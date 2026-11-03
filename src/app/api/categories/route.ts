import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
      include: {
        keywords: {
          where: { isActive: true },
          select: { id: true, keyword: true },
        },
        _count: { select: { news: true } },
      },
    });

    return NextResponse.json({
      success: true,
      data: categories,
    });
  } catch (err: unknown) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "CATEGORIES_FETCH_ERROR",
          message: err instanceof Error ? err.message : "Gagal mengambil daftar kategori",
        },
      },
      { status: 500 }
    );
  }
}
