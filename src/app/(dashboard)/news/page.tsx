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
          if (res.data) {
            setNews(res.data);
          }
          if (res.meta) {
            setTotalCount(res.meta.total || 0);
            setTotalPages(res.meta.totalPages || 1);
          }
        }
      } catch (err: unknown) {
        if (!ignore) {
          setError(
            err instanceof Error
              ? err.message
              : "Gagal memuat daftar berita dari backend."
          );
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
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
    setLoading(true);
    setError(null);
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

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="News Explorer"
        description="Telusuri, saring, dan analisis artikel berita fenomena sosial ekonomi di Kota Medan."
      >
        <Button
          variant="outline"
          size="sm"
          onClick={handleExportCSV}
          className="gap-2"
        >
          <Download className="h-4 w-4 text-slate-600 dark:text-slate-400" />
          Ekspor CSV ({totalCount})
        </Button>
      </PageHeader>

      {/* Filter and Search Panel */}
      <Card className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="space-y-3">
          {/* Search bar & View mode */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Cari kata kunci, judul, atau nama kecamatan (misal: 'stunting belawan')..."
                className="pl-9 text-xs"
              />
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50 p-0.5 dark:border-slate-800 dark:bg-slate-900">
                <button
                  onClick={() => setViewMode("table")}
                  className={`rounded-md p-1.5 text-xs transition ${
                    viewMode === "table"
                      ? "bg-white text-slate-900 shadow-xs dark:bg-slate-800 dark:text-white"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                  aria-label="Tampilan Tabel"
                >
                  <List className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode("grid")}
                  className={`rounded-md p-1.5 text-xs transition ${
                    viewMode === "grid"
                      ? "bg-white text-slate-900 shadow-xs dark:bg-slate-800 dark:text-white"
                      : "text-slate-500 hover:text-slate-900"
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
                  className="h-8 gap-1.5 text-xs text-rose-600 hover:bg-rose-50 hover:text-rose-700 dark:text-rose-400 dark:hover:bg-rose-950/40"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Reset
                </Button>
              )}
            </div>
          </div>

          {/* Filter Dropdowns Grid */}
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 md:grid-cols-4 pt-2 border-t border-slate-100 dark:border-slate-800">
            {/* Category Filter */}
            <div>
              <label className="text-[11px] font-medium text-slate-500 block mb-1">
                Kategori Fenomena
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setCurrentPage(1);
                }}
                className="h-8 w-full rounded-md border border-slate-200 bg-white px-2 text-xs text-slate-800 focus:outline-hidden dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
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
              <label className="text-[11px] font-medium text-slate-500 block mb-1">
                Sumber Portal Media
              </label>
              <select
                value={selectedSource}
                onChange={(e) => {
                  setSelectedSource(e.target.value);
                  setCurrentPage(1);
                }}
                className="h-8 w-full rounded-md border border-slate-200 bg-white px-2 text-xs text-slate-800 focus:outline-hidden dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
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
              <label className="text-[11px] font-medium text-slate-500 block mb-1">
                Wilayah Kecamatan
              </label>
              <select
                value={selectedLocation}
                onChange={(e) => {
                  setSelectedLocation(e.target.value);
                  setCurrentPage(1);
                }}
                className="h-8 w-full rounded-md border border-slate-200 bg-white px-2 text-xs text-slate-800 focus:outline-hidden dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
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
              <label className="text-[11px] font-medium text-slate-500 block mb-1">
                Urutan Berita
              </label>
              <select
                value={sortBy}
                onChange={(e) =>
                  setSortBy(e.target.value as "newest" | "oldest")
                }
                className="h-8 w-full rounded-md border border-slate-200 bg-white px-2 text-xs text-slate-800 focus:outline-hidden dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
              >
                <option value="newest">Terbaru (Default)</option>
                <option value="oldest">Terlama</option>
              </select>
            </div>
          </div>
        </div>
      </Card>

      {/* Results Count & Meta */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <span>
          Menampilkan <strong>{totalCount}</strong> artikel terverifikasi dari database
        </span>
        <span>
          Halaman {currentPage} dari {totalPages}
        </span>
      </div>

      {/* Content Rendering: Loading, Error, Empty, or Data */}
      {loading ? (
        <Card className="p-4 bg-white dark:bg-slate-900 rounded-xl">
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
        <Card className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <EmptyState
            title="Tidak Ada Artikel Ditemukan"
            description="Tidak ada artikel berita yang cocok dengan kriteria pencarian atau filter saat ini. Coba ubah kata kunci atau jalankan ingestion scraper."
            action={
              <Button
                variant="outline"
                size="sm"
                onClick={handleResetFilters}
                className="gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                Reset Semua Filter
              </Button>
            }
          />
        </Card>
      ) : viewMode === "table" ? (
        /* Table View */
        <Card className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-semibold text-slate-600 uppercase tracking-wider dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">
                <tr>
                  <th className="py-3 px-4">Judul Berita</th>
                  <th className="py-3 px-4">Kategori</th>
                  <th className="py-3 px-4">Lokasi</th>
                  <th className="py-3 px-4">Sumber Portal</th>
                  <th className="py-3 px-4">Tanggal</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {news.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/70 transition dark:hover:bg-slate-800/50"
                  >
                    <td className="py-3 px-4 max-w-md">
                      <Link
                        href={`/news/${item.id}`}
                        className="font-medium text-slate-900 hover:text-teal-700 transition dark:text-white dark:hover:text-teal-400 line-clamp-2"
                      >
                        {item.title}
                      </Link>
                      {item.description && (
                        <p className="mt-0.5 text-[11px] text-slate-500 line-clamp-1 dark:text-slate-400">
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
                        <span className="text-slate-400 text-[11px]">Umum</span>
                      )}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 text-slate-600 dark:text-slate-300">
                        <MapPin className="h-3 w-3 text-slate-400" />
                        {item.locationName || "Kota Medan"}
                      </span>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap text-slate-600 dark:text-slate-300">
                      {item.source?.name || "-"}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap text-slate-500 dark:text-slate-400">
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
                            className="h-7 px-2 text-xs text-teal-700 hover:bg-teal-50 dark:text-teal-300"
                          >
                            Detail
                          </Button>
                        </Link>
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800"
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
              className="flex flex-col justify-between rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs transition hover:shadow-sm dark:border-slate-800 dark:bg-slate-900"
            >
              <div>
                <div className="flex items-center justify-between gap-2 pb-2">
                  {item.category ? (
                    <CategoryBadge
                      name={item.category.name}
                      slug={item.category.slug}
                    />
                  ) : (
                    <span className="text-[11px] text-slate-400">Umum</span>
                  )}
                  <span className="text-[11px] text-slate-400">
                    {item.publishedAt
                      ? new Date(item.publishedAt).toLocaleDateString("id-ID")
                      : ""}
                  </span>
                </div>
                <Link
                  href={`/news/${item.id}`}
                  className="font-semibold text-slate-900 hover:text-teal-700 transition dark:text-white dark:hover:text-teal-400 text-sm block mt-1"
                >
                  {item.title}
                </Link>
                {item.description && (
                  <p className="mt-2 text-xs text-slate-600 line-clamp-3 dark:text-slate-300">
                    {item.description}
                  </p>
                )}
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500 dark:border-slate-800">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-slate-400" />
                  {item.locationName || "Kota Medan"} &bull; {item.source?.name}
                </span>
                <Link
                  href={`/news/${item.id}`}
                  className="font-medium text-teal-700 hover:underline dark:text-teal-400"
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
        <div className="flex items-center justify-between border-t border-slate-200 pt-4 dark:border-slate-800">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="text-xs"
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
                  className={`h-8 w-8 rounded-lg text-xs font-medium transition ${
                    currentPage === pageNumber
                      ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                      : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
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
            className="text-xs"
          >
            Berikutnya &rarr;
          </Button>
        </div>
      )}
    </div>
  );
}
