import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const limit = parseInt(url.searchParams.get("limit") || "20", 10);

    const jobs = await prisma.scrapingJob.findMany({
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        source: { select: { id: true, name: true, type: true } },
      },
    });

    return NextResponse.json({
      success: true,
      data: jobs,
    });
  } catch (err: unknown) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "JOBS_FETCH_ERROR",
          message: err instanceof Error ? err.message : "Gagal mengambil riwayat jobs",
        },
      },
      { status: 500 }
    );
  }
}
