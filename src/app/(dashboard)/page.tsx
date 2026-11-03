import React from "react";
import { PageHeader } from "@/components/layout/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Newspaper,
  Rss,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  PieChart,
} from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Dashboard Pemantauan"
        description="Ringkasan pemantauan isu kemiskinan dan kondisi sosial ekonomi di Kota Medan."
      >
        <Link href="/news">
          <Button variant="outline" size="sm" className="gap-2">
            Buka Explorer
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </PageHeader>

      {/* Info Banner Disclaimer */}
      <div className="rounded-xl border border-teal-200/80 bg-teal-50/60 p-4 text-xs text-teal-900 dark:border-teal-900/60 dark:bg-teal-950/40 dark:text-teal-200">
        <span className="font-semibold">Catatan Metodologi:</span> Data yang
        ditampilkan mencerminkan frekuensi pemberitaan dan topik liputan media
        massa daring di Kota Medan, bukan statistik resmi angka kemiskinan BPS.
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Pemberitaan"
          value="1,428"
          description="Liputan isu kemiskinan"
          trend={{ value: 12, isPositive: true, label: "vs bulan lalu" }}
          icon={Newspaper}
          variant="default"
        />
        <StatCard
          title="24 Jam Terakhir"
          value="34"
          description="Artikel terindeks baru"
          trend={{ value: 5, isPositive: true, label: "vs kemarin" }}
          icon={TrendingUp}
          variant="success"
        />
        <StatCard
          title="Sumber Portal Aktif"
          value="8"
          description="Portal berita Medan & Sumut"
          icon={Rss}
          variant="default"
        />
        <StatCard
          title="Tingkat Sukses Scraper"
          value="98.5%"
          description="Eksekusi job ingestion"
          icon={CheckCircle2}
          variant="success"
        />
      </div>

      {/* Charts Grid Placeholder */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="rounded-xl border border-slate-200/80 bg-white p-5 lg:col-span-2 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                Tren Liputan Berita (30 Hari)
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Frekuensi artikel per hari mengenai fenomena sosial ekonomi
              </p>
            </div>
            <TrendingUp className="h-4 w-4 text-teal-600" />
          </div>
          <div className="flex h-64 items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50/50 mt-4 text-xs text-slate-400 dark:border-slate-800 dark:bg-slate-950/40">
            Visualisasi Grafik Tren Area / Bar (Phase 5)
          </div>
        </Card>

        <Card className="rounded-xl border border-slate-200/80 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                Distribusi Topik
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Porsi isu kemiskinan teridentifikasi
              </p>
            </div>
            <PieChart className="h-4 w-4 text-teal-600" />
          </div>
          <div className="flex h-64 items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50/50 mt-4 text-xs text-slate-400 dark:border-slate-800 dark:bg-slate-950/40">
            Visualisasi Grafik Donat Kategori (Phase 5)
          </div>
        </Card>
      </div>

      {/* Latest Feed Container Placeholder */}
      <Card className="rounded-xl border border-slate-200/80 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-base font-semibold text-slate-900 dark:text-white">
              Pemberitaan Terkini di Kota Medan
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Artikel terbaru yang terverifikasi dan dinormalisasi sistem
            </p>
          </div>
          <Link
            href="/news"
            className="text-xs font-medium text-teal-700 hover:underline dark:text-teal-400"
          >
            Lihat Semua Berita &rarr;
          </Link>
        </div>
        <div className="flex h-36 items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50/50 mt-4 text-xs text-slate-400 dark:border-slate-800 dark:bg-slate-950/40">
          Feed Berita Real-Time (Phase 5)
        </div>
      </Card>
    </div>
  );
}
