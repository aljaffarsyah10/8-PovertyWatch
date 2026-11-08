"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { CategoryBadge } from "@/components/shared/category-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { TableRowSkeleton } from "@/components/shared/loading-skeleton";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Download,
  Search,
  ExternalLink,
  MapPin,
  RotateCcw,
  LayoutGrid,
  List,
  FileSpreadsheet,
  FileText,
} from "lucide-react";
import { apiFetch } from "@/lib/api-client";

interface NewsItem {
  id: string;
  title: string;
  url: string;
  normalizedUrl: string;
  description?: string;
  locationName?: string;
  locationLevel?: string;
  publishedAt?: string;
  source?: { id: string; name: string };
  category?: { id: string; name: string; slug: string };
}

interface CategoryOption {
  id: string;
  name: string;
  slug: string;
}

interface SourceOption {
  id: string;
  name: string;
  type: string;
}

export default function NewsExplorerPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [sources, setSources] = useState<SourceOption[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [selectedSource, setSelectedSource] = useState<string>("ALL");
  const [selectedLocation, setSelectedLocation] = useState<string>("ALL");
  const [sortBy, setSortBy] = useState<"newest" | "oldest">("newest");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [refreshIndex, setRefreshIndex] = useState<number>(0);

  useEffect(() => {
    let ignore = false;
    async function loadOptions() {
      try {
        const [catRes, srcRes] = await Promise.all([
          apiFetch<CategoryOption[]>("/api/categories"),
          apiFetch<SourceOption[]>("/api/sources"),
        ]);
        if (!ignore) {
          if (catRes.data) setCategories(catRes.data);
          if (srcRes.data) setSources(srcRes.data);
        }
      } catch {
        // Options fallback
      }
    }
    loadOptions();
    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    let ignore = false;
    async function loadNews() {
      try {
        const params = new URLSearchParams();
        params.set("page", currentPage.toString());
        params.set("limit", "10");
        params.set("sortBy", sortBy);

        if (searchQuery.trim()) params.set("search", searchQuery.trim());
        if (selectedCategory !== "ALL") params.set("categoryId", selectedCategory);
        if (selectedSource !== "ALL") params.set("sourceId", selectedSource);
        if (selectedLocation !== "ALL") params.set("location", selectedLocation);

        const res = await apiFetch<NewsItem[]>(`/api/news?${params.toString()}`);
        if (!ignore) {
          if (res.success && res.data) {
            setNews(res.data);
            if (res.meta) {
              setTotalPages(res.meta.totalPages || 1);
              setTotalCount(res.meta.total || res.data.length);
            }
          }
          setError(null);
        }
      } catch (err: unknown) {
        if (!ignore) {
          const msg = err instanceof Error ? err.message : "Gagal memuat berita";
          setError(msg);
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    loadNews();

    return () => {
      ignore = true;
    };
  }, [
    currentPage,
    searchQuery,
    selectedCategory,
    selectedSource,
    selectedLocation,
    sortBy,
    refreshIndex,
  ]);

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("ALL");
    setSelectedSource("ALL");
    setSelectedLocation("ALL");
    setSortBy("newest");
    setCurrentPage(1);
  };

  const handleRetry = () => {
    setRefreshIndex((prev) => prev + 1);
  };

  const handleExportCSV = () => {
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set("search", searchQuery.trim());
    if (selectedCategory !== "ALL") params.set("categoryId", selectedCategory);
    if (selectedSource !== "ALL") params.set("sourceId", selectedSource);
    const link = document.createElement("a");
    link.href = `/api/news/export?${params.toString()}`;
    link.setAttribute("download", `povertywatch_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportExcel = () => {
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set("search", searchQuery.trim());
    if (selectedCategory !== "ALL") params.set("categoryId", selectedCategory);
    if (selectedSource !== "ALL") params.set("sourceId", selectedSource);
    if (selectedLocation !== "ALL") params.set("location", selectedLocation);
    const link = document.createElement("a");
    link.href = `/api/news/export/excel?${params.toString()}`;
    link.setAttribute("download", `povertywatch_export_${Date.now()}.xlsx`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportPDF = () => {
    const params = new URLSearchParams();
    if (selectedCategory !== "ALL") params.set("categoryId", selectedCategory);
    const link = document.createElement("a");
    link.href = `/api/news/report/pdf?${params.toString()}`;
    link.setAttribute("download", `povertywatch_report_${Date.now()}.pdf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="News Explorer"
        description="Telusuri, saring, dan analisis artikel berita fenomena sosial ekonomi di Kota Medan."
      >
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            className="gap-1.5 text-xs font-semibold border-border hover:bg-secondary"
            title="Ekspor data hasil filter ke CSV"
          >
            <Download className="h-3.5 w-3.5 text-muted-foreground" />
            CSV ({totalCount})
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportExcel}
            className="gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800 dark:text-emerald-400 border-border hover:bg-secondary"
            title="Ekspor ke Excel Workbook (XLSX) dengan lembar metodologi"
          >
            <FileSpreadsheet className="h-3.5 w-3.5" />
            Excel
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportPDF}
            className="gap-1.5 text-xs font-semibold text-[#D9541E] hover:text-[#C24412] border-border hover:bg-secondary"
            title="Unduh laporan ringkasan berita dalam format PDF"
          >
            <FileText className="h-3.5 w-3.5" />
            Laporan PDF
          </Button>
        </div>
      </PageHeader>

      {/* Filter and Search Panel */}
      <Card className="rounded-xl border border-border bg-card p-4 shadow-2xs">
        <div className="space-y-3">
          {/* Search bar & View mode */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Cari kata kunci, judul, atau nama kecamatan (misal: 'stunting belawan')..."
                className="pl-9 text-xs font-medium bg-background border-border focus:border-[#D9541E] focus:ring-1 focus:ring-[#D9541E]"
              />
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center rounded-lg border border-border bg-secondary/50 p-0.5">
                <button
                  onClick={() => setViewMode("table")}
                  className={`rounded-md p-1.5 text-xs transition font-medium ${
                    viewMode === "table"
                      ? "bg-[#D9541E] text-white shadow-2xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  aria-label="Tampilan Tabel"
                >
                  <List className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode("grid")}
                  className={`rounded-md p-1.5 text-xs transition font-medium ${
                    viewMode === "grid"
                      ? "bg-[#D9541E] text-white shadow-2xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  aria-label="Tampilan Kartu"
                >
                  <LayoutGrid className="h-4 w-4" />
                </button>
              </div>

              {(searchQuery ||
                selectedCategory !== "ALL" ||
                selectedSource !== "ALL" ||
                selectedLocation !== "ALL") && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleResetFilters}
                  className="h-8 gap-1.5 text-xs font-bold text-[#D9541E] hover:bg-[#D9541E]/10 hover:text-[#C24412]"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Reset
                </Button>
              )}
            </div>
          </div>

          {/* Filter Dropdowns Grid */}
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 md:grid-cols-4 pt-2.5 border-t border-border/80">
            {/* Category Filter */}
            <div>
              <label className="text-[11px] font-bold text-muted-foreground block mb-1">
                Kategori Fenomena
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setCurrentPage(1);
                }}
                className="h-8 w-full rounded-md border border-border bg-background px-2 text-xs font-medium text-foreground focus:border-[#D9541E] focus:outline-hidden"
              >
                <option value="ALL">Semua Kategori</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Source Filter */}
            <div>
              <label className="text-[11px] font-bold text-muted-foreground block mb-1">
                Sumber Portal Media
              </label>
              <select
                value={selectedSource}
                onChange={(e) => {
                  setSelectedSource(e.target.value);
                  setCurrentPage(1);
                }}
                className="h-8 w-full rounded-md border border-border bg-background px-2 text-xs font-medium text-foreground focus:border-[#D9541E] focus:outline-hidden"
              >
                <option value="ALL">Semua Sumber Media</option>
                {sources.map((src) => (
                  <option key={src.id} value={src.id}>
                    {src.name} ({src.type})
                  </option>
                ))}
              </select>
            </div>

            {/* Location Filter */}
            <div>
              <label className="text-[11px] font-bold text-muted-foreground block mb-1">
                Wilayah Kecamatan
              </label>
              <select
                value={selectedLocation}
                onChange={(e) => {
                  setSelectedLocation(e.target.value);
                  setCurrentPage(1);
                }}
                className="h-8 w-full rounded-md border border-border bg-background px-2 text-xs font-medium text-foreground focus:border-[#D9541E] focus:outline-hidden"
              >
                <option value="ALL">Seluruh Kota Medan</option>
                <option value="Medan Belawan">Medan Belawan</option>
                <option value="Medan Deli">Medan Deli</option>
                <option value="Medan Sunggal">Medan Sunggal</option>
                <option value="Medan Amplas">Medan Amplas</option>
                <option value="Medan Labuhan">Medan Labuhan</option>
                <option value="Medan Timur">Medan Timur</option>
                <option value="Medan Barat">Medan Barat</option>
                <option value="Medan Kota">Medan Kota</option>
              </select>
            </div>

            {/* Sorting */}
            <div>
              <label className="text-[11px] font-bold text-muted-foreground block mb-1">
                Urutan Berita
              </label>
              <select
                value={sortBy}
                onChange={(e) =>
                  setSortBy(e.target.value as "newest" | "oldest")
                }
                className="h-8 w-full rounded-md border border-border bg-background px-2 text-xs font-medium text-foreground focus:border-[#D9541E] focus:outline-hidden"
              >
                <option value="newest">Terbaru (Default)</option>
                <option value="oldest">Terlama</option>
              </select>
            </div>
          </div>
        </div>
      </Card>

      {/* Results Count & Meta */}
      <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
        <span>
          Menampilkan <strong className="text-foreground font-bold">{totalCount}</strong> artikel terverifikasi dari database
        </span>
        <span className="font-mono">
          Halaman {currentPage} dari {totalPages}
        </span>
      </div>

      {/* Content Rendering: Loading, Error, Empty, or Data */}
      {loading ? (
        <Card className="p-4 bg-card border-border rounded-xl">
          <TableRowSkeleton columns={6} />
          <TableRowSkeleton columns={6} />
          <TableRowSkeleton columns={6} />
        </Card>
      ) : error ? (
        <ErrorState
          title="Gagal Memuat Berita"
          description={error}
          onRetry={handleRetry}
        />
      ) : news.length === 0 ? (
        <Card className="rounded-xl border border-border bg-card p-6 shadow-2xs">
          <EmptyState
            title="Tidak Ada Artikel Ditemukan"
            description="Tidak ada artikel berita yang cocok dengan kriteria pencarian atau filter saat ini. Coba ubah kata kunci atau jalankan ingestion scraper."
            action={
              <Button
                variant="outline"
                size="sm"
                onClick={handleResetFilters}
                className="gap-2 border-border font-semibold hover:bg-secondary"
              >
                <RotateCcw className="h-4 w-4" />
                Reset Semua Filter
              </Button>
            }
          />
        </Card>
      ) : viewMode === "table" ? (
        /* Table View */
        <Card className="overflow-hidden rounded-xl border border-border bg-card shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border bg-secondary/50 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Judul Berita</th>
                  <th className="py-3 px-4">Kategori</th>
                  <th className="py-3 px-4">Lokasi</th>
                  <th className="py-3 px-4">Sumber Portal</th>
                  <th className="py-3 px-4">Tanggal</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {news.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-secondary/40 transition-colors"
                  >
                    <td className="py-3 px-4 max-w-md">
                      <Link
                        href={`/news/${item.id}`}
                        className="font-bold text-foreground hover:text-[#D9541E] transition-colors line-clamp-2 leading-snug"
                      >
                        {item.title}
                      </Link>
                      {item.description && (
                        <p className="mt-1 text-[11px] font-medium text-muted-foreground line-clamp-1">
                          {item.description}
                        </p>
                      )}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      {item.category ? (
                        <CategoryBadge
                          name={item.category.name}
                          slug={item.category.slug}
                        />
                      ) : (
                        <span className="text-muted-foreground text-[11px]">Umum</span>
                      )}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 font-semibold text-foreground">
                        <MapPin className="h-3 w-3 text-[#D9541E]" />
                        {item.locationName || "Kota Medan"}
                      </span>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap font-medium text-foreground">
                      {item.source?.name || "-"}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap font-mono text-muted-foreground">
                      {item.publishedAt
                        ? new Date(item.publishedAt).toLocaleDateString("id-ID", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                        : "-"}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link href={`/news/${item.id}`}>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2.5 text-xs font-bold text-[#D9541E] hover:bg-[#D9541E]/10"
                          >
                            Detail
                          </Button>
                        </Link>
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-md p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                          title="Buka sumber asli"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      ) : (
        /* Grid / Card View */
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {news.map((item) => (
            <Card
              key={item.id}
              className="flex flex-col justify-between rounded-xl border border-border bg-card p-5 shadow-2xs transition hover:shadow-xs"
            >
              <div>
                <div className="flex items-center justify-between gap-2 pb-2">
                  {item.category ? (
                    <CategoryBadge
                      name={item.category.name}
                      slug={item.category.slug}
                    />
                  ) : (
                    <span className="text-[11px] font-medium text-muted-foreground">Umum</span>
                  )}
                  <span className="text-[11px] font-mono font-medium text-muted-foreground">
                    {item.publishedAt
                      ? new Date(item.publishedAt).toLocaleDateString("id-ID")
                      : ""}
                  </span>
                </div>
                <Link
                  href={`/news/${item.id}`}
                  className="font-bold text-foreground hover:text-[#D9541E] transition-colors text-sm block mt-1 leading-snug"
                >
                  {item.title}
                </Link>
                {item.description && (
                  <p className="mt-2 text-xs font-medium text-muted-foreground line-clamp-3 leading-relaxed">
                    {item.description}
                  </p>
                )}
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-border/80 pt-3 text-xs">
                <span className="flex items-center gap-1 font-medium text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5 text-[#D9541E]" />
                  {item.locationName || "Kota Medan"} &bull; {item.source?.name}
                </span>
                <Link
                  href={`/news/${item.id}`}
                  className="font-bold text-[#D9541E] hover:underline"
                >
                  Lihat Detail &rarr;
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-border/80 pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="text-xs font-semibold border-border hover:bg-secondary"
          >
            &larr; Sebelumnya
          </Button>

          <div className="flex items-center gap-1.5">
            {Array.from({ length: totalPages }).map((_, idx) => {
              const pageNumber = idx + 1;
              return (
                <button
                  key={pageNumber}
                  onClick={() => setCurrentPage(pageNumber)}
                  className={`h-8 w-8 rounded-lg text-xs font-mono font-bold transition ${
                    currentPage === pageNumber
                      ? "bg-[#D9541E] text-white shadow-2xs"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  {pageNumber}
                </button>
              );
            })}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="text-xs font-semibold border-border hover:bg-secondary"
          >
            Berikutnya &rarr;
          </Button>
        </div>
      )}
    </div>
  );
}
