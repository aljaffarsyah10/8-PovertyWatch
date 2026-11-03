import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { logger } from "@/lib/logger";

export async function GET() {
  try {
    const sources = await prisma.newsSource.findMany({
      include: {
        _count: { select: { news: true, scrapingJobs: true } },
        scrapingJobs: {
          orderBy: { createdAt: "desc" },
          take: 5,
          select: {
            id: true,
            status: true,
            finishedAt: true,
            errorMessage: true,
            createdAt: true,
          },
        },
      },
      orderBy: { name: "asc" },
    });

    const healthData = sources.map((source) => {
      const recentJobs = source.scrapingJobs;
      const completedJobs = recentJobs.filter((j) => j.status === "COMPLETED");
      const failedJobs = recentJobs.filter((j) => j.status === "FAILED");

      const lastSuccess = completedJobs[0]?.finishedAt || null;
      const lastFail = failedJobs[0] || null;

      let status: "HEALTHY" | "DEGRADED" | "FAILING" = "HEALTHY";

      if (recentJobs.length > 0) {
        const failureCount = failedJobs.length;
        const totalRecent = recentJobs.length;
        const failRate = failureCount / totalRecent;

        if (recentJobs[0]?.status === "FAILED" && failureCount >= 2) {
          status = "FAILING";
        } else if (failRate > 0.3) {
          status = "DEGRADED";
        } else {
          status = "HEALTHY";
        }
      }

      return {
        sourceId: source.id,
        name: source.name,
        baseUrl: source.baseUrl,
        type: source.type,
        isActive: source.isActive,
        lastScrapedAt: source.lastScrapedAt,
        totalArticles: source._count.news,
        totalJobs: source._count.scrapingJobs,
        lastSuccessfulRun: lastSuccess,
        lastFailureAt: lastFail ? lastFail.createdAt : null,
        lastErrorMessage: lastFail ? lastFail.errorMessage : null,
        healthStatus: status,
      };
    });

    return NextResponse.json({
      success: true,
      data: healthData,
    });
  } catch (error: unknown) {
    logger.error({ error }, "Error fetching source health");
    return NextResponse.json(
      {
        success: false,
        error: "Gagal memuat status kesehatan sumber.",
      },
      { status: 500 }
    );
  }
}
