"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, BedDouble, CalendarCheck, LogOut, User as UserIcon } from "lucide-react";
import { signOut, useSession } from "next-auth/react";

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const role = (session?.user as any)?.role;

  const links = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "Rooms", href: "/dashboard/rooms", icon: BedDouble },
    { name: "Bookings", href: "/dashboard/bookings", icon: CalendarCheck },
  ];

  return (
    <div className="flex h-full w-64 flex-col bg-gray-900 text-white">
      <div className="flex h-16 items-center justify-center border-b border-gray-800 px-6">
        <h2 className="text-lg font-bold tracking-tight">Avadh Dashboard</h2>
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-3">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`group flex items-center rounded-md px-3 py-2 text-sm font-medium ${
                  isActive
                    ? "bg-gray-800 text-white"
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                }`}
              >
                <link.icon
                  className={`mr-3 h-5 w-5 flex-shrink-0 ${
                    isActive ? "text-gray-300" : "text-gray-400 group-hover:text-gray-300"
                  }`}
                  aria-hidden="true"
                />
                {link.name}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="border-t border-gray-800 p-4">
        <div className="flex items-center gap-3 mb-4 px-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-800">
            <UserIcon className="h-5 w-5 text-gray-300" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-white">{session?.user?.name || "User"}</span>
            <span className="text-xs text-gray-400 capitalize">{role || "Staff"}</span>
          </div>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="group flex w-full items-center rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-white"
        >
          <LogOut className="mr-3 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-300" />
          Log Out
        </button>
      </div>
    </div>
  );
}
