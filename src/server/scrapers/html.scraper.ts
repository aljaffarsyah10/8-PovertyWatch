import * as cheerio from "cheerio";
import { URL } from "url";
import {
  INewsScraper,
  ScrapeResult,
  ScrapedItem,
  SourceScrapeConfig,
} from "./base.scraper";
import { secureFetch } from "../security/ssrf-guard";
import { cleanText } from "../processors/text-cleaner";
import { logger } from "@/lib/logger";

export class HtmlScraper implements INewsScraper {
  async scrape(source: SourceScrapeConfig): Promise<ScrapeResult> {
    const targetUrl = source.baseUrl;
    const errors: string[] = [];
    const items: ScrapedItem[] = [];

    const selectors = source.selectorConfig || {
      itemSelector: "article, .post, .news-item, .berita-item",
      titleSelector: "h2, h3, .title, a",
      linkSelector: "a",
      descriptionSelector: "p, .excerpt, .desc",
      dateSelector: "time, .date, .time",
    };

    try {
      logger.info({ sourceId: source.id, url: targetUrl }, "Mengambil HTML Halaman Berita");

      // 1. Fetch aman dengan perlindungan SSRF
      const response = await secureFetch(targetUrl, { timeoutMs: 12000 });
      const htmlData = await response.text();

      // 2. Parse HTML via Cheerio
      const $ = cheerio.load(htmlData);

      const itemElements = $(selectors.itemSelector || "article");

      if (itemElements.length === 0) {
        logger.warn(
          { sourceId: source.id, selector: selectors.itemSelector },
          "Selector item HTML tidak menemukan elemen pada halaman"
        );
        return {
          items: [],
          errors: [
            `Selector "${selectors.itemSelector}" tidak menemukan elemen artikel pada ${targetUrl}.`,
          ],
        };
      }

      itemElements.each((_, el) => {
        try {
          const item = $(el);

          // Ekstraksi Title
          const titleEl = selectors.titleSelector
            ? item.find(selectors.titleSelector).first()
            : item.find("h2, h3, a").first();
          const rawTitle = titleEl.text().trim();

          // Ekstraksi Link (Href)
          let rawHref = "";
          if (selectors.linkSelector) {
            rawHref = item.find(selectors.linkSelector).first().attr("href") || "";
          }
          if (!rawHref) {
            rawHref = item.find("a").first().attr("href") || "";
          }
          if (!rawHref && titleEl.is("a")) {
            rawHref = titleEl.attr("href") || "";
          }

          if (!rawTitle || rawTitle.length < 5) return;
          if (!rawHref) return;

          // Resolusi absolute URL jika link relatif
          let fullUrl = rawHref.trim();
          if (!fullUrl.startsWith("http")) {
            fullUrl = new URL(fullUrl, targetUrl).toString();
          }

          // Ekstraksi Description
          const descEl = selectors.descriptionSelector
            ? item.find(selectors.descriptionSelector).first()
            : item.find("p").first();
          const rawDesc = descEl.text().trim();

          // Ekstraksi Date
          let publishedDate: Date | undefined;
          if (selectors.dateSelector) {
            const dateStr = item.find(selectors.dateSelector).first().text().trim();
            if (dateStr) {
              const d = new Date(dateStr);
              if (!isNaN(d.getTime())) {
                publishedDate = d;
              }
            }
          }

          items.push({
            title: cleanText(rawTitle),
            url: fullUrl,
            publishedAt: publishedDate,
            description: cleanText(rawDesc).slice(0, 1000),
          });
        } catch (itemErr: unknown) {
          errors.push(
            `Error parsing HTML item: ${itemErr instanceof Error ? itemErr.message : String(itemErr)}`
          );
        }
      });

      logger.info(
        { sourceId: source.id, totalFound: items.length },
        "Selesai parsing HTML Scraper"
      );
    } catch (err: unknown) {
      const errMsg = `Gagal mengambil/parse HTML (${targetUrl}): ${err instanceof Error ? err.message : String(err)}`;
      logger.error({ sourceId: source.id, err: errMsg }, "HTML Scrape Failure");
      errors.push(errMsg);
    }

    return { items, errors };
  }
}
