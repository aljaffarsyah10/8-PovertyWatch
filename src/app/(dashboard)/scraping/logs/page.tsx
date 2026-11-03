"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { TableRowSkeleton } from "@/components/shared/loading-skeleton";
import { ErrorState } from "@/components/shared/error-state";
import { EmptyState } from "@/components/shared/empty-state";
import {
  ArrowLeft,
  Search,
  Info,
  AlertCircle,
  Eye,
  X,
  Code,
  RefreshCw,
} from "lucide-react";
import { apiFetch } from "@/lib/api-client";

interface ScrapingJobWithLogs {
  id: string;
  sourceId?: string | null;
  source?: { name: string } | null;
  status: string;
  errorMessage?: string | null;
  createdAt: string;
}

export default function ScrapingLogsPage() {
  const [jobs, setJobs] = useState<ScrapingJobWithLogs[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<
    "ALL" | "INFO" | "WARNING" | "ERROR"
  >("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeLogModal, setActiveLogModal] = useState<ScrapingJobWithLogs | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;
    async function loadJobs() {
      try {
        const res = await apiFetch<ScrapingJobWithLogs[]>("/api/scraping/jobs?limit=50");
        if (!ignore && res.data) {
          setJobs(res.data);
        }
      } catch (err: unknown) {
        if (!ignore) {
          setError(
            err instanceof Error ? err.message : "Gagal memuat log dari server"
          );
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

  const handleRefresh = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiFetch<ScrapingJobWithLogs[]>("/api/scraping/jobs?limit=50");
      if (res.data) setJobs(res.data);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Gagal memuat log dari server"
      );
    } finally {
      setLoading(false);
    }
  };

  const filteredJobs = jobs.filter((job) => {
    const isError = job.status === "FAILED" || Boolean(job.errorMessage);
    if (selectedLevel === "ERROR" && !isError) return false;
    if (selectedLevel === "INFO" && isError) return false;

    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;

    return (
      job.id.toLowerCase().includes(query) ||
      (job.source?.name && job.source.name.toLowerCase().includes(query)) ||
      (job.errorMessage && job.errorMessage.toLowerCase().includes(query))
    );
  });

  return (
    <div className="space-y-6">
      <Link href="/scraping">
        <Button
          variant="ghost"
          size="sm"
          className="gap-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Scraping Monitor
        </Button>
      </Link>

      <PageHeader
        title="Scraping Audit Logs"
        description="Pemeriksaan mendalam atas seluruh proses ingestion, status job, dan jejak audit worker dari basis data."
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
      </PageHeader>

      {/* Filter and Search Bar */}
      <Card className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari ID job, nama portal media, atau pesan status..."
              className="pl-9 text-xs"
            />
          </div>
          <div className="flex items-center gap-1.5">
            <Button
              variant={selectedLevel === "ALL" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedLevel("ALL")}
              className="text-xs"
            >
              Semua ({jobs.length})
            </Button>
            <Button
              variant={selectedLevel === "INFO" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedLevel("INFO")}
              className="text-xs"
            >
              Sukses
            </Button>
            <Button
              variant={selectedLevel === "ERROR" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedLevel("ERROR")}
              className="text-xs"
            >
              Gagal
            </Button>
          </div>
        </div>
      </Card>

      {/* Logs Table */}
      {loading ? (
        <Card className="p-4 bg-white dark:bg-slate-900 rounded-xl">
          <TableRowSkeleton columns={5} />
          <TableRowSkeleton columns={5} />
        </Card>
      ) : error ? (
        <ErrorState
          title="Gagal Memuat Log"
          description={error}
          onRetry={handleRefresh}
        />
      ) : filteredJobs.length === 0 ? (
        <Card className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <EmptyState
            title="Tidak Ada Catatan Log Sesuai Filter"
            description="Belum ada audit log yang sesuai dengan filter pencarian atau riwayat job scraping."
          />
        </Card>
      ) : (
        <Card className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-sans font-semibold text-slate-600 uppercase tracking-wider dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">
                <tr>
                  <th className="py-3 px-4">Level</th>
                  <th className="py-3 px-4">Waktu</th>
                  <th className="py-3 px-4">ID Job</th>
                  <th className="py-3 px-4">Sumber</th>
                  <th className="py-3 px-4">Pesan Status</th>
                  <th className="py-3 px-4 text-right">Detail</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans dark:divide-slate-800">
                {filteredJobs.map((job) => {
                  const isErr = job.status === "FAILED" || Boolean(job.errorMessage);

                  return (
                    <tr
                      key={job.id}
                      className="hover:bg-slate-50/70 transition dark:hover:bg-slate-800/50"
                    >
                      <td className="py-3 px-4 whitespace-nowrap">
                        {isErr ? (
                          <Badge
                            variant="outline"
                            className="border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900 dark:bg-rose-950/60 dark:text-rose-300 gap-1 text-[10px]"
                          >
                            <AlertCircle className="h-3 w-3" />
                            ERROR
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-300 gap-1 text-[10px]"
                          >
                            <Info className="h-3 w-3" />
                            INFO
                          </Badge>
                        )}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap text-slate-500 font-mono text-[11px] dark:text-slate-400">
                        {new Date(job.createdAt).toLocaleString("id-ID")}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap font-mono text-[11px] text-slate-700 dark:text-slate-300">
                        {job.id.slice(0, 8)}...
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap font-medium text-slate-900 dark:text-white">
                        {job.source?.name || "Batch (Semua Sumber)"}
                      </td>
                      <td className="py-3 px-4 text-slate-700 dark:text-slate-300 max-w-md">
                        {job.errorMessage || `Eksekusi selesai dengan status ${job.status}`}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setActiveLogModal(job)}
                          className="h-7 px-2 text-xs text-teal-700 hover:bg-teal-50 dark:text-teal-300"
                        >
                          <Eye className="h-3.5 w-3.5 mr-1" />
                          JSON
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* JSON Payload Inspector Modal */}
      {activeLogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Code className="h-4 w-4 text-teal-600" />
                <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                  Audit Payload Inspector ({activeLogModal.id})
                </h2>
              </div>
              <button
                onClick={() => setActiveLogModal(null)}
                className="rounded-md p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 space-y-3">
              <div>
                <span className="text-[11px] font-medium text-slate-400 block mb-1">
                  Metadata Job Record:
                </span>
                <pre className="p-3 rounded-lg bg-slate-950 text-slate-100 text-xs font-mono overflow-x-auto max-h-60">
                  {JSON.stringify(activeLogModal, null, 2)}
                </pre>
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setActiveLogModal(null)}
              >
                Tutup
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
