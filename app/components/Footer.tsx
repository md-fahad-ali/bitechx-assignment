import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-[var(--nav-border)] bg-[var(--nav-bg)]">
      <div className="max-w-7xl mx-auto px-4 py-8 grid gap-6 md:grid-cols-3 text-[var(--nav-fg)]">
        <div>
          <h3 className="font-semibold text-lg">BITECHX</h3>
          <p className="mt-2 text-sm opacity-80">Modern products demo built with Next.js. Styled with our palette: rich, anti, green, lion, chestnut.</p>
        </div>
        <div>
          <h4 className="font-medium">Links</h4>
          <ul className="mt-2 space-y-1 text-sm">
            <li><Link className="hover:text-[var(--c-green)]" href="/products">Products</Link></li>
            <li><Link className="hover:text-[var(--c-green)]" href="/auth/login">Login</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-medium">Stay in touch</h4>
          <p className="mt-2 text-sm opacity-80">contact: connect@bitechx.com</p>
        </div>
      </div>
      <div className="border-t border-[var(--nav-border)] text-center text-xs py-4 text-[var(--nav-fg)]/70">© {new Date().getFullYear()} BITECHX</div>
    </footer>
  );
}
