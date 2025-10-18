import LoadingSpinner from "@/app/components/LoadingSpinner";

export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-3 md:px-4 lg:px-8 space-y-6" aria-busy="true">
      {/* Filters skeleton */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center" aria-hidden="true">
        <div className="h-10 bg-[var(--nav-bg)] border border-[var(--nav-border)] rounded-md animate-pulse w-48 md:w-64"></div>
        <div className="md:ml-auto w-full md:w-auto">
          <div className="h-10 bg-[var(--nav-bg)] border border-[var(--nav-border)] rounded-md animate-pulse w-full sm:w-64 md:w-72 ml-auto"></div>
        </div>
      </div>

      {/* Grid skeleton */}
      <ul className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4" aria-hidden="true">
        {Array.from({ length: 12 }).map((_, i) => (
          <li key={i} className="rounded-lg border border-[var(--nav-border)] bg-[var(--nav-bg)] overflow-hidden">
            <div className="aspect-[4/3] bg-[color:rgba(13,24,33,0.05)] dark:bg-[color:rgba(239,241,243,0.06)] animate-pulse" />
            <div className="p-4">
              {/* Title line */}
              <div className="h-5 bg-[color:rgba(13,24,33,0.1)] dark:bg-[color:rgba(239,241,243,0.1)] rounded animate-pulse" />

              {/* Description block mirrors min-height and padding of real card */}
              <div className="mt-1 min-h-[2.5rem] pb-[25px]">
                <div className="h-4 bg-[color:rgba(13,24,33,0.1)] dark:bg-[color:rgba(239,241,243,0.1)] rounded w-3/4 animate-pulse" />
                <div className="mt-2 h-4 bg-[color:rgba(13,24,33,0.1)] dark:bg-[color:rgba(239,241,243,0.1)] rounded w-1/2 animate-pulse" />
              </div>

              <hr className="my-3 border-t border-[var(--nav-border)]/70" />
              <div className="mt-2 flex items-center justify-between">
                <div className="h-5 bg-[var(--c-green)]/30 rounded w-16 animate-pulse" />
                <div className="flex gap-1">
                  <div className="w-8 h-8 bg-[color:rgba(13,24,33,0.1)] dark:bg-[color:rgba(239,241,243,0.1)] rounded animate-pulse" />
                  <div className="w-8 h-8 bg-[color:rgba(13,24,33,0.1)] dark:bg-[color:rgba(239,241,243,0.1)] rounded animate-pulse" />
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {/* Loading indicator */}
      <div className="flex items-center justify-center py-8" role="status" aria-live="polite" aria-label="Loading products">
        <LoadingSpinner size="lg" />
        <span className="ml-3 text-[var(--nav-fg)] opacity-70">Loading products...</span>
        <span className="sr-only">Please wait</span>
      </div>
    </div>
  );
}
