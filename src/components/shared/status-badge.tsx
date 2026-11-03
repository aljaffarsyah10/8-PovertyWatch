import React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type JobStatus = "PENDING" | "RUNNING" | "COMPLETED" | "FAILED";

interface StatusBadgeProps {
  status: JobStatus | string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const getStatusConfig = (val: string) => {
    switch (val.toUpperCase()) {
      case "COMPLETED":
      case "SUCCESS":
        return {
          label: "Berhasil",
          classes:
            "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800",
          dot: "bg-emerald-500",
        };
      case "RUNNING":
        return {
          label: "Berjalan",
          classes:
            "bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800",
          dot: "bg-amber-500 animate-pulse",
        };
      case "FAILED":
      case "ERROR":
        return {
          label: "Gagal",
          classes:
            "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800",
          dot: "bg-rose-500",
        };
      case "PENDING":
      default:
        return {
          label: "Antrean",
          classes:
            "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
          dot: "bg-slate-400",
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <Badge
      variant="outline"
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-xs font-medium",
        config.classes,
        className
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", config.dot)} />
      {config.label}
    </Badge>
  );
}

