"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Newspaper,
  Rss,
  Activity,
  ScrollText,
  Tags,
  Settings,
  ShieldCheck,
  Radio,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export const navigationItems = [
  {
    title: "Utama",
    items: [
      {
        title: "Dashboard",
        href: "/",
        icon: LayoutDashboard,
      },
      {
        title: "News Explorer",
        href: "/news",
        icon: Newspaper,
      },
    ],
  },
  {
    title: "Pengelolaan & Scraper",
    items: [
      {
        title: "News Sources",
        href: "/sources",
        icon: Rss,
      },
      {
        title: "Scraping Monitor",
        href: "/scraping",
        icon: Activity,
      },
      {
        title: "Scraping Logs",
        href: "/scraping/logs",
        icon: ScrollText,
      },
      {
        title: "Kategori & Keyword",
        href: "/categories",
        icon: Tags,
      },
    ],
  },
  {
    title: "Sistem",
    items: [
      {
        title: "Settings",
        href: "/settings",
        icon: Settings,
      },
    ],
  },
];

interface AppSidebarProps {
  onClose?: () => void;
  className?: string;
}

export function AppSidebar({ onClose, className }: AppSidebarProps) {
  const pathname = usePathname();

  const isItemActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  return (
    <aside
      className={cn(
        "flex h-full w-64 flex-col border-r border-border bg-sidebar text-sidebar-foreground transition-colors",
        className
      )}
    >
      {/* Brand Header */}
      <div className="flex h-16 items-center justify-between border-b border-border/80 px-5">
        <Link
          href="/"
          onClick={onClose}
          className="flex items-center gap-2.5 transition hover:opacity-90"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#D9541E] text-white shadow-sm font-bold">
            <Radio className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold tracking-tight text-foreground text-[15px]">
                PovertyWatch
              </span>
              <Badge
                variant="outline"
                className="h-4 px-1.5 text-[9px] font-bold uppercase tracking-wider text-[#D9541E] border-[#D9541E]/30 bg-[#D9541E]/10"
              >
                Medan
              </Badge>
            </div>
            <span className="text-[11px] font-medium text-muted-foreground">
              Media Monitoring Platform
            </span>
          </div>
        </Link>
        {onClose && (
          <button
            onClick={onClose}
            className="rounded-md p-1.5 text-muted-foreground hover:bg-sidebar-accent hover:text-foreground lg:hidden"
            aria-label="Tutup menu"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto px-3.5 py-4">
        {navigationItems.map((section, idx) => (
          <div key={idx} className="mb-6 last:mb-0">
            <h2 className="mb-2.5 px-2.5 text-[11px] font-bold tracking-wider text-muted-foreground/80 uppercase">
              {section.title}
            </h2>
            <nav className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const active = isItemActive(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={cn(
                      "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150",
                      active
                        ? "bg-[#D9541E] text-white shadow-xs font-semibold"
                        : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-4 w-4 shrink-0 transition-colors",
                        active
                          ? "text-white"
                          : "text-muted-foreground group-hover:text-sidebar-foreground"
                      )}
                    />
                    <span className="truncate">{item.title}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        ))}
      </div>

      {/* Bottom Status Card */}
      <div className="border-t border-border/80 p-3.5">
        <div className="rounded-xl border border-border/70 bg-card/60 p-3.5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-foreground">
              Worker Status
            </span>
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Siaga Aktif
            </span>
          </div>
          <p className="mt-1 text-[11px] font-medium text-muted-foreground">
            Jadwal: 06:00 WIB Harian
          </p>
          <div className="mt-2.5 flex items-center gap-1.5 border-t border-border/50 pt-2 text-[10px] font-medium text-muted-foreground">
            <ShieldCheck className="h-3.5 w-3.5 text-[#D9541E]" />
            <span>Mode Standar Terproteksi</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
