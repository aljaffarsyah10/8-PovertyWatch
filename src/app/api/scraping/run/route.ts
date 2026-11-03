import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { TriggerScrapingSchema } from "@/lib/validation/news.schema";

export async function POST(req: NextRequest) {
  try {
    let sourceId: string | undefined;

    // Baca body jika ada
    try {
      const body = await req.json();
      const parsed = TriggerScrapingSchema.parse(body);
      sourceId = parsed.sourceId;
    } catch {
      // Body kosong diperbolehkan (memicu scrape seluruh sumber aktif)
    }

    const job = await prisma.scrapingJob.create({
      data: {
        sourceId: sourceId || undefined,
        triggerType: "MANUAL",
        status: "PENDING",
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Pekerjaan scraping berhasil dicatat ke antrean.",
        data: {
          jobId: job.id,
          status: job.status,
          createdAt: job.createdAt,
        },
      },
      { status: 202 }
    );
  } catch (err: unknown) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "TRIGGER_SCRAPING_ERROR",
          message: err instanceof Error ? err.message : "Gagal memicu scraping manual",
        },
      },
      { status: 400 }
    );
  }
}

