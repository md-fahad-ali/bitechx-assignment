"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { SunIcon, MoonIcon } from "@heroicons/react/24/solid";

export default function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null; // avoid hydration mismatch

  const effective = theme === "system" ? systemTheme : theme;

  // Compact: single icon button toggles between light<->dark
  if (compact) {
    const isDark = effective === "dark";
    return (
      <button
        aria-label="Toggle theme"
        onClick={() => setTheme(isDark ? "light" : "dark")}
        className="inline-flex items-center justify-center rounded-full border border-[var(--nav-border)] text-[var(--nav-fg)] hover:text-[#ad8a64] hover:border-[color:#ad8a64] h-9 w-9"
      >
          {isDark ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
      </button>
    );
  }

  const isDark = effective === "dark";
  return (
    <div className="inline-flex items-center gap-1 p-1 rounded-full border border-[var(--nav-border)] bg-[var(--nav-bg)]">
      <button
        aria-label="Switch to light"
        onClick={() => setTheme("light")}
        className={`h-9 w-9 inline-flex items-center justify-center rounded-full ${
          !isDark ? "bg-[var(--c-anti)] text-[var(--c-rich)]" : "text-[var(--nav-fg)]"
        }`}
      >
      <MoonIcon className="h-5 w-5" />
        
      </button>
      <button
        aria-label="Switch to dark"
        onClick={() => setTheme("dark")}
        className={`h-9 w-9 inline-flex items-center justify-center rounded-full ${
          isDark ? "bg-[var(--c-green)] text-white" : "text-[var(--nav-fg)]"
        }`}
      >
        <SunIcon className="h-5 w-5" />
      </button>
    </div>
  );
}
