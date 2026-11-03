import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const job = await prisma.scrapingJob.findUnique({
      where: { id },
      include: {
        source: true,
        logs: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!job) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "JOB_NOT_FOUND",
            message: `Job dengan ID ${id} tidak ditemukan.`,
          },
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: job,
    });
  } catch (err: unknown) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "JOB_DETAIL_ERROR",
          message: err instanceof Error ? err.message : "Gagal mengambil detail job",
        },
      },
      { status: 500 }
    );
  }
}

