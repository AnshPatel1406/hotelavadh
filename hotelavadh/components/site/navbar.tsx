"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import ProfileMenu from "@/components/navbar/ProfileMenu";
import { Mail, Menu, ChevronRight } from "lucide-react";

const leftLinks = [
  { href: "/", label: "Home" },
  { href: "/dining", label: "Dining" },
  { href: "/banquet", label: "Banquet & Lawn" },
];

const rightLinks = [
  { href: "/rooms", label: "Rooms" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" },
];

const allNavLinks = [...leftLinks, ...rightLinks];

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const NavItem = ({ href, label }: { href: string; label: string }) => {
    const active = pathname === href;
    return (
      <Link
        href={href}
        className={[
          "text-[13px] uppercase tracking-[0.18em] transition-colors",
          active ? "text-foreground border-b border-foreground pb-1" : "text-muted-foreground hover:text-foreground",
        ].join(" ")}
      >
        {label}
      </Link>
    );
  };

  return (
    <header className="w-full">
      {/* Whole header wrapper so desktop logo can overlap both bars */}
      <div className="relative border-b">
        {/* TOP STRIP */}
        <div className="bg-[#0F5C5C] text-white">
          <div className="mx-auto max-w-6xl px-3 sm:px-4 h-11 sm:h-12 flex items-center justify-between text-xs">
            {/* Left: Email (always visible on mobile & desktop) */}
            <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
              <Mail className="w-3.5 h-3.5 text-[#E6CA65] shrink-0" />
              <a
                className="hover:underline text-[11px] sm:text-xs text-white/95 font-medium tracking-wide truncate"
                href="mailto:info@hotelavadh.co.in"
              >
                info@hotelavadh.co.in
              </a>
            </div>

            {/* Right: Tagline & Profile (always visible on mobile & desktop) */}
            <div className="flex items-center gap-2 sm:gap-5 shrink-0 ml-2">
              <span className="text-[10px] sm:text-xs tracking-[0.12em] sm:tracking-[0.16em] uppercase text-white/90 font-medium">
                Premium Hospitality
              </span>

              <ProfileMenu />
            </div>
          </div>
        </div>

        {/* BOTTOM STRIP */}
        <div className="bg-white">
          <div className="mx-auto max-w-6xl px-4 h-[70px] md:h-16 flex items-center justify-between">
            {/* LEFT LINKS (Desktop) */}
            <nav className="hidden md:flex items-center gap-10">
              {leftLinks.map((l) => (
                <NavItem key={l.href} href={l.href} label={l.label} />
              ))}
            </nav>

            {/* CENTER LOGO (Desktop: overlaps both strips gracefully without overflowing) */}
            <Link
              href="/"
              className="hidden md:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[48%] z-20"
              aria-label="Go to Home"
            >
              <div className="relative w-[86px] h-[95px]">
                <Image
                  src="/logo.png"
                  alt="Hotel Avadh"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </Link>

            {/* RIGHT LINKS (Desktop) */}
            <nav className="hidden md:flex items-center gap-10">
              {rightLinks.map((l) => (
                <NavItem key={l.href} href={l.href} label={l.label} />
              ))}
            </nav>

            {/* MOBILE NAVBAR (Logo Centered + 3-Line Hamburger Menu) */}
            <div className="md:hidden flex items-center justify-between w-full h-full">
              {/* Left spacer to keep logo centered */}
              <div className="w-10" />

              {/* Centered Mobile Logo (Prominently sized and sharp) */}
              <Link href="/" className="relative flex items-center justify-center py-1" aria-label="Go to Home">
                <div className="relative w-[78px] h-[64px]">
                  <Image
                    src="/logo.png"
                    alt="Hotel Avadh"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </Link>

              {/* 3 Horizontal Lines Fancy Hamburger Menu Button */}
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <button
                    type="button"
                    aria-label="Open Navigation Menu"
                    className="flex items-center justify-center w-10 h-10 rounded-xl border border-gray-200 bg-stone-50 text-[#0F5C5C] shadow-xs hover:bg-[#0F5C5C] hover:text-white transition-all active:scale-95 focus:outline-none"
                  >
                    <Menu className="w-5 h-5 stroke-[2.2]" />
                  </button>
                </SheetTrigger>

                <SheetContent side="right" className="p-0 flex flex-col justify-between w-[300px] sm:w-[350px]">
                  <div>
                    {/* Drawer Header */}
                    <div className="p-4 border-b bg-stone-50/50">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 flex items-center justify-center">
                          <Image
                            src="/logo.png"
                            alt="Hotel Avadh"
                            width={40}
                            height={40}
                            className="object-contain"
                          />
                        </div>
                        <div>
                          <div className="font-serif font-bold text-sm tracking-wider text-gray-900">HOTEL AVADH</div>
                          <div className="text-[10px] tracking-widest uppercase text-[#0F5C5C] font-semibold">Premium Hospitality</div>
                        </div>
                      </div>
                    </div>

                    {/* Nav Links with auto-close on selection */}
                    <div className="p-4 flex flex-col gap-1">
                      <div className="text-[11px] font-semibold tracking-wider text-gray-400 uppercase px-3 pb-1">
                        Navigation
                      </div>
                      {allNavLinks.map((l) => {
                        const active = pathname === l.href;
                        return (
                          <Link
                            key={l.href}
                            href={l.href}
                            onClick={() => setIsOpen(false)}
                            className={[
                              "flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors",
                              active
                                ? "bg-[#0F5C5C] text-white font-semibold shadow-xs"
                                : "text-gray-700 hover:bg-gray-100 hover:text-[#0F5C5C]",
                            ].join(" ")}
                          >
                            <span>{l.label}</span>
                            <ChevronRight className={`w-4 h-4 ${active ? "text-[#E6CA65]" : "text-gray-400"}`} />
                          </Link>
                        );
                      })}
                    </div>
                  </div>

                  {/* Drawer Footer Actions with auto-close on selection */}
                  <div className="p-4 border-t bg-stone-50/80 flex flex-col gap-2.5">
                    <Button
                      asChild
                      variant="outline"
                      className="w-full justify-center h-10 border-[#0F5C5C]/30 text-[#0F5C5C] hover:bg-[#0F5C5C]/5"
                      onClick={() => setIsOpen(false)}
                    >
                      <a href="https://wa.me/919428504802" target="_blank" rel="noreferrer">
                        WhatsApp Concierge
                      </a>
                    </Button>
                    <Button
                      asChild
                      className="w-full justify-center h-10 bg-[#0F5C5C] hover:bg-[#0C4A4A] text-white"
                      onClick={() => setIsOpen(false)}
                    >
                      <Link href="/contact" onClick={() => setIsOpen(false)}>
                        Get Directions
                      </Link>
                    </Button>
                    <div className="text-[11px] text-center text-gray-500 pt-1 space-y-0.5">
                      <div>Himmatnagar-Idar Highway, Gujarat</div>
                      <a href="mailto:info@hotelavadh.co.in" className="text-[#0F5C5C] hover:underline block font-medium">
                        info@hotelavadh.co.in
                      </a>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}