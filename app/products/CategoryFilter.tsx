"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

export type Category = {
  id: string;
  name: string;
};

export default function CategoryFilter({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const current = params.get("categoryId") ?? "";

  const onChange = (id: string) => {
    const sp = new URLSearchParams(params.toString());
    if (id) sp.set("categoryId", id); else sp.delete("categoryId");
    sp.delete("offset");
    router.replace(`${pathname}?${sp.toString()}`);
  };

  return (
    <div className="flex items-center gap-2">
      <label className="text-sm opacity-80">Category</label>
      <select
        value={current}
        onChange={(e) => onChange(e.target.value)}
        className="min-w-[180px] rounded-md border border-[var(--card-border)] bg-[var(--app-bg)] text-[var(--app-fg)] px-3 py-2 outline-none focus:ring-2 focus:ring-[var(--ring)]"
      >
        <option value="">All</option>
        {categories.map((c) => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </select>
    </div>
  );
}
