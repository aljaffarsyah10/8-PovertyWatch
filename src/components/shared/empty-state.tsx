import React from "react";
import { FileQuestion } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ComponentType<{ className?: string }>;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  title,
  description,
  icon: Icon = FileQuestion,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex min-h-[260px] flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white/50 p-8 text-center dark:border-slate-800 dark:bg-slate-900/30",
        className
      )}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="mt-4 text-base font-semibold text-slate-900 dark:text-white">
        {title}
      </h3>
      <p className="mt-1.5 max-w-sm text-sm text-slate-500 dark:text-slate-400">
        {description}
      </p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

