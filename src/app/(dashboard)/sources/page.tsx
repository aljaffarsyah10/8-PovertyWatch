import React from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Rss } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";

export default function SourcesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Manajemen Sumber Berita"
        description="Kelola portal berita lokal Kota Medan dan Sumatera Utara yang dipantau (RSS & HTML Scraper)."
      >
        <Button size="sm" className="gap-2 bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900">
          <Plus className="h-4 w-4" />
          Tambah Sumber Baru
        </Button>
      </PageHeader>

      <Card className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <EmptyState
          icon={Rss}
          title="Tabel Sumber Berita"
          description="Daftar konfigurasi portal media, selector HTML, frekuensi penarikan, dan indikator kesehatan scraping akan diimplementasikan pada Phase 5."
        />
      </Card>
    </div>
  );
}
