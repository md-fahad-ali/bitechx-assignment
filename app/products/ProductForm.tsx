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
        setErrors({ form: result.error || "Failed to create product" });
        return;
      }
      // close modal by removing create/edit param
      const sp = new URLSearchParams(params.toString());
      sp.delete("create");
      sp.delete("edit");
      router.replace(`${pathname}?${sp.toString()}`);
      router.refresh();
      onSuccess?.();
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errors.form && (
        <div className="rounded-md border border-[color:rgba(164,74,63,0.25)] bg-[color:rgba(164,74,63,0.12)] text-[#A44A3F] px-3 py-2 text-sm">
          {errors.form}
        </div>
      )}
      <div>
        <label className="block text-sm mb-1">Name</label>
        <input name="name" defaultValue={initialData?.name || ""} className="w-full rounded-md border border-[var(--card-border)] bg-[var(--app-bg)] text-[var(--app-fg)] px-3 py-2 outline-none focus:ring-2 focus:ring-[var(--ring)]" />
        {errors.name && <p className="text-xs text-[#A44A3F] mt-1">{errors.name}</p>}
      </div>
      <div>
        <label className="block text-sm mb-1">Description</label>
        <textarea name="description" rows={3} defaultValue={initialData?.description || ""} className="w-full rounded-md border border-[var(--card-border)] bg-[var(--app-bg)] text-[var(--app-fg)] px-3 py-2 outline-none focus:ring-2 focus:ring-[var(--ring)]" />
        {errors.description && <p className="text-xs text-[#A44A3F] mt-1">{errors.description}</p>}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm mb-1">Price</label>
          <input name="price" type="number" step="0.01" defaultValue={initialData?.price || ""} className="w-full rounded-md border border-[var(--card-border)] bg-[var(--app-bg)] text-[var(--app-fg)] px-3 py-2 outline-none focus:ring-2 focus:ring-[var(--ring)]" />
          {errors.price && <p className="text-xs text-[#A44A3F] mt-1">{errors.price}</p>}
        </div>
        <div>
          <label className="block text-sm mb-1">Category</label>
          <select name="categoryId" defaultValue={initialData?.categoryId || ""} className="w-full rounded-md border border-[var(--card-border)] bg-[var(--app-bg)] text-[var(--app-fg)] px-3 py-2 outline-none focus:ring-2 focus:ring-[var(--ring)]">
            <option value="" disabled>Choose a category…</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          {errors.categoryId && <p className="text-xs text-[#A44A3F] mt-1">{errors.categoryId}</p>}
        </div>
      </div>
      <div>
        <label className="block text-sm mb-1">Image URL</label>
        <input name="image" placeholder="https://..." defaultValue={initialData?.image || ""} className="w-full rounded-md border border-[var(--card-border)] bg-[var(--app-bg)] text-[var(--app-fg)] px-3 py-2 outline-none focus:ring-2 focus:ring-[var(--ring)]" />
        {errors.image && <p className="text-xs text-[#A44A3F] mt-1">{errors.image}</p>}
      </div>
      <div className="flex items-center justify-end gap-2 pt-2">
        <button type="button" onClick={() => { 
          const sp = new URLSearchParams(params.toString()); 
          sp.delete("create"); 
          sp.delete("edit");
          router.replace(`${pathname}?${sp.toString()}`); 
        }} className="px-3 py-2 rounded-md border border-[var(--card-border)]">Cancel</button>
        <button disabled={pending} className="px-4 py-2 rounded-md bg-[var(--btn-bg)] text-[var(--btn-fg)] hover:bg-[var(--btn-bg-hover)] disabled:opacity-60 flex items-center gap-2">
          {pending && <LoadingSpinner size="sm" />}
          {pending ? "Saving…" : (isEdit ? "Update" : "Save")}
        </button>
      </div>
    </form>
  );
}
