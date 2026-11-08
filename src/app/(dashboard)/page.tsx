"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { CategoryBadge } from "@/components/shared/category-badge";
import { StatCardSkeleton, NewsCardSkeleton } from "@/components/shared/loading-skeleton";
import { ErrorState } from "@/components/shared/error-state";
import { EmptyState } from "@/components/shared/empty-state";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Newspaper,
  Rss,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  ExternalLink,
  MapPin,
  ShieldCheck,
  RefreshCw,
  FileText,
  FileSpreadsheet,
} from "lucide-react";
import { apiFetch } from "@/lib/api-client";

interface DashboardStats {
  totalArticles: number;
  last24Hours: number;
  activeSources: number;
  totalSources: number;
  scraperSuccessRate: number;
  categoryDistribution: Array<{
    categoryId: string;
    name: string;
    slug: string;
    count: number;
  }>;
}

interface TrendData {
  totalAllTime: number;
  currentPeriodCount: number;
  previousPeriodCount: number;
  percentageChange: number;
  weeklyTrends: Array<{ week: string; count: number }>;
  monthlyTrends: Array<{ month: string; count: number }>;
  topCategories: Array<{ categoryId: string; name: string; slug: string; count: number; percentage: number }>;
  regionalBreakdown: Array<{ location: string; count: number }>;
}

interface NewsItem {
  id: string;
  title: string;
  description?: string;
  locationName?: string;
  publishedAt?: string;
  source?: { name: string };
  category?: { name: string; slug: string };
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [trends, setTrends] = useState<TrendData | null>(null);
  const [latestNews, setLatestNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshIndex, setRefreshIndex] = useState(0);

