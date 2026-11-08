"use client";

import React from "react";
import { Menu, Search, MapPin, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface AppHeaderProps {
  onOpenMobileMenu: () => void;
}

export function AppHeader({ onOpenMobileMenu }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border bg-background/95 px-4 backdrop-blur-md sm:px-6 transition-colors">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="rounded-lg p-2 text-muted-foreground hover:bg-secondary hover:text-foreground lg:hidden"
          aria-label="Buka menu navigasi"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Global Search Placeholder */}
        <div className="relative hidden w-72 md:block">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            placeholder="Cari topik atau judul berita..."
            className="h-9 w-full rounded-lg border border-border bg-card pl-9 pr-3 text-xs text-foreground placeholder:text-muted-foreground transition-colors focus:border-[#D9541E] focus:outline-hidden focus:ring-1 focus:ring-[#D9541E]"
            readOnly
          />
        </div>
      </div>

      <div className="flex items-center gap-2.5 sm:gap-3.5">
        {/* Coverage Badge */}
        <div className="flex items-center gap-1.5 rounded-full border border-[#D9541E]/30 bg-[#D9541E]/10 px-3 py-1 text-xs font-semibold text-[#D9541E]">
          <MapPin className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Cakupan Wilayah:</span>
          <span>Kota Medan</span>
        </div>

        {/* Disclaimer Tooltip / Notice */}
        <div className="hidden items-center gap-1.5 text-xs font-medium text-muted-foreground xl:flex">
          <AlertCircle className="h-3.5 w-3.5 text-[#D9541E]" />
          <span>Data media massa, bukan sensus BPS</span>
        </div>

        {/* Operator Badge */}
        <Badge
          variant="secondary"
          className="h-8 px-2.5 text-xs font-semibold text-secondary-foreground bg-secondary border border-border shadow-2xs"
        >
          Operator Mode
        </Badge>
      </div>
    </header>
  );
}
