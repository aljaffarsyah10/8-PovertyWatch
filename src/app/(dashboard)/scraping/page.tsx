"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { TableRowSkeleton } from "@/components/shared/loading-skeleton";
import { ErrorState } from "@/components/shared/error-state";
import { EmptyState } from "@/components/shared/empty-state";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Play,
  ScrollText,
  Clock,
  RefreshCw,
  Cpu,
  Layers,
  Check,
} from "lucide-react";
import { apiFetch } from "@/lib/api-client";

interface ScrapingJobItem {
  id: string;
  sourceId?: string | null;
  source?: { name: string; type: string } | null;
  triggerType: "MANUAL" | "SCHEDULED";
  status: "PENDING" | "RUNNING" | "COMPLETED" | "FAILED";
  startedAt?: string | null;
  finishedAt?: string | null;
  totalFound: number;
  totalNew: number;
  totalDuplicate: number;
  totalFailed: number;
  errorMessage?: string | null;
  createdAt: string;
}

export default function ScrapingMonitorPage() {
  const [jobs, setJobs] = useState<ScrapingJobItem[]>([]);
  const [isTriggering, setIsTriggering] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const refreshJobs = async () => {
    try {
      const res = await apiFetch<ScrapingJobItem[]>("/api/scraping/jobs?limit=20");
      if (res.data) setJobs(res.data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Gagal memuat riwayat job");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;
    async function loadJobs() {
      try {
        const res = await apiFetch<ScrapingJobItem[]>("/api/scraping/jobs?limit=20");
        if (!ignore && res.data) {
          setJobs(res.data);
        }
      } catch (err: unknown) {
        if (!ignore) {
          setError(err instanceof Error ? err.message : "Gagal memuat riwayat job");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }
    loadJobs();
    return () => {
      ignore = true;
    };
  }, []);

  // Polling loop jika terdapat job yang sedang PENDING atau RUNNING
  useEffect(() => {
    const hasActiveJob = jobs.some(
      (j) => j.status === "PENDING" || j.status === "RUNNING"
    );
    if (!hasActiveJob) return;

    const timer = setInterval(() => {
      apiFetch<ScrapingJobItem[]>("/api/scraping/jobs?limit=20")
        .then((res) => {
          if (res.data) setJobs(res.data);
        })
        .catch(() => {});
    }, 3500);

    return () => clearInterval(timer);
  }, [jobs]);

  const handleRefresh = async () => {
    setLoading(true);
    setError(null);
    await refreshJobs();
  };

  const handleRunManualScrape = async () => {
    setIsTriggering(true);
    try {
      const res = await apiFetch<{ jobId: string }>("/api/scraping/run", {
        method: "POST",
      });
      showNotification(
        `Job scraping #${res.data?.jobId.slice(-6)} telah dikirim ke antrean worker.`
      );
      await refreshJobs();
    } catch (err: unknown) {
      alert(`Gagal memicu scraping: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsTriggering(false);
    }
  };

  const isAnyJobRunning = jobs.some(
    (j) => j.status === "PENDING" || j.status === "RUNNING"
  );

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
        title="Scraping Monitor & Ingestion Worker"
        description="Pantau proses background worker, jalankan scraping manual, dan audit eksekusi pengambilan berita."
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
        <Link href="/scraping/logs">
          <Button variant="outline" size="sm" className="gap-2">
            <ScrollText className="h-4 w-4" />
            Audit Logs
          </Button>
        </Link>
        <Button
          size="sm"
          onClick={handleRunManualScrape}
          disabled={isTriggering || isAnyJobRunning}
          className="gap-2 bg-teal-600 text-white hover:bg-teal-700 disabled:opacity-75"
        >
          {isTriggering || isAnyJobRunning ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin" />
              Scraping Sedang Berjalan...
            </>
          ) : (
            <>
              <Play className="h-4 w-4" />
              Jalankan Scrape Manual
            </>
          )}
        </Button>
      </PageHeader>

      {/* Worker Live Status Banner */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
              <Cpu className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[11px] font-medium text-slate-400 block">
                Status Worker Antrean
              </span>
              <span className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-900 dark:text-white">
                <span
                  className={`h-2 w-2 rounded-full ${
                    isAnyJobRunning ? "bg-amber-500 animate-pulse" : "bg-emerald-500"
                  }`}
                />
                {isAnyJobRunning ? "SEDANG MEMPROSES" : "STANDBY (NORMAL)"}
              </span>
            </div>
          </div>
        </Card>

        <Card className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-50 text-teal-600 dark:bg-teal-950 dark:text-teal-400">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[11px] font-medium text-slate-400 block">
                Jadwal Cron Harian
              </span>
              <span className="text-sm font-bold text-slate-900 dark:text-white">
                06:00:00 WIB (Asia/Jakarta)
              </span>
            </div>
          </div>
        </Card>

        <Card className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[11px] font-medium text-slate-400 block">
                Protokol Anti-Duplikasi
              </span>
              <span className="text-sm font-bold text-slate-900 dark:text-white">
                Normalized URL Hash
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* Jobs History Table */}
      {loading ? (
        <Card className="p-4 bg-white dark:bg-slate-900 rounded-xl">
          <TableRowSkeleton columns={7} />
          <TableRowSkeleton columns={7} />
        </Card>
      ) : error ? (
        <ErrorState
          title="Gagal Memuat Jobs"
          description={error}
          onRetry={handleRefresh}
        />
      ) : jobs.length === 0 ? (
        <Card className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <EmptyState
            title="Belum Ada Riwayat Job Scraping"
            description="Tekan tombol 'Jalankan Scrape Manual' di atas untuk memicu proses ingestion pertama."
            action={
              <Button
                size="sm"
                onClick={handleRunManualScrape}
                disabled={isTriggering}
                className="gap-2"
              >
                <Play className="h-4 w-4" />
                Mulai Scraping Sekarang
              </Button>
            }
          />
        </Card>
      ) : (
        <Card className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                Riwayat Eksekusi Job Scraping
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Catatan eksekusi terjadwal otomatis maupun manual dari database
              </p>
            </div>
            <span className="text-xs text-slate-400">
              Total {jobs.length} Job Terdaftar
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-semibold text-slate-600 uppercase tracking-wider dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">
                <tr>
                  <th className="py-3 px-4">ID Job</th>
                  <th className="py-3 px-4">Pemicu</th>
                  <th className="py-3 px-4">Waktu Mulai</th>
                  <th className="py-3 px-4">Hasil Ditemukan</th>
                  <th className="py-3 px-4">Baru Disimpan</th>
                  <th className="py-3 px-4">Duplikat</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Detail</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {jobs.map((job) => (
                  <tr
                    key={job.id}
                    className="hover:bg-slate-50/70 transition dark:hover:bg-slate-800/50"
                  >
                    <td className="py-3 px-4 font-mono font-medium text-slate-900 dark:text-white">
                      {job.id.slice(0, 8)}...
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span
                        className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${
                          job.triggerType === "SCHEDULED"
                            ? "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                            : "bg-teal-50 text-teal-800 border border-teal-200 dark:bg-teal-950 dark:text-teal-300 dark:border-teal-800"
                        }`}
                      >
                        {job.triggerType}
                      </span>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap text-slate-600 dark:text-slate-400">
                      {job.startedAt
                        ? new Date(job.startedAt).toLocaleString("id-ID")
                        : "Dalam antrean"}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap font-medium text-slate-900 dark:text-white">
                      {job.totalFound}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap font-bold text-emerald-600 dark:text-emerald-400">
                      +{job.totalNew}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap text-slate-500">
                      {job.totalDuplicate}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <StatusBadge status={job.status} />
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap text-right">
                      <Link href={`/scraping/logs`}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 px-2 text-xs text-teal-700 hover:bg-teal-50 dark:text-teal-300"
                        >
                          Logs &rarr;
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
