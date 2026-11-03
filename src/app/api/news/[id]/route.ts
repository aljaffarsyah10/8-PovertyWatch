import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const item = await prisma.news.findUnique({
      where: { id },
      include: {
        source: {
          select: {
            id: true,
            name: true,
            baseUrl: true,
            type: true,
            lastScrapedAt: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
            description: true,
          },
        },
      },
    });

    if (!item) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "NEWS_NOT_FOUND",
            message: `Artikel dengan ID ${id} tidak ditemukan.`,
          },
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: item,
    });
  } catch (err: unknown) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "NEWS_DETAIL_ERROR",
          message: err instanceof Error ? err.message : "Gagal mengambil detail berita",
        },
      },
      { status: 500 }
    );
  }
}
