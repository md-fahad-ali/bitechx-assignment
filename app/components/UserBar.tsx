"use client";

import { useFormStatus } from "react-dom";
import { logout } from "@/app/auth/logout/server";

function LogoutButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="px-3 py-1.5 rounded-md border border-[var(--nav-border)] text-[var(--nav-fg)] hover:text-red-500 hover:border-[color:rgba(78,110,93,0.4)] disabled:opacity-60"
    >
      {pending ? "…" : "Logout"}
    </button>
  );
}

export default function UserBar() {
  return (
    <div className="mt-auto border-t border-[var(--nav-border)] p-3">
      <div className="flex items-center justify-between gap-3">
        {/* Profile icon */}
        <div className="flex items-center gap-2 text-[var(--nav-fg)]">
          <div className="w-9 h-9 rounded-full bg-[color:rgba(13,24,33,0.08)] dark:bg-[color:rgba(239,241,243,0.12)] grid place-items-center">
            <svg width="18" height="18" viewBox="0 0 17 19" xmlns="http://www.w3.org/2000/svg" className="text-[var(--nav-fg)]/80">
              <path d="M10.083 10.3857C13.7871 10.3857 16.7898 13.3887 16.79 17.0928V17.4395C16.79 17.8537 16.4543 18.1895 16.04 18.1895C15.6259 18.1893 15.29 17.8536 15.29 17.4395V17.0928C15.2898 14.2171 12.9587 11.8857 10.083 11.8857H6.70703C3.83142 11.8859 1.50027 14.2172 1.5 17.0928V17.4395C1.5 17.8537 1.16421 18.1895 0.75 18.1895C0.335786 18.1895 0 17.8537 0 17.4395V17.0928C0.000274757 13.3888 3.00299 10.3859 6.70703 10.3857H10.083ZM8.39453 0C10.8323 9.89535e-05 12.8085 1.9763 12.8086 4.41406C12.8086 6.85187 10.8323 8.82803 8.39453 8.82812C5.9567 8.82808 3.98047 6.8519 3.98047 4.41406C3.98051 1.97626 5.95673 4.37769e-05 8.39453 0ZM8.39453 1.5C6.78516 1.50004 5.48051 2.80469 5.48047 4.41406C5.48047 6.02347 6.78513 7.32808 8.39453 7.32812C10.0039 7.32803 11.3086 6.02344 11.3086 4.41406C11.3085 2.80472 10.0039 1.5001 8.39453 1.5Z" fill="currentColor" />
            </svg>
          </div>
          <div className="leading-tight">
            <div className="text-sm font-medium">Account</div>
            <div className="text-xs opacity-70">Signed in</div>
          </div>
        </div>
        {/* Logout button with server action */}
        <form action={logout}>
          <LogoutButton />
        </form>
      </div>
    </div>
  );
}
