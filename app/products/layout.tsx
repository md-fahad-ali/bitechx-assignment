import type { ReactNode } from 'react';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Footer from '@/app/components/Footer';
import Logo from '@/app/components/Logo';
import ThemeToggle from '@/app/components/ThemeToggle';
import ProfileDropdown from '@/app/components/ProfileDropdown';
import AddProductButton from './AddProductButton';
import UserBar from '@/app/components/UserBar';

export default async function ProductsLayout({ children }: { children: ReactNode }) {
  const store = await cookies();
  const token = store.get('auth_token')?.value;
  if (!token) redirect('/auth/login');

  return (
    <div className="min-h-dvh overflow-x-hidden">
      {/* Mobile nav toggle (peer) */}
      <input id="nav-toggle" type="checkbox" className="peer absolute opacity-0 pointer-events-none" />

      {/* Sidebar (reused) */}
      <aside
        className="flex flex-col border-r border-[var(--nav-border)] bg-[var(--nav-bg)]
        h-screen overflow-y-auto shadow-2xl shadow-black/20
        lg:fixed lg:inset-y-0 lg:left-0 lg:h-screen lg:overflow-hidden lg:shadow-none
        lg:translate-x-0
        fixed inset-y-0 left-0 w-[240px] z-60
        -translate-x-full peer-checked:translate-x-0 transition-transform duration-300 ease-in-out"
      >
        <div className="h-16 flex items-center px-4 ">
          <Link href="/products" className="flex items-center gap-2 text-[var(--nav-fg)]">
            <Logo className="w-6 h-6" />
            <span className="text-lg font-semibold">BiTechX</span>
          </Link>
          {/* Mobile close button to hide sidebar */}
          <label
            htmlFor="nav-toggle"
            className="lg:hidden ml-auto inline-flex items-center justify-center w-9 h-9 rounded-md border border-[var(--nav-border)] text-[var(--nav-fg)] hover:bg-[color:rgba(78,110,93,0.10)] cursor-pointer"
            aria-label="Close sidebar"
          >
            ✕
          </label>
        </div>
        <nav className="p-3 space-y-1">
          <Link href="/products" className="block px-3 py-2 rounded-md text-[var(--nav-fg)] hover:bg-[color:rgba(78,110,93,0.08)]">Products</Link>
        </nav>
        <div className="px-3">
          <AddProductButton />
        </div>
        <UserBar />
      </aside>

      {/* Backdrop for mobile when sidebar is open */}
      <label
        htmlFor="nav-toggle"
        className="lg:hidden fixed inset-0 z-50 bg-black/40 opacity-0 pointer-events-none transition-opacity duration-300
        peer-checked:opacity-100 peer-checked:pointer-events-auto"
      />

      {/* Main */}
      <div className="flex flex-col min-w-0 min-h-dvh lg:pl-[240px]">
        <header className="sticky top-0 z-20 h-24 p-[14px] flex items-center justify-between px-4 border-b border-[var(--nav-border)] bg-[var(--nav-bg)]">
          <div className="flex items-center gap-2">
            {/* Mobile hamburger */}
            <label
              htmlFor="nav-toggle"
              className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-md border border-[var(--nav-border)] text-[var(--nav-fg)] hover:bg-[color:rgba(78,110,93,0.10)] transition-colors mr-1"
              aria-label="Open sidebar"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </label>
            <span className="text-[var(--nav-fg)] font-semibold text-lg">Products</span>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle compact />
            <ProfileDropdown />
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
        <div className="mt-auto"><Footer /></div>
      </div>
    </div>
  );
}
