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
          className="gap-2 text-muted-foreground hover:text-foreground font-semibold"
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
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          className="gap-1.5 text-xs font-semibold border-border hover:bg-secondary"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Refresh
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
              placeholder="Cari ID job, nama portal media, atau pesan status..."
              className="pl-9 text-xs font-medium bg-background border-border focus:border-[#D9541E] focus:ring-1 focus:ring-[#D9541E]"
            />
          </div>
          <div className="flex items-center gap-1.5">
            <Button
              variant={selectedLevel === "ALL" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedLevel("ALL")}
              className={`text-xs font-semibold ${
                selectedLevel === "ALL"
                  ? "bg-[#D9541E] text-white hover:bg-[#C24412]"
                  : "border-border hover:bg-secondary"
              }`}
            >
              Semua ({jobs.length})
            </Button>
            <Button
              variant={selectedLevel === "INFO" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedLevel("INFO")}
              className={`text-xs font-semibold ${
                selectedLevel === "INFO"
                  ? "bg-[#D9541E] text-white hover:bg-[#C24412]"
                  : "border-border hover:bg-secondary"
              }`}
            >
              Sukses
            </Button>
            <Button
              variant={selectedLevel === "ERROR" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedLevel("ERROR")}
              className={`text-xs font-semibold ${
                selectedLevel === "ERROR"
                  ? "bg-[#D9541E] text-white hover:bg-[#C24412]"
                  : "border-border hover:bg-secondary"
              }`}
            >
              Gagal
            </Button>
          </div>
        </div>
      </Card>

      {/* Logs Table */}
      {loading ? (
        <Card className="p-4 bg-card border-border rounded-xl">
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
        <Card className="rounded-xl border border-border bg-card p-6 shadow-2xs">
          <EmptyState
            title="Tidak Ada Catatan Log Sesuai Filter"
            description="Belum ada audit log yang sesuai dengan filter pencarian atau riwayat job scraping."
          />
        </Card>
      ) : (
        <Card className="overflow-hidden rounded-xl border border-border bg-card shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="border-b border-border bg-secondary/50 text-[11px] font-sans font-bold text-muted-foreground uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Level</th>
                  <th className="py-3 px-4">Waktu</th>
                  <th className="py-3 px-4">ID Job</th>
                  <th className="py-3 px-4">Sumber</th>
                  <th className="py-3 px-4">Pesan Status</th>
                  <th className="py-3 px-4 text-right">Detail</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 font-sans">
                {filteredJobs.map((job) => {
                  const isErr = job.status === "FAILED" || Boolean(job.errorMessage);

                  return (
                    <tr
                      key={job.id}
                      className="hover:bg-secondary/40 transition-colors"
                    >
                      <td className="py-3 px-4 whitespace-nowrap">
                        {isErr ? (
                          <Badge
                            variant="outline"
                            className="border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-300 gap-1 text-[10px] font-bold"
                          >
                            <AlertCircle className="h-3 w-3" />
                            ERROR
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 gap-1 text-[10px] font-bold"
                          >
                            <Info className="h-3 w-3" />
                            INFO
                          </Badge>
                        )}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap text-muted-foreground font-mono text-[11px]">
                        {new Date(job.createdAt).toLocaleString("id-ID")}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap font-mono text-[11px] font-bold text-foreground">
                        {job.id.slice(0, 8)}...
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap font-semibold text-foreground">
                        {job.source?.name || "Batch (Semua Sumber)"}
                      </td>
                      <td className="py-3 px-4 text-foreground max-w-md font-medium">
                        {job.errorMessage || `Eksekusi selesai dengan status ${job.status}`}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setActiveLogModal(job)}
                          className="h-7 px-2.5 text-xs font-bold text-[#D9541E] hover:bg-[#D9541E]/10"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-xl border border-border bg-card p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <Code className="h-4 w-4 text-[#D9541E]" />
                <h2 className="text-sm font-bold text-foreground">
                  Audit Payload Inspector ({activeLogModal.id})
                </h2>
              </div>
              <button
                onClick={() => setActiveLogModal(null)}
                className="rounded-md p-1 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 space-y-3">
              <div>
                <span className="text-[11px] font-bold text-muted-foreground block mb-1">
                  Metadata Job Record:
                </span>
                <pre className="p-3 rounded-lg bg-secondary/80 text-foreground text-xs font-mono overflow-x-auto max-h-60 border border-border">
                  {JSON.stringify(activeLogModal, null, 2)}
                </pre>
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setActiveLogModal(null)}
                className="border-border hover:bg-secondary font-semibold"
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