  useEffect(() => {
    let ignore = false;
    async function loadDashboardData() {
      try {
        const [statsRes, newsRes, trendsRes] = await Promise.all([
          apiFetch<DashboardStats>("/api/dashboard/stats"),
          apiFetch<NewsItem[]>("/api/news?limit=4&sortBy=newest"),
          apiFetch<TrendData>("/api/dashboard/trends"),
        ]);

        if (!ignore) {
          if (statsRes.success && statsRes.data) {
            setStats(statsRes.data);
          }
          if (newsRes.success && newsRes.data) {
            setLatestNews(newsRes.data);
          }
          if (trendsRes.success && trendsRes.data) {
            setTrends(trendsRes.data);
          }
          setError(null);
        }
      } catch (err: unknown) {
        if (!ignore) {
          const msg = err instanceof Error ? err.message : "Gagal memuat ringkasan dashboard";
          setError(msg);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadDashboardData();
    return () => {
      ignore = true;
    };
  }, [refreshIndex]);

  const handleRefresh = () => {
    setLoading(true);
    setRefreshIndex((prev) => prev + 1);
  };

  if (loading && !stats) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Dashboard Pemantauan Media"
          description="Memuat ringkasan data kemiskinan dan ketimpangan lokal Kota Medan..."
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Card className="p-5 lg:col-span-2 border-border bg-card">
            <NewsCardSkeleton />
          </Card>
          <Card className="p-5 border-border bg-card">
            <NewsCardSkeleton />
          </Card>
        </div>
      </div>
    );
  }

  if (error && !stats) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Dashboard Pemantauan Media"
          description="Terjadi kendala saat menghubungkan ke backend API."
        />
        <ErrorState
          title="Gagal Memuat Data Dashboard"
          description={error}
          onRetry={handleRefresh}
        />
      </div>
    );
  }

  const categoryDistribution = stats?.categoryDistribution || [];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Dashboard Pemantauan Media"
        description="Analisis frekuensi pemberitaan kemiskinan dan fenomena sosial ekonomi lokal di Kota Medan."
      >
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            const a = document.createElement("a");
            a.href = "/api/news/export/excel";
            a.download = `povertywatch_export_${Date.now()}.xlsx`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
          }}
          className="gap-1.5 text-xs font-semibold border-border hover:bg-secondary transition-colors"
          title="Unduh dataset lengkap dalam format Excel"
        >
          <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
          Excel (XLSX)
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            const a = document.createElement("a");
            a.href = "/api/news/report/pdf";
            a.download = `povertywatch_report_${Date.now()}.pdf`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
          }}
          className="gap-1.5 text-xs font-semibold border-border hover:bg-secondary transition-colors"
          title="Unduh laporan ringkasan berkala dalam format PDF"
        >
          <FileText className="h-3.5 w-3.5 text-[#D9541E]" />
          Laporan PDF
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleRefresh}
          className="gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground"
          title="Segarkan data"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Refresh
        </Button>
        <Link href="/news">
          <Button
            size="sm"
            className="gap-2 bg-[#D9541E] text-white hover:bg-[#C24412] font-semibold shadow-xs"
          >
            Buka News Explorer
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </PageHeader>

      {/* Info Banner Disclaimer */}
      <div className="flex flex-col gap-2 rounded-xl border border-[#D9541E]/30 bg-[#D9541E]/8 p-4 text-xs sm:flex-row sm:items-center sm:justify-between text-foreground">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="h-4 w-4 text-[#D9541E] shrink-0" />
          <span className="font-medium">
            <strong className="font-bold text-[#D9541E]">Batasan Metodologi:</strong> Angka yang disajikan
            adalah volume dan frekuensi isu dalam pemberitaan media massa daring Kota Medan,
            bukan data sensus resmi atau angka penduduk miskin BPS.
          </span>
        </div>
        <Badge
          variant="outline"
          className="w-fit shrink-0 border-[#D9541E]/40 bg-[#D9541E]/15 text-[10px] font-bold text-[#D9541E]"
        >
          Kota Medan &bull; Sumut
        </Badge>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Pemberitaan"
          value={stats?.totalArticles ?? 0}
          description="Total artikel terindeks sistem"
          icon={Newspaper}
          variant="default"
        />
        <StatCard
          title="24 Jam Terakhir"
          value={stats?.last24Hours ?? 0}
          description="Artikel berita baru"
          icon={TrendingUp}
          variant="success"
        />
        <StatCard
          title="Sumber Portal Aktif"
          value={`${stats?.activeSources ?? 0} / ${stats?.totalSources ?? 0}`}
          description="Media online Kota Medan & Sumut"
          icon={Rss}
          variant="default"
        />
        <StatCard
          title="Keandalan Scraper"
          value={`${stats?.scraperSuccessRate ?? 98}%`}
          description="Tingkat sukses eksekusi cron"
          icon={CheckCircle2}
          variant="success"
        />
      </div>

      {/* Category Breakdown & Overview */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Category Breakdown */}
        <Card className="rounded-xl border border-border bg-card p-5 shadow-2xs lg:col-span-1">
          <div className="flex items-center justify-between pb-4 border-b border-border/80">
            <div>
              <h2 className="text-base font-bold text-foreground">
                Distribusi Kategori
              </h2>
              <p className="text-xs font-medium text-muted-foreground">
                Porsi isu berdasarkan kata kunci
              </p>
            </div>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#D9541E]/10 text-[#D9541E]">
              <PieChart className="h-4 w-4" />
            </div>
          </div>

          <div className="mt-4 space-y-3.5">
            {categoryDistribution.length === 0 ? (
              <p className="text-xs text-muted-foreground py-4 text-center">
                Belum ada data kategori teragregasi.
              </p>
            ) : (
              categoryDistribution.slice(0, 5).map((cat) => {
                const total = stats?.totalArticles || 1;
                const percentage = Math.round((cat.count / total) * 100);

                return (
                  <div key={cat.categoryId} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-foreground truncate max-w-[170px]">
                        {cat.name}
                      </span>
                      <span className="font-bold text-foreground font-mono">
                        {cat.count}{" "}
                        <span className="text-[10px] font-normal text-muted-foreground">
                          ({percentage}%)
                        </span>
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
                      <div
                        style={{ width: `${Math.min(percentage * 2.5, 100)}%` }}
                        className="h-full rounded-full bg-[#D9541E] transition-all duration-300"
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="mt-5 border-t border-border/80 pt-3.5">
            <Link
              href="/categories"
              className="text-xs font-semibold text-[#D9541E] hover:text-[#C24412] flex items-center justify-between transition-colors"
            >
              <span>Lihat seluruh kategori & kata kunci</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </Card>

        {/* Latest News Feed */}
        <Card className="rounded-xl border border-border bg-card p-5 lg:col-span-2 shadow-2xs">
          <div className="flex items-center justify-between pb-4 border-b border-border/80">
            <div>
              <h2 className="text-base font-bold text-foreground">
                Pemberitaan Terkini di Kota Medan
              </h2>
              <p className="text-xs font-medium text-muted-foreground">
                Artikel terverifikasi yang baru dinormalisasi dari portal media
              </p>
            </div>
            <Link
              href="/news"
              className="text-xs font-semibold text-[#D9541E] hover:text-[#C24412] flex items-center gap-1 transition-colors"
            >
              <span>Lihat Semua</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {latestNews.length === 0 ? (
            <div className="py-8">
              <EmptyState
                title="Belum Ada Berita Tersimpan"
                description="Basis data belum memiliki artikel berita. Jalankan scraper dari halaman Scraping Monitor untuk mengumpulkan berita pertama."
                action={
                  <Link href="/scraping">
                    <Button
                      size="sm"
                      className="gap-2 bg-[#D9541E] text-white hover:bg-[#C24412] font-semibold"
                    >
                      Buka Scraping Monitor
                    </Button>
                  </Link>
                }
              />
            </div>
          ) : (
            <div className="divide-y divide-border/60">
              {latestNews.map((news) => (
                <div
                  key={news.id}
                  className="py-3.5 first:pt-3.5 last:pb-0 flex flex-col gap-2 transition hover:bg-secondary/40 rounded-lg px-2"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    {news.category && (
                      <CategoryBadge
                        name={news.category.name}
                        slug={news.category.slug}
                      />
                    )}
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-muted-foreground">
                      <MapPin className="h-3 w-3 text-[#D9541E]" />
                      {news.locationName || "Kota Medan"}
                    </span>
                    <span className="text-[11px] text-muted-foreground/50">&bull;</span>
                    <span className="text-[11px] font-medium text-muted-foreground">
                      {news.source?.name || "Portal Berita"}
                    </span>
                    {news.publishedAt && (
                      <>
                        <span className="text-[11px] text-muted-foreground/50">&bull;</span>
                        <span className="text-[11px] font-mono text-muted-foreground">
                          {new Date(news.publishedAt).toLocaleDateString("id-ID", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </>
                    )}
                  </div>

                  <Link
                    href={`/news/${news.id}`}
                    className="font-bold text-foreground hover:text-[#D9541E] transition-colors text-sm leading-snug"
                  >
                    {news.title}
                  </Link>

                  {news.description && (
                    <p className="text-xs font-medium text-muted-foreground line-clamp-2 leading-relaxed">
                      {news.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Trend Monitoring Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Weekly Trend Bar Chart */}
        <Card className="rounded-xl border border-border bg-card p-5 shadow-2xs lg:col-span-2">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-border/80 gap-2">
            <div>
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-[#D9541E]" />
                <h2 className="text-base font-bold text-foreground">
                  Dinamika Tren Publikasi Mingguan
                </h2>
              </div>
              <p className="text-xs font-medium text-muted-foreground">
                Frekuensi artikel berita kemiskinan dan masalah sosial ekonomi 8 minggu terakhir
              </p>
            </div>
            {trends && (
              <Badge
                variant="outline"
                className={`gap-1 text-xs font-bold ${
                  trends.percentageChange >= 0
                    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                    : "border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-300"
                }`}
              >
                {trends.percentageChange >= 0 ? (
                  <TrendingUp className="h-3.5 w-3.5" />
                ) : (
                  <TrendingDown className="h-3.5 w-3.5" />
                )}
                {trends.percentageChange > 0 ? `+${trends.percentageChange}%` : `${trends.percentageChange}%`}{" "}
                vs 30 hari lalu
              </Badge>
            )}
          </div>

          <div className="mt-6">
            {trends?.weeklyTrends && trends.weeklyTrends.length > 0 ? (
              <div className="grid grid-cols-8 gap-2 items-end h-40 pt-6">
                {trends.weeklyTrends.map((w, idx) => {
                  const maxCount = Math.max(...trends.weeklyTrends.map((t) => t.count), 1);
                  const barHeight = Math.max(Math.round((w.count / maxCount) * 100), 8);

                  return (
                    <div key={idx} className="flex flex-col items-center gap-2 h-full justify-end group">
                      <span className="text-[10px] font-mono font-bold text-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                        {w.count}
                      </span>
                      <div
                        className="w-full max-w-[28px] rounded-t-md bg-[#D9541E] group-hover:bg-[#C24412] transition-all"
                        style={{ height: `${barHeight}%` }}
                      />
                      <span className="text-[10px] font-medium font-mono text-muted-foreground text-center truncate w-full">
                        {w.week}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground py-10 text-center font-medium">
                Belum cukup riwayat data untuk visualisasi mingguan.
              </p>
            )}
          </div>
        </Card>

        {/* Regional Breakdown Card */}
        <Card className="rounded-xl border border-border bg-card p-5 shadow-2xs lg:col-span-1">
          <div className="flex items-center justify-between pb-4 border-b border-border/80">
            <div>
              <h2 className="text-base font-bold text-foreground">
                Sebaran Wilayah
              </h2>
              <p className="text-xs font-medium text-muted-foreground">
                Kecamatan paling sering diberitakan
              </p>
            </div>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#D9541E]/10 text-[#D9541E]">
              <MapPin className="h-4 w-4" />
            </div>
          </div>

          <div className="mt-4 space-y-2">
            {trends?.regionalBreakdown && trends.regionalBreakdown.length > 0 ? (
              trends.regionalBreakdown.slice(0, 6).map((reg, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-secondary/50 border border-border/60 text-xs transition-colors hover:bg-secondary"
                >
                  <span className="font-semibold text-foreground truncate">
                    {reg.location}
                  </span>
                  <Badge variant="outline" className="text-[11px] font-mono font-bold text-[#D9541E] border-[#D9541E]/30 bg-[#D9541E]/10">
                    {reg.count} berita
                  </Badge>
                </div>
              ))
            ) : (
              <p className="text-xs text-muted-foreground py-6 text-center font-medium">
                Belum ada data ekstraksi wilayah kecamatan.
              </p>
            )}
          </div>
        </Card>
      </div>

      {/* Scraper Status Banner */}
      <Card className="rounded-xl border border-border bg-card p-5 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <h3 className="text-sm font-bold text-foreground">
                Background Ingestion Worker Siaga
              </h3>
            </div>
            <p className="text-xs font-medium text-muted-foreground">
              Jadwal cron berikutnya: Besok pukul 06:00:00 WIB (Asia/Jakarta) &bull; Protokol Anti-Duplikasi Normalized URL Hash Aktif
            </p>
          </div>
          <Link href="/scraping">
            <Button size="sm" variant="outline" className="gap-2 text-xs font-semibold border-border hover:bg-secondary">
              <ExternalLink className="h-3.5 w-3.5 text-[#D9541E]" />
              Buka Kontrol Scraper
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
