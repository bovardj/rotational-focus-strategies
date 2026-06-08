"use client";

import { useClerk, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  UserCircleIcon,
  ArrowRightStartOnRectangleIcon,
} from "@heroicons/react/24/outline";

export default function UserNav({ compact = false }: { compact?: boolean }) {
  const { user } = useUser();
  const { signOut, openUserProfile } = useClerk();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [dropUp, setDropUp] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

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
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleOpen() {
    if (ref.current) {
      const { bottom } = ref.current.getBoundingClientRect();
      setDropUp(window.innerHeight - bottom < 150);
    }
    setOpen((o) => !o);
  }

  return (
    <div ref={ref} className="relative">
      {compact ? (
        <button
          onClick={handleOpen}
          aria-label="Account"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-sm font-semibold text-white transition-colors hover:bg-white/30"
        >
          {initials}
        </button>
      ) : (
        <button
          onClick={handleOpen}
          className="flex h-[48px] w-full items-center gap-2 rounded-md bg-gray-100 px-3 font-medium transition-colors hover:bg-blue-50 hover:text-blue-700"
        >
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-semibold text-white">
            {initials}
          </div>
          <span className="flex-1 truncate text-left text-sm font-medium text-gray-700">
            {name}
          </span>
        </button>
      )}

      {open && (
        <div className={`absolute z-50 overflow-hidden rounded-md border border-gray-700 bg-white shadow-lg ${compact ? "right-0 w-56" : "left-0 right-0"} ${dropUp ? "bottom-full mb-1" : "top-full mt-1"}`}>
          <div className="border-b border-gray-100 px-3 py-2">
            <p className="truncate text-xs font-medium text-gray-800">{name}</p>
            {user?.primaryEmailAddress && (
              <p className="truncate text-xs text-gray-400">
                {user.primaryEmailAddress.emailAddress}
              </p>
            )}
          </div>
          <button
            onClick={() => { setOpen(false); openUserProfile(); }}
            className="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50"
          >
            <UserCircleIcon className="h-4 w-4 text-gray-400" />
            Manage account
          </button>
          <button
            onClick={() => signOut(() => router.push("/sign-in"))}
            className="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50"
          >
            <ArrowRightStartOnRectangleIcon className="h-4 w-4 text-gray-400" />
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
