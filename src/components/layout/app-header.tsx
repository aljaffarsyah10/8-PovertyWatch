"use client";

import React from "react";
import { Menu, Search, MapPin, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface AppHeaderProps {
  onOpenMobileMenu: () => void;
}

export function AppHeader({ onOpenMobileMenu }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur-xs sm:px-6 dark:border-slate-800 dark:bg-slate-950/95">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 lg:hidden dark:text-slate-400 dark:hover:bg-slate-800"
          aria-label="Buka menu navigasi"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Global Search Placeholder */}
        <div className="relative hidden w-72 md:block">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            placeholder="Cari topik atau judul berita..."
            className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-xs text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:outline-hidden dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500"
            readOnly
          />
        </div>
      </div>

      <div className="flex items-center gap-2.5 sm:gap-3.5">
        {/* Coverage Badge */}
        <div className="flex items-center gap-1.5 rounded-full border border-teal-200 bg-teal-50/70 px-3 py-1 text-xs font-medium text-teal-800 dark:border-teal-900 dark:bg-teal-950/50 dark:text-teal-300">
          <MapPin className="h-3.5 w-3.5 text-teal-600" />
          <span className="hidden sm:inline">Cakupan Wilayah:</span>
          <span className="font-semibold">Kota Medan</span>
        </div>

        {/* Disclaimer Tooltip / Notice */}
        <div className="hidden items-center gap-1.5 text-xs text-slate-500 xl:flex dark:text-slate-400">
          <AlertCircle className="h-3.5 w-3.5 text-amber-500" />
          <span>Data media massa, bukan data sensus resmi</span>
        </div>

        {/* Operator Badge */}
        <Badge
          variant="secondary"
          className="h-8 px-2.5 text-xs font-medium text-slate-700 bg-slate-100 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700"
        >
          Operator Mode
        </Badge>
      </div>
    </header>
  );
}

