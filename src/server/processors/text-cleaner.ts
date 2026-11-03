/**
 * Membersihkan naskah teks dari entitas HTML, tag script/style tersembunyi, dan spasi berlebih.
 * Mencegah XSS (Cross-Site Scripting) dari konten berita pihak ketiga.
 */
export function cleanText(rawText?: string | null): string {
  if (!rawText) return "";

  return rawText
    // Buang blok script dan style beserta isinya
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, " ")
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, " ")
    // Buang seluruh tag HTML
    .replace(/<[^>]*>/g, " ")
    // Decode entitas HTML umum
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ")
    // Normalisasi whitespace ganda atau newline berlebihan
    .replace(/\s+/g, " ")
    .trim();
}
