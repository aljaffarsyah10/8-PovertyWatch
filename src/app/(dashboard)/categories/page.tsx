import React from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { Tags } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";

export default function CategoriesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Kategori & Kata Kunci"
        description="Daftar taksonomi isu kemiskinan dan konfigurasi kata kunci (keywords) untuk pencocokan otomatis berita."
      />

      <Card className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <EmptyState
          icon={Tags}
          title="Kategori & Kata Kunci Relevansi"
          description="Pengelolaan 9 kategori fenomena sosial ekonomi dan daftar kata kunci akan diimplementasikan pada Phase 5."
        />
      </Card>
    </div>
  );
}
