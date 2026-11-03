import {
  AIProvider,
  ClassificationResult,
  ClassificationResultSchema,
  SummaryResult,
  SummaryResultSchema,
} from "./provider.interface";
import { MockAIProvider } from "./mock-ai.provider";
import { logger } from "@/lib/logger";

export class OpenAICompatibleProvider implements AIProvider {
  public readonly name = "OpenAI Compatible LLM Provider";
  private apiKey: string;
  private baseUrl: string;
  private model: string;
  private fallbackProvider: MockAIProvider;

  constructor(apiKey: string, baseUrl?: string, model?: string) {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl || "https://api.openai.com/v1";
    this.model = model || "gpt-4o-mini";
    this.fallbackProvider = new MockAIProvider();
  }

  public async classifyNews(title: string, content: string): Promise<ClassificationResult> {
    try {
      const prompt = `Anda adalah sistem klasifikasi berita kemiskinan dan masalah sosial Kota Medan.
Klasifikasikan artikel berikut ke dalam salah satu dari 8 kategori:
1. "Bansos & Bantuan Pangan" (slug: "bansos-bantuan-pangan")
2. "Stunting & Gizi Buruk" (slug: "stunting-gizi-buruk")
3. "Rumah Tidak Layak Huni" (slug: "rutilahu-bedah-rumah")
4. "Pengangguran & PHK" (slug: "pengangguran-phk")
5. "Inflasi & Beban Hidup" (slug: "inflasi-beban-hidup")
6. "PKH & Program Keluarga Harapan" (slug: "pkh-keluarga-harapan")
7. "Disabilitas & Perlindungan Sosial" (slug: "disabilitas-marjinal")
8. "Lansia Terlantar & Warga Rentan" (slug: "lansia-terlantar")

Judul: ${title}
Isi: ${content.slice(0, 1000)}

Kembalikan HANYA format JSON valid tanpa markdown, dengan struktur:
{"category": string, "categorySlug": string, "confidence": number (antara 0.1 sampai 0.95), "reason": string}`;

      const res = await fetch(`${this.baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: this.model,
          messages: [{ role: "user", content: prompt }],
          temperature: 0.1,
          response_format: { type: "json_object" },
        }),
        signal: AbortSignal.timeout(8000), // 8 seconds timeout
      });

      if (!res.ok) {
        throw new Error(`OpenAI API returned status ${res.status}`);
      }

      const json = await res.json();
      const contentStr = json.choices?.[0]?.message?.content;
      if (!contentStr) {
        throw new Error("Empty response from AI Provider");
      }

      const parsed = JSON.parse(contentStr);
      return ClassificationResultSchema.parse(parsed);
    } catch (err) {
      logger.warn(
        { err: err instanceof Error ? err.message : String(err) },
        "AI classification error, falling back to rule-based provider"
      );
      return this.fallbackProvider.classifyNews(title, content);
    }
  }

  public async summarizeNews(title: string, content: string): Promise<SummaryResult> {
    try {
      const prompt = `Buat ringkasan ringkas 2 sampai 4 kalimat dalam Bahasa Indonesia formal mengenai fenomena sosial ekonomi yang diberitakan pada artikel berikut.
Judul: ${title}
Isi: ${content.slice(0, 1500)}

Kembalikan HANYA JSON valid:
{"summary": string, "keyPoints": [string, string]}`;

      const res = await fetch(`${this.baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: this.model,
          messages: [{ role: "user", content: prompt }],
          temperature: 0.2,
          response_format: { type: "json_object" },
        }),
        signal: AbortSignal.timeout(8000),
      });

      if (!res.ok) {
        throw new Error(`OpenAI API returned status ${res.status}`);
      }

      const json = await res.json();
      const contentStr = json.choices?.[0]?.message?.content;
      if (!contentStr) {
        throw new Error("Empty response from AI Provider");
      }

      const parsed = JSON.parse(contentStr);
      return SummaryResultSchema.parse(parsed);
    } catch (err) {
      logger.warn(
        { err: err instanceof Error ? err.message : String(err) },
        "AI summarization error, falling back to rule-based provider"
      );
      return this.fallbackProvider.summarizeNews(title, content);
    }
  }
}

