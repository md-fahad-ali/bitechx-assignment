"use client";

export default function ConfirmSubmit({
  children,
  message = "Are you sure?",
  className,
}: {
  children: React.ReactNode;
  message?: string;
  className?: string;
}) {
  return (
    <button
      type="submit"
      onClick={(e) => {
        const ok = window.confirm(message);
        if (!ok) e.preventDefault();
      }}
      className={className}
    >
      {children}
    </button>
  );
}
