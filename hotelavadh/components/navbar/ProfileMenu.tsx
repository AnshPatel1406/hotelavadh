"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { User, LogOut, ChevronDown } from "lucide-react";

export default function ProfileMenu() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }

    window.addEventListener("click", handleClick);

    return () => window.removeEventListener("click", handleClick);
  }, []);

  return (
    <div ref={menuRef} className="relative z-[9999]">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 rounded-full border border-white/30 bg-white px-2 py-1 shadow-md transition hover:shadow-lg"
      >
        {session?.user?.image ? (
          <Image
            src={session.user.image}
            alt="Profile"
            width={36}
            height={36}
            className="rounded-full object-cover"
          />
        ) : (
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-200">
            <User className="h-5 w-5 text-gray-700" />
          </div>
        )}

        <ChevronDown size={18} className="text-gray-700" />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-60 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-2xl z-[99999]">

          {session ? (
            <>
              <div className="border-b px-5 py-4">
                <p className="font-semibold text-gray-900">
                  {session.user?.name}
                </p>

                <p className="truncate text-xs text-gray-500">
                  {session.user?.email}
                </p>
              </div>

              <Link
                href="/profile"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-5 py-3 text-sm font-medium text-gray-800 transition hover:bg-gray-100"
              >
                <User size={18} />
                Profile
              </Link>

              {((session.user as any)?.role === "admin" || (session.user as any)?.role === "reception") && (
                <Link
                  href="/dashboard"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-5 py-3 text-sm font-medium text-gray-800 transition hover:bg-gray-100"
                >
                  <LogOut className="rotate-180" size={18} />
                  Dashboard
                </Link>
              )}

              <button
                onClick={() => signOut()}
                className="flex w-full items-center gap-3 px-5 py-3 text-left text-sm font-medium text-red-600 transition hover:bg-red-50"
              >
                <LogOut size={18} />
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="block px-5 py-3 text-sm font-medium text-gray-800 transition hover:bg-gray-100"
            >
              Login
            </Link>
          )}

        </div>
      )}
    </div>
  );
}