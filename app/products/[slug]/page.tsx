import { cookies } from 'next/headers';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

async function fetchProduct(token: string, slug: string) {
  const base = process.env.NEXT_API_BASE as string;
  const res = await fetch(`${base}/products/${encodeURIComponent(slug)}` , {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  });
  if (!res.ok) return null;
  return res.json();
}

function formatPrice(p: number) {
  try { return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(p); } catch { return `$${p}` }
}

export default async function ProductDetails({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const store = await cookies();
  const token = store.get('auth_token')?.value;
  if (!token) {
    return (
      <div className="max-w-3xl mx-auto text-center py-20">
        <h1 className="text-2xl font-semibold text-[var(--nav-fg)]">Please sign in to view product</h1>
        <p className="mt-2 opacity-80">You must be authenticated to access details.</p>
        <Link href="/auth/login" className="inline-flex mt-6 px-4 py-2 rounded-md bg-[var(--c-green)] text-white">Go to Login</Link>
      </div>
    );
  }

  const product = await fetchProduct(token, slug);
  if (!product) {
    return (
      <div className="max-w-3xl mx-auto text-center py-20">
        <h1 className="text-2xl font-semibold text-[var(--nav-fg)]">Product not found</h1>
        <p className="mt-2 opacity-80">We couldn’t load this product right now.</p>
        <Link href="/products" className="inline-flex mt-6 px-4 py-2 rounded-md border border-[var(--nav-border)] text-[var(--nav-fg)]">Back to Products</Link>
      </div>
    );
  }
  const img = Array.isArray(product.images) ? product.images[0] : undefined;

  return (
    <div>
      {/* Top back link aligned to the left edge of the main content area */}
      <div className="mb-4">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-[var(--nav-border)] text-[var(--nav-fg)] hover:text-[#ad8a64] hover:border-[#ad8a64] transition-colors"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
          Back
        </Link>
      </div>

      <div className="mx-auto max-w-5xl grid gap-8 md:grid-cols-2">
        <div className="rounded-lg border border-[var(--nav-border)] bg-[var(--nav-bg)] overflow-hidden">
          <div className="relative aspect-[4/3] bg-[color:rgba(13,24,33,0.05)] dark:bg-[color:rgba(239,241,243,0.06)]">
            {img ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={img} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-sm opacity-60">No Image</div>
            )}
          </div>
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-[var(--nav-fg)]">{product.name}</h1>
          <div className="mt-2 text-white text-xl font-bold">{formatPrice(product.price)}</div>
          <p className="mt-4 opacity-80 leading-7">{product.description}</p>
          {product.category && (
            <div className="mt-4 text-sm">
              <span className="opacity-70">Category:</span> <span className="font-medium">{product.category.name}</span>
            </div>
          )}

          {/* Back button moved to the top */}
        </div>
      </div>
    </div>
  );
}
