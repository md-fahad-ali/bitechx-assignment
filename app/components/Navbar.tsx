'use client';

import { useState, type ReactNode } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from 'next-themes';

import ThemeToggle from './ThemeToggle';
import { AnimatePresence, motion } from 'framer-motion';

type Props = {
  isAuthenticated?: boolean;
};

const Navbar = ({ isAuthenticated = false }: Props) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, systemTheme } = useTheme();
  
  // Determine the effective theme
  const effectiveTheme = theme === 'system' ? systemTheme : theme;
  const isDark = effectiveTheme === 'dark';

  return (
    <nav className="w-full bg-[var(--nav-bg)] border-b border-[var(--nav-border)]">

      {/* Main Navigation */}
      <div className="max-w-7xl mx-auto px-3 md:px-4 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-16">
          {/* Mobile Menu Button & Logo */}
          <div className="flex items-center gap-5 md:gap-0">
            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 rounded-lg bg-transparent"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <svg className="w-6 h-6 text-[var(--nav-fg)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Logo */}
            <Link href="/" className="flex gap-1 items-center">
              <Image
                src={isDark ? "/logo-dark.svg" : "/logo-light.svg"}
                alt="BITECHX"
                width={40}
                height={46}
                className="h-8 w-auto md:h-10"
                priority
              />
              <span className="text-xl md:text-2xl font-bold text-[var(--nav-fg)] tracking-wide ml-2">BITECHX</span>
            </Link>
          </div>

          {/* Navigation Menu */}
          <div className="hidden lg:flex items-center space-x-8">
            <Link href="/deals" className="flex items-center space-x-1 text-[var(--nav-fg)] hover:text-[var(--c-green)] font-medium">
              <span>Deals of the Week</span>
              <span className="bg-[color:rgba(164,74,63,0.1)] text-[#A44A3F] text-xs px-2 py-0.5 rounded-full ">Hot</span>
            </Link>
            <Link href="/new-arrivals" className="text-[var(--nav-fg)] hover:text-[var(--c-green)] font-medium">
              New Arrivals
            </Link>
            <Link href="/men" className="text-[var(--nav-fg)] hover:text-[var(--c-green)] font-medium">
              Men
            </Link>
            <Link href="/women" className="text-[var(--nav-fg)] hover:text-[var(--c-green)] font-medium">
              Women
            </Link>
            <Link href="/kids" className="text-[var(--nav-fg)] hover:text-[var(--c-green)] font-medium">
              Kids
            </Link>
            <Link href="/sale" className="flex items-center space-x-1 text-[var(--nav-fg)] hover:text-[var(--c-green)] font-medium">
              <span>Sale</span>
              <span className="bg-[color:rgba(78,110,93,0.1)] text-[0.8rem] text-[var(--c-green)] px-2 py-0.5 rounded-full">20% OFF</span>
            </Link>
          </div>

          {/* Right side icons */}
          <div className="flex items-center gap-2.5">
            {/* Search - Visible on mobile and desktop */}
            <button className="p-2 text-[var(--nav-fg)] hover:text-[var(--c-green)]">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* User/Login - Hidden on mobile */}
            {isAuthenticated ? (
              <div className="hidden md:flex items-center gap-2">
                <button
                  className="p-2 text-[1.3rem] text-[var(--nav-fg)] hover:text-[var(--c-green)]"
                  aria-label="Account"
                  title="Account"
                >
                  <svg width="17" height="19" viewBox="0 0 17 19" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10.083 10.3857C13.7871 10.3857 16.7898 13.3887 16.79 17.0928V17.4395C16.79 17.8537 16.4543 18.1895 16.04 18.1895C15.6259 18.1893 15.29 17.8536 15.29 17.4395V17.0928C15.2898 14.2171 12.9587 11.8857 10.083 11.8857H6.70703C3.83142 11.8859 1.50027 14.2172 1.5 17.0928V17.4395C1.5 17.8537 1.16421 18.1895 0.75 18.1895C0.335786 18.1895 0 17.8537 0 17.4395V17.0928C0.000274757 13.3888 3.00299 10.3859 6.70703 10.3857H10.083ZM8.39453 0C10.8323 9.89535e-05 12.8085 1.9763 12.8086 4.41406C12.8086 6.85187 10.8323 8.82803 8.39453 8.82812C5.9567 8.82808 3.98047 6.8519 3.98047 4.41406C3.98051 1.97626 5.95673 4.37769e-05 8.39453 0ZM8.39453 1.5C6.78516 1.50004 5.48051 2.80469 5.48047 4.41406C5.48047 6.02347 6.78513 7.32808 8.39453 7.32812C10.0039 7.32803 11.3086 6.02344 11.3086 4.41406C11.3085 2.80472 10.0039 1.5001 8.39453 1.5Z" fill="currentColor" />
                  </svg>
                </button>
                <button
                  onClick={async () => {
                    try {
                      await fetch('/api/auth/logout', { method: 'POST' });
                      // simple client-side refresh to reflect auth state
                      window.location.reload();
                    } catch {}
                  }}
                  className="px-3 py-1.5 rounded-full border border-[var(--nav-border)] text-[var(--nav-fg)] hover:text-[var(--c-green)] hover:border-[color:rgba(78,110,93,0.4)]"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                href="/auth/login"
                className="hidden md:inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--nav-border)] text-[var(--nav-fg)] hover:text-[var(--c-green)] hover:border-[color:rgba(78,110,93,0.4)]"
              >
                Login
              </Link>
            )}
            {/* Theme toggle button */}
            <ThemeToggle compact />
            {/* Wishlist */}
           
            
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay with animations */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="lg:hidden fixed inset-0 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            {/* Dimmed backdrop */}
            <motion.div className="absolute inset-0 bg-black/50" />

            {/* Drawer */}
            <motion.div
              className="relative bg-[var(--nav-bg)] w-full max-w-sm h-full shadow-lg"
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: 'spring', stiffness: 260, damping: 24 }}
              onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
            >
              <div className="p-4">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-[var(--nav-fg)]">Menu</h2>
                  <button onClick={() => setIsMobileMenuOpen(false)}>
                    <svg className="w-6 h-6 text-[color:rgba(13,24,33,0.6)] dark:text-[color:rgba(239,241,243,0.6)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Staggered links */}
                <motion.div
                  className="space-y-4"
                  initial="hidden"
                  animate="show"
                  variants={{
                    hidden: { opacity: 1 },
                    show: {
                      opacity: 1,
                      transition: { staggerChildren: 0.06, delayChildren: 0.05 },
                    },
                  }}
                >
                  {(() => {
                    const menuItems: { href: string; content: ReactNode; className: string }[] = [
                      {
                        href: '/deals',
                        content: (
                          <>
                            <span>Deals of the Week</span>
                            <span className="bg-[color:rgba(164,74,63,0.1)] text-[#A44A3F] text-xs px-2 py-0.5 rounded-full">Hot</span>
                          </>
                        ),
                        className: 'flex items-center justify-between',
                      },
                      { href: '/new-arrivals', content: 'New Arrivals', className: 'block' },
                      { href: '/men', content: 'Men', className: 'block' },
                      { href: '/women', content: 'Women', className: 'block' },
                      { href: '/kids', content: 'Kids', className: 'block' },
                      {
                        href: '/sale',
                        content: (
                          <>
                            <span>Sale</span>
                            <span className="bg-[color:rgba(78,110,93,0.1)] text-[var(--c-green)] text-xs px-2 py-0.5 rounded-full">20% OFF</span>
                          </>
                        ),
                        className: 'flex items-center justify-between',
                      },
                    ];
                    return menuItems.map((item, idx) => (
                      <motion.div
                        key={idx}
                        variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }}
                      >
                        <Link href={item.href} className={`${item.className} py-3 text-[var(--nav-fg)] border-b border-[var(--nav-border)]`}>
                        {item.content}
                        </Link>
                      </motion.div>
                    ));
                  })()}
                </motion.div>

                <div className="mt-8 pt-6 border-t border-[var(--nav-border)]">
                  <motion.div
                    className="flex items-center gap-4 mb-4"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                  >
                    <button className="flex items-center gap-2 text-[var(--nav-fg)]">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      <span>Search</span>
                    </button>
                    {isAuthenticated ? (
                      <button className="flex items-center gap-2 text-[var(--nav-fg)]" aria-label="Account">
                        <svg width="17" height="19" viewBox="0 0 17 19" xmlns="http://www.w3.org/2000/svg">
                          <path d="M10.083 10.3857C13.7871 10.3857 16.7898 13.3887 16.79 17.0928V17.4395C16.79 17.8537 16.4543 18.1895 16.04 18.1895C15.6259 18.1893 15.29 17.8536 15.29 17.4395V17.0928C15.2898 14.2171 12.9587 11.8857 10.083 11.8857H6.70703C3.83142 11.8859 1.50027 14.2172 1.5 17.0928V17.4395C1.5 17.8537 1.16421 18.1895 0.75 18.1895C0.335786 18.1895 0 17.8537 0 17.4395V17.0928C0.000274757 13.3888 3.00299 10.3859 6.70703 10.3857H10.083ZM8.39453 0C10.8323 9.89535e-05 12.8085 1.9763 12.8086 4.41406C12.8086 6.85187 10.8323 8.82803 8.39453 8.82812C5.9567 8.82808 3.98047 6.8519 3.98047 4.41406C3.98051 1.97626 5.95673 4.37769e-05 8.39453 0ZM8.39453 1.5C6.78516 1.50004 5.48051 2.80469 5.48047 4.41406C5.48047 6.02347 6.78513 7.32808 8.39453 7.32812C10.0039 7.32803 11.3086 6.02344 11.3086 4.41406C11.3085 2.80472 10.0039 1.5001 8.39453 1.5Z" fill="currentColor" />
                        </svg>
                        <span>Account</span>
                      </button>
                    ) : (
                      <Link href="/auth/login" className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--nav-border)] text-[var(--nav-fg)] hover:text-[var(--c-green)] hover:border-[color:rgba(78,110,93,0.4)]">
                        Login
                      </Link>
                    )}
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;