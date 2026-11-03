"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Shield,
  Database,
  Bot,
  Check,
  Save,
} from "lucide-react";

export default function SettingsPage() {
  const [userAgent, setUserAgent] = useState(
    "PovertyWatch-Bot/1.0 (+https://povertywatch.id/about-bot)"
  );
  const [timeoutSeconds, setTimeoutSeconds] = useState("10");
  const [retentionDays, setRetentionDays] = useState("90");
  const [cronTime, setCronTime] = useState("06:00");
  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    showNotification("Pengaturan konfigurasi sistem berhasil disimpan.");
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
        title="Pengaturan Sistem & Bot Scraper"
        description="Konfigurasi parameter crawler, etika User-Agent, batas timeout, dan retensi audit data."
      />

      <form onSubmit={handleSaveSettings} className="space-y-6 max-w-4xl">
        {/* Scraper Configuration Card */}
        <Card className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 dark:border-slate-800 text-slate-900 dark:text-white font-semibold text-sm">
            <Bot className="h-4 w-4 text-teal-600" />
            <span>Konfigurasi Ingestion Crawler</span>
          </div>

          <div className="mt-4 space-y-4">
            <div>
              <label className="text-xs font-medium text-slate-700 block mb-1 dark:text-slate-300">
                Identitas User-Agent HTTP Header
              </label>
              <Input
                value={userAgent}
                onChange={(e) => setUserAgent(e.target.value)}
                className="text-xs font-mono"
              />
              <p className="mt-1 text-[11px] text-slate-500">
                User-Agent yang transparan menginformasikan ke pemilik portal media
                mengenai identitas dan tujuan pengumpulan data etis PovertyWatch.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-slate-700 block mb-1 dark:text-slate-300">
                  Request Timeout (Detik)
                </label>
                <Input
                  type="number"
                  value={timeoutSeconds}
                  onChange={(e) => setTimeoutSeconds(e.target.value)}
                  className="text-xs"
                />
                <p className="mt-1 text-[11px] text-slate-500">
                  Batas waktu tunggu koneksi sebelum membatalkan request (SSRF protection).
                </p>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-700 block mb-1 dark:text-slate-300">
                  Jadwal Ingestion Harian (WIB)
                </label>
                <Input
                  type="time"
                  value={cronTime}
                  onChange={(e) => setCronTime(e.target.value)}
                  className="text-xs"
                />
                <p className="mt-1 text-[11px] text-slate-500">
                  Waktu eksekusi node-cron harian untuk menarik seluruh portal aktif.
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Data Retention & Storage */}
        <Card className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 dark:border-slate-800 text-slate-900 dark:text-white font-semibold text-sm">
            <Database className="h-4 w-4 text-teal-600" />
            <span>Retensi Data & Kebijakan Penyimpanan</span>
          </div>

          <div className="mt-4 space-y-4">
            <div>
              <label className="text-xs font-medium text-slate-700 block mb-1 dark:text-slate-300">
                Masa Retensi Audit Log (Hari)
              </label>
              <Input
                type="number"
                value={retentionDays}
                onChange={(e) => setRetentionDays(e.target.value)}
                className="text-xs max-w-xs"
              />
              <p className="mt-1 text-[11px] text-slate-500">
                Log eksekusi yang lebih lama dari masa retensi akan diarsipkan otomatis
                untuk menjaga performa basis data.
              </p>
            </div>
          </div>
        </Card>

        {/* Security & Operator Access */}
        <Card className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 dark:border-slate-800 text-slate-900 dark:text-white font-semibold text-sm">
            <Shield className="h-4 w-4 text-teal-600" />
            <span>Keamanan Operator</span>
          </div>

          <div className="mt-4 space-y-4">
            <div>
              <label className="text-xs font-medium text-slate-700 block mb-1 dark:text-slate-300">
                Password Sesi Operator Baru (Opsional)
              </label>
              <Input
                type="password"
                placeholder="Masukkan password baru untuk memperbarui kredensial..."
                className="text-xs max-w-md"
              />
              <p className="mt-1 text-[11px] text-slate-500">
                Digunakan untuk melindungi endpoint penambahan sumber berita dan pemicuan scraping manual.
              </p>
            </div>
          </div>
        </Card>

        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            className="gap-2 bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900"
          >
            <Save className="h-4 w-4" />
            Simpan Seluruh Pengaturan
          </Button>
        </div>
      </form>
    </div>
  );
}
