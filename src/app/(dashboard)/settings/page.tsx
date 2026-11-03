import React from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { Settings as SettingsIcon } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Pengaturan Sistem"
        description="Konfigurasi parameter scraper bot, batas timeout, retensi data, dan keamanan operator."
      />

      <Card className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <EmptyState
          icon={SettingsIcon}
          title="Konfigurasi Sistem PovertyWatch"
          description="Formulir pengaturan User-Agent scraper, interval retensi audit log, dan kredensial operator akan diimplementasikan pada Phase 5."
        />
      </Card>
    </div>
  );
}
