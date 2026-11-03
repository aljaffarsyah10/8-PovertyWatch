import React from "react";
import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { CategoryBadge } from "@/components/shared/category-badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Newspaper,
  Rss,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  PieChart,
  Calendar,
  ExternalLink,
  MapPin,
  Clock,
  ShieldCheck,
} from "lucide-react";
import { MOCK_NEWS } from "@/features/news/mocks/mock-news";
import { MOCK_CATEGORIES } from "@/features/categories/mocks/mock-categories";
import { MOCK_SOURCES } from "@/features/sources/mocks/mock-sources";
import { MOCK_SCRAPING_JOBS } from "@/features/scraping/mocks/mock-scraping";

export default function DashboardPage() {
  const latestNews = MOCK_NEWS.slice(0, 4);
  const lastJob = MOCK_SCRAPING_JOBS[0];
  const activeSourcesCount = MOCK_SOURCES.filter((s) => s.isActive).length;

  // Daily Trend Data (Last 14 days sample for SVG chart)
  const trendData = [
    { day: "21 Okt", count: 18 },
    { day: "22 Okt", count: 24 },
    { day: "23 Okt", count: 19 },
    { day: "24 Okt", count: 32 },
    { day: "25 Okt", count: 28 },
    { day: "26 Okt", count: 21 },
    { day: "27 Okt", count: 35 },
    { day: "28 Okt", count: 42 },
    { day: "29 Okt", count: 30 },
    { day: "30 Okt", count: 48 },
    { day: "31 Okt", count: 39 },
    { day: "01 Nov", count: 52 },
    { day: "02 Nov", count: 44 },
    { day: "03 Nov", count: 34 },
  ];

  const maxTrend = Math.max(...trendData.map((d) => d.count));

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Dashboard Pemantauan Media"
        description="Analisis frekuensi pemberitaan kemiskinan dan fenomena sosial ekonomi lokal di Kota Medan."
      >
        <Link href="/news">
          <Button variant="outline" size="sm" className="gap-2">
            Buka News Explorer
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </PageHeader>

      {/* Info Banner Disclaimer */}
      <div className="flex flex-col gap-2 rounded-xl border border-teal-200/80 bg-teal-50/70 p-4 text-xs text-teal-900 sm:flex-row sm:items-center sm:justify-between dark:border-teal-900/60 dark:bg-teal-950/40 dark:text-teal-200">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-teal-600 shrink-0 dark:text-teal-400" />
          <span>
            <strong>Batasan Interpretasi Data:</strong> Angka yang disajikan
            adalah volume dan frekuensi isu dalam pemberitaan media massa daring,
            bukan data sensus resmi atau angka penduduk miskin BPS.
          </span>
        </div>
        <Badge
          variant="outline"
          className="w-fit border-teal-300 bg-teal-100/50 text-[10px] text-teal-800 dark:border-teal-800 dark:bg-teal-900/50 dark:text-teal-200"
        >
          Kota Medan &bull; Sumut
        </Badge>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Pemberitaan"
          value="1,428"
          description="Total artikel terindeks sistem"
          trend={{ value: 14.2, isPositive: true, label: "vs bulan lalu" }}
          icon={Newspaper}
          variant="default"
        />
        <StatCard
          title="24 Jam Terakhir"
          value="34"
          description="Artikel berita baru"
          trend={{ value: 6.8, isPositive: true, label: "vs kemarin" }}
          icon={TrendingUp}
          variant="success"
        />
        <StatCard
          title="Sumber Portal Aktif"
          value={`${activeSourcesCount} / ${MOCK_SOURCES.length}`}
          description="Media online Kota Medan & Sumut"
          icon={Rss}
          variant="default"
        />
        <StatCard
          title="Keandalan Scraper"
          value="98.2%"
          description="Tingkat sukses eksekusi cron"
          icon={CheckCircle2}
          variant="success"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Trend Chart (CSS / SVG Native) */}
        <Card className="rounded-xl border border-slate-200/80 bg-white p-5 lg:col-span-2 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                Tren Frekuensi Liputan (14 Hari Terakhir)
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Jumlah artikel terverifikasi per hari mengenai isu sosial ekonomi
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-medium text-teal-700 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-200 dark:bg-teal-950 dark:text-teal-300 dark:border-teal-800">
              <TrendingUp className="h-3.5 w-3.5" />
              Rata-rata 32 art/hari
            </div>
          </div>

          {/* Interactive Bar Chart Representation */}
          <div className="mt-6 flex h-52 items-end gap-2 sm:gap-3 pt-6 pb-2">
            {trendData.map((item, idx) => {
              const heightPercent = Math.round((item.count / maxTrend) * 100);
              const isLatest = idx === trendData.length - 1;

              return (
                <div
                  key={item.day}
                  className="group relative flex flex-1 flex-col items-center gap-1.5 h-full justify-end"
                >
                  {/* Tooltip on hover */}
                  <div className="absolute -top-7 hidden rounded-md bg-slate-900 px-1.5 py-0.5 text-[10px] font-medium text-white shadow-xs group-hover:block z-10 dark:bg-slate-100 dark:text-slate-900">
                    {item.count} Berita
                  </div>
                  {/* Bar */}
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className={`w-full rounded-t-sm transition-all duration-300 ${
                      isLatest
                        ? "bg-teal-600 dark:bg-teal-500"
                        : "bg-slate-200 group-hover:bg-slate-400 dark:bg-slate-800 dark:group-hover:bg-slate-700"
                    }`}
                  />
                  {/* Label */}
                  <span className="text-[9px] text-slate-500 font-medium truncate max-w-full dark:text-slate-400">
                    {item.day.split(" ")[0]}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2 text-[11px] text-slate-400 dark:border-slate-800">
            <span>21 Oktober 2026</span>
            <span>Hari ini (03 November 2026)</span>
          </div>
        </Card>

        {/* Category Breakdown */}
        <Card className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                Distribusi Kategori
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Porsi isu berdasarkan kata kunci
              </p>
            </div>
            <PieChart className="h-4 w-4 text-teal-600" />
          </div>

          <div className="mt-4 space-y-3.5">
            {MOCK_CATEGORIES.slice(0, 5).map((cat) => {
              const totalMockArticles = 1428;
              const percentage = Math.round((cat.count / totalMockArticles) * 100);

              return (
                <div key={cat.id} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-700 dark:text-slate-300 truncate max-w-[170px]">
                      {cat.name}
                    </span>
                    <span className="text-slate-500 font-semibold dark:text-slate-400">
                      {cat.count}{" "}
                      <span className="text-[10px] font-normal text-slate-400">
                        ({percentage}%)
                      </span>
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden dark:bg-slate-800">
                    <div
                      style={{ width: `${percentage * 2.5}%` }}
                      className="h-full rounded-full bg-slate-900 dark:bg-slate-100"
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-5 border-t border-slate-100 pt-3 dark:border-slate-800">
            <Link
              href="/categories"
              className="text-xs font-medium text-teal-700 hover:underline flex items-center justify-between dark:text-teal-400"
            >
              <span>Lihat seluruh 8 kategori & keyword</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </Card>
      </div>

      {/* Latest Feed & Scraper Health Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Latest News Feed */}
        <Card className="rounded-xl border border-slate-200/80 bg-white p-5 lg:col-span-2 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                Pemberitaan Terkini di Kota Medan
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Artikel terverifikasi yang baru dinormalisasi dari portal media
              </p>
            </div>
            <Link
              href="/news"
              className="text-xs font-medium text-teal-700 hover:underline flex items-center gap-1 dark:text-teal-400"
            >
              <span>Lihat Semua</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {latestNews.map((news) => (
              <div
                key={news.id}
                className="py-4 first:pt-4 last:pb-0 flex flex-col gap-2 transition hover:bg-slate-50/50 rounded-lg px-2 dark:hover:bg-slate-800/50"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <CategoryBadge name={news.categoryName} slug={news.categorySlug} />
                  <span className="flex items-center gap-1 text-[11px] font-medium text-slate-500 dark:text-slate-400">
                    <MapPin className="h-3 w-3 text-slate-400" />
                    {news.locationName}
                  </span>
                  <span className="text-[11px] text-slate-400">&bull;</span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    {news.sourceName}
                  </span>
                  <span className="text-[11px] text-slate-400">&bull;</span>
                  <span className="text-[11px] text-slate-400">
                    {news.publishedAt}
                  </span>
                </div>

                <Link
                  href={`/news/${news.id}`}
                  className="font-semibold text-slate-900 hover:text-teal-700 transition dark:text-white dark:hover:text-teal-400 text-sm"
                >
                  {news.title}
                </Link>

                <p className="text-xs text-slate-600 line-clamp-2 dark:text-slate-300">
                  {news.description}
                </p>
              </div>
            ))}
          </div>
        </Card>

        {/* Scraper Health & Execution Status */}
        <Card className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                Status Background Worker
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Pipa ingestion dan pemrosesan data
              </p>
            </div>
            <Link href="/scraping">
              <Button variant="ghost" size="sm" className="h-8 px-2 text-xs">
                Detail
              </Button>
            </Link>
          </div>

          <div className="mt-4 space-y-4">
            <div className="rounded-lg border border-slate-200/80 bg-slate-50 p-3.5 dark:border-slate-800 dark:bg-slate-950/60">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  Eksekusi Terakhir
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  Selesai Sukses
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                {lastJob.startedAt}
              </p>

              <div className="mt-3 grid grid-cols-3 gap-2 border-t border-slate-200/60 pt-2.5 text-center text-[11px] dark:border-slate-800">
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">
                    {lastJob.totalFound}
                  </div>
                  <div className="text-slate-400">Ditemukan</div>
                </div>
                <div>
                  <div className="font-bold text-emerald-600 dark:text-emerald-400">
                    +{lastJob.totalNew}
                  </div>
                  <div className="text-slate-400">Baru</div>
                </div>
                <div>
                  <div className="font-bold text-slate-500">
                    {lastJob.totalDuplicate}
                  </div>
                  <div className="text-slate-400">Duplikat</div>
                </div>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-slate-400" />
                  Jadwal Ingestion Berikutnya:
                </span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  Besok, 06:00 WIB
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-slate-400" />
                  Frekuensi Otomatis:
                </span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  1x Sehari (Harian)
                </span>
              </div>
            </div>

            <div className="pt-2">
              <Link href="/scraping">
                <Button
                  size="sm"
                  className="w-full gap-2 bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  Buka Scraping Monitor
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
