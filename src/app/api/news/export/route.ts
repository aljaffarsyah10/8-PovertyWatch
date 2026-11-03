import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { NewsQuerySchema } from "@/lib/validation/news.schema";
import { Prisma } from "@prisma/client";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const queryParams = Object.fromEntries(url.searchParams.entries());
    const query = NewsQuerySchema.parse(queryParams);

    const where: Prisma.NewsWhereInput = {};

    if (query.search) {
      where.OR = [
        { title: { contains: query.search, mode: "insensitive" } },
        { description: { contains: query.search, mode: "insensitive" } },
        { locationName: { contains: query.search, mode: "insensitive" } },
      ];
    }
    if (query.categoryId) where.categoryId = query.categoryId;
    if (query.sourceId) where.sourceId = query.sourceId;

    const items = await prisma.news.findMany({
      where,
      take: 1000, // Safety cap for export
      orderBy: { publishedAt: "desc" },
      include: {
        source: { select: { name: true } },
        category: { select: { name: true } },
      },
    });

    const headers = [
      "ID",
      "Judul",
      "Kategori",
      "Sumber",
      "Lokasi",
      "Tanggal Terbit",
      "URL Asli",
    ];

    const csvRows = items.map((n) => [
      `"${n.id}"`,
      `"${n.title.replace(/"/g, '""')}"`,
      `"${n.category?.name || "Tidak Terkategori"}"`,
      `"${n.source?.name || ""}"`,
      `"${n.locationName || ""}"`,
      `"${n.publishedAt ? n.publishedAt.toISOString() : ""}"`,
      `"${n.url}"`,
    ]);

    const csvData = [headers.join(","), ...csvRows.map((r) => r.join(","))].join("\n");

    return new NextResponse(csvData, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="povertywatch_export_${Date.now()}.csv"`,
      },
    });
  } catch (err: unknown) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "EXPORT_ERROR",
          message: err instanceof Error ? err.message : "Gagal mengekspor data CSV",
        },
      },
      { status: 500 }
    );
  }
}

