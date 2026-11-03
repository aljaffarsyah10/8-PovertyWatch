import React from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Download, Search, Filter } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";

export default function NewsExplorerPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="News Explorer"
        description="Telusuri, cari, dan analisis artikel berita fenomena sosial ekonomi di Kota Medan."
      >
        <Button variant="outline" size="sm" className="gap-2">
          <Download className="h-4 w-4" />
          Ekspor CSV
        </Button>
      </PageHeader>

      {/* Filter Toolbar Placeholder */}
      <Card className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Cari berdasarkan judul, kata kunci, atau nama kecamatan..."
              className="pl-9 text-xs"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1.5 text-xs">
              <Filter className="h-3.5 w-3.5 text-slate-500" />
              Kategori
            </Button>
            <Button variant="outline" size="sm" className="gap-1.5 text-xs">
              Sumber Media
            </Button>
            <Button variant="outline" size="sm" className="gap-1.5 text-xs">
              Periode
            </Button>
          </div>
        </div>
      </Card>

      {/* News Content Area Placeholder */}
      <Card className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <EmptyState
          title="Tabel News Explorer"
          description="Daftar artikel terstruktur dengan paginasi, sorting, dan filter interaktif akan aktif pada Phase 5."
        />
      </Card>
    </div>
  );
}
