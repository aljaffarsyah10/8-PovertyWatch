import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { logger } from "@/lib/logger";

export async function GET() {
  try {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

    // 1. Ambil seluruh berita dalam 60 hari terakhir untuk tren
    const [allRecentNews, totalAllTime, categories] = await Promise.all([
      prisma.news.findMany({
        where: { publishedAt: { gte: sixtyDaysAgo } },
        select: {
          id: true,
          publishedAt: true,
          categoryId: true,
          locationName: true,
          locationLevel: true,
        },
        orderBy: { publishedAt: "asc" },
      }),
      prisma.news.count(),
      prisma.category.findMany({
        select: { id: true, name: true, slug: true },
      }),
    ]);

    // 2. Hitung perbandingan periode (30 hari terakhir vs 30 hari sebelumnya)
    let currentPeriodCount = 0;
    let previousPeriodCount = 0;

    for (const item of allRecentNews) {
      if (item.publishedAt && item.publishedAt >= thirtyDaysAgo) {
        currentPeriodCount++;
      } else if (item.publishedAt && item.publishedAt >= sixtyDaysAgo) {
        previousPeriodCount++;
      }
    }

    const percentageChange =
      previousPeriodCount === 0
        ? currentPeriodCount > 0
          ? 100
          : 0
        : Math.round(((currentPeriodCount - previousPeriodCount) / previousPeriodCount) * 100);

    // 3. Agregasi mingguan (8 minggu terakhir)
    const weeklyMap = new Map<string, number>();
    for (let i = 7; i >= 0; i--) {
      const label = `Mg -${i === 0 ? "ini" : i}`;
      weeklyMap.set(label, 0);
    }

    for (const item of allRecentNews) {
      if (!item.publishedAt) continue;
      const daysDiff = Math.floor((now.getTime() - item.publishedAt.getTime()) / (24 * 60 * 60 * 1000));
      const weekIdx = Math.floor(daysDiff / 7);
      if (weekIdx >= 0 && weekIdx <= 7) {
        const label = `Mg -${weekIdx === 0 ? "ini" : weekIdx}`;
        weeklyMap.set(label, (weeklyMap.get(label) || 0) + 1);
      }
    }

    const weeklyTrends = Array.from(weeklyMap.entries()).map(([label, count]) => ({
      week: label,
      count,
    }));

    // 4. Agregasi bulanan (6 bulan terakhir)
    const monthlyMap = new Map<string, number>();
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const label = `${monthNames[d.getMonth()]} ${d.getFullYear().toString().slice(-2)}`;
      monthlyMap.set(label, 0);
    }

    for (const item of allRecentNews) {
      if (!item.publishedAt) continue;
      const d = item.publishedAt;
      const label = `${monthNames[d.getMonth()]} ${d.getFullYear().toString().slice(-2)}`;
      if (monthlyMap.has(label)) {
        monthlyMap.set(label, (monthlyMap.get(label) || 0) + 1);
      }
    }

    const monthlyTrends = Array.from(monthlyMap.entries()).map(([month, count]) => ({
      month,
      count,
    }));

    // 5. Kategori terpopuler
    const categoryCountMap = new Map<string, number>();
    for (const item of allRecentNews) {
      if (item.categoryId) {
        categoryCountMap.set(item.categoryId, (categoryCountMap.get(item.categoryId) || 0) + 1);
      }
    }

    const totalCategorized = Array.from(categoryCountMap.values()).reduce((a, b) => a + b, 0) || 1;
    const topCategories = categories
      .map((cat) => {
        const count = categoryCountMap.get(cat.id) || 0;
        return {
          categoryId: cat.id,
          name: cat.name,
          slug: cat.slug,
          count,
          percentage: Math.round((count / totalCategorized) * 100),
        };
      })
      .sort((a, b) => b.count - a.count);

    // 6. Regional Breakdown (Kecamatan di Medan)
    const regionalMap = new Map<string, number>();
    for (const item of allRecentNews) {
      const loc = item.locationName || "Kota Medan";
      regionalMap.set(loc, (regionalMap.get(loc) || 0) + 1);
    }

    const regionalBreakdown = Array.from(regionalMap.entries())
      .map(([location, count]) => ({ location, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    return NextResponse.json({
      success: true,
      data: {
        totalAllTime,
        currentPeriodCount,
        previousPeriodCount,
        percentageChange,
        weeklyTrends,
        monthlyTrends,
        topCategories,
        regionalBreakdown,
      },
    });
  } catch (error: unknown) {
    logger.error({ error }, "Error fetching dashboard trends");
    return NextResponse.json(
      {
        success: false,
        error: "Gagal mengambil data agregasi tren.",
      },
      { status: 500 }
    );
  }
}
