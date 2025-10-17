"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { deleteProductAction } from "./actions";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import ConfirmDeleteModal from "@/app/components/ConfirmDeleteModal";

type Product = {
  id: string;
  name: string;
  description?: string;
  slug: string;
};

export default function ProductActions({ product }: { product: Product }) {
  const [deleting, setDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    setDeleting(true);
    
    // Create a form data object for the server action
    const formData = new FormData();
    formData.append('productId', product.id);
    formData.append('name', product.name);
    formData.append('description', product.description || '');
    
    try {
      const result = await deleteProductAction(formData);
      
      if (!result.ok) {
        throw new Error(result.error || "Failed to delete product");
      }
      
      // Refresh the current route without adding a new history entry
      router.refresh();
    } catch (e) {
      throw e; // Re-throw to be handled by modal
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Open edit modal by updating URL params with Next.js router
    const params = new URLSearchParams(searchParams.toString());
    params.set("edit", "1");
    params.set("productId", product.id);
    router.push(`/products?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-[10px]">
      <button 
        onClick={handleEdit}
        className="p-1.5 rounded-md border border-[#4E6E5D] text-[#4E6E5D] hover:bg-[#4E6E5D]/10 transition-colors"
        title="Edit product"
      >
        <PencilIcon className="w-4 h-4" />
      </button>
      <button 
        onClick={handleDeleteClick}
        disabled={deleting}
        className="p-1.5 rounded-md border border-[#A44A3F] text-[#A44A3F] hover:bg-[#A44A3F]/10 transition-colors disabled:opacity-50"
        title="Delete product"
      >
        {deleting ? <LoadingSpinner size="sm" /> : <TrashIcon className="w-4 h-4" />}
      </button>
      
      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Product"
        message={`Are you sure you want to delete "${product.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
}
