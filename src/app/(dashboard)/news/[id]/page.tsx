import React, { Suspense } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, ExternalLink, Calendar, User, Globe } from "lucide-react";
import { CategoryBadge } from "@/components/shared/category-badge";
import { Skeleton } from "@/components/ui/skeleton";

async function NewsDetailContent({
  paramsPromise,
}: {
  paramsPromise: Promise<{ id: string }>;
}) {
  const { id } = await paramsPromise;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Detail Berita & Provenance"
        description={`ID Artikel: ${id}`}
        badge={<CategoryBadge name="Kemiskinan Ekstrem" />}
      >
        <Button variant="outline" size="sm" className="gap-2">
          <ExternalLink className="h-4 w-4" />
          Buka Sumber Asli
        </Button>
      </PageHeader>

      <Card className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pb-4 border-b border-slate-100 dark:border-slate-800 dark:text-slate-400">
            <span className="flex items-center gap-1.5">
              <Globe className="h-3.5 w-3.5 text-slate-400" />
              Portal Media Contoh
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-slate-400" />
              03 November 2026
            </span>
            <span className="flex items-center gap-1.5">
              <User className="h-3.5 w-3.5 text-slate-400" />
              Redaksi
            </span>
          </div>

          <div className="rounded-lg bg-slate-50 p-4 text-sm text-slate-600 dark:bg-slate-800/50 dark:text-slate-300">
            <p className="font-medium text-slate-900 dark:text-white mb-1">
              Ringkasan Cuplikan (Excerpt):
            </p>
            Halaman detail artikel berita ini akan menampilkan naskah ringkasan,
            provenance audit trail, dan tautan asli artikel secara terstruktur
            pada Phase 5.
          </div>
        </div>
      </Card>
    </div>
  );
}

function NewsDetailSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-40" />
      </div>
      <Card className="rounded-xl border border-slate-200/80 p-6">
        <Skeleton className="h-24 w-full" />
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
    <div className="space-y-6">
      <Link href="/news">
        <Button
          variant="ghost"
          size="sm"
          className="gap-2 text-slate-500 hover:text-slate-900 dark:text-slate-400"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke News Explorer
        </Button>
      </Link>

      <Suspense fallback={<NewsDetailSkeleton />}>
        <NewsDetailContent paramsPromise={params} />
      </Suspense>
    </div>
  );
}
