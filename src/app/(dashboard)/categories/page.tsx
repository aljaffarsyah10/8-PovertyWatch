"use client";

import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TableRowSkeleton } from "@/components/shared/loading-skeleton";
import { ErrorState } from "@/components/shared/error-state";
import { EmptyState } from "@/components/shared/empty-state";
import {
  Search,
  Hash,
  RefreshCw,
} from "lucide-react";
import { CategoryBadge } from "@/components/shared/category-badge";
import { apiFetch } from "@/lib/api-client";

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  _count?: { news: number };
  keywords: Array<{ id: string; keyword: string }>;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;
    async function loadCategories() {
      try {
        const res = await apiFetch<CategoryItem[]>("/api/categories");
        if (!ignore && res.data) {
          setCategories(res.data);
        }
      } catch (err: unknown) {
        if (!ignore) {
          setError(
            err instanceof Error ? err.message : "Gagal memuat kategori dari server"
          );
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }
    loadCategories();
    return () => {
      ignore = true;
    };
  }, []);

  const handleRefresh = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiFetch<CategoryItem[]>("/api/categories");
      if (res.data) setCategories(res.data);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Gagal memuat kategori dari server"
      );
    } finally {
      setLoading(false);
    }
  };

  const filteredCategories = categories.filter((c) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    const matchName = c.name.toLowerCase().includes(q);
    const matchDesc = c.description?.toLowerCase().includes(q) ?? false;
    const matchKeywords = c.keywords.some((k) =>
      k.keyword.toLowerCase().includes(q)
    );
    return matchName || matchDesc || matchKeywords;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Kategori Fenomena & Kata Kunci"
        description="Konfigurasi taksonomi kemiskinan dan kata kunci (keywords) yang digunakan algoritma pencocokan berita."
      >
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          className="gap-1.5 text-xs font-semibold border-border hover:bg-secondary"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Refresh
        </Button>
      </PageHeader>

      {/* Search Bar */}
      <Card className="rounded-xl border border-border bg-card p-4 shadow-2xs">
        <div className="relative">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari kategori atau kata kunci spesifik (misal: 'stunting', 'bansos', 'bedah rumah')..."
            className="pl-9 text-xs font-medium bg-background border-border focus:border-[#D9541E] focus:ring-1 focus:ring-[#D9541E]"
          />
        </div>
      </Card>

      {/* Content */}
      {loading ? (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <Card className="p-5 rounded-xl bg-card border-border"><TableRowSkeleton columns={3} /></Card>
          <Card className="p-5 rounded-xl bg-card border-border"><TableRowSkeleton columns={3} /></Card>
        </div>
      ) : error ? (
        <ErrorState
          title="Gagal Memuat Kategori"
          description={error}
          onRetry={handleRefresh}
        />
      ) : filteredCategories.length === 0 ? (
        <Card className="rounded-xl border border-border bg-card p-6 shadow-2xs">
          <EmptyState
            title="Tidak Ada Kategori Ditemukan"
            description="Kategori belum di-seed ke basis data atau tidak cocok dengan filter pencarian. Jalankan 'npm run seed' untuk mengisi kategori awal."
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {filteredCategories.map((category) => (
            <Card
              key={category.id}
              className="flex flex-col justify-between rounded-xl border border-border bg-card p-5 shadow-2xs transition hover:shadow-xs hover:border-border/80"
            >
              <div>
                <div className="flex items-center justify-between gap-2 pb-2">
                  <CategoryBadge
                    name={category.name}
                    slug={category.slug}
                    className="text-xs"
                  />
                  <span className="text-xs font-mono font-bold text-foreground">
                    {category._count?.news ?? 0} Artikel
                  </span>
                </div>

                {category.description && (
                  <p className="mt-2 text-xs font-medium text-muted-foreground leading-relaxed">
                    {category.description}
                  </p>
                )}

                {/* Keywords Tag List */}
                <div className="mt-4 pt-3.5 border-t border-border/80">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                      Kata Kunci Relevansi ({category.keywords.length})
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {category.keywords.map((kw) => (
                      <span
                        key={kw.id}
                        className="inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-1 text-[11px] font-medium text-foreground border border-border transition-colors hover:border-[#D9541E]/40"
                      >
                        <Hash className="h-2.5 w-2.5 text-[#D9541E]" />
                        {kw.keyword}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
