"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import ProductForm from "./ProductForm";
import { useEffect } from "react";

type Category = { id: string; name: string };
type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  images: string[];
};

export default function EditModal({ categories = [], product }: { categories?: Category[]; product?: Product }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const open = params.get("edit") === "1";

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = ''; };
    }
  }, [open]);

  if (!open) return null;
  
  if (!product) {
    console.log("EditModal: No product found for editing");
    return null;
  }

  const close = () => {
    const sp = new URLSearchParams(params.toString());
    sp.delete("edit");
    sp.delete("productId");
    router.replace(`${pathname}?${sp.toString()}`);
  };

  const initialData = {
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    categoryId: product.categoryId,
    image: Array.isArray(product.images) ? product.images[0] : "",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6">
      <div className="absolute inset-0 h-screen bg-black/50" onClick={close} />
      <div className="relative w-full max-w-xl max-h-[85vh] overflow-y-auto rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-5 shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-[var(--nav-fg)]">Edit Product</h2>
          <button onClick={close} className="p-2 rounded-md border border-[var(--card-border)]">✕</button>
        </div>
        <ProductForm onSuccess={close} categories={categories} initialData={initialData} isEdit={true} />
      </div>
    </div>
  );
}
