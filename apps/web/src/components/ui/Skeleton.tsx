export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-gray-200 rounded-md ${className}`} />
  );
}

/* ── Course Card Skeleton ── */
export function CourseCardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden flex flex-col">
      <Skeleton className="w-full aspect-video rounded-none" />
      <div className="p-4 flex flex-col gap-y-3 flex-1">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-2/3" />
        <div className="flex items-center gap-x-2 mt-auto pt-3">
          <Skeleton className="size-6 rounded-full shrink-0" />
          <Skeleton className="h-3 w-24" />
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-3 w-12" />
        </div>
      </div>
    </div>
  );
}

/* ── Article Card Skeleton ── */
export function ArticleCardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden flex flex-col">
      <Skeleton className="w-full aspect-video rounded-none" />
      <div className="p-4 flex flex-col gap-y-3 flex-1">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-2/3" />
        <div className="flex items-center gap-x-2 mt-auto pt-3">
          <Skeleton className="size-6 rounded-full shrink-0" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
    </div>
  );
}

/* ── Category Card Skeleton ── */
export function CategoryCardSkeleton() {
  return (
    <div className="bg-white flex flex-col items-center gap-3 px-2.5 py-6 rounded-lg border-2 border-transparent
      shrink-0 w-[calc((100%-5*1rem)/3)] sm:w-[calc((100%-5*1rem)/4)] lg:w-[calc((100%-5*1rem)/6)]">
      <Skeleton className="size-20 sm:size-24 rounded-sm" />
      <Skeleton className="h-4 w-20" />
      <Skeleton className="h-5 w-14 rounded-sm" />
    </div>
  );
}
