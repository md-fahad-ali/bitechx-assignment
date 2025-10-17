"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function AddProductButton() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const open = () => {
    // If mobile sidebar is open, close it before opening modal
    if (typeof window !== 'undefined') {
      const el = document.getElementById('nav-toggle') as HTMLInputElement | null;
      if (el && el.checked) el.checked = false;
    }
    const sp = new URLSearchParams(params.toString());
    sp.set("create", "1");
    router.replace(`${pathname}?${sp.toString()}`);
  };

  return (
    <button
      onClick={open}
      className="mt-2 w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-md bg-[#ad8a64] text-[var(--btn-fg)] hover:bg-[#7c6449]"
    >
      + Add Product
    </button>
  );
}
