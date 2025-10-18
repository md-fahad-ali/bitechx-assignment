import { cookies } from "next/headers";
import Link from "next/link";
import CreateModal from "./CreateModal";
import SearchClient from "./SearchClient";
import ProductActions from "./ProductActions";
import EditModal from "./EditModal";
import CategoryFilter from "./CategoryFilter";
import SearchLoadingBridge from "../components/SearchLoadingBridge";

// Category type used within this page
type Category = { id: string; name: string };

export const dynamic = "force-dynamic";

type Product = {
  id: string;
  name: string;
  description: string;
  slug: string;
  images: string[];
  price: number;
  categoryId: string;
  category?: { id: string; name: string };
};

async function fetchProducts(opts: {
  token: string;
  q?: string;
  categoryId?: string;
}) {
  const { token, q, categoryId } = opts;
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  } as const;

  const base = process.env.NEXT_API_BASE;
  if (!base) {
    throw new Error("NEXT_API_BASE environment variable is not configured");
  }

  if (q && q.trim().length > 0) {
    const url = `${base}/products/search?${new URLSearchParams({
      searchedText: q,
    }).toString()}`;
    const res = await fetch(url, { headers, cache: "no-store" });
    if (!res.ok) {
      console.error("Search failed:", res.status, await res.text());
      throw new Error("Failed to load products");
    }
    const data = (await res.json()) as Product[];
    return { items: data, total: data.length };
  }

  const sp = new URLSearchParams();
  if (categoryId) sp.set("categoryId", categoryId);
  const res = await fetch(`${base}/products${sp.toString() ? `?${sp}` : ""}`, {
    headers,
    cache: "force-cache",
    next: { revalidate: 30 },
  });
  if (!res.ok) {
    console.error("Fetch products failed:", res.status, await res.text());
    throw new Error("Failed to load products");
  }
  const items = (await res.json()) as Product[];
  return { items, total: items.length };
}

async function fetchCategories(token: string): Promise<Category[]> {
  const base = process.env.NEXT_API_BASE;
  if (!base) {
    throw new Error("NEXT_API_BASE environment variable is not configured");
  }

  const res = await fetch(`${base}/categories`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    cache: "force-cache",
    next: { revalidate: 300 },
  });
  if (!res.ok) {
    console.error("Fetch categories failed:", res.status, await res.text());
    return [] as { id: string; name: string }[];
  }
  const data: unknown = await res.json();
  if (!Array.isArray(data)) return [];
  return (data as unknown[])
    .map((c) => {
      if (
        c &&
        typeof c === "object" &&
        "id" in c &&
        "name" in c &&
        typeof (c as { id: unknown }).id === "string" &&
        typeof (c as { name: unknown }).name === "string"
      ) {
        const cc = c as { id: string; name: string };
        return { id: cc.id, name: cc.name } as Category;
      }
      return null;
    })
    .filter((x): x is Category => x !== null);
}

