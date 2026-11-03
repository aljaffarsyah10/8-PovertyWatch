export interface KeywordMatchResult {
  isRelevant: boolean;
  relevanceScore: number;
  matchedKeywords: string[];
}

/**
 * Mencocokkan teks berita terhadap daftar kata kunci topik kemiskinan.
 * - Pembobotan lebih tinggi diberikan pada kemunculan kata kunci di judul (bobot x2.0)
 * - Hasil matching digunakan sebagai indikator relevansi awal.
 */
export function matchNewsKeywords(
  title: string,
  contentOrDesc: string,
  keywords: string[]
): KeywordMatchResult {
  if (!keywords || keywords.length === 0) {
    return { isRelevant: true, relevanceScore: 0.5, matchedKeywords: [] };
  }

  const titleLower = title.toLowerCase();
  const bodyLower = contentOrDesc.toLowerCase();

  const matchedSet = new Set<string>();
  let score = 0;

  for (const rawKw of keywords) {
    const kw = rawKw.toLowerCase().trim();
    if (!kw) continue;

    const inTitle = titleLower.includes(kw);
    const inBody = bodyLower.includes(kw);

    if (inTitle || inBody) {
      matchedSet.add(kw);
      if (inTitle) score += 0.4;
      if (inBody) score += 0.2;
    }
  }

  // Cap max score at 1.0, minimum 0.1 jika ada yang cocok
  const normalizedScore = Math.min(Math.max(score, matchedSet.size > 0 ? 0.3 : 0), 1.0);

  return {
    isRelevant: matchedSet.size > 0,
    relevanceScore: Number(normalizedScore.toFixed(2)),
    matchedKeywords: Array.from(matchedSet),
  };
}

