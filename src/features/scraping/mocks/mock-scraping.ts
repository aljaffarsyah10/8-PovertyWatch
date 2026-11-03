/**
 * [MOCK DATA] Riwayat Scraping Jobs & Audit Logs
 * Hanya digunakan untuk kebutuhan rendering frontend sebelum integrasi database (Phase 6).
 */

export interface MockScrapingJob {
  id: string;
  sourceId?: string;
  sourceName?: string;
  triggerType: "MANUAL" | "SCHEDULED";
  status: "PENDING" | "RUNNING" | "COMPLETED" | "FAILED";
  startedAt: string;
  finishedAt?: string;
  durationSeconds: number;
  totalFound: number;
  totalNew: number;
  totalDuplicate: number;
  totalFailed: number;
  errorMessage?: string;
}

export interface MockScrapingLog {
  id: string;
  jobId: string;
  sourceName: string;
  level: "INFO" | "WARNING" | "ERROR";
  message: string;
  timestamp: string;
  details?: string;
}

export const MOCK_SCRAPING_JOBS: MockScrapingJob[] = [
  {
    id: "job-20261103-01",
    triggerType: "SCHEDULED",
    status: "COMPLETED",
    startedAt: "2026-11-03 06:00:00 WIB",
    finishedAt: "2026-11-03 06:04:12 WIB",
    durationSeconds: 252,
    totalFound: 112,
    totalNew: 34,
    totalDuplicate: 78,
    totalFailed: 0,
  },
  {
    id: "job-20261102-02",
    sourceId: "src-1",
    sourceName: "Waspada Online",
    triggerType: "MANUAL",
    status: "COMPLETED",
    startedAt: "2026-11-02 14:15:00 WIB",
    finishedAt: "2026-11-02 14:16:10 WIB",
    durationSeconds: 70,
    totalFound: 18,
    totalNew: 6,
    totalDuplicate: 12,
    totalFailed: 0,
  },
  {
    id: "job-20261102-01",
    triggerType: "SCHEDULED",
    status: "COMPLETED",
    startedAt: "2026-11-02 06:00:00 WIB",
    finishedAt: "2026-11-02 06:03:45 WIB",
    durationSeconds: 225,
    totalFound: 98,
    totalNew: 28,
    totalDuplicate: 70,
    totalFailed: 0,
  },
  {
    id: "job-20261101-01",
    triggerType: "SCHEDULED",
    status: "FAILED",
    startedAt: "2026-11-01 06:00:00 WIB",
    finishedAt: "2026-11-01 06:02:18 WIB",
    durationSeconds: 138,
    totalFound: 45,
    totalNew: 12,
    totalDuplicate: 32,
    totalFailed: 1,
    errorMessage: "Connection timeout saat menghubungi feed analisadaily.com (10000ms exceeded)",
  },
];

export const MOCK_SCRAPING_LOGS: MockScrapingLog[] = [
  {
    id: "log-1",
    jobId: "job-20261103-01",
    sourceName: "Waspada Online",
    level: "INFO",
    message: "Berhasil mengunduh RSS feed: 24 item ditemukan.",
    timestamp: "2026-11-03 06:00:15 WIB",
    details: '{"httpStatus": 200, "feedType": "RSS 2.0", "parsedItems": 24}',
  },
  {
    id: "log-2",
    jobId: "job-20261103-01",
    sourceName: "Waspada Online",
    level: "INFO",
    message: "Normalisasi URL selesai. 8 artikel baru tersimpan, 16 artikel duplikat dilewati.",
    timestamp: "2026-11-03 06:00:28 WIB",
    details: '{"newSaved": 8, "duplicatesSkipped": 16}',
  },
  {
    id: "log-3",
    jobId: "job-20261103-01",
    sourceName: "Tribun Medan",
    level: "INFO",
    message: "Berhasil mengunduh feed: 45 item ditemukan. 18 artikel baru cocok dengan kata kunci kemiskinan.",
    timestamp: "2026-11-03 06:01:40 WIB",
  },
  {
    id: "log-4",
    jobId: "job-20261103-01",
    sourceName: "Harian Analisa",
    level: "WARNING",
    message: "Waktu respons server media lambat: 4200ms.",
    timestamp: "2026-11-03 06:03:10 WIB",
    details: '{"responseTimeMs": 4200, "thresholdWarning": 3000}',
  },
  {
    id: "log-5",
    jobId: "job-20261101-01",
    sourceName: "Harian Analisa",
    level: "ERROR",
    message: "Gagal fetch HTML portal analisadaily.com: ETIMEDOUT 10000ms.",
    timestamp: "2026-11-01 06:02:18 WIB",
    details: '{"code": "ETIMEDOUT", "url": "https://analisadaily.com", "attempt": 3}',
  },
];

