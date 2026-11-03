import cron from "node-cron";
import { prisma } from "@/lib/db/prisma";
import { logger } from "@/lib/logger";

export function initScheduler(): cron.ScheduledTask {
  logger.info(
    "Inisialisasi node-cron scheduler (Jadwal: 06:00 WIB Harian, Timezone: Asia/Jakarta)"
  );

  // Jadwal harian: Pukul 06:00 WIB
  return cron.schedule(
    "0 6 * * *",
    async () => {
      logger.info("Scheduler Trigger: Memicu scheduled scraping harian");
      try {
        // Buat record job PENDING baru di database
        const job = await prisma.scrapingJob.create({
          data: {
            triggerType: "SCHEDULED",
            status: "PENDING",
          },
        });
        logger.info({ jobId: job.id }, "Scheduled job berhasil dibuat di database");
      } catch (err) {
        logger.error({ err }, "Gagal membuat scheduled job di database");
      }
    },
    {
      scheduled: true,
      timezone: "Asia/Jakarta",
    }
  );
}
