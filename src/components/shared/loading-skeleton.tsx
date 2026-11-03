import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export function StatCardSkeleton() {
  return (
    <Card className="rounded-xl border border-slate-200/80 p-5 dark:border-slate-800">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-9 w-9 rounded-lg" />
      </div>
      <Skeleton className="mt-3 h-8 w-20" />
      <Skeleton className="mt-2.5 h-4 w-32" />
    </Card>
  );
}

export function TableRowSkeleton({ columns = 5 }: { columns?: number }) {
  return (
    <div className="flex items-center gap-4 py-3.5 border-b border-slate-100 px-4 dark:border-slate-800">
      {Array.from({ length: columns }).map((_, idx) => (
        <Skeleton
          key={idx}
          className="h-4 flex-1 first:max-w-[140px] last:max-w-[80px]"
        />
      ))}
    </div>
  );
}

export function NewsCardSkeleton() {
  return (
    <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center gap-2">
        <Skeleton className="h-5 w-24 rounded-full" />
        <Skeleton className="h-4 w-20" />
      </div>
      <Skeleton className="mt-2.5 h-6 w-3/4" />
      <Skeleton className="mt-2 h-4 w-full" />
      <Skeleton className="mt-1 h-4 w-2/3" />
      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-4 w-16" />
      </div>
    </div>
  );
}

