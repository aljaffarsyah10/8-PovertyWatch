import React from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Play, Activity } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import Link from "next/link";

export default function ScrapingMonitorPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Scraping Monitor"
        description="Pantau proses background worker, antrean job scraping, dan riwayat penarikan berita terkini."
      >
        <Link href="/scraping/logs">
          <Button variant="outline" size="sm">
            Lihat Logs
          </Button>
        </Link>
        <Button size="sm" className="gap-2 bg-teal-600 text-white hover:bg-teal-700">
          <Play className="h-4 w-4" />
          Jalankan Scrape Manual
        </Button>
      </PageHeader>

      <Card className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <EmptyState
          icon={Activity}
          title="Scraping Monitor & Job Runner"
          description="Status live background worker, kontrol pemicuan scraping, dan ringkasan eksekusi job akan diimplementasikan pada Phase 5."
        />
      </Card>
    </div>
  );
}
