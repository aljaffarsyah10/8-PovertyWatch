/**
 * [MOCK DATA] Sumber Portal Berita Lokal (Kota Medan & Sumatera Utara)
 * Hanya digunakan untuk kebutuhan rendering frontend sebelum integrasi database (Phase 6).
 */

export interface MockSource {
  id: string;
  name: string;
  baseUrl: string;
  feedUrl?: string;
  type: "RSS" | "HTML";
  isActive: boolean;
  scrapeFrequency: "DAILY" | "WEEKLY" | "MONTHLY";
  lastScrapedAt?: string;
  totalArticles: number;
  status: "NORMAL" | "WARNING" | "ERROR";
  selectorConfig?: {
    itemSelector: string;
    titleSelector: string;
    linkSelector: string;
    dateSelector?: string;
  };
}

export const MOCK_SOURCES: MockSource[] = [
  {
    id: "src-1",
    name: "Waspada Online",
    baseUrl: "https://waspada.id",
    feedUrl: "https://waspada.id/feed/",
    type: "RSS",
    isActive: true,
    scrapeFrequency: "DAILY",
    lastScrapedAt: "2026-11-03 06:00:15 WIB",
    totalArticles: 412,
    status: "NORMAL",
  },
  {
    id: "src-2",
    name: "Tribun Medan (Sumut)",
    baseUrl: "https://medan.tribunnews.com",
    feedUrl: "https://medan.tribunnews.com/rss",
    type: "RSS",
    isActive: true,
    scrapeFrequency: "DAILY",
    lastScrapedAt: "2026-11-03 06:05:40 WIB",
    totalArticles: 538,
    status: "NORMAL",
  },
  {
    id: "src-3",
    name: "Sumut Pos",
    baseUrl: "https://sumutpos.jawapos.com",
    feedUrl: "https://sumutpos.jawapos.com/feed",
    type: "RSS",
    isActive: true,
    scrapeFrequency: "DAILY",
    lastScrapedAt: "2026-11-03 06:10:02 WIB",
    totalArticles: 276,
    status: "NORMAL",
  },
  {
    id: "src-4",
    name: "Antara News Sumut",
    baseUrl: "https://sumut.antaranews.com",
    feedUrl: "https://sumut.antaranews.com/rss/terkini.xml",
    type: "RSS",
    isActive: true,
    scrapeFrequency: "DAILY",
    lastScrapedAt: "2026-11-03 06:12:18 WIB",
    totalArticles: 194,
    status: "NORMAL",
  },
  {
    id: "src-5",
    name: "Harian Analisa",
    baseUrl: "https://analisadaily.com",
    type: "HTML",
    isActive: true,
    scrapeFrequency: "DAILY",
    lastScrapedAt: "2026-11-03 06:15:33 WIB",
    totalArticles: 86,
    status: "NORMAL",
    selectorConfig: {
      itemSelector: ".news-list-item",
      titleSelector: "h3.title > a",
      linkSelector: "h3.title > a",
      dateSelector: ".date-time",
    },
  },
  {
    id: "src-6",
    name: "Portal Berita Medan Terkini",
    baseUrl: "https://medanterkini.com",
    type: "HTML",
    isActive: false,
    scrapeFrequency: "DAILY",
    lastScrapedAt: "2026-11-01 06:00:00 WIB",
    totalArticles: 34,
    status: "WARNING",
    selectorConfig: {
      itemSelector: "article.post",
      titleSelector: ".entry-title a",
      linkSelector: ".entry-title a",
      dateSelector: ".published",
    },
  },
];

