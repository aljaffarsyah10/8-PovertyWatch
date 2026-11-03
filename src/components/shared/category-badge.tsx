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

    if (key.includes("ekstrem") || key.includes("pangan")) {
      return "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800";
    }
    if (key.includes("rumah") || key.includes("kumuh") || key.includes("rtlh")) {
      return "bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800";
    }
    if (key.includes("stunting") || key.includes("gizi")) {
      return "bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800";
    }
    if (key.includes("sekolah") || key.includes("pendidikan")) {
      return "bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800";
    }
    if (key.includes("pengangguran") || key.includes("phk")) {
      return "bg-purple-50 text-purple-800 border-purple-200 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800";
    }
    if (key.includes("bansos") || key.includes("bantuan")) {
      return "bg-cyan-50 text-cyan-800 border-cyan-200 dark:bg-cyan-950/60 dark:text-cyan-300 dark:border-cyan-800";
    }
    if (key.includes("bencana")) {
      return "bg-orange-50 text-orange-800 border-orange-200 dark:bg-orange-950/60 dark:text-orange-300 dark:border-orange-800";
    }

    return "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700";
  };

  return (
    <Badge
      variant="outline"
      className={cn(
        "rounded-md px-2 py-0.5 text-xs font-medium transition-colors",
        getBadgeStyle(slug, name),
        className
      )}
    >
      {name}
    </Badge>
  );
}
