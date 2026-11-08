import React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface CategoryBadgeProps {
  name: string;
  slug?: string;
  className?: string;
}

export function CategoryBadge({ name, slug, className }: CategoryBadgeProps) {
  const getBadgeStyle = (categorySlug?: string, categoryName?: string) => {
    const key = (categorySlug || categoryName || "").toLowerCase();

    // Kemiskinan Ekstrem / Pangan: Menggunakan Burnt Orange / Red-Orange yang tegas
    if (key.includes("ekstrem") || key.includes("pangan")) {
      return "bg-[#D9541E]/12 text-[#B84010] border-[#D9541E]/35 dark:bg-[#D9541E]/20 dark:text-[#F38A5E] dark:border-[#D9541E]/40 font-semibold";
    }
    // Perumahan / Kumuh / RTLH: Warm Amber / Terracotta
    if (key.includes("rumah") || key.includes("kumuh") || key.includes("rtlh")) {
      return "bg-amber-500/12 text-amber-900 border-amber-500/35 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/40 font-semibold";
    }
    // Stunting / Gizi: Emerald Warm
    if (key.includes("stunting") || key.includes("gizi")) {
      return "bg-emerald-500/12 text-emerald-900 border-emerald-500/35 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-500/40 font-semibold";
    }
    // Pendidikan / Sekolah: Indigo Warm
    if (key.includes("sekolah") || key.includes("pendidikan")) {
      return "bg-sky-500/12 text-sky-950 border-sky-500/35 dark:bg-sky-500/20 dark:text-sky-300 dark:border-sky-500/40 font-semibold";
    }
    // Ketenagakerjaan / PHK: Purple / Mauve
    if (key.includes("pengangguran") || key.includes("phk")) {
      return "bg-purple-500/12 text-purple-950 border-purple-500/35 dark:bg-purple-500/20 dark:text-purple-300 dark:border-purple-500/40 font-semibold";
    }
    // Bansos / Perlindungan Sosial: Cyan Teal
    if (key.includes("bansos") || key.includes("bantuan")) {
      return "bg-teal-500/12 text-teal-950 border-teal-500/35 dark:bg-teal-500/20 dark:text-teal-300 dark:border-teal-500/40 font-semibold";
    }
    // Bencana / Rentan: Burnt Tangerine
    if (key.includes("bencana")) {
      return "bg-orange-500/12 text-orange-950 border-orange-500/35 dark:bg-orange-500/20 dark:text-orange-300 dark:border-orange-500/40 font-semibold";
    }

    // Default neutral: Warm cream-gray / ink
    return "bg-secondary text-foreground border-border font-medium";
  };

  return (
    <Badge
      variant="outline"
      className={cn(
        "rounded-md px-2.5 py-0.5 text-xs transition-colors shadow-2xs",
        getBadgeStyle(slug, name),
        className
      )}
    >
      {name}
    </Badge>
  );
}
