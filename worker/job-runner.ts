import { prisma } from "@/lib/db/prisma";
import { logger } from "@/lib/logger";
import { ScrapingPipeline } from "@/server/processors/pipeline";
import { SourceScrapeConfig } from "@/server/scrapers/base.scraper";

export class JobRunner {
  private pipeline = new ScrapingPipeline();
  private isProcessing = false;

  /**
   * Mengembalikan / mereset job yang menggantung (stale) akibat worker crash sebelumnya.
   */
  async recoverStaleJobs(): Promise<void> {
    try {
      const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
      const staleJobs = await prisma.scrapingJob.updateMany({
        where: {
          status: "RUNNING",
          startedAt: { lt: thirtyMinutesAgo },
        },
        data: {
          status: "FAILED",
          errorMessage: "Job dibatalkan otomatis: worker terhenti/timeout > 30 menit.",
          finishedAt: new Date(),
        },
      });

      if (staleJobs.count > 0) {
        logger.warn(
          { recoveredCount: staleJobs.count },
          "Memulihkan stale jobs yang menggantung"
        );
      }
    } catch (err) {
      logger.error({ err }, "Gagal memeriksa stale jobs");
    }
  }

  /**
   * Melakukan polling ke antrean job PENDING dan mengeksekusi dengan transactional lock.
   */
  async pollAndExecute(): Promise<boolean> {
    if (this.isProcessing) return false;

    try {
      this.isProcessing = true;

      // 1. Klaim job tertua yang berstatus PENDING secara atomic
      // Menggunakan conditional update di Prisma
      const pendingJob = await prisma.scrapingJob.findFirst({
        where: { status: "PENDING" },
        orderBy: { createdAt: "asc" },
      });

      if (!pendingJob) {
        return false;
      }

      // Atomic transition: PENDING -> RUNNING
      const claimedJob = await prisma.scrapingJob.updateMany({
        where: {
          id: pendingJob.id,
          status: "PENDING",
        },
        data: {
          status: "RUNNING",
          startedAt: new Date(),
        },
      });

      if (claimedJob.count === 0) {
        // Job sudah diambil oleh worker lain
        return false;
      }

      logger.info(
        { jobId: pendingJob.id, triggerType: pendingJob.triggerType },
        "Berhasil mengklaim job scraping"
      );

      // 2. Ambil daftar sumber yang perlu diproses
      let sourcesToScrape: Array<SourceScrapeConfig> = [];

      if (pendingJob.sourceId) {
        const singleSource = await prisma.newsSource.findUnique({
          where: { id: pendingJob.sourceId },
        });
        if (singleSource && singleSource.isActive) {
          sourcesToScrape = [singleSource as unknown as SourceScrapeConfig];
        }
      } else {
        const activeSources = await prisma.newsSource.findMany({
          where: { isActive: true },
        });
        sourcesToScrape = activeSources as unknown as SourceScrapeConfig[];
      }

      let totalFound = 0;
      let totalNew = 0;
      let totalDuplicate = 0;
      let totalFailed = 0;
      const allErrors: string[] = [];

      // 3. Jalankan pipeline per sumber dengan jeda kesopanan (rate limiting)
      for (const src of sourcesToScrape) {
        try {
          const stats = await this.pipeline.processSource(src, pendingJob.id);
          totalFound += stats.totalFound;
          totalNew += stats.totalNew;
          totalDuplicate += stats.totalDuplicate;
          totalFailed += stats.totalFailed;
          allErrors.push(...stats.errors);

          // Jeda santun 1.5 detik antar sumber
          await new Promise((res) => setTimeout(res, 1500));
        } catch (srcErr: unknown) {
          totalFailed++;
          allErrors.push(
            `Kegagalan fatal pada sumber ${src.name}: ${srcErr instanceof Error ? srcErr.message : String(srcErr)}`
          );
        }
      }

      // 4. Update status akhir job
      const finalStatus =
        totalFailed > 0 && totalNew === 0 && totalDuplicate === 0
          ? "FAILED"
          : "COMPLETED";

      await prisma.scrapingJob.update({
        where: { id: pendingJob.id },
        data: {
          status: finalStatus,
          finishedAt: new Date(),
          totalFound,
          totalNew,
          totalDuplicate,
          totalFailed,
          errorMessage:
            allErrors.length > 0 ? allErrors.slice(0, 5).join("; ") : null,
        },
      });

      logger.info(
        {
          jobId: pendingJob.id,
          finalStatus,
          totalFound,
          totalNew,
          totalDuplicate,
        },
        "Pekerjaan scraping selesai diproses"
      );

      return true;
    } catch (err: unknown) {
      logger.error({ err }, "Error saat menjalankan job runner");
      return false;
    } finally {
      this.isProcessing = false;
    }
  }
}

