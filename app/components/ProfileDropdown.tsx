"use client";

import { useState, useRef, useEffect } from "react";
import { UserIcon, Cog6ToothIcon, PencilIcon, ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";
import { logout } from "../auth/logout/server";

export default function ProfileDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full border border-[var(--nav-border)] text-[var(--nav-fg)] hover:bg-[var(--nav-bg)] hover:text-[#ad8a64] hover:border-[color:#ad8a64] transition-colors"
        title="Profile menu"
      >
        <UserIcon className="w-5 h-5" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-md border border-[var(--card-border)] bg-[var(--card-bg)] shadow-lg z-50">
          <div className="py-1">
            <button
              onClick={() => {
                setIsOpen(false);
                // TODO: Navigate to settings
                console.log("Settings clicked");
              }}
              className="flex items-center w-full px-4 py-2 text-sm text-[var(--nav-fg)] hover:bg-[var(--nav-bg)] transition-colors"
            >
              <Cog6ToothIcon className="w-4 h-4 mr-3" />
              Settings
            </button>
            
            <button
              onClick={() => {
                setIsOpen(false);
                // TODO: Navigate to edit profile
                console.log("Edit Profile clicked");
              }}
              className="flex items-center w-full px-4 py-2 text-sm text-[var(--nav-fg)] hover:bg-[var(--nav-bg)] transition-colors"
            >
              <PencilIcon className="w-4 h-4 mr-3" />
              Edit Profile
            </button>

            <div className="border-t border-[var(--nav-border)] my-1"></div>
            
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <ArrowRightOnRectangleIcon className="w-4 h-4 mr-3" />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
