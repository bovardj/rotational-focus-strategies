"use client";

import { useClerk, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  UserCircleIcon,
  ArrowRightStartOnRectangleIcon,
  BellIcon,
} from "@heroicons/react/24/outline";

export default function UserNav({ compact = false, dark = false }: { compact?: boolean; dark?: boolean }) {
  const { user } = useUser();
  const { signOut, openUserProfile } = useClerk();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [dropUp, setDropUp] = useState(false);
  const [dropRect, setDropRect] = useState<DOMRect | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  const [mounted, setMounted] = useState(false);
  const firstItemRef = useRef<HTMLButtonElement>(null);

  const onboardingComplete = user?.publicMetadata?.onboardingComplete === true;
  const name = user?.fullName ?? user?.primaryEmailAddress?.emailAddress ?? "Account";
  const initials = user?.fullName
    ? user.fullName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : (user?.primaryEmailAddress?.emailAddress?.[0] ?? "?").toUpperCase();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (open && firstItemRef.current) firstItemRef.current.focus();
  }, [open]);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  function handleOpen() {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setDropUp(window.innerHeight - rect.bottom < 150);
      if (compact) setDropRect(rect);
    }
    setOpen((o) => !o);
  }

  return (
    <div ref={ref} className="relative">
      {compact ? (
        <button
          onClick={handleOpen}
          aria-label="Account"
          aria-expanded={open}
          aria-haspopup="menu"
          aria-controls="user-nav-menu"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-sm font-semibold text-white transition-colors hover:bg-white/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-800 focus-visible:ring-offset-2"
        >
          {mounted ? initials : ""}
        </button>
      ) : (
        <button
          onClick={handleOpen}
          aria-expanded={open}
          aria-haspopup="menu"
          aria-controls="user-nav-menu"
          className={`flex h-12 w-full items-center gap-2 rounded-md px-3 font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-800 focus-visible:ring-offset-2 ${dark ? "bg-white/10 hover:bg-white/20 text-white" : "bg-gray-100 hover:bg-blue-50 hover:text-blue-800"}`}
        >
          <div aria-hidden="true" className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${dark ? "bg-white/20 text-white" : "bg-blue-800 text-white"}`}>
            {mounted ? initials : ""}
          </div>
          <span className={`flex-1 truncate text-left text-sm font-medium ${dark ? "text-white" : "text-gray-700"}`}>
            {mounted ? name : ""}
          </span>
        </button>
      )}

      {open && (() => {
        const menuContent = (
          <>
            <div className="border-b border-gray-100 px-3 py-2" aria-hidden="true">
              <p className="truncate text-xs font-medium text-gray-800">{mounted ? name : ""}</p>
              {mounted && user?.primaryEmailAddress && (
                <p className="truncate text-xs text-gray-600">
                  {user.primaryEmailAddress.emailAddress}
                </p>
              )}
            </div>
            <button
              ref={firstItemRef}
              role="menuitem"
              onClick={() => { setOpen(false); openUserProfile(); }}
              className="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-800"
            >
              <UserCircleIcon aria-hidden="true" className="h-4 w-4 text-gray-400" />
              Manage account
            </button>
            <button
              role="menuitem"
              onClick={() => { setOpen(false); router.push("/dashboard/notifications"); }}
              disabled={!onboardingComplete}
              className="flex w-full items-center gap-2 px-3 py-2 text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-40 text-gray-700 hover:bg-gray-50 disabled:hover:bg-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-800"
            >
              <BellIcon aria-hidden="true" className="h-4 w-4 text-gray-400" />
              Notifications
            </button>
            <button
              role="menuitem"
              onClick={() => signOut(() => router.push("/"))}
              className="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-800"
            >
              <ArrowRightStartOnRectangleIcon aria-hidden="true" className="h-4 w-4 text-gray-400" />
              Sign out
            </button>
          </>
        );

        if (compact && dropRect) {
          return createPortal(
            <div
              id="user-nav-menu"
              role="menu"
              className="fixed z-9999 w-56 overflow-hidden rounded-md border border-gray-700 bg-white shadow-lg"
              style={dropUp
                ? { bottom: window.innerHeight - dropRect.top + 4, right: window.innerWidth - dropRect.right }
                : { top: dropRect.bottom + 4, right: window.innerWidth - dropRect.right }
              }
            >
              {menuContent}
            </div>,
            document.body
          );
        }

        return (
          <div
            id="user-nav-menu"
            role="menu"
            className={`absolute left-0 right-0 z-50 overflow-hidden rounded-md border border-gray-700 bg-white shadow-lg ${dropUp ? "bottom-full mb-1" : "top-full mt-1"}`}
          >
            {menuContent}
          </div>
        );
      })()}
    </div>
  );
}
