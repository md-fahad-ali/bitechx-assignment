"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type Props = {
  placeholder?: string;
  className?: string; 
};

export default function SearchClient({ placeholder = "Search products…", className = "" }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [value, setValue] = useState<string>(params.get("q") ?? "");
  const mounted = useRef(false);
  const [searching, setSearching] = useState(false);

  
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const update = (next: string) => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      const sp = new URLSearchParams(params.toString());
      if (next) sp.set("q", next);
      else sp.delete("q");
      
      sp.delete("offset");
      try {
        setSearching(true);
        if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('search:pending'));
      } catch {}
      router.replace(`${pathname}?${sp.toString()}`);
    }, 300);
  };

  useEffect(() => {
    if (mounted.current) return; 
    mounted.current = true;
    setValue(params.get("q") ?? "");
  }, [params]);

  
  useEffect(() => {
    const currentQ = params.get('q') ?? '';
    
    if (searching && currentQ === value.trim()) {
      setSearching(false);
      if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('search:done'));
    }
    
  }, [params,searching,value]);

  const inputClasses = "w-full pl-9 rounded-md border border-[var(--nav-border)] bg-[var(--app-bg)] text-[var(--app-fg)] placeholder:opacity-70 outline-none px-3 py-2 focus:ring-2 focus:ring-[color:rgba(78,110,93,0.35)]";

  return (
    <div className={`relative w-full ${className}`}>
      <input
        value={value}
        onChange={(e) => {
          const v = e.target.value;
          setValue(v);
          update(v.trim());
        }}
        placeholder={placeholder}
        className={inputClasses}
        aria-label="Search products"
      />
      {/* Left icon */}
      <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--nav-fg)]/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    </div>
  );
}
