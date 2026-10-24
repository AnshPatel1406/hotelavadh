"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BedDouble,
  CalendarCheck,
  BarChart3,
  LogOut,
  User as UserIcon,
  Shield,
  ArrowUpRight,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";

export function DashboardTopNav() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const role = (session?.user as any)?.role;

  const links = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "Rooms", href: "/dashboard/rooms", icon: BedDouble },
    { name: "Bookings", href: "/dashboard/bookings", icon: CalendarCheck },
    { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  ];

  return (
    <header className="sticky top-0 z-40 w-full rounded-2xl border border-stone-200/90 bg-white/95 backdrop-blur-md shadow-sm mb-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between px-4 sm:px-6 py-3 gap-3">
        {/* Left: Branding & Role */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-stone-900 text-white shadow-sm">
              <Shield className="h-4 w-4 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-stone-900 tracking-tight">
                  Hotel Avadh
                </span>
                <span className="rounded-full bg-stone-100 border border-stone-200 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-stone-700">
                  {role || "Staff"}
                </span>
              </div>
              <p className="text-[11px] text-stone-500 hidden sm:block">
                Management Portal
              </p>
            </div>
          </div>

          {/* Quick exit on mobile */}
          <Link
            href="/"
            className="md:hidden flex items-center gap-1 text-xs text-stone-500 hover:text-stone-900"
          >
            <span>Live Site</span>
            <ArrowUpRight className="h-3 w-3" />
          </Link>
        </div>

        {/* Center: Horizontal Tabs (Overview, Rooms, Bookings, Analytics) */}
        <nav className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {links.map((link) => {
            const isActive =
              link.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(link.href);

            const Icon = link.icon;

            return (
              <Link
                key={link.name}
                href={link.href}
                className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-medium transition whitespace-nowrap ${
                  isActive
                    ? "bg-stone-900 text-white shadow-sm"
                    : "text-stone-600 hover:bg-stone-100 hover:text-stone-900"
                }`}
              >
                <Icon
                  className={`h-4 w-4 ${
                    isActive ? "text-amber-300" : "text-stone-400"
                  }`}
                />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right: Staff Info & Actions */}
        <div className="hidden md:flex items-center gap-3">
          <div className="flex items-center gap-2 border-r border-stone-200 pr-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-stone-100 border border-stone-200 text-stone-700">
              <UserIcon className="h-3.5 w-3.5" />
            </div>
            <div className="text-left">
              <p className="text-xs font-semibold text-stone-900 leading-none">
                {session?.user?.name || "Staff Member"}
              </p>
              <p className="text-[10px] text-stone-500 capitalize leading-tight mt-0.5">
                {role || "Staff"}
              </p>
            </div>
          </div>

          <Link
            href="/"
            className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs text-stone-600 hover:bg-stone-100 hover:text-stone-900 transition"
            title="View Live Website"
          >
            <span>Website</span>
            <ArrowUpRight className="h-3.5 w-3.5 text-stone-400" />
          </Link>

          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="inline-flex items-center gap-1.5 rounded-lg border border-stone-200 bg-white px-2.5 py-1.5 text-xs font-medium text-rose-600 hover:bg-rose-50 hover:border-rose-200 transition shadow-2xs"
            title="Log out"
          >
            <LogOut className="h-3.5 w-3.5 text-rose-500" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}
