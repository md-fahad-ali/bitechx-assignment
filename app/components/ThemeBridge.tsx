"use client";

import { useEffect } from "react";
import { useTheme } from "next-themes";
import { useThemePref } from "@/stores/useThemePref";

export default function ThemeBridge() {
  const { theme, systemTheme } = useTheme();
  const setTheme = useThemePref((s) => s.setTheme);

  useEffect(() => {
    const effective = theme === "system" ? systemTheme : theme;
    if (effective === "light" || effective === "dark" || effective === "system") {
      setTheme(effective);
    }
  }, [theme, systemTheme, setTheme]);

  return null;
}
