"use client";

import { authenticate } from "./server";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import ThemeToggle from "@/app/components/ThemeToggle";
import Footer from "@/app/components/Footer";
import Logo from "@/app/components/Logo";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-[var(--c-green)] text-white px-4 py-2 font-medium disabled:opacity-60"
    >
      {pending ? "Signing in…" : "Continue"}
    </button>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <header className="h-16 flex items-center justify-between px-4 border-b border-[var(--nav-border)] bg-[var(--nav-bg)]">
        <Link href="/" className="flex items-center gap-2 text-[var(--nav-fg)]">
          <Logo className="w-6 h-6" />
          <span className="font-semibold">BiTechX</span>
        </Link>
        <ThemeToggle compact />
      </header>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <form action={authenticate} className="w-full max-w-sm bg-[var(--nav-bg)] text-[var(--nav-fg)] border border-[var(--nav-border)] rounded-xl p-6 space-y-4">
          <h1 className="text-xl font-semibold">Sign in</h1>
          <p className="text-sm opacity-80">Enter your email to receive a login token.</p>
          <label className="block text-sm">
            Email
            <input
              type="email"
              name="email"
              required
              className="mt-1 w-full rounded-md border border-[var(--nav-border)] bg-[var(--app-bg)] text-[var(--app-fg)] px-3 py-2 outline-none focus:ring-2 focus:ring-[color:rgba(78,110,93,0.35)]"
              placeholder="you@example.com"
            />
          </label>
          <SubmitButton />
        </form>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
