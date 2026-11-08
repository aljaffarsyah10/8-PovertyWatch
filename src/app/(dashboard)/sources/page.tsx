"use client";

import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { TableRowSkeleton } from "@/components/shared/loading-skeleton";
import { ErrorState } from "@/components/shared/error-state";
import { EmptyState } from "@/components/shared/empty-state";
import {
  Plus,
  Play,
  Trash2,
  ExternalLink,
  X,
  Search,
  Check,
  RefreshCw,
  HeartPulse,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import { apiFetch } from "@/lib/api-client";

interface SourceItem {
  id: string;
  name: string;
  baseUrl: string;
  feedUrl?: string | null;
  type: "RSS" | "HTML";
  isActive: boolean;
  scrapeFrequency: "DAILY" | "WEEKLY" | "MONTHLY";
  lastScrapedAt?: string | null;
  _count?: { news: number };
}

interface SourceHealthItem {
  sourceId: string;
  name: string;
  healthStatus: "HEALTHY" | "DEGRADED" | "FAILING";
  lastSuccessfulRun?: string | null;
  lastFailureAt?: string | null;
  lastErrorMessage?: string | null;
}

export default function SourcesPage() {
  const [sources, setSources] = useState<SourceItem[]>([]);
  const [healthMap, setHealthMap] = useState<Record<string, SourceHealthItem>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<"ALL" | "RSS" | "HTML">("ALL");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    baseUrl: "",
    feedUrl: "",
    type: "RSS" as "RSS" | "HTML",
    scrapeFrequency: "DAILY" as "DAILY" | "WEEKLY" | "MONTHLY",
    itemSelector: "",
    titleSelector: "",
    linkSelector: "",
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  useEffect(() => {
    let ignore = false;
    async function loadSources() {
      try {
        const [res, healthRes] = await Promise.all([
          apiFetch<SourceItem[]>("/api/sources"),
          apiFetch<SourceHealthItem[]>("/api/sources/health"),
        ]);
        if (!ignore) {
          if (res.data) setSources(res.data);
          if (healthRes.data) {
            const map: Record<string, SourceHealthItem> = {};
            for (const h of healthRes.data) {
              map[h.sourceId] = h;
            }
            setHealthMap(map);
          }
        }
      } catch (err: unknown) {
        if (!ignore) {
          setError(
            err instanceof Error ? err.message : "Gagal memuat sumber berita"
          );
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    loadSources();
    return () => {
      ignore = true;
    };
  }, []);

  const handleRefresh = async () => {
    setLoading(true);
    try {
      const [res, healthRes] = await Promise.all([
        apiFetch<SourceItem[]>("/api/sources"),
        apiFetch<SourceHealthItem[]>("/api/sources/health"),
      ]);
      if (res.data) setSources(res.data);
      if (healthRes.data) {
        const map: Record<string, SourceHealthItem> = {};
        for (const h of healthRes.data) {
          map[h.sourceId] = h;
        }
        setHealthMap(map);
      }
      setError(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Gagal menyegarkan data");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (sourceId: string, currentStatus: boolean) => {
    try {
      const res = await apiFetch<SourceItem>(`/api/sources/${sourceId}`, {
        method: "PATCH",
        body: JSON.stringify({ isActive: !currentStatus }),
      });
      if (res.success && res.data) {
        setSources((prev) =>
          prev.map((s) => (s.id === sourceId ? { ...s, isActive: !currentStatus } : s))
        );
        showNotification(
          `Sumber "${res.data.name}" berhasil di${!currentStatus ? "aktifkan" : "nonaktifkan"}.`
        );
      }
    } catch {
      showNotification("Gagal mengubah status sumber");
    }
  };

  const handleTriggerScrape = async (sourceId: string, sourceName: string) => {
    showNotification(`Memicu proses scraping untuk "${sourceName}"...`);
    try {
      const res = await apiFetch<{ articlesSaved: number }>(
        `/api/sources/${sourceId}/scrape`,
        { method: "POST" }
      );
      if (res.success) {
        showNotification(
          `Scraping selesai: ${res.data?.articlesSaved || 0} artikel baru tersimpan.`
        );
        handleRefresh();
      } else {
        showNotification(`Scraping gagal: ${res.error?.message || "Unknown error"}`);
      }
    } catch {
      showNotification("Terjadi kendala saat memicu scraping.");
    }
  };

  const handleDeleteSource = async (sourceId: string, sourceName: string) => {
    if (!confirm(`Hapus sumber "${sourceName}" dari pemantauan?`)) return;
    try {
      const res = await apiFetch(`/api/sources/${sourceId}`, {
        method: "DELETE",
      });
      if (res.success) {
        setSources((prev) => prev.filter((s) => s.id !== sourceId));
        showNotification(`Sumber "${sourceName}" berhasil dihapus.`);
      }
    } catch {
      showNotification("Gagal menghapus sumber.");
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) errors.name = "Nama sumber wajib diisi";
    if (!formData.baseUrl.trim()) errors.baseUrl = "Base URL wajib diisi";
    else {
      try {
        new URL(formData.baseUrl);
      } catch {
        errors.baseUrl = "Format URL tidak valid (harus menyertakan https://)";
      }
    }

    if (formData.type === "RSS" && !formData.feedUrl.trim()) {
      errors.feedUrl = "Feed URL wajib diisi untuk ingestion RSS";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddSourceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const payload: Record<string, unknown> = {
        name: formData.name.trim(),
        baseUrl: formData.baseUrl.trim(),
        type: formData.type,
        scrapeFrequency: formData.scrapeFrequency,
      };

      if (formData.type === "RSS") {
        payload.feedUrl = formData.feedUrl.trim();
      } else {
        payload.scraperConfig = {
          itemSelector: formData.itemSelector || "article",
          titleSelector: formData.titleSelector || "h2",
          linkSelector: formData.linkSelector || "a",
        };
      }

      const res = await apiFetch<SourceItem>("/api/sources", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      if (res.success && res.data) {
        setSources((prev) => [res.data!, ...prev]);
        setIsAddModalOpen(false);
        setFormData({
          name: "",
          baseUrl: "",
          feedUrl: "",
          type: "RSS",
          scrapeFrequency: "DAILY",
          itemSelector: "",
          titleSelector: "",
          linkSelector: "",
        });
        showNotification(`Sumber "${res.data.name}" berhasil ditambahkan.`);
      } else {
        showNotification(res.error?.message || "Gagal menambahkan sumber");
      }
    } catch (err: unknown) {
      showNotification(
        err instanceof Error ? err.message : "Terjadi kendala saat menyimpan"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredSources = sources.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.baseUrl.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "ALL" || s.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-xl bg-foreground px-4 py-3 text-xs font-semibold text-background shadow-xl border border-border animate-in fade-in slide-in-from-bottom-2">
          <Check className="h-4 w-4 text-[#D9541E]" />
          <span>{notification}</span>
        </div>
      )}

      {/* Page Header */}
      <PageHeader
        title="Manajemen Sumber Berita"
        description="Kelola portal berita lokal Kota Medan dan konfigurasi scraping RSS / HTML."
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
        <Button
          size="sm"
          onClick={() => setIsAddModalOpen(true)}
          className="gap-2 bg-[#D9541E] text-white hover:bg-[#C24412] font-semibold shadow-xs"
        >
          <Plus className="h-4 w-4" />
          Tambah Sumber Baru
        </Button>
      </PageHeader>

      {/* Filter and Search Bar */}
      <Card className="rounded-xl border border-border bg-card p-4 shadow-2xs">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari sumber berita atau domain..."
              className="pl-9 text-xs font-medium bg-background border-border focus:border-[#D9541E] focus:ring-1 focus:ring-[#D9541E]"
            />
          </div>
          <div className="flex items-center gap-1.5">
            <Button
              variant={typeFilter === "ALL" ? "default" : "outline"}
              size="sm"
              onClick={() => setTypeFilter("ALL")}
              className={`text-xs font-semibold ${
                typeFilter === "ALL"
                  ? "bg-[#D9541E] text-white hover:bg-[#C24412]"
                  : "border-border hover:bg-secondary"
              }`}
            >
              Semua ({sources.length})
            </Button>
            <Button
              variant={typeFilter === "RSS" ? "default" : "outline"}
              size="sm"
              onClick={() => setTypeFilter("RSS")}
              className={`text-xs font-semibold ${
                typeFilter === "RSS"
                  ? "bg-[#D9541E] text-white hover:bg-[#C24412]"
                  : "border-border hover:bg-secondary"
              }`}
            >
              RSS ({sources.filter((s) => s.type === "RSS").length})
            </Button>
            <Button
              variant={typeFilter === "HTML" ? "default" : "outline"}
              size="sm"
              onClick={() => setTypeFilter("HTML")}
              className={`text-xs font-semibold ${
                typeFilter === "HTML"
                  ? "bg-[#D9541E] text-white hover:bg-[#C24412]"
                  : "border-border hover:bg-secondary"
              }`}
            >
              HTML ({sources.filter((s) => s.type === "HTML").length})
            </Button>
          </div>
        </div>
      </Card>

      {/* Sources Data Table */}
      {loading ? (
        <Card className="p-4 bg-card border-border rounded-xl">
          <TableRowSkeleton columns={6} />
          <TableRowSkeleton columns={6} />
        </Card>
      ) : error ? (
        <ErrorState
          title="Gagal Memuat Sumber"
          description={error}
          onRetry={handleRefresh}
        />
      ) : filteredSources.length === 0 ? (
        <Card className="rounded-xl border border-border bg-card p-6 shadow-2xs">
          <EmptyState
            title="Belum Ada Sumber Berita"
            description="Tambahkan portal media berita lokal pertama Anda untuk mulai mengumpulkan berita."
            action={
              <Button
                size="sm"
                onClick={() => setIsAddModalOpen(true)}
                className="gap-2 bg-[#D9541E] text-white hover:bg-[#C24412] font-semibold"
              >
                <Plus className="h-4 w-4" />
                Tambah Sumber Sekarang
              </Button>
            }
          />
        </Card>
      ) : (
        <Card className="overflow-hidden rounded-xl border border-border bg-card shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border bg-secondary/50 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Nama Sumber</th>
                  <th className="py-3 px-4">Tipe Ingestion</th>
                  <th className="py-3 px-4">Frekuensi</th>
                  <th className="py-3 px-4">Kesehatan Sumber</th>
                  <th className="py-3 px-4">Terakhir Diambil</th>
                  <th className="py-3 px-4">Total Artikel</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredSources.map((source) => (
                  <tr
                    key={source.id}
                    className="hover:bg-secondary/40 transition-colors"
                  >
                    <td className="py-3 px-4 max-w-xs">
                      <div className="font-bold text-foreground">
                        {source.name}
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground mt-0.5">
                        <a
                          href={source.baseUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline flex items-center gap-1 font-mono hover:text-[#D9541E] transition-colors"
                        >
                          {source.baseUrl}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <Badge
                        variant="outline"
                        className={`text-[10px] font-bold px-2 py-0.5 ${
                          source.type === "RSS"
                            ? "border-[#D9541E]/30 bg-[#D9541E]/10 text-[#D9541E]"
                            : "border-purple-500/30 bg-purple-500/10 text-purple-700 dark:text-purple-300"
                        }`}
                      >
                        {source.type}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap text-foreground font-medium">
                      {source.scrapeFrequency === "DAILY" ? "1x Sehari (Harian)" : source.scrapeFrequency}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      {healthMap[source.id] ? (
                        healthMap[source.id].healthStatus === "HEALTHY" ? (
                          <Badge
                            variant="outline"
                            className="border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-[10px] gap-1 font-bold"
                          >
                            <CheckCircle2 className="h-3 w-3" />
                            Sehat
                          </Badge>
                        ) : healthMap[source.id].healthStatus === "DEGRADED" ? (
                          <Badge
                            variant="outline"
                            className="border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300 text-[10px] gap-1 font-bold"
                          >
                            <AlertTriangle className="h-3 w-3" />
                            Degradasi
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-300 text-[10px] gap-1 font-bold"
                          >
                            <AlertTriangle className="h-3 w-3" />
                            Kritis
                          </Badge>
                        )
                      ) : (
                        <Badge
                          variant="outline"
                          className="border-border bg-secondary text-muted-foreground text-[10px] gap-1 font-semibold"
                        >
                          <HeartPulse className="h-3 w-3" />
                          Siap
                        </Badge>
                      )}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap font-mono text-muted-foreground">
                      {source.lastScrapedAt
                        ? new Date(source.lastScrapedAt).toLocaleString("id-ID")
                        : "Belum pernah"}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap font-mono font-bold text-foreground">
                      {source._count?.news ?? 0}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <button
                        onClick={() =>
                          handleToggleActive(source.id, source.isActive)
                        }
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold cursor-pointer transition ${
                          source.isActive
                            ? "bg-emerald-500/10 text-emerald-700 border border-emerald-500/30 dark:text-emerald-300"
                            : "bg-secondary text-muted-foreground border border-border"
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full shrink-0 ${
                            source.isActive ? "bg-emerald-500" : "bg-muted-foreground"
                          }`}
                        />
                        {source.isActive ? "Aktif" : "Nonaktif"}
                      </button>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            handleTriggerScrape(source.id, source.name)
                          }
                          className="h-7 px-2.5 text-xs font-bold text-[#D9541E] hover:bg-[#D9541E]/10"
                          title="Picu scraping sumber ini"
                        >
                          <Play className="h-3 w-3 mr-1" />
                          Scrape
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            handleDeleteSource(source.id, source.name)
                          }
                          className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive transition-colors"
                          title="Hapus sumber"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Add Source Modal Dialog */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-xl border border-border bg-card p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h2 className="text-base font-bold text-foreground">
                Tambah Sumber Berita Baru
              </h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="rounded-md p-1 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleAddSourceSubmit} className="mt-4 space-y-4">
              <div>
                <label className="text-xs font-bold text-foreground block mb-1">
                  Nama Portal Media *
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Contoh: Medan Pos Online"
                  className="text-xs font-medium bg-background border-border"
                />
                {formErrors.name && (
                  <p className="mt-1 text-[11px] font-semibold text-destructive">{formErrors.name}</p>
                )}
              </div>

              <div>
                <label className="text-xs font-bold text-foreground block mb-1">
                  Base URL *
                </label>
                <Input
                  value={formData.baseUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, baseUrl: e.target.value })
                  }
                  placeholder="https://medanposonline.com"
                  className="text-xs font-medium bg-background border-border"
                />
                {formErrors.baseUrl && (
                  <p className="mt-1 text-[11px] font-semibold text-destructive">
                    {formErrors.baseUrl}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-foreground block mb-1">
                    Tipe Ingestion
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        type: e.target.value as "RSS" | "HTML",
                      })
                    }
                    className="h-9 w-full rounded-md border border-border bg-background px-2 text-xs font-medium text-foreground focus:border-[#D9541E] focus:outline-hidden"
                  >
                    <option value="RSS">RSS / Atom Feed</option>
                    <option value="HTML">HTML Scraper</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-foreground block mb-1">
                    Frekuensi Scrape
                  </label>
                  <select
                    value={formData.scrapeFrequency}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        scrapeFrequency: e.target.value as
                          | "DAILY"
                          | "WEEKLY"
                          | "MONTHLY",
                      })
                    }
                    className="h-9 w-full rounded-md border border-border bg-background px-2 text-xs font-medium text-foreground focus:border-[#D9541E] focus:outline-hidden"
                  >
                    <option value="DAILY">Harian (06:00 WIB)</option>
                    <option value="WEEKLY">Mingguan</option>
                    <option value="MONTHLY">Bulanan</option>
                  </select>
                </div>
              </div>

              {formData.type === "RSS" && (
                <div>
                  <label className="text-xs font-bold text-foreground block mb-1">
                    Feed URL (XML/RSS) *
                  </label>
                  <Input
                    value={formData.feedUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, feedUrl: e.target.value })
                    }
                    placeholder="https://medanposonline.com/rss/news.xml"
                    className="text-xs font-medium bg-background border-border"
                  />
                  {formErrors.feedUrl && (
                    <p className="mt-1 text-[11px] font-semibold text-destructive">
                      {formErrors.feedUrl}
                    </p>
                  )}
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsAddModalOpen(false)}
                  className="border-border hover:bg-secondary font-semibold"
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={isSubmitting}
                  className="bg-[#D9541E] text-white hover:bg-[#C24412] font-semibold"
                >
                  {isSubmitting ? "Menyimpan..." : "Simpan Sumber"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
