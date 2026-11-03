import Parser from "rss-parser";
import {
  INewsScraper,
  ScrapeResult,
  ScrapedItem,
  SourceScrapeConfig,
} from "./base.scraper";
import { secureFetch } from "../security/ssrf-guard";
import { cleanText } from "../processors/text-cleaner";
import { logger } from "@/lib/logger";

export class RssScraper implements INewsScraper {
  private parser: Parser;

  constructor() {
    this.parser = new Parser({
      timeout: 10000,
      headers: {
        "User-Agent":
          process.env.SCRAPER_USER_AGENT ||
          "PovertyWatch-Bot/1.0 (+https://povertywatch.id/about-bot)",
      },
    });
  }

  async scrape(source: SourceScrapeConfig): Promise<ScrapeResult> {
    const targetUrl = source.feedUrl || source.baseUrl;
    const errors: string[] = [];
    const items: ScrapedItem[] = [];

    try {
      logger.info({ sourceId: source.id, url: targetUrl }, "Mengambil RSS Feed");

      // 1. Fetch aman dengan perlindungan SSRF
      const response = await secureFetch(targetUrl, { timeoutMs: 12000 });
      const xmlData = await response.text();

      // 2. Parse XML RSS/Atom
      const feed = await this.parser.parseString(xmlData);

      if (!feed.items || feed.items.length === 0) {
        logger.warn({ sourceId: source.id }, "Feed RSS kosong atau tidak ada item");
        return { items: [], errors: ["Feed tidak memuat artikel berita."] };
      }

      for (const entry of feed.items) {
        try {
          const rawTitle = entry.title || "";
          const rawLink = entry.link || "";

          // Validasi kelayakan artikel
          if (!rawTitle.trim() || rawTitle.trim().length < 5) {
            continue;
          }
          if (!rawLink.trim() || !rawLink.startsWith("http")) {
            continue;
          }

          let publishedDate: Date | undefined;
          if (entry.pubDate || entry.isoDate) {
            const parsedDate = new Date(entry.pubDate || entry.isoDate || "");
            if (!isNaN(parsedDate.getTime())) {
              publishedDate = parsedDate;
            }
          }

          const description = cleanText(
            entry.contentSnippet || entry.summary || entry.content || ""
          );

          items.push({
            title: cleanText(rawTitle),
            url: rawLink.trim(),
            publishedAt: publishedDate,
            description: description.slice(0, 1000), // Batas wajar ringkasan
            author: entry.creator || entry.author || undefined,
            imageUrl: entry.enclosure?.url || undefined,
          });
        } catch (itemErr: unknown) {
          errors.push(
            `Error parsing item feed: ${itemErr instanceof Error ? itemErr.message : String(itemErr)}`
          );
        }
      }

      logger.info(
        { sourceId: source.id, totalFound: items.length },
        "Selesai parsing RSS Feed"
      );
    } catch (err: unknown) {
      const errMsg = `Gagal mengambil/parse RSS (${targetUrl}): ${err instanceof Error ? err.message : String(err)}`;
      logger.error({ sourceId: source.id, err: errMsg }, "RSS Scrape Failure");
      errors.push(errMsg);
    }

    return { items, errors };
  }
}
