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
  PieChart,
  ExternalLink,
  MapPin,
  ShieldCheck,
  RefreshCw,
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
  const [latestNews, setLatestNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDashboardData = async () => {
    try {
      const [statsRes, newsRes] = await Promise.all([
        apiFetch<DashboardStats>("/api/dashboard/stats"),
        apiFetch<NewsItem[]>("/api/news?limit=4&sortBy=newest"),
      ]);

      if (statsRes.data) {
        setStats(statsRes.data);
      }
      if (newsRes.data) {
        setLatestNews(newsRes.data);
      }
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Gagal memuat data dari server basis data."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;
    async function init() {
      try {
        const [statsRes, newsRes] = await Promise.all([
          apiFetch<DashboardStats>("/api/dashboard/stats"),
          apiFetch<NewsItem[]>("/api/news?limit=4&sortBy=newest"),
        ]);
        if (!ignore) {
          if (statsRes.data) setStats(statsRes.data);
          if (newsRes.data) setLatestNews(newsRes.data);
        }
      } catch (err: unknown) {
        if (!ignore) {
          setError(
            err instanceof Error
              ? err.message
              : "Gagal memuat data dari server basis data."
          );
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }
    init();
    return () => {
      ignore = true;
    };
  }, []);

  const handleRefresh = async () => {
    setLoading(true);
    setError(null);
    await loadDashboardData();
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Dashboard Pemantauan Media"
          description="Memuat ringkasan data dari basis data PostgreSQL..."
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Card className="p-5 lg:col-span-2">
            <NewsCardSkeleton />
          </Card>
          <Card className="p-5">
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
          variant="ghost"
          size="sm"
          onClick={handleRefresh}
          className="gap-1.5 text-xs text-slate-500 hover:text-slate-900"
          title="Segarkan data"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Refresh
        </Button>
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
        <Card className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 lg:col-span-1">
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
            {categoryDistribution.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">
                Belum ada data kategori teragregasi.
              </p>
            ) : (
              categoryDistribution.slice(0, 5).map((cat) => {
                const total = stats?.totalArticles || 1;
                const percentage = Math.round((cat.count / total) * 100);

                return (
                  <div key={cat.categoryId} className="space-y-1">
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
                        style={{ width: `${Math.min(percentage * 2.5, 100)}%` }}
                        className="h-full rounded-full bg-slate-900 dark:bg-slate-100"
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="mt-5 border-t border-slate-100 pt-3 dark:border-slate-800">
            <Link
              href="/categories"
              className="text-xs font-medium text-teal-700 hover:underline flex items-center justify-between dark:text-teal-400"
            >
              <span>Lihat seluruh kategori & kata kunci</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </Card>

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

          {latestNews.length === 0 ? (
            <div className="py-8">
              <EmptyState
                title="Belum Ada Berita Tersimpan"
                description="Basis data belum memiliki artikel berita. Jalankan scraper dari halaman Scraping Monitor untuk mengumpulkan berita pertama."
                action={
                  <Link href="/scraping">
                    <Button size="sm" className="gap-2">
                      Buka Scraping Monitor
                    </Button>
                  </Link>
                }
              />
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {latestNews.map((news) => (
                <div
                  key={news.id}
                  className="py-4 first:pt-4 last:pb-0 flex flex-col gap-2 transition hover:bg-slate-50/50 rounded-lg px-2 dark:hover:bg-slate-800/50"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    {news.category && (
                      <CategoryBadge
                        name={news.category.name}
                        slug={news.category.slug}
                      />
                    )}
                    <span className="flex items-center gap-1 text-[11px] font-medium text-slate-500 dark:text-slate-400">
                      <MapPin className="h-3 w-3 text-slate-400" />
                      {news.locationName || "Kota Medan"}
                    </span>
                    <span className="text-[11px] text-slate-400">&bull;</span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      {news.source?.name || "Portal Berita"}
                    </span>
                    {news.publishedAt && (
                      <>
                        <span className="text-[11px] text-slate-400">&bull;</span>
                        <span className="text-[11px] text-slate-400">
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
                    className="font-semibold text-slate-900 hover:text-teal-700 transition dark:text-white dark:hover:text-teal-400 text-sm"
                  >
                    {news.title}
                  </Link>

                  {news.description && (
                    <p className="text-xs text-slate-600 line-clamp-2 dark:text-slate-300">
                      {news.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Scraper Status Banner */}
      <Card className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                Background Ingestion Worker Siaga
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Jadwal cron berikutnya: Besok pukul 06:00:00 WIB (Asia/Jakarta) &bull; Protokol Anti-Duplikasi Normalized URL Hash Aktif
            </p>
          </div>
          <Link href="/scraping">
            <Button size="sm" variant="outline" className="gap-2 text-xs">
              <ExternalLink className="h-3.5 w-3.5" />
              Buka Kontrol Scraper
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
