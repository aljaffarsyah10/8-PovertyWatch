/**
 * Membersihkan naskah teks dari entitas HTML, tag tersembunyi, dan spasi berlebih.
 */
export function cleanText(rawText?: string | null): string {
  if (!rawText) return "";

  return rawText
    // Buang tag HTML
    .replace(/<[^>]*>/g, " ")
    // Decode entitas HTML umum
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ")
    // Normalisasi whitespace ganda atau newline berlebihan
    .replace(/\s+/g, " ")
    .trim();
}

