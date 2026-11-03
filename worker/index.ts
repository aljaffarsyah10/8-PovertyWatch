import { initScheduler } from "./scheduler";
import { JobRunner } from "./job-runner";
import { logger } from "@/lib/logger";
import { prisma } from "@/lib/db/prisma";

async function main() {
  logger.info("=========================================");
  logger.info("🚀 PovertyWatch Background Worker Memulai");
  logger.info("=========================================");

  const jobRunner = new JobRunner();

  // 1. Pulihkan job yang menggantung akibat restart mendadak
  await jobRunner.recoverStaleJobs();

  // 2. Jalankan cron scheduler
  const scheduledTask = initScheduler();

  let isShuttingDown = false;

  // 3. Polling loop untuk antrean job PENDING (setiap 5 detik)
  const pollInterval = setInterval(async () => {
    if (isShuttingDown) return;
    await jobRunner.pollAndExecute();
  }, 5000);

  // 4. Graceful Shutdown Handler
  const handleShutdown = async (signal: string) => {
    logger.info(`Sinyal ${signal} diterima. Menghentikan worker secara tertib...`);
    isShuttingDown = true;
    clearInterval(pollInterval);
    scheduledTask.stop();

    try {
      await prisma.$disconnect();
      logger.info("Koneksi Prisma database berhasil ditutup.");
    } catch (e) {
      logger.error({ e }, "Error saat menutup koneksi basis data");
    }

    logger.info("Worker berhenti. Sampai jumpa.");
    process.exit(0);
  };

  process.on("SIGINT", () => handleShutdown("SIGINT"));
  process.on("SIGTERM", () => handleShutdown("SIGTERM"));
}

main().catch((err) => {
  logger.fatal({ err }, "Fatal error pada background worker");
  process.exit(1);
});

