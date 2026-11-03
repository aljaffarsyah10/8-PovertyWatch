import {
  AIProvider,
  ClassificationResult,
  ClassificationResultSchema,
  SummaryResult,
  SummaryResultSchema,
} from "./provider.interface";

interface CategoryDefinition {
  name: string;
  slug: string;
  keywords: string[];
  primaryReasons: string;
}

const CATEGORIES: CategoryDefinition[] = [
  {
    name: "Bansos & Bantuan Pangan",
    slug: "bansos-bantuan-pangan",
    keywords: ["bansos", "sembako", "bantuan pangan", "beras", "pasar murah", "antrean bansos"],
    primaryReasons: "Pemberitaan berfokus pada distribusi bantuan logistik pangan atau program sembako bagi masyarakat berpenghasilan rendah.",
  },
  {
    name: "Stunting & Gizi Buruk",
    slug: "stunting-gizi-buruk",
    keywords: ["stunting", "gizi buruk", "posyandu", "kurang gizi", "anak kerdil", "balita"],
    primaryReasons: "Topik mencakup kesehatan ibu dan anak, pencegahan kekerdilan (stunting), dan intervensi nutrisi.",
  },
  {
    name: "Rumah Tidak Layak Huni",
    slug: "rutilahu-bedah-rumah",
    keywords: ["bedah rumah", "rutilahu", "kumuh", "atap bocor", "gubuk", "dinding reyot", "batu bara", "drainase"],
    primaryReasons: "Artikel menyoroti kondisi sanitasi pemukiman atau program revitalisasi rumah tidak layak huni.",
  },
  {
    name: "Pengangguran & PHK",
    slug: "pengangguran-phk",
    keywords: ["phk", "pengangguran", "pencari kerja", "job fair", "pesangon", "lowongan kerja", "buruh"],
    primaryReasons: "Terkait dinamika ketenagakerjaan, hilangnya mata pencaharian, atau kesulitan mencari nafkah.",
  },
  {
    name: "Inflasi & Beban Hidup",
    slug: "inflasi-beban-hidup",
    keywords: ["inflasi", "harga cabai", "daya beli", "tarif", "ongkos", "kenaikan harga", "pangan mahal"],
    primaryReasons: "Membahas lonjakan harga bahan pokok lokal Kota Medan yang menekan daya beli warga prasejahtera.",
  },
  {
    name: "PKH & Program Keluarga Harapan",
    slug: "pkh-keluarga-harapan",
    keywords: ["pkh", "kartu sembako", "dtks", "keluarga harapan", "kemsos", "graduasi pkh"],
    primaryReasons: "Berita merujuk pada pendaftaran, verifikasi, atau pencairan Program Keluarga Harapan (PKH).",
  },
  {
    name: "Disabilitas & Perlindungan Sosial",
    slug: "disabilitas-marjinal",
    keywords: ["disabilitas", "difabel", "kursi roda", "tuna rungu", "tuna netra", "pemberdayaan marjinal"],
    primaryReasons: "Menyoroti pemenuhan hak, aksesibilitas, dan bantuan perlindungan sosial bagi penyandang disabilitas.",
  },
  {
    name: "Lansia Terlantar & Warga Rentan",
    slug: "lansia-terlantar",
    keywords: ["lansia terlantar", "sebatang kara", "panti jompo", "jompo", "warga miskin ekstrem", "tanpa keluarga"],
    primaryReasons: "Menceritakan kondisi lansia rentan tanpa pendampingan atau warga marjinal terlantar di sudut kota.",
  },
];

export class MockAIProvider implements AIProvider {
  public readonly name = "Mock/Rule-based AI Provider (Offline/Deterministic)";

  public async classifyNews(title: string, content: string): Promise<ClassificationResult> {
    const text = `${title} ${content}`.toLowerCase();

    let bestMatch: CategoryDefinition | null = null;
    let highestCount = 0;

    for (const cat of CATEGORIES) {
      let count = 0;
      for (const kw of cat.keywords) {
        if (text.includes(kw)) {
          count += 1;
        }
      }
      if (count > highestCount) {
        highestCount = count;
        bestMatch = cat;
      }
    }

    if (!bestMatch || highestCount === 0) {
      // Default fallback
      const fallback = {
        category: "Bansos & Bantuan Pangan",
        categorySlug: "bansos-bantuan-pangan",
        confidence: 0.5,
        reason: "Klasifikasi otomatis probabilitas dasar berdasarkan keterkaitan sosial umum.",
      };
      return ClassificationResultSchema.parse(fallback);
    }

    const confidence = Math.min(0.95, 0.65 + highestCount * 0.1);
    const result = {
      category: bestMatch.name,
      categorySlug: bestMatch.slug,
      confidence: parseFloat(confidence.toFixed(2)),
      reason: bestMatch.primaryReasons,
    };

    return ClassificationResultSchema.parse(result);
  }

  public async summarizeNews(title: string, content: string): Promise<SummaryResult> {
    const cleanContent = content.trim().replace(/\s+/g, " ");
    
    // Pecah kalimat
    const sentences = cleanContent
      .split(/(?<=[.?!])\s+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 20);

    let summaryText: string;
    const keyPoints: string[] = [];

    if (sentences.length >= 2) {
      // Ambil 2-3 kalimat utama
      const selected = sentences.slice(0, 3);
      summaryText = selected.join(" ");
      keyPoints.push(sentences[0]);
      if (sentences[1]) keyPoints.push(sentences[1]);
    } else if (cleanContent.length > 0) {
      summaryText = `Artikel mengulas "${title}". Informasi menunjukkan fenomena terkait dinamika kehidupan sosial ekonomi masyarakat di Kota Medan.`;
      keyPoints.push(title);
    } else {
      summaryText = `Pemberitaan mengenai "${title}". Belum ada rincian narasi tambahan dari sumber berita terkait.`;
      keyPoints.push(title);
    }

    // Pastikan batas 2-4 kalimat
    const result = {
      summary: summaryText,
      keyPoints,
    };

    return SummaryResultSchema.parse(result);
  }
}

