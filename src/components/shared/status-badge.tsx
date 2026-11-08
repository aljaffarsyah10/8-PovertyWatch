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
            "bg-emerald-500/12 text-emerald-900 border-emerald-500/30 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-500/40 font-semibold",
          dot: "bg-emerald-500",
        };
      case "RUNNING":
        return {
          label: "Berjalan",
          classes:
            "bg-[#D9541E]/12 text-[#B84010] border-[#D9541E]/30 dark:bg-[#D9541E]/20 dark:text-[#F38A5E] dark:border-[#D9541E]/40 font-semibold",
          dot: "bg-[#D9541E] animate-pulse",
        };
      case "FAILED":
      case "ERROR":
        return {
          label: "Gagal",
          classes:
            "bg-rose-500/12 text-rose-900 border-rose-500/30 dark:bg-rose-500/20 dark:text-rose-300 dark:border-rose-500/40 font-semibold",
          dot: "bg-rose-500",
        };
      case "PENDING":
      default:
        return {
          label: "Antrean",
          classes:
            "bg-secondary text-foreground border-border font-medium",
          dot: "bg-muted-foreground",
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <Badge
      variant="outline"
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md px-2.5 py-0.5 text-xs shadow-2xs",
        config.classes,
        className
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full shrink-0", config.dot)} />
      {config.label}
    </Badge>
  );
}
