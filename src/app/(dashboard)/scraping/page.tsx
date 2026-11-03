"use client";

import React, { useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
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
import {
  MOCK_SCRAPING_JOBS,
  MockScrapingJob,
} from "@/features/scraping/mocks/mock-scraping";

export default function ScrapingMonitorPage() {
  const [jobs, setJobs] = useState<MockScrapingJob[]>(MOCK_SCRAPING_JOBS);
  const [isTriggering, setIsTriggering] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleRunManualScrape = () => {
    setIsTriggering(true);
    showNotification("Pekerjaan scraping manual dimulai... Memproses RSS dan HTML feed.");

    // Simulate asynchronous pipeline execution
    setTimeout(() => {
      const newJob: MockScrapingJob = {
        id: `job-${Date.now().toString().slice(-6)}`,
        triggerType: "MANUAL",
        status: "COMPLETED",
        startedAt: "Baru saja",
        finishedAt: "Baru saja",
        durationSeconds: 14,
        totalFound: 28,
        totalNew: 7,
        totalDuplicate: 21,
        totalFailed: 0,
      };

      setJobs([newJob, ...jobs]);
      setIsTriggering(false);
      showNotification("Scraping manual selesai: 7 berita baru berhasil diindeks!");
    }, 2400);
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
        title="Scraping Monitor & Ingestion Worker"
        description="Pantau proses background worker, jalankan scraping manual, dan audit eksekusi pengambilan berita."
      >
        <Link href="/scraping/logs">
          <Button variant="outline" size="sm" className="gap-2">
            <ScrollText className="h-4 w-4" />
            Audit Logs
          </Button>
        </Link>
        <Button
          size="sm"
          onClick={handleRunManualScrape}
          disabled={isTriggering}
          className="gap-2 bg-teal-600 text-white hover:bg-teal-700 disabled:opacity-75"
        >
          {isTriggering ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin" />
              Menjalankan Scraper...
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
                Status Worker
              </span>
              <span className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-900 dark:text-white">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                {isTriggering ? "SEDANG SCRAPING" : "STANDBY (NORMAL)"}
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
                Jadwal Cron Berikutnya
              </span>
              <span className="text-sm font-bold text-slate-900 dark:text-white">
                Besok, 06:00:00 WIB
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
      <Card className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
              Riwayat Eksekusi Job Scraping
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Catatan eksekusi terjadwal otomatis maupun manual
            </p>
          </div>
          <span className="text-xs text-slate-400">
            Total {jobs.length} Job Tercatat
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-semibold text-slate-600 uppercase tracking-wider dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">
              <tr>
                <th className="py-3 px-4">ID Job</th>
                <th className="py-3 px-4">Pemicu</th>
                <th className="py-3 px-4">Waktu Mulai</th>
                <th className="py-3 px-4">Durasi</th>
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
                    {job.id}
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
                    {job.startedAt}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap text-slate-600 dark:text-slate-400">
                    {job.durationSeconds} detik
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
    </div>
  );
}
