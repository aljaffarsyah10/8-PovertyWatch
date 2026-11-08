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
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-xl bg-foreground px-4 py-3 text-xs font-semibold text-background shadow-xl border border-border animate-in fade-in slide-in-from-bottom-2">
          <Check className="h-4 w-4 text-[#D9541E]" />
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
        <Card className="rounded-xl border border-border bg-card p-6 shadow-2xs">
          <div className="flex items-center gap-2.5 pb-4 border-b border-border/80 text-foreground font-bold text-sm">
            <Bot className="h-4 w-4 text-[#D9541E]" />
            <span>Konfigurasi Ingestion Crawler</span>
          </div>

          <div className="mt-4 space-y-4">
            <div>
              <label className="text-xs font-bold text-foreground block mb-1">
                Identitas User-Agent HTTP Header
              </label>
              <Input
                value={userAgent}
                onChange={(e) => setUserAgent(e.target.value)}
                className="text-xs font-mono font-medium bg-background border-border"
              />
              <p className="mt-1 text-[11px] font-medium text-muted-foreground leading-relaxed">
                User-Agent yang transparan menginformasikan ke pemilik portal media
                mengenai identitas dan tujuan pengumpulan data etis PovertyWatch.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-foreground block mb-1">
                  Request Timeout (Detik)
                </label>
                <Input
                  type="number"
                  value={timeoutSeconds}
                  onChange={(e) => setTimeoutSeconds(e.target.value)}
                  className="text-xs font-medium bg-background border-border"
                />
                <p className="mt-1 text-[11px] font-medium text-muted-foreground leading-relaxed">
                  Batas waktu tunggu koneksi sebelum membatalkan request (SSRF protection).
                </p>
              </div>

              <div>
                <label className="text-xs font-bold text-foreground block mb-1">
                  Jadwal Ingestion Harian (WIB)
                </label>
                <Input
                  type="time"
                  value={cronTime}
                  onChange={(e) => setCronTime(e.target.value)}
                  className="text-xs font-mono font-medium bg-background border-border"
                />
                <p className="mt-1 text-[11px] font-medium text-muted-foreground leading-relaxed">
                  Waktu eksekusi node-cron harian untuk menarik seluruh portal aktif.
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Data Retention & Storage */}
        <Card className="rounded-xl border border-border bg-card p-6 shadow-2xs">
          <div className="flex items-center gap-2.5 pb-4 border-b border-border/80 text-foreground font-bold text-sm">
            <Database className="h-4 w-4 text-[#D9541E]" />
            <span>Retensi Data & Kebijakan Penyimpanan</span>
          </div>

          <div className="mt-4 space-y-4">
            <div>
              <label className="text-xs font-bold text-foreground block mb-1">
                Masa Retensi Audit Log (Hari)
              </label>
              <Input
                type="number"
                value={retentionDays}
                onChange={(e) => setRetentionDays(e.target.value)}
                className="text-xs font-medium bg-background border-border max-w-xs"
              />
              <p className="mt-1 text-[11px] font-medium text-muted-foreground leading-relaxed">
                Log eksekusi yang lebih lama dari masa retensi akan diarsipkan otomatis
                untuk menjaga performa basis data.
              </p>
            </div>
          </div>
        </Card>

        {/* Security & Operator Access */}
        <Card className="rounded-xl border border-border bg-card p-6 shadow-2xs">
          <div className="flex items-center gap-2.5 pb-4 border-b border-border/80 text-foreground font-bold text-sm">
            <Shield className="h-4 w-4 text-[#D9541E]" />
            <span>Keamanan Operator</span>
          </div>

          <div className="mt-4 space-y-4">
            <div>
              <label className="text-xs font-bold text-foreground block mb-1">
                Password Sesi Operator Baru (Opsional)
              </label>
              <Input
                type="password"
                placeholder="Masukkan password baru untuk memperbarui kredensial..."
                className="text-xs font-medium bg-background border-border max-w-md"
              />
              <p className="mt-1 text-[11px] font-medium text-muted-foreground leading-relaxed">
                Digunakan untuk melindungi endpoint penambahan sumber berita dan pemicuan scraping manual.
              </p>
            </div>
          </div>
        </Card>

        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            className="gap-2 bg-[#D9541E] text-white hover:bg-[#C24412] font-semibold shadow-xs"
          >
            <Save className="h-4 w-4" />
            Simpan Seluruh Pengaturan
          </Button>
        </div>
      </form>
    </div>
  );
}
