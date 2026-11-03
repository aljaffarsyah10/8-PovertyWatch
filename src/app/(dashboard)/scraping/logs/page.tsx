"use client";

import React, { useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Search,
  AlertTriangle,
  Info,
  AlertCircle,
  Eye,
  X,
  Code,
} from "lucide-react";
import {
  MOCK_SCRAPING_LOGS,
  MockScrapingLog,
} from "@/features/scraping/mocks/mock-scraping";
import { EmptyState } from "@/components/shared/empty-state";

export default function ScrapingLogsPage() {
  const [logs] = useState<MockScrapingLog[]>(MOCK_SCRAPING_LOGS);
  const [selectedLevel, setSelectedLevel] = useState<
    "ALL" | "INFO" | "WARNING" | "ERROR"
  >("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeLogModal, setActiveLogModal] = useState<MockScrapingLog | null>(
    null
  );

  const filteredLogs = logs.filter((log) => {
    const matchLevel = selectedLevel === "ALL" || log.level === selectedLevel;
    const query = searchQuery.toLowerCase().trim();
    const matchQuery =
      !query ||
      log.message.toLowerCase().includes(query) ||
      log.sourceName.toLowerCase().includes(query) ||
      log.jobId.toLowerCase().includes(query);
    return matchLevel && matchQuery;
  });

  const getLevelBadge = (level: "INFO" | "WARNING" | "ERROR") => {
    switch (level) {
      case "INFO":
        return (
          <Badge
            variant="outline"
            className="border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-950/60 dark:text-blue-300 gap-1 text-[10px]"
          >
            <Info className="h-3 w-3" />
            INFO
          </Badge>
        );
      case "WARNING":
        return (
          <Badge
            variant="outline"
            className="border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900 dark:bg-amber-950/60 dark:text-amber-300 gap-1 text-[10px]"
          >
            <AlertTriangle className="h-3 w-3" />
            WARN
          </Badge>
        );
      case "ERROR":
        return (
          <Badge
            variant="outline"
            className="border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900 dark:bg-rose-950/60 dark:text-rose-300 gap-1 text-[10px]"
          >
            <AlertCircle className="h-3 w-3" />
            ERROR
          </Badge>
        );
    }
  };

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
        description="Pemeriksaan mendalam atas seluruh proses ingestion, parsing RSS/HTML, dan jejak error worker."
      />

      {/* Filter and Search Bar */}
      <Card className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari pesan log, nama sumber, atau ID job..."
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
              Semua ({logs.length})
            </Button>
            <Button
              variant={selectedLevel === "INFO" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedLevel("INFO")}
              className="text-xs"
            >
              Info ({logs.filter((l) => l.level === "INFO").length})
            </Button>
            <Button
              variant={selectedLevel === "WARNING" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedLevel("WARNING")}
              className="text-xs"
            >
              Warning ({logs.filter((l) => l.level === "WARNING").length})
            </Button>
            <Button
              variant={selectedLevel === "ERROR" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedLevel("ERROR")}
              className="text-xs"
            >
              Error ({logs.filter((l) => l.level === "ERROR").length})
            </Button>
          </div>
        </div>
      </Card>

      {/* Logs Table */}
      {filteredLogs.length === 0 ? (
        <Card className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <EmptyState
            title="Tidak Ada Log Sesuai Filter"
            description="Tidak ada catatan audit log yang cocok dengan tingkat level atau kata kunci saat ini."
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
                  <th className="py-3 px-4">Pesan Eksekusi</th>
                  <th className="py-3 px-4 text-right">Detail</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans dark:divide-slate-800">
                {filteredLogs.map((log) => (
                  <tr
                    key={log.id}
                    className="hover:bg-slate-50/70 transition dark:hover:bg-slate-800/50"
                  >
                    <td className="py-3 px-4 whitespace-nowrap">
                      {getLevelBadge(log.level)}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap text-slate-500 font-mono text-[11px] dark:text-slate-400">
                      {log.timestamp}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap font-mono text-[11px] text-slate-700 dark:text-slate-300">
                      {log.jobId}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap font-medium text-slate-900 dark:text-white">
                      {log.sourceName}
                    </td>
                    <td className="py-3 px-4 text-slate-700 dark:text-slate-300 max-w-md">
                      {log.message}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap text-right">
                      {log.details ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setActiveLogModal(log)}
                          className="h-7 px-2 text-xs text-teal-700 hover:bg-teal-50 dark:text-teal-300"
                        >
                          <Eye className="h-3.5 w-3.5 mr-1" />
                          JSON
                        </Button>
                      ) : (
                        <span className="text-slate-300 text-[11px]">-</span>
                      )}
                    </td>
                  </tr>
                ))}
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
                <span className="text-[11px] font-medium text-slate-400 block">
                  Pesan:
                </span>
                <p className="text-xs text-slate-800 dark:text-slate-200 font-medium">
                  {activeLogModal.message}
                </p>
              </div>

              <div>
                <span className="text-[11px] font-medium text-slate-400 block mb-1">
                  Metadata JSON Payload:
                </span>
                <pre className="p-3 rounded-lg bg-slate-950 text-slate-100 text-xs font-mono overflow-x-auto max-h-60">
                  {JSON.stringify(JSON.parse(activeLogModal.details || "{}"), null, 2)}
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