function formatPrice(p: number) {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(p);
  } catch {
    return `$${p}`;
  }
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const store = await cookies();
  const token = store.get("auth_token")?.value;

  if (!token) {
    return (
      <div className="max-w-3xl mx-auto text-center py-20">
        <h1 className="text-2xl font-semibold text-[var(--nav-fg)]">
          Please sign in to view products
        </h1>
        <p className="mt-2 opacity-80">
          You must be authenticated to access the catalog.
        </p>
        <Link
          href="/auth/login"
          className="inline-flex mt-6 px-4 py-2 rounded-md bg-[var(--c-green)] text-white"
        >
          Go to Login
        </Link>
      </div>
    );
  }

  const q = typeof params.q === "string" ? params.q : undefined;
  const page = Number(params.page ?? 1) || 1;
  // console.log("Current page from URL:", params.page, "Parsed page:", page);
  const limit = 12;
  const offset = (page - 1) * limit;
  // console.log("Calculated offset:", offset, "Limit:", limit);
  const categoryId =
    typeof params.categoryId === "string" ? params.categoryId : undefined;
  const editProductId =
    typeof params.productId === "string" ? params.productId : undefined;

  const [cats, prod] = await Promise.all([
    fetchCategories(token),
    fetchProducts({ token, q, categoryId }),
  ]);
  const items: Product[] = prod.items;
  const catsFinal: { id: string; name: string }[] =
    cats && cats.length
      ? cats
      : Array.from(
          new Map(
            (items || [])
              .map((p) => p.category)
              .filter(
                (c): c is { id: string; name: string } =>
                  !!c && !!c.id && !!c.name
              )
              .map((c) => [c.id, { id: c.id, name: c.name }] as const)
          ).values()
        );

  const editProduct = editProductId
    ? items.find((p) => p.id === editProductId)
    : undefined;

  // console.log("Full products list:", items);

  // console.log("Page debug:", {
  //   editProductId,
  //   editProduct: editProduct ? editProduct.name : "not found",
  //   totalItems: items.length
  // });

  // Show loading state if no items and it's likely still loading
  const isLoading = !items.length && !q;
  // Dynamically determine if we should show no products message based on total items
  const showNoProductsMessage = items.length <= limit && !isLoading;

  const currentPage = Math.floor(offset / limit) + 1;
  const totalPages = Math.max(1, Math.ceil(prod.total / limit));
  const hasPreviousPage = currentPage > 1;
  const hasNextPage = currentPage < totalPages;

  // Merge base query with a specific page number
  const baseQuery = params;
  const makeHref = (pageNum: number) => {
    const query: Record<string, string> = {};
    if (baseQuery) {
      for (const [k, v] of Object.entries(baseQuery)) {
        if (typeof v === "string" && v.length > 0) query[k] = v;
      }
    }
    query.page = String(pageNum);
    return { pathname: "/products", query } as const;
  };

  const getPageNumbers = () => {
    const result: (number | "...")[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) result.push(i);
      return result;
    }

    // Always include first and last
    result.push(1);

    const left = Math.max(2, currentPage - 1);
    const right = Math.min(totalPages - 1, currentPage + 1);

    // Left ellipsis
    if (left > 2) result.push("...");

    // Middle range around current
    for (let i = left; i <= right; i++) result.push(i);

    // Right ellipsis
    if (right < totalPages - 1) result.push("...");

    result.push(totalPages);
    return result;
  };

  return (
    <>
      <CreateModal categories={catsFinal} />
      <EditModal categories={catsFinal} product={editProduct} />
      <div className="max-w-7xl mx-auto px-3 md:px-4 lg:px-8 space-y-6">
      {/* Filters */}
      <div>
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
          <CategoryFilter categories={catsFinal} />
          <div className="md:ml-auto w-full md:w-auto">
            <SearchClient className="w-full sm:w-64 md:w-72 ml-auto" />
          </div>
        </div>

        {/* Search loading indicator (client-side while navigating) */}
        <SearchLoadingBridge />

        {/* Loading or Grid or No Products Message */}
        {isLoading ? (
          <ul className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <li
                key={i}
                className="rounded-lg border border-[var(--nav-border)] bg-[var(--nav-bg)] overflow-hidden animate-pulse shadow-lg"
              >
                <div className="aspect-[4/3] bg-[color:rgba(13,24,33,0.05)] dark:bg-[color:rgba(239,241,243,0.06)]"></div>
                <div className="p-3 space-y-2">
                  <div className="h-5 bg-[color:rgba(13,24,33,0.1)] dark:bg-[color:rgba(239,241,243,0.1)] rounded"></div>
                  <div className="h-4 bg-[color:rgba(13,24,33,0.1)] dark:bg-[color:rgba(239,241,243,0.1)] rounded w-3/4"></div>
                  <div className="h-4 bg-[color:rgba(13,24,33,0.1)] dark:bg-[color:rgba(239,241,243,0.1)] rounded w-1/2"></div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="h-5 bg-[var(--c-green)] opacity-20 rounded w-16"></div>
                    <div className="flex gap-1">
                      <div className="w-8 h-8 bg-[color:rgba(13,24,33,0.1)] dark:bg-[color:rgba(239,241,243,0.1)] rounded"></div>
                      <div className="w-8 h-8 bg-[color:rgba(13,24,33,0.1)] dark:bg-[color:rgba(239,241,243,0.1)] rounded"></div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : showNoProductsMessage ? (
          <div className="flex items-center justify-center py-20">
            <span className="text-[var(--nav-fg)] opacity-70">
              No Product Found
            </span>
          </div>
        ) : (
          <div>
            <ul className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
              {items.slice(offset, offset + limit).map((p: Product) => (
                <li
                  key={p.id}
                  className="group rounded-lg border border-[var(--nav-border)] bg-[var(--nav-bg)] overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="block">
                    <div className="relative aspect-[4/3] bg-[color:rgba(13,24,33,0.05)] dark:bg-[color:rgba(239,241,243,0.06)]">
                      {/* safe image rendering */}
                      {(() => {
                        const first = Array.isArray(p.images)
                          ? p.images[0]
                          : undefined;
                        const valid =
                          typeof first === "string" &&
                          /^(https?:)?\/\//i.test(first);
                        return valid ? (
                          <img
                            src={first}
                            alt={p.name}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-sm opacity-60">
                            No Image
                          </div>
                        );
                      })()}
                    </div>
                    <div className="p-4">
                      <Link
                        href={`/products/${p.slug}`}
                        className="focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] rounded-sm"
                      >
                        <h3 className="font-medium text-[var(--nav-fg)] line-clamp-1 hover:underline">
                          {p.name}
                        </h3>
                      </Link>
                      <p className="mt-1 text-sm opacity-70 pb-[25px] line-clamp-2 min-h-[2.5rem]">
                        {p.description}
                      </p>
                      <hr className="my-3 border-t border-[var(--nav-border)]/70" />
                      <div className="mt-2 flex items-center justify-between">
                        <div className="font-semibold text-[var(--nav-fg)]">
                          {formatPrice(p.price)}
                        </div>
                        <ProductActions
                          product={{
                            id: p.id,
                            name: p.name,
                            description: p.description,
                            slug: p.slug,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <nav
              className="flex items-center justify-center mt-8"
              aria-label="Pagination"
            >
              <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
                {/* Prev Button */}
                <Link
                  aria-disabled={!hasPreviousPage}
                  tabIndex={hasPreviousPage ? 0 : -1}
                  className={`inline-flex items-center justify-center px-3 py-1 sm:px-4 sm:py-2 rounded-lg sm:text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] ${
                    hasPreviousPage
                      ? "text-[var(--nav-fg)] hover:bg-[var(--brand)] hover:text-[var(--btn-fg)]"
                      : "text-[color:rgba(13,24,33,0.35)] dark:text-[color:rgba(239,241,243,0.35)] cursor-not-allowed pointer-events-none opacity-60"
                  }`}
                  href={makeHref(currentPage - 1)}
                >
                  Prev
                </Link>

                {/* Page Numbers */}
                {getPageNumbers().map((pageNum, idx) => {
                  if (pageNum === "...") {
                    return (
                      <span
                        key={idx}
                        className="px-2 py-1 sm:py-2 sm:text-sm text-[color:rgba(13,24,33,0.45)] dark:text-[color:rgba(239,241,243,0.45)]"
                      >
                        ...
                      </span>
                    );
                  }

                  const isActive = pageNum === currentPage;

                  return (
                    <Link
                      key={idx}
                      href={makeHref(pageNum)}
                      className={`w-[32px] h-[32px] sm:w-[40px] sm:h-[40px] flex items-center justify-center rounded-lg text-xs sm:text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] ${
                        isActive
                          ? "bg-[var(--brand)] text-[var(--btn-fg)] shadow-md"
                          : "text-[var(--nav-fg)] hover:bg-[var(--brand)] hover:text-[var(--btn-fg)]"
                      }`}
                      aria-current={isActive ? "page" : undefined}
                    >
                      {pageNum}
                    </Link>
                  );
                })}

                {/* Next Button */}
                <Link
                  aria-disabled={!hasNextPage}
                  tabIndex={hasNextPage ? 0 : -1}
                  className={`inline-flex items-center justify-center px-3 py-1 sm:px-4 sm:py-2 rounded-lg sm:text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] ${
                    hasNextPage
                      ? "text-[var(--nav-fg)] hover:bg-[var(--brand)] hover:text-[var(--btn-fg)]"
                      : "text-[color:rgba(13,24,33,0.35)] dark:text-[color:rgba(239,241,243,0.35)] cursor-not-allowed pointer-events-none opacity-60"
                  }`}
                  href={makeHref(currentPage + 1)}
                >
                  Next
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
      </div>
    </>
  );
}
