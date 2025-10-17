"use client";

import { ThemeProvider } from "next-themes";
import type { ReactNode } from "react";
import ThemeBridge from "./components/ThemeBridge";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute="data-theme" 
      defaultTheme="light"   
      enableSystem
      disableTransitionOnChange
    >
      <ThemeBridge />
      {children}
    </ThemeProvider>
  );
}
