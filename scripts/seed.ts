import { prisma } from "../src/lib/db/prisma";
import { logger } from "../src/lib/logger";

const SEED_CATEGORIES = [
  {
    name: "Kemiskinan Ekstrem",
    slug: "kemiskinan-ekstrem",
    description: "Keluarga pra-sejahtera, tunawisma, dan ketidakmampuan kebutuhan pokok paling mendasar.",
    keywords: ["kemiskinan ekstrem", "keluarga pra-sejahtera", "kelaparan", "gelandangan", "pengemis", "miskin ekstrem"],
  },
  {
    name: "Rumah Tidak Layak Huni (RTLH) & Permukiman Kumuh",
    slug: "rtlh-kumuh",
    description: "Kondisi hunian padat, sanitasi buruk, pinggiran rel, bantaran sungai, dan pesisir.",
    keywords: ["bedah rumah", "rtlh", "permukiman kumuh", "bantaran sungai deli", "pesisir belawan", "gubuk"],
  },
  {
    name: "Stunting & Gizi Buruk",
    slug: "stunting-gizi-buruk",
    description: "Gangguan pertumbuhan anak balita akibat kekurangan gizi kronis di wilayah rentan.",
    keywords: ["stunting", "gizi buruk", "posyandu", "balita kurang gizi", "penimbangan balita"],
  },
  {
    name: "Anak Putus Sekolah",
    slug: "anak-putus-sekolah",
    description: "Anak usia sekolah yang terpaksa berhenti belajar karena kendala biaya atau bekerja.",
    keywords: ["putus sekolah", "anak jalanan", "biaya sekolah", "seragam sekolah", "bantuan pendidikan"],
  },
  {
    name: "Pengangguran & PHK",
    slug: "pengangguran-phk",
    description: "Tingkat pengangguran terbuka, pemutusan hubungan kerja, dan pekerja informal.",
    keywords: ["phk", "pengangguran", "pencari kerja", "buruh harian lepas", "pabrik tutup"],
  },
  {
    name: "Kerawanan Pangan",
    slug: "kerawanan-pangan",
    description: "Lonjakan harga pangan pokok yang membebani daya beli masyarakat berpendapatan rendah.",
    keywords: ["beras mahal", "pasar murah", "antrean sembako", "bantuan pangan", "daya beli turun"],
  },
  {
    name: "Bantuan Sosial (Bansos)",
    slug: "bansos-bantuan-sosial",
    description: "Isu penyaluran PKH, BLT, bansos pangan tidak tepat sasaran atau data anomali.",
    keywords: ["pkh", "blt", "bansos", "bantuan sosial", "dtks", "pembagian beras", "kartu sembako"],
  },
  {
    name: "Dampak Bencana Kelompok Rentan",
    slug: "dampak-bencana-rentan",
    description: "Banjir rob Belawan, banjir kiriman sungai Deli yang memiskinkan warga rentan.",
    keywords: ["banjir rob", "sungai deli meluap", "pengungsi banjir", "kampung nelayan terendam", "kebakaran pemukiman"],
  },
];

const SEED_SOURCES = [
  {
    name: "Waspada Online",
    baseUrl: "https://waspada.id",
    feedUrl: "https://waspada.id/feed/",
    type: "RSS" as const,
    scrapeFrequency: "DAILY" as const,
    isActive: true,
  },
  {
    name: "Tribun Medan",
    baseUrl: "https://medan.tribunnews.com",
    feedUrl: "https://medan.tribunnews.com/rss",
    type: "RSS" as const,
    scrapeFrequency: "DAILY" as const,
    isActive: true,
  },
  {
    name: "Sumut Pos",
    baseUrl: "https://sumutpos.jawapos.com",
    feedUrl: "https://sumutpos.jawapos.com/feed",
    type: "RSS" as const,
    scrapeFrequency: "DAILY" as const,
    isActive: true,
  },
  {
    name: "Antara News Sumut",
    baseUrl: "https://sumut.antaranews.com",
    feedUrl: "https://sumut.antaranews.com/rss/terkini.xml",
    type: "RSS" as const,
    scrapeFrequency: "DAILY" as const,
    isActive: true,
  },
  {
    name: "Harian Analisa",
    baseUrl: "https://analisadaily.com",
    type: "HTML" as const,
    scrapeFrequency: "DAILY" as const,
    isActive: true,
    selectorConfig: {
      itemSelector: ".news-list-item",
      titleSelector: "h3.title > a",
      linkSelector: "h3.title > a",
      dateSelector: ".date-time",
    },
  },
];

async function main() {
  logger.info("Memulai Idempotent Seeding Database PovertyWatch...");

  // 1. Seed Categories & Keywords
  for (const catData of SEED_CATEGORIES) {
    const category = await prisma.category.upsert({
      where: { slug: catData.slug },
      update: {
        name: catData.name,
        description: catData.description,
      },
      create: {
        name: catData.name,
        slug: catData.slug,
        description: catData.description,
      },
    });

    for (const kw of catData.keywords) {
      const existingKw = await prisma.newsKeyword.findFirst({
        where: { categoryId: category.id, keyword: kw },
      });

      if (!existingKw) {
        await prisma.newsKeyword.create({
          data: {
            categoryId: category.id,
            keyword: kw,
            isActive: true,
          },
        });
      }
    }
  }

  logger.info(`Seeding ${SEED_CATEGORIES.length} Kategori selesai.`);

  // 2. Seed Sources
  for (const srcData of SEED_SOURCES) {
    const existingSource = await prisma.newsSource.findFirst({
      where: { baseUrl: srcData.baseUrl },
    });

    if (!existingSource) {
      await prisma.newsSource.create({
        data: {
          name: srcData.name,
          baseUrl: srcData.baseUrl,
          feedUrl: srcData.feedUrl,
          type: srcData.type,
          scrapeFrequency: srcData.scrapeFrequency,
          isActive: srcData.isActive,
          selectorConfig: srcData.selectorConfig || undefined,
        },
      });
    }
  }

  logger.info(`Seeding ${SEED_SOURCES.length} Sumber Portal Media selesai.`);
  logger.info("Database Seeding Selesai Sukses!");
}

main()
  .catch((e) => {
    logger.error({ error: e }, "Seeding gagal");
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
