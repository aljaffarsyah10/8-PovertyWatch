import React from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { ScrollText, ArrowLeft } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ScrapingLogsPage() {
  return (
    <div className="space-y-6">
      <Link href="/scraping">
        <Button variant="ghost" size="sm" className="gap-2 text-slate-500 hover:text-slate-900">
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Scraping Monitor
        </Button>
      </Link>

      <PageHeader
        title="Scraping Audit Logs"
        description="Riwayat detail eksekusi proses penarikan berita, verifikasi payload, dan log error sistem."
      />

      <Card className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <EmptyState
          icon={ScrollText}
          title="Tabel Audit Log"
          description="Log berjenjang (INFO, WARNING, ERROR) dengan filter level dan pencarian teks akan diimplementasikan pada Phase 5."
        />
      </Card>
    </div>
  );
}
