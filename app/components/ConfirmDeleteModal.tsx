"use client";

import { useState } from "react";
import LoadingSpinner from "./LoadingSpinner";

type ConfirmDeleteModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
};

export default function ConfirmDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Delete",
  cancelText = "Cancel"
}: ConfirmDeleteModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setIsDeleting(true);
    setError(null);
    try {
      await onConfirm();
      onClose();
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Failed to delete. Please try again.";
      setError(msg);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 z-10 bg-black/50" onClick={onClose} />
      <div className="relative z-20 bg-[var(--nav-bg)] border border-[var(--nav-border)] rounded-xl p-6 max-w-md w-full mx-4 shadow-xl">
        <h3 className="text-lg font-semibold text-[var(--nav-fg)] mb-2">{title}</h3>
        <p className="text-[var(--nav-fg)] opacity-80 mb-6">{message}</p>
        {error && (
          <div className="mb-4 rounded-md border border-[color:rgba(164,74,63,0.25)] bg-[color:rgba(164,74,63,0.12)] text-[#A44A3F] px-3 py-2 text-sm" role="alert" aria-live="assertive">
            {error}
          </div>
        )}
        
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 rounded-md border border-[var(--nav-border)] text-[var(--nav-fg)] hover:bg-[var(--nav-border)]/20 transition-colors disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            disabled={isDeleting}
            className="px-4 py-2 rounded-md bg-[#A44A3F] text-white hover:bg-[#A44A3F]/90 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {isDeleting && <LoadingSpinner size="sm" />}
            {isDeleting ? "Deleting..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
