"use client";

import { useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { createProductAction, updateProductAction } from "./actions";
import LoadingSpinner from "@/app/components/LoadingSpinner";

type Category = { id: string; name: string };

type ProductData = {
  id?: string;
  name?: string;
  description?: string;
  price?: number;
  categoryId?: string;
  image?: string;
};

export default function ProductForm({ onSuccess, categories = [], initialData, isEdit = false }: { 
  onSuccess?: () => void; 
  categories?: Category[]; 
  initialData?: ProductData;
  isEdit?: boolean;
}) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pending, setPending] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors({});

    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("name") || "").trim();
    const description = String(fd.get("description") || "").trim();
    const priceStr = String(fd.get("price") || "").trim();
    const image = String(fd.get("image") || "").trim();
    const categoryId = String(fd.get("categoryId") || "").trim();

    const nextErrors: Record<string, string> = {};
    if (!name) nextErrors.name = "Name is required";
    if (!description) nextErrors.description = "Description is required";
    const price = Number(priceStr);
    if (!priceStr || Number.isNaN(price)) nextErrors.price = "Price must be a number";
    else if (price <= 0) nextErrors.price = "Price must be greater than 0";
    if (!categoryId) nextErrors.categoryId = "Category is required";
    if (image && !/^https?:\/\//i.test(image)) nextErrors.image = "Image must be a valid URL";

    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    try {
      setPending(true);
      const fd = new FormData(e.currentTarget);
      
      // Add hidden ID field for edit mode
      if (isEdit && initialData?.id) {
        fd.append("id", initialData.id);
      }

      const result = isEdit ? await updateProductAction(fd) : await createProductAction(fd);
      if (!result.ok) {
        setErrors({ form: result.error || (isEdit ? "Failed to update product" : "Failed to create product") });
        return;
      }
      // close modal by removing create/edit param
      const sp = new URLSearchParams(params.toString());
      sp.delete("create");
      sp.delete("edit");
      router.replace(`${pathname}?${sp.toString()}`);
      router.refresh();
      onSuccess?.();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong. Please try again.';
      setErrors({ form: message });
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {errors.form && (
        <div className="rounded-lg border border-red-200 bg-red-50 text-red-700 px-4 py-3 text-sm">
          {errors.form}
        </div>
      )}
      <div className="space-y-2">
        <label htmlFor="name" className="block text-sm font-medium text-[var(--app-fg)]">Product Name</label>
        <input 
          id="name" 
          name="name" 
          defaultValue={initialData?.name || ""} 
          aria-invalid={Boolean(errors.name)} 
          aria-describedby={errors.name ? 'name-error' : undefined} 
          className="w-full rounded-lg border border-[var(--card-border)] bg-[var(--app-bg)] text-[var(--app-fg)] px-4 py-3 outline-none focus:ring-2 focus:ring-[var(--ring)] focus:border-transparent transition-all" 
        />
        {errors.name && <p id="name-error" className="text-xs text-red-600 mt-1">{errors.name}</p>}
      </div>
      <div className="space-y-2">
        <label htmlFor="description" className="block text-sm font-medium text-[var(--app-fg)]">Description</label>
        <textarea 
          id="description" 
          name="description" 
          rows={3} 
          defaultValue={initialData?.description || ""} 
          aria-invalid={Boolean(errors.description)} 
          aria-describedby={errors.description ? 'description-error' : undefined} 
          className="w-full rounded-lg border border-[var(--card-border)] bg-[var(--app-bg)] text-[var(--app-fg)] px-4 py-3 outline-none focus:ring-2 focus:ring-[var(--ring)] focus:border-transparent transition-all resize-none" 
        />
        {errors.description && <p id="description-error" className="text-xs text-red-600 mt-1">{errors.description}</p>}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="price" className="block text-sm font-medium text-[var(--app-fg)]">Price ($)</label>
          <input 
            id="price" 
            name="price" 
            type="number" 
            step="0.01" 
            defaultValue={initialData?.price || ""} 
            aria-invalid={Boolean(errors.price)} 
            aria-describedby={errors.price ? 'price-error' : undefined} 
            className="w-full rounded-lg border border-[var(--card-border)] bg-[var(--app-bg)] text-[var(--app-fg)] px-4 py-3 outline-none focus:ring-2 focus:ring-[var(--ring)] focus:border-transparent transition-all" 
          />
          {errors.price && <p id="price-error" className="text-xs text-red-600 mt-1">{errors.price}</p>}
        </div>
        <div className="space-y-2">
          <label htmlFor="categoryId" className="block text-sm font-medium text-[var(--app-fg)]">Category</label>
          <select 
            id="categoryId" 
            name="categoryId" 
            defaultValue={initialData?.categoryId || ""} 
            aria-invalid={Boolean(errors.categoryId)} 
            aria-describedby={errors.categoryId ? 'category-error' : undefined} 
            className="w-full rounded-lg border border-[var(--card-border)] bg-[var(--app-bg)] text-[var(--app-fg)] px-4 py-3 outline-none focus:ring-2 focus:ring-[var(--ring)] focus:border-transparent transition-all"
          >
            <option value="" disabled>Choose a category…</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          {errors.categoryId && <p id="category-error" className="text-xs text-red-600 mt-1">{errors.categoryId}</p>}
        </div>
      </div>
      <div className="space-y-2">
        <label htmlFor="image" className="block text-sm font-medium text-[var(--app-fg)]">Image URL</label>
        <input 
          id="image" 
          name="image" 
          placeholder="https://example.com/image.jpg" 
          defaultValue={initialData?.image || ""} 
          aria-invalid={Boolean(errors.image)} 
          aria-describedby={errors.image ? 'image-error' : undefined} 
          className="w-full rounded-lg border border-[var(--card-border)] bg-[var(--app-bg)] text-[var(--app-fg)] px-4 py-3 outline-none focus:ring-2 focus:ring-[var(--ring)] focus:border-transparent transition-all" 
        />
        {errors.image && <p id="image-error" className="text-xs text-red-600 mt-1">{errors.image}</p>}
      </div>
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--card-border)]">
        <button 
          type="button" 
          onClick={() => { 
            const sp = new URLSearchParams(params.toString()); 
            sp.delete("create"); 
            sp.delete("edit");
            router.replace(`${pathname}?${sp.toString()}`); 
          }} 
          className="px-4 py-2 rounded-lg border border-[var(--card-border)] text-[var(--app-fg)] hover:bg-[var(--card-border)] transition-colors"
        >
          Cancel
        </button>
        <button 
          disabled={pending} 
          className="px-6 py-2 rounded-lg bg-[var(--btn-bg)] text-[var(--btn-fg)] hover:bg-[var(--btn-bg-hover)] disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2 font-medium transition-all"
        >
          {pending && <LoadingSpinner size="sm" />}
          {pending ? "Saving…" : (isEdit ? "Update Product" : "Save Product")}
        </button>
      </div>
    </form>
  );
}
