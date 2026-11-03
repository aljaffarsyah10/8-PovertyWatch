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
        if (!ignore) {
          setLoading(false);
        }
      }
    }
    loadSources();
    return () => {
      ignore = true;
    };
  }, []);

  const handleRefresh = async () => {
    setLoading(true);
    setError(null);
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
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Gagal memuat sumber berita"
      );
    } finally {
      setLoading(false);
    }
  };

  const filteredSources = sources.filter((s) => {
    const matchQuery =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.baseUrl.toLowerCase().includes(searchQuery.toLowerCase());
    const matchType = typeFilter === "ALL" || s.type === typeFilter;
    return matchQuery && matchType;
  });

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      await apiFetch(`/api/sources/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ isActive: !currentStatus }),
      });
      setSources((prev) =>
        prev.map((s) => (s.id === id ? { ...s, isActive: !currentStatus } : s))
      );
      showNotification(
        `Status sumber diperbarui: ${!currentStatus ? "Aktif" : "Nonaktif"}.`
      );
    } catch (err: unknown) {
      alert(`Gagal memperbarui status: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  const handleDeleteSource = async (id: string, name: string) => {
    if (!confirm(`Hapus sumber "${name}" beserta konfigurasi scraping-nya?`)) {
      return;
    }
    try {
      await apiFetch(`/api/sources/${id}`, { method: "DELETE" });
      setSources((prev) => prev.filter((s) => s.id !== id));
      showNotification(`Sumber "${name}" berhasil dihapus.`);
    } catch (err: unknown) {
      alert(`Gagal menghapus sumber: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  const handleTriggerScrape = async (sourceId: string, name: string) => {
    try {
      await apiFetch("/api/scraping/run", {
        method: "POST",
        body: JSON.stringify({ sourceId }),
      });
      showNotification(`Scraping untuk "${name}" telah dicatat ke antrean worker.`);
    } catch (err: unknown) {
      alert(`Gagal memicu scraping: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.name.trim() || formData.name.length < 3) {
      errors.name = "Nama sumber minimal 3 karakter.";
    }
    if (!formData.baseUrl.trim() || !formData.baseUrl.startsWith("http")) {
      errors.baseUrl = "Base URL wajib berupa URL HTTP/HTTPS valid.";
    }
    if (
      formData.type === "RSS" &&
      (!formData.feedUrl.trim() || !formData.feedUrl.startsWith("http"))
    ) {
      errors.feedUrl = "Feed URL wajib diisi untuk sumber bertipe RSS.";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddSourceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const payload = {
        name: formData.name,
        baseUrl: formData.baseUrl,
        feedUrl: formData.type === "RSS" ? formData.feedUrl : null,
        type: formData.type,
        scrapeFrequency: formData.scrapeFrequency,
        isActive: true,
        selectorConfig:
          formData.type === "HTML"
            ? {
                itemSelector: formData.itemSelector,
                titleSelector: formData.titleSelector,
                linkSelector: formData.linkSelector || formData.titleSelector,
              }
            : null,
      };

      const res = await apiFetch<SourceItem>("/api/sources", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      if (res.data) {
        setSources([res.data, ...sources]);
      }
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
      showNotification(`Sumber "${payload.name}" berhasil ditambahkan.`);
    } catch (err: unknown) {
      alert(`Gagal menambahkan sumber: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-xs text-white shadow-lg dark:bg-white dark:text-slate-900 animate-in fade-in slide-in-from-bottom-2">
          <Check className="h-4 w-4 text-emerald-400 dark:text-emerald-600" />
          <span>{notification}</span>
        </div>
      )}

      {/* Page Header */}
      <PageHeader
        title="Manajemen Sumber Berita"
        description="Kelola portal berita lokal Kota Medan dan konfigurasi scraping RSS / HTML."
      >
        <Button
          variant="ghost"
          size="sm"
          onClick={handleRefresh}
          className="gap-1.5 text-xs"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Refresh
        </Button>
        <Button
          size="sm"
          onClick={() => setIsAddModalOpen(true)}
          className="gap-2 bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900"
        >
          <Plus className="h-4 w-4" />
          Tambah Sumber Baru
        </Button>
      </PageHeader>

      {/* Filter and Search Bar */}
      <Card className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari sumber berita atau domain..."
              className="pl-9 text-xs"
            />
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={typeFilter === "ALL" ? "default" : "outline"}
              size="sm"
              onClick={() => setTypeFilter("ALL")}
              className="text-xs"
            >
              Semua ({sources.length})
            </Button>
            <Button
              variant={typeFilter === "RSS" ? "default" : "outline"}
              size="sm"
              onClick={() => setTypeFilter("RSS")}
              className="text-xs"
            >
              RSS ({sources.filter((s) => s.type === "RSS").length})
            </Button>
            <Button
              variant={typeFilter === "HTML" ? "default" : "outline"}
              size="sm"
              onClick={() => setTypeFilter("HTML")}
              className="text-xs"
            >
              HTML ({sources.filter((s) => s.type === "HTML").length})
            </Button>
          </div>
        </div>
      </Card>

      {/* Sources Data Table */}
      {loading ? (
        <Card className="p-4 bg-white dark:bg-slate-900 rounded-xl">
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
        <Card className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <EmptyState
            title="Belum Ada Sumber Berita"
            description="Tambahkan portal media berita lokal pertama Anda untuk mulai mengumpulkan berita."
            action={
              <Button
                size="sm"
                onClick={() => setIsAddModalOpen(true)}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Tambah Sumber Sekarang
              </Button>
            }
          />
        </Card>
      ) : (
        <Card className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-semibold text-slate-600 uppercase tracking-wider dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">
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
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredSources.map((source) => (
                  <tr
                    key={source.id}
                    className="hover:bg-slate-50/70 transition dark:hover:bg-slate-800/50"
                  >
                    <td className="py-3 px-4 max-w-xs">
                      <div className="font-semibold text-slate-900 dark:text-white">
                        {source.name}
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-0.5">
                        <a
                          href={source.baseUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline flex items-center gap-1 text-slate-500"
                        >
                          {source.baseUrl}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <Badge
                        variant="outline"
                        className={`text-[10px] font-semibold px-2 py-0.5 ${
                          source.type === "RSS"
                            ? "border-teal-200 bg-teal-50 text-teal-800 dark:border-teal-900 dark:bg-teal-950/60 dark:text-teal-300"
                            : "border-purple-200 bg-purple-50 text-purple-800 dark:border-purple-900 dark:bg-purple-950/60 dark:text-purple-300"
                        }`}
                      >
                        {source.type}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap text-slate-600 dark:text-slate-300">
                      {source.scrapeFrequency === "DAILY" ? "1x Sehari (Harian)" : source.scrapeFrequency}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      {healthMap[source.id] ? (
                        healthMap[source.id].healthStatus === "HEALTHY" ? (
                          <Badge
                            variant="outline"
                            className="border-emerald-200 bg-emerald-50 text-emerald-700 text-[10px] gap-1 dark:bg-emerald-950 dark:text-emerald-300"
                          >
                            <CheckCircle2 className="h-3 w-3" />
                            Sehat
                          </Badge>
                        ) : healthMap[source.id].healthStatus === "DEGRADED" ? (
                          <Badge
                            variant="outline"
                            className="border-amber-200 bg-amber-50 text-amber-700 text-[10px] gap-1 dark:bg-amber-950 dark:text-amber-300"
                          >
                            <AlertTriangle className="h-3 w-3" />
                            Degradasi
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="border-rose-200 bg-rose-50 text-rose-700 text-[10px] gap-1 dark:bg-rose-950 dark:text-rose-300"
                          >
                            <AlertTriangle className="h-3 w-3" />
                            Kritis
                          </Badge>
                        )
                      ) : (
                        <Badge
                          variant="outline"
                          className="border-slate-200 bg-slate-50 text-slate-500 text-[10px] gap-1 dark:bg-slate-800 dark:text-slate-400"
                        >
                          <HeartPulse className="h-3 w-3" />
                          Siap
                        </Badge>
                      )}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap text-slate-500 dark:text-slate-400">
                      {source.lastScrapedAt
                        ? new Date(source.lastScrapedAt).toLocaleString("id-ID")
                        : "Belum pernah"}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap font-medium text-slate-900 dark:text-white">
                      {source._count?.news ?? 0}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <button
                        onClick={() =>
                          handleToggleActive(source.id, source.isActive)
                        }
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium cursor-pointer transition ${
                          source.isActive
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800"
                            : "bg-slate-100 text-slate-500 border border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700"
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            source.isActive ? "bg-emerald-500" : "bg-slate-400"
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
                          className="h-7 px-2 text-xs text-teal-700 hover:bg-teal-50 dark:text-teal-300"
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
                          className="h-7 w-7 p-0 text-slate-400 hover:text-rose-600"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                Tambah Sumber Berita Baru
              </h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="rounded-md p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleAddSourceSubmit} className="mt-4 space-y-4">
              <div>
                <label className="text-xs font-medium text-slate-700 block mb-1 dark:text-slate-300">
                  Nama Portal Media *
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Contoh: Medan Pos Online"
                  className="text-xs"
                />
                {formErrors.name && (
                  <p className="mt-1 text-[11px] text-rose-600">{formErrors.name}</p>
                )}
              </div>

              <div>
                <label className="text-xs font-medium text-slate-700 block mb-1 dark:text-slate-300">
                  Base URL *
                </label>
                <Input
                  value={formData.baseUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, baseUrl: e.target.value })
                  }
                  placeholder="https://medanposonline.com"
                  className="text-xs"
                />
                {formErrors.baseUrl && (
                  <p className="mt-1 text-[11px] text-rose-600">
                    {formErrors.baseUrl}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-700 block mb-1 dark:text-slate-300">
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
                    className="h-9 w-full rounded-md border border-slate-200 bg-white px-2 text-xs text-slate-800 focus:outline-hidden dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
                  >
                    <option value="RSS">RSS / Atom Feed</option>
                    <option value="HTML">HTML Scraper</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-700 block mb-1 dark:text-slate-300">
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
                    className="h-9 w-full rounded-md border border-slate-200 bg-white px-2 text-xs text-slate-800 focus:outline-hidden dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
                  >
                    <option value="DAILY">Harian (06:00 WIB)</option>
                    <option value="WEEKLY">Mingguan</option>
                    <option value="MONTHLY">Bulanan</option>
                  </select>
                </div>
              </div>

              {formData.type === "RSS" && (
                <div>
                  <label className="text-xs font-medium text-slate-700 block mb-1 dark:text-slate-300">
                    Feed URL (XML/RSS) *
                  </label>
                  <Input
                    value={formData.feedUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, feedUrl: e.target.value })
                    }
                    placeholder="https://medanposonline.com/rss/news.xml"
                    className="text-xs"
                  />
                  {formErrors.feedUrl && (
                    <p className="mt-1 text-[11px] text-rose-600">
                      {formErrors.feedUrl}
                    </p>
                  )}
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsAddModalOpen(false)}
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={isSubmitting}
                  className="bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900"
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
