"use client";

import Link from "next/link";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="max-w-3xl mx-auto px-3 md:px-4 lg:px-8 py-16 text-center">
      <h1 className="text-2xl font-semibold text-[var(--nav-fg)]">Something went wrong</h1>
      <p className="mt-2 text-sm opacity-80">
        {error?.message || "We couldn't load this page. Please try again."}
      </p>

      <div className="mt-6 flex items-center justify-center gap-3">
        <button
          onClick={() => reset()}
          className="px-4 py-2 rounded-md bg-[var(--btn-bg)] text-[var(--btn-fg)] hover:bg-[var(--btn-bg-hover)]"
        >
          Try again
        </button>
        <Link
          href="/products"
          className="px-4 py-2 rounded-md border border-[var(--nav-border)] text-[var(--nav-fg)] hover:bg-[var(--nav-border)]/20"
        >
          Back to products
        </Link>
      </div>

      {error?.digest && (
        <p className="mt-4 text-xs opacity-60">Error code: {error.digest}</p>
      )}
    </div>
  );
}
