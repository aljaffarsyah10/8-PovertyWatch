import { prisma } from "@/lib/db/prisma";
import { logger } from "@/lib/logger";
import { RssScraper } from "../scrapers/rss.scraper";
import { HtmlScraper } from "../scrapers/html.scraper";
import { SourceScrapeConfig } from "../scrapers/base.scraper";
import { normalizeNewsUrl } from "./url-normalizer";
import { matchNewsKeywords } from "./keyword-matcher";
import { extractMedanLocation } from "./location-extractor";
import { getAIProvider } from "../ai";

export interface PipelineExecutionStats {
  totalFound: number;
  totalNew: number;
  totalDuplicate: number;
  totalFailed: number;
  errors: string[];
}

export class ScrapingPipeline {
  private rssScraper = new RssScraper();
  private htmlScraper = new HtmlScraper();

  /**
   * Menjalankan seluruh alur ingestion untuk satu sumber berita:
   * Scrape -> Validate -> Normalize -> Deduplicate -> Match Keywords -> Persist
   */
  async processSource(
    source: SourceScrapeConfig,
    jobId: string
  ): Promise<PipelineExecutionStats> {
    const stats: PipelineExecutionStats = {
      totalFound: 0,
      totalNew: 0,
      totalDuplicate: 0,
      totalFailed: 0,
      errors: [],
    };

    logger.info(
      { jobId, sourceId: source.id, sourceName: source.name, type: source.type },
      "Memulai Ingestion Pipeline"
    );

    // 1. Pilih scraper sesuai tipe sumber
    const scraper = source.type === "RSS" ? this.rssScraper : this.htmlScraper;
    const scrapeResult = await scraper.scrape(source);

    stats.totalFound = scrapeResult.items.length;
    stats.errors.push(...scrapeResult.errors);

    // Ambil seluruh kategori dan kata kunci aktif dari database
    let categoriesWithKeywords: Array<{
      id: string;
      name: string;
      slug: string;
      keywords: Array<{ keyword: string }>;
    }> = [];

    try {
      categoriesWithKeywords = await prisma.category.findMany({
        where: { isActive: true },
        include: { keywords: { where: { isActive: true } } },
      });
    } catch {
      // Fallback jika database belum terisi atau testing mode
      categoriesWithKeywords = [];
    }

    // 2. Iterasi dan proses setiap artikel
    for (const item of scrapeResult.items) {
      try {
        const canonicalUrl = normalizeNewsUrl(item.url);

        // Deduplication Check
        const existing = await prisma.news.findUnique({
          where: { normalizedUrl: canonicalUrl },
          select: { id: true },
        });

        if (existing) {
          stats.totalDuplicate++;
          continue;
        }

        // Ekstraksi Lokasi Medan
        const locationInfo = extractMedanLocation(
          item.title,
          item.description || ""
        );

        // Keyword & Category Matching
        let matchedCategoryId: string | null = null;
        let isRelevant = true;
        let bestRelevanceScore = 0;

        for (const cat of categoriesWithKeywords) {
          const kwList = cat.keywords.map((k) => k.keyword);
          const matchResult = matchNewsKeywords(
            item.title,
            item.description || "",
            kwList
          );

          if (matchResult.isRelevant && matchResult.relevanceScore > bestRelevanceScore) {
            bestRelevanceScore = matchResult.relevanceScore;
            matchedCategoryId = cat.id;
            isRelevant = matchResult.isRelevant;
          }
        }

        // AI Provider Enhancement (Non-blocking: failure never halts scraper)
        let aiSummaryText: string | null = null;
        let aiConfidenceScore: number | null = null;
        let aiReasonText: string | null = null;
        let isAiClassifiedFlag = false;

        try {
          const aiProvider = getAIProvider();
          const [summaryResult, classResult] = await Promise.all([
            aiProvider.summarizeNews(item.title, item.description || ""),
            aiProvider.classifyNews(item.title, item.description || ""),
          ]);

          aiSummaryText = summaryResult.summary;
          aiConfidenceScore = classResult.confidence;
          aiReasonText = classResult.reason;
          isAiClassifiedFlag = true;

          // Jika keyword rule-based belum menemukan kategori, gunakan klasifikasi AI
          if (!matchedCategoryId) {
            const foundCat = categoriesWithKeywords.find(
              (c) =>
                c.slug === classResult.categorySlug ||
                c.name.toLowerCase() === classResult.category.toLowerCase()
            );
            if (foundCat) {
              matchedCategoryId = foundCat.id;
            }
          }
        } catch (aiErr) {
          logger.debug(
            { aiErr: aiErr instanceof Error ? aiErr.message : String(aiErr) },
            "AI enrichment skipped or failed; continuing with standard ingestion"
          );
        }

        // Simpan ke basis data
        await prisma.news.create({
          data: {
            sourceId: source.id,
            title: item.title,
            url: item.url,
            normalizedUrl: canonicalUrl,
            description: item.description,
            author: item.author,
            imageUrl: item.imageUrl,
            publishedAt: item.publishedAt || new Date(),
            categoryId: matchedCategoryId,
            locationName: locationInfo.locationName,
            locationLevel: locationInfo.locationLevel,
            aiSummary: aiSummaryText,
            aiConfidence: aiConfidenceScore,
            aiReason: aiReasonText,
            isAiClassified: isAiClassifiedFlag,
            isRelevant: isRelevant,
          },
        });

        stats.totalNew++;
      } catch (itemError: unknown) {
        stats.totalFailed++;
        const msg = `Gagal memproses item (${item.url}): ${itemError instanceof Error ? itemError.message : String(itemError)}`;
        stats.errors.push(msg);
      }
    }

    // 3. Catat audit log eksekusi
    try {
      await prisma.scrapingLog.create({
        data: {
          jobId: jobId,
          sourceId: source.id,
          level: stats.errors.length > 0 ? "WARNING" : "INFO",
          message: `Ingestion selesai: ${stats.totalFound} ditemukan, ${stats.totalNew} baru, ${stats.totalDuplicate} duplikat, ${stats.totalFailed} gagal.`,
          details: JSON.parse(
            JSON.stringify({
              stats: stats,
              sourceName: source.name,
            })
          ),
        },
      });

      // Update waktu scrape terakhir pada sumber
      await prisma.newsSource.update({
        where: { id: source.id },
        data: { lastScrapedAt: new Date() },
      });
    } catch (logErr) {
      logger.warn({ logErr }, "Gagal mencatat ScrapingLog ke basis data");
    }

    logger.info({ jobId, sourceId: source.id, stats }, "Pipeline Selesai");
    return stats;
  }
}
