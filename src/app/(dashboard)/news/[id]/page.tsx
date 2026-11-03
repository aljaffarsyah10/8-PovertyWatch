import React, { Suspense } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ArrowLeft,
  ExternalLink,
  Calendar,
  User,
  Globe,
  MapPin,
  ShieldCheck,
} from "lucide-react";
import { CategoryBadge } from "@/components/shared/category-badge";
import { Skeleton } from "@/components/ui/skeleton";
import { MOCK_NEWS } from "@/features/news/mocks/mock-news";

async function NewsDetailContent({
  paramsPromise,
}: {
  paramsPromise: Promise<{ id: string }>;
}) {
  const { id } = await paramsPromise;
  const news = MOCK_NEWS.find((n) => n.id === id) || MOCK_NEWS[0];

  return (
    <div className="space-y-6">
      {/* Back button */}
      <Link href="/news">
        <Button
          variant="ghost"
          size="sm"
          className="gap-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke News Explorer
        </Button>
      </Link>

      {/* Page Header */}
      <PageHeader
        title={news.title}
        description={`Terbit pada ${news.publishedAt} &bull; Penulis: ${news.author}`}
        badge={
          <CategoryBadge
            name={news.categoryName}
            slug={news.categorySlug}
          />
        }
      >
        <a
          href={news.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button size="sm" className="gap-2 bg-teal-600 text-white hover:bg-teal-700">
            <ExternalLink className="h-4 w-4" />
            Buka Berita Asli di {news.sourceName}
          </Button>
        </a>
      </PageHeader>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Article & Summary */}
        <div className="space-y-6 lg:col-span-2">
          {/* Metadata bar */}
          <Card className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
                <Globe className="h-4 w-4 text-slate-400" />
                {news.sourceName}
              </span>
              <span className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
                <MapPin className="h-4 w-4 text-teal-600" />
                {news.locationName} ({news.locationLevel})
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-slate-400" />
                {news.publishedAt}
              </span>
              <span className="flex items-center gap-1.5">
                <User className="h-4 w-4 text-slate-400" />
                {news.author}
              </span>
            </div>
          </Card>

          {/* Excerpt and Content */}
          <Card className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-5 dark:border-slate-800 dark:bg-slate-900">
            <div className="rounded-lg border border-teal-200/60 bg-teal-50/50 p-4 dark:border-teal-900/40 dark:bg-teal-950/20">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-teal-900 dark:text-teal-300 mb-1.5">
                Ringkasan Intisari (Lead Summary):
              </h2>
              <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-200">
                {news.description}
              </p>
            </div>

            <div className="space-y-3 pt-2 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
              <h3 className="font-semibold text-slate-900 dark:text-white">
                Cuplikan Isi Berita:
              </h3>
              <p>{news.content}</p>
            </div>

            <div className="border-t border-slate-100 pt-4 flex items-center justify-between dark:border-slate-800">
              <span className="text-xs text-slate-400">
                Skor Relevansi Algoritma:{" "}
                <strong className="text-slate-700 dark:text-slate-300">
                  {Math.round(news.relevanceScore * 100)}%
                </strong>
              </span>
              <a
                href={news.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-medium text-teal-700 hover:underline flex items-center gap-1 dark:text-teal-400"
              >
                Baca kelanjutan artikel di portal asli &rarr;
              </a>
            </div>
          </Card>
        </div>

        {/* Sidebar: Provenance & Technical Audit Trail */}
        <div className="space-y-6">
          <Card className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 text-slate-900 font-semibold text-sm dark:border-slate-800 dark:text-white">
              <ShieldCheck className="h-4 w-4 text-teal-600" />
              <span>Data Provenance & Audit Trail</span>
            </div>

            <div className="mt-4 space-y-3.5 text-xs">
              <div>
                <span className="text-slate-400 block mb-0.5">ID Internal Berita:</span>
                <code className="rounded bg-slate-100 px-1.5 py-0.5 text-[11px] font-mono text-slate-800 dark:bg-slate-800 dark:text-slate-200">
                  {news.id}
                </code>
              </div>

              <div>
                <span className="text-slate-400 block mb-0.5">Canonical Normalized URL:</span>
                <p className="font-mono text-[11px] break-all text-slate-700 bg-slate-50 p-2 rounded border border-slate-100 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
                  {news.normalizedUrl}
                </p>
              </div>

              <div>
                <span className="text-slate-400 block mb-0.5">Tautan Asli Sebelum Normalisasi:</span>
                <p className="font-mono text-[11px] break-all text-slate-500">
                  {news.url}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="rounded-lg bg-amber-50/70 border border-amber-200 p-3 text-[11px] text-amber-900 dark:bg-amber-950/40 dark:border-amber-900/60 dark:text-amber-300">
                  <strong>Kepatuhan Hak Cipta & Etika:</strong> PovertyWatch
                  hanya mengindeks metadata, cuplikan awal, dan tautan asli. Naskah
                  lengkap menjadi hak eksklusif penerbit media bersangkutan.
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function NewsDetailSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-16 w-full" />
      <Card className="rounded-xl border border-slate-200/80 p-6">
        <Skeleton className="h-40 w-full" />
      </Card>
    </div>
  );
}

export default function NewsDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense fallback={<NewsDetailSkeleton />}>
      <NewsDetailContent paramsPromise={params} />
    </Suspense>
  );
}
