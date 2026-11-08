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
  Sparkles,
} from "lucide-react";
import { CategoryBadge } from "@/components/shared/category-badge";
import { Skeleton } from "@/components/ui/skeleton";
import { prisma } from "@/lib/db/prisma";

async function NewsDetailContent({
  paramsPromise,
}: {
  paramsPromise: Promise<{ id: string }>;
}) {
  const { id } = await paramsPromise;

  let news = null;
  try {
    news = await prisma.news.findUnique({
      where: { id },
      include: {
        source: true,
        category: true,
      },
    });
  } catch {
    // Error loading from db
  }

  if (!news) {
    return (
      <div className="space-y-6">
        <Link href="/news">
          <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            Kembali ke News Explorer
          </Button>
        </Link>
        <Card className="p-8 text-center bg-card border-border rounded-xl">
          <h2 className="text-base font-bold text-foreground">
            Artikel Tidak Ditemukan
          </h2>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto font-medium">
            Artikel dengan ID &quot;{id}&quot; belum terdaftar di basis data atau
            telah dihapus.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back button */}
      <Link href="/news">
        <Button
          variant="ghost"
          size="sm"
          className="gap-2 text-muted-foreground hover:text-foreground font-semibold"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke News Explorer
        </Button>
      </Link>

      {/* Page Header */}
      <PageHeader
        title={news.title}
        description={`Terbit pada ${news.publishedAt ? new Date(news.publishedAt).toLocaleDateString("id-ID") : "Tanggal tidak tersedia"}`}
        badge={
          news.category ? (
            <CategoryBadge
              name={news.category.name}
              slug={news.category.slug}
            />
          ) : undefined
        }
      >
        <a
          href={news.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button size="sm" className="gap-2 bg-[#D9541E] text-white hover:bg-[#C24412] font-semibold shadow-xs">
            <ExternalLink className="h-4 w-4" />
            Buka Berita Asli di {news.source?.name}
          </Button>
        </a>
      </PageHeader>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Article & Summary */}
        <div className="space-y-6 lg:col-span-2">
          {/* Metadata bar */}
          <Card className="rounded-xl border border-border bg-card p-4 shadow-2xs">
            <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-muted-foreground">
              <span className="flex items-center gap-1.5 font-semibold text-foreground">
                <Globe className="h-4 w-4 text-[#D9541E]" />
                {news.source?.name || "Portal Berita"}
              </span>
              <span className="flex items-center gap-1.5 font-semibold text-foreground">
                <MapPin className="h-4 w-4 text-[#D9541E]" />
                {news.locationName || "Kota Medan"} ({news.locationLevel || "KOTA"})
              </span>
              {news.publishedAt && (
                <span className="flex items-center gap-1.5 font-mono">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  {new Date(news.publishedAt).toLocaleDateString("id-ID", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              )}
              {news.author && (
                <span className="flex items-center gap-1.5">
                  <User className="h-4 w-4 text-muted-foreground" />
                  {news.author}
                </span>
              )}
            </div>
          </Card>

          {/* AI Summary & Classification Card */}
          {news.aiSummary && (
            <Card className="rounded-xl border border-[#D9541E]/30 bg-[#D9541E]/8 p-5 shadow-2xs space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#D9541E]/20 pb-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-md bg-[#D9541E] text-white shadow-2xs">
                    <Sparkles className="h-3.5 w-3.5" />
                  </div>
                  <h2 className="text-xs font-bold uppercase tracking-wider text-foreground">
                    Ringkasan AI (2-4 Kalimat)
                  </h2>
                </div>
                {news.aiConfidence && (
                  <span className="text-[11px] font-bold text-[#D9541E] bg-[#D9541E]/15 border border-[#D9541E]/30 px-2 py-0.5 rounded font-mono">
                    Keyakinan AI: {(news.aiConfidence * 100).toFixed(0)}%
                  </span>
                )}
              </div>

              <p className="text-sm leading-relaxed text-foreground font-semibold">
                {news.aiSummary}
              </p>

              {news.aiReason && (
                <div className="text-xs font-medium text-foreground bg-card/80 p-3 rounded-lg border border-border">
                  <span className="font-bold text-[#D9541E]">
                    Dasar Klasifikasi:{" "}
                  </span>
                  {news.aiReason}
                </div>
              )}

              <p className="text-[10px] text-muted-foreground italic font-medium">
                * Catatan: Ringkasan dan klasifikasi ini dihasilkan otomatis oleh model pemrosesan bahasa alami (AI) untuk membantu pemetaan awal informasi publik.
              </p>
            </Card>
          )}

          {/* Excerpt and Content */}
          <Card className="rounded-xl border border-border bg-card p-6 shadow-2xs space-y-5">
            {news.description && (
              <div className="rounded-lg border border-border bg-secondary/40 p-4">
                <h2 className="text-xs font-bold uppercase tracking-wider text-[#D9541E] mb-1.5">
                  Ringkasan Intisari (Lead Summary):
                </h2>
                <p className="text-sm leading-relaxed text-foreground font-medium">
                  {news.description}
                </p>
              </div>
            )}

            {news.content && (
              <div className="space-y-3 pt-2 text-sm leading-relaxed text-foreground">
                <h3 className="font-bold text-base">
                  Cuplikan Isi Berita:
                </h3>
                <p className="font-medium text-muted-foreground leading-relaxed">
                  {news.content}
                </p>
              </div>
            )}

            <div className="border-t border-border/80 pt-4 flex items-center justify-between">
              <span className="text-xs text-muted-foreground font-medium">
                Status Relevansi:{" "}
                <strong className="text-foreground font-bold">
                  {news.isRelevant ? "Terverifikasi Relevan" : "Umum"}
                </strong>
              </span>

              <a
                href={news.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-[#D9541E] hover:underline flex items-center gap-1"
              >
                Baca artikel lengkap di portal asli &rarr;
              </a>
            </div>
          </Card>
        </div>

        {/* Sidebar: Provenance & Technical Audit Trail */}
        <div className="space-y-6">
          <Card className="rounded-xl border border-border bg-card p-5 shadow-2xs">
            <div className="flex items-center gap-2 pb-3 border-b border-border/80 text-foreground font-bold text-sm">
              <ShieldCheck className="h-4 w-4 text-[#D9541E]" />
              <span>Data Provenance & Audit Trail</span>
            </div>

            <div className="mt-4 space-y-3.5 text-xs">
              <div>
                <span className="text-muted-foreground font-medium block mb-0.5">ID Internal Database:</span>
                <code className="rounded bg-secondary px-1.5 py-0.5 text-[11px] font-mono font-semibold text-foreground border border-border">
                  {news.id}
                </code>
              </div>

              <div>
                <span className="text-muted-foreground font-medium block mb-0.5">Canonical Normalized URL:</span>
                <p className="font-mono text-[11px] break-all text-foreground bg-secondary/50 p-2.5 rounded-lg border border-border">
                  {news.normalizedUrl}
                </p>
              </div>

              <div>
                <span className="text-muted-foreground font-medium block mb-0.5">Tautan Asli Sebelum Normalisasi:</span>
                <p className="font-mono text-[11px] break-all text-muted-foreground">
                  {news.url}
                </p>
              </div>

              <div className="pt-2 border-t border-border/80">
                <div className="rounded-lg bg-[#D9541E]/10 border border-[#D9541E]/25 p-3 text-[11px] text-foreground font-medium">
                  <strong className="font-bold text-[#D9541E]">Kepatuhan Hak Cipta & Etika:</strong> PovertyWatch
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
      <Card className="rounded-xl border border-border p-6 bg-card">
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
