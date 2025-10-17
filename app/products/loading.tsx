import LoadingSpinner from "@/app/components/LoadingSpinner";

export default function Loading() {
  return (
    <div className="space-y-6">
      {/* Filters skeleton */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
        <div className="flex-1 h-10 bg-[var(--nav-bg)] border border-[var(--nav-border)] rounded-md animate-pulse"></div>
        <div className="w-32 h-10 bg-[var(--nav-bg)] border border-[var(--nav-border)] rounded-md animate-pulse"></div>
      </div>

      {/* Grid skeleton */}
      <ul className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <li key={i} className="rounded-lg border border-[var(--nav-border)] bg-[var(--nav-bg)] overflow-hidden animate-pulse">
            <div className="aspect-[4/3] bg-[color:rgba(13,24,33,0.05)] dark:bg-[color:rgba(239,241,243,0.06)]"></div>
            <div className="p-3 space-y-2">
              <div className="h-5 bg-[color:rgba(13,24,33,0.1)] dark:bg-[color:rgba(239,241,243,0.1)] rounded"></div>
              <div className="h-4 bg-[color:rgba(13,24,33,0.1)] dark:bg-[color:rgba(239,241,243,0.1)] rounded w-3/4"></div>
              <div className="h-4 bg-[color:rgba(13,24,33,0.1)] dark:bg-[color:rgba(239,241,243,0.1)] rounded w-1/2"></div>
              <div className="flex items-center justify-between mt-2">
                <div className="h-5 bg-[var(--c-green)] opacity-20 rounded w-16"></div>
                <div className="flex gap-1">
                  <div className="w-8 h-8 bg-[color:rgba(13,24,33,0.1)] dark:bg-[color:rgba(239,241,243,0.1)] rounded"></div>
                  <div className="w-8 h-8 bg-[color:rgba(13,24,33,0.1)] dark:bg-[color:rgba(239,241,243,0.1)] rounded"></div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {/* Loading indicator */}
      <div className="flex items-center justify-center py-8">
        <LoadingSpinner size="lg" />
        <span className="ml-3 text-[var(--nav-fg)] opacity-70">Loading products...</span>
      </div>
    </div>
  );
}
