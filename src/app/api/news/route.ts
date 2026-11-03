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

    if (query.categoryId) {
      where.categoryId = query.categoryId;
    }

    if (query.sourceId) {
      where.sourceId = query.sourceId;
    }

    if (query.location) {
      where.locationName = { contains: query.location, mode: "insensitive" };
    }

    if (query.startDate || query.endDate) {
      where.publishedAt = {};
      if (query.startDate) where.publishedAt.gte = new Date(query.startDate);
      if (query.endDate) where.publishedAt.lte = new Date(query.endDate);
    }

    const skip = (query.page - 1) * query.limit;

    const [total, items] = await Promise.all([
      prisma.news.count({ where }),
      prisma.news.findMany({
        where,
        skip,
        take: query.limit,
        orderBy: {
          publishedAt: query.sortBy === "newest" ? "desc" : "asc",
        },
        include: {
          source: { select: { id: true, name: true, baseUrl: true, type: true } },
          category: { select: { id: true, name: true, slug: true } },
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: items,
      meta: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages: Math.ceil(total / query.limit) || 1,
      },
    });
  } catch (err: unknown) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "NEWS_FETCH_ERROR",
          message: err instanceof Error ? err.message : "Gagal mengambil data berita",
        },
      },
      { status: 400 }
    );
  }
}

