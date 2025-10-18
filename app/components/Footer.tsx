import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-[var(--nav-border)] bg-[var(--nav-bg)] text-[var(--nav-fg)]">
      {/* Top section */}
      <div className="max-w-7xl mx-auto px-3 md:px-4 lg:px-8 py-12 grid gap-y-10 gap-x-8 md:grid-cols-3">
        {/* Brand */}
        <div>
          <Link href="/" className="inline-flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] rounded-md">
            <span className="text-2xl md:text-3xl font-bold tracking-wide">BITECHX</span>
          </Link>
          <p className="mt-3 text-sm leading-6 opacity-80 max-w-prose">
            Modern products demo built with Next.js. Designed with a cohesive palette and thoughtful spacing for clarity and comfort.
          </p>
        </div>

        {/* Links */}
        <div>
          <h4 className="text-xs uppercase tracking-wider font-semibold text-[color:rgba(13,24,33,0.7)] dark:text-[color:rgba(239,241,243,0.75)]">Links</h4>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link
                className="inline-flex items-center gap-2 hover:text-[var(--c-green)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] rounded-md transition-colors"
                href="/products"
              >
                Products
              </Link>
            </li>
            <li>
              <Link
                className="inline-flex items-center gap-2 hover:text-[var(--c-green)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] rounded-md transition-colors"
                href="/auth/login"
              >
                Login
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-xs uppercase tracking-wider font-semibold text-[color:rgba(13,24,33,0.7)] dark:text-[color:rgba(239,241,243,0.75)]">Stay in touch</h4>
          <p className="mt-3 text-sm opacity-80">contact: <a className="underline-offset-4 hover:underline hover:text-[var(--c-green)]" href="mailto:connect@bitechx.com">connect@bitechx.com</a></p>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[var(--nav-border)]">
        <div className="max-w-7xl mx-auto px-3 md:px-4 lg:px-8 py-5 text-center text-xs text-[var(--nav-fg)]/70">
          © {new Date().getFullYear()} BITECHX
        </div>
      </div>
    </footer>
  );
}

