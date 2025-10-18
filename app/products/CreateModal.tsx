"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import ProductForm from "./ProductForm";
import { useCallback, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";

type Category = { id: string; name: string };

export default function CreateModal({ categories = [] }: { categories?: Category[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const paramOpen = params.get("create") === "1";
  const [localOpen, setLocalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const open = useMemo(() => (mounted && (paramOpen || localOpen)), [mounted, paramOpen, localOpen]);

  const onOpen = useCallback(() => setLocalOpen(true), []);
  const onClose = useCallback(() => setLocalOpen(false), []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('modal:create:open', onOpen as EventListener);
      window.addEventListener('modal:create:close', onClose as EventListener);
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('modal:create:open', onOpen as EventListener);
        window.removeEventListener('modal:create:close', onClose as EventListener);
      }
    };
  }, [onOpen, onClose]);

  const close = useCallback(() => {
    if (paramOpen) {
      const sp = new URLSearchParams(params.toString());
      sp.delete("create");
      router.replace(`${pathname}?${sp.toString()}`);
    } else {
      setLocalOpen(false);
      if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('modal:create:close'));
    }
  }, [paramOpen, params, pathname, router]);

  if (!mounted || !open) return null;

  const modalContent = (
    <div className="fixed inset-0 z-[99] flex items-center justify-center p-4" onClick={close}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div 
        className="relative w-full max-w-md bg-[var(--app-bg)] rounded-xl shadow-2xl max-h-[90vh] overflow-hidden border border-[var(--card-border)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-[var(--card-border)]">
          <h2 className="text-xl font-semibold text-[var(--app-fg)]">Add Product</h2>
          <button
            onClick={close}
            className="p-2 hover:bg-[var(--card-border)] rounded-lg transition-colors text-[var(--app-fg)]"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          <ProductForm onSuccess={close} categories={categories} />
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
