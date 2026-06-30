/** Reusable skeleton building blocks for dashboard pages */

export function Sk({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-gray-200 rounded-md ${className}`} />;
}

export function HomePageSkeleton() {
  return (
    <div className="flex flex-col gap-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white rounded-md p-4 flex items-center justify-between">
            <div className="flex flex-col gap-y-2">
              <Sk className="h-7 w-16" />
              <Sk className="h-3 w-20" />
            </div>
            <Sk className="size-12 rounded-md" />
          </div>
        ))}
      </div>
      {/* Recent views */}
      <div className="bg-white rounded-md p-5">
        <Sk className="h-5 w-32 mb-5" />
        <div className="grid grid-cols-12 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="col-span-6 lg:col-span-4 xl:col-span-3 rounded-md overflow-hidden">
              <Sk className="aspect-video w-full rounded-none" />
              <Sk className="h-8 mt-2 mx-3" />
              <Sk className="h-4 mt-2 mx-3 mb-3 w-1/2" />
            </div>
          ))}
        </div>
      </div>
      {/* Recent tickets */}
      <div className="bg-white rounded-md p-5">
        <Sk className="h-5 w-32 mb-5" />
        <div className="flex flex-col gap-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-x-3">
                <Sk className="h-6 w-16 rounded-md" />
                <Sk className="h-4 w-40" />
              </div>
              <Sk className="h-4 w-12" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function CoursesPageSkeleton() {
  return (
    <div className="bg-white p-4 sm:p-5 lg:rounded-md lg:p-7">
      <Sk className="h-5 w-24 mb-5" />
      <div className="grid grid-cols-12 gap-4 sm:gap-5">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="col-span-6 lg:col-span-4 xl:col-span-3 rounded-md overflow-hidden">
            <Sk className="aspect-video w-full rounded-none" />
            <Sk className="h-8 mt-2 mx-3" />
            <Sk className="h-4 mt-2 mx-3 mb-3 w-1/2" />
            <Sk className="h-9 w-full rounded-none" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function FavoritesPageSkeleton() {
  return (
    <div className="bg-white p-4 sm:p-5 lg:rounded-md lg:p-7">
      <Sk className="h-5 w-24 mb-5" />
      <div className="flex flex-col gap-y-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-center gap-x-3 px-4 py-3.5">
            <Sk className="size-11 shrink-0 rounded-md" />
            <div className="flex-1 flex flex-col gap-y-2">
              <Sk className="h-4 w-3/4" />
              <Sk className="h-3 w-1/4" />
            </div>
            <Sk className="size-7 rounded-md" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function NotificationsPageSkeleton() {
  return (
    <div className="bg-white p-4 sm:p-5 lg:rounded-md lg:p-7">
      <div className="flex items-center justify-between mb-5">
        <Sk className="h-5 w-28" />
        <Sk className="h-8 w-28 rounded-md" />
      </div>
      <div className="flex flex-col gap-y-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-start gap-x-3 px-4 py-4 min-h-[92px]">
            <Sk className="size-9 shrink-0 rounded-full" />
            <div className="flex-1 flex flex-col gap-y-2 pt-1">
              <Sk className="h-4 w-3/4" />
              <Sk className="h-3 w-1/2" />
              <Sk className="h-3 w-20 mt-1" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function TicketsPageSkeleton() {
  return (
    <div className="bg-white p-4 sm:p-5 lg:rounded-md lg:p-7">
      <div className="flex items-center justify-between mb-5">
        <Sk className="h-5 w-24" />
        <Sk className="h-9 w-32 rounded-md" />
      </div>
      <div className="flex flex-col gap-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="p-5 rounded-md">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-x-3">
                <Sk className="h-5 w-16 rounded-full" />
                <Sk className="h-4 w-40" />
              </div>
              <Sk className="h-4 w-20" />
            </div>
            <Sk className="h-3 w-full mb-2" />
            <Sk className="h-3 w-2/3" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function TicketDetailSkeleton() {
  return (
    <div className="bg-white p-4 sm:p-5 lg:rounded-md lg:p-7">
      <Sk className="h-5 w-48 mb-6" />
      <div className="flex flex-col gap-y-4 mb-8">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className={`flex gap-x-3 ${i % 2 === 1 ? "flex-row-reverse" : ""}`}>
            <Sk className="size-9 shrink-0 rounded-full" />
            <div className="flex flex-col gap-y-2 max-w-[70%]">
              <Sk className="h-3 w-20" />
              <Sk className="h-16 w-64 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
      <Sk className="h-24 w-full rounded-md mb-3" />
      <div className="flex gap-x-2">
        <Sk className="h-9 w-24 rounded-md" />
        <Sk className="h-9 w-24 rounded-md" />
      </div>
    </div>
  );
}

export function TransactionsPageSkeleton() {
  return (
    <div className="bg-white p-4 sm:p-5 lg:rounded-md lg:p-7">
      <Sk className="h-5 w-28 mb-6" />
      {/* Desktop table */}
      <div className="hidden md:block rounded-md overflow-hidden">
        <div className="bg-gray-50 px-5 py-3.5 flex gap-x-5">
          {Array.from({ length: 4 }).map((_, i) => <Sk key={i} className="h-3 w-20" />)}
        </div>
        <div className="divide-y divide-gray-50">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex gap-x-5 px-5 py-3.5">
              <Sk className="h-4 w-24" />
              <Sk className="h-4 flex-1" />
              <Sk className="h-4 w-20" />
              <Sk className="h-4 w-16" />
            </div>
          ))}
        </div>
      </div>
      {/* Mobile cards */}
      <div className="flex flex-col gap-y-3 md:hidden">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white rounded-md p-4 flex flex-col gap-y-2">
            <Sk className="h-4 w-3/4" />
            <Sk className="h-3 w-1/2" />
            <Sk className="h-3 w-1/4" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function OrderPaymentPageSkeleton() {
  return (
    <div className="bg-[var(--bg)] min-h-screen">
      <div className="container py-8 max-w-5xl">
        {/* breadcrumb */}
        <div className="flex items-center gap-x-2 mb-6">
          <Sk className="h-3 w-16" />
          <Sk className="h-3 w-3 rounded-full" />
          <Sk className="h-3 w-12" />
          <Sk className="h-3 w-3 rounded-full" />
          <Sk className="h-3 w-20" />
        </div>
        {/* title */}
        <Sk className="h-6 w-44 mb-6" />
        {/* order summary bar */}
        <div className="bg-white rounded-md p-5 flex justify-between items-center mb-5">
          <Sk className="h-4 w-24" />
          <Sk className="h-5 w-32" />
        </div>
        {/* two columns */}
        <div className="flex flex-col lg:flex-row gap-5 items-start">
          {/* destination account — right on desktop (first in DOM) */}
          <div className="bg-white rounded-md p-5 w-full lg:w-72 lg:shrink-0 flex flex-col gap-y-4">
            <Sk className="h-4 w-36" />
            <div className="flex flex-col gap-y-3">
              <Sk className="h-3 w-20" />
              <Sk className="h-4 w-40" />
              <Sk className="h-3 w-24" />
              <Sk className="h-4 w-28" />
              <Sk className="h-3 w-20" />
              <Sk className="h-4 w-32" />
            </div>
          </div>
          {/* form — left on desktop */}
          <div className="bg-white rounded-md p-5 w-full lg:flex-1 flex flex-col gap-y-4">
            <Sk className="h-4 w-32" />
            <div className="flex gap-x-2">
              <Sk className="h-11 flex-1 rounded-md" />
              <Sk className="h-11 flex-1 rounded-md" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex flex-col gap-y-1.5">
                  <Sk className="h-3 w-24" />
                  <Sk className="h-12 w-full rounded-md" />
                </div>
              ))}
            </div>
            <div className="flex justify-end">
              <Sk className="h-11 w-32 rounded-md" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CartPageSkeleton() {
  return (
    <div className="bg-[var(--bg)] min-h-[800px]">
      <div className="container py-16">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 items-start">
          {/* items list */}
          <div className="bg-white rounded-lg p-6">
            <Sk className="h-5 w-28 mb-6" />
            <div className="flex flex-col divide-y divide-gray-100">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="py-4 flex items-center justify-between gap-x-4">
                  <div className="flex items-center gap-x-4 flex-1 min-w-0">
                    <Sk className="h-[101px] w-[180px] shrink-0 rounded-md" />
                    <Sk className="h-5 flex-1 max-w-xs" />
                  </div>
                  <div className="flex items-center gap-x-4 shrink-0">
                    <div className="flex flex-col gap-y-1 items-end">
                      <Sk className="h-3 w-16" />
                      <Sk className="h-5 w-20" />
                    </div>
                    <Sk className="size-5 rounded-sm" />
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* summary sidebar */}
          <div className="bg-white rounded-lg px-6 py-6 flex flex-col gap-y-4 sticky top-24 self-start">
            <Sk className="h-5 w-28" />
            <div className="flex flex-col gap-y-3 pb-5 border-b border-gray-100">
              <div className="flex justify-between">
                <Sk className="h-3 w-20" />
                <Sk className="h-3 w-16" />
              </div>
            </div>
            <div className="flex justify-between">
              <Sk className="h-4 w-24" />
              <Sk className="h-5 w-20" />
            </div>
            <Sk className="h-12 w-full rounded-md mt-2" />
            <Sk className="h-3 w-full" />
            <Sk className="h-3 w-3/4" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function AccountPageSkeleton() {
  return (
    <div className="bg-white p-4 sm:p-5 lg:rounded-md lg:p-7">
      <Sk className="h-5 w-36 mb-7" />
      <div className="flex flex-col gap-y-5 max-w-md">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-y-1.5">
            <Sk className="h-3 w-20" />
            <Sk className="h-10 w-full rounded-md" />
          </div>
        ))}
        <Sk className="h-11 w-36 rounded-md mt-2" />
      </div>
    </div>
  );
}
