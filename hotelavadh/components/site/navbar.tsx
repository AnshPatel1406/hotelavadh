"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";

const leftLinks = [
  { href: "/", label: "Home" },
  { href: "/dining", label: "Dining" },
  { href: "/banquet", label: "Banquet" },
];

const rightLinks = [
  { href: "/rooms", label: "Rooms" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const pathname = usePathname();

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
      {/* Whole header wrapper so logo can overlap both bars */}
      <div className="relative border-b">
        {/* TOP STRIP */}
        <div className="bg-[#0F5C5C] text-white">
          <div className="mx-auto max-w-6xl px-4 h-12 flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <a className="hover:underline" href="tel:+919999999999">
                +91 99999 99999
              </a>
              <span className="opacity-50 hidden sm:inline">|</span>
              <a className="hover:underline hidden sm:inline" href="mailto:info@hotelavadh.com">
                info@hotelavadh.com
              </a>
            </div>

            {/* Optional right side (you can add socials later) */}
            <div className="hidden sm:flex items-center gap-3 opacity-90">
              <span className="text-xs tracking-wide">Premium Hospitality</span>
            </div>
          </div>
        </div>

        {/* BOTTOM STRIP */}
        <div className="bg-white">
          <div className="mx-auto max-w-6xl px-4 h-16 flex items-center justify-between">
            {/* LEFT LINKS (Desktop) */}
            <nav className="hidden md:flex items-center gap-10">
              {leftLinks.map((l) => (
                <NavItem key={l.href} href={l.href} label={l.label} />
              ))}
            </nav>

            {/* CENTER LOGO (overlaps both strips) */}
            <Link
  href="/"
  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[48%] z-20"
  aria-label="Go to Home"
>
  <div className="relative w-[180px] h-[200px] md:w-[160px] md:h-[170px]">
    <Image
      src="/logo.png"
      alt="Hotel Avadh"
      fill
      className="object-fill"
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

            {/* MOBILE MENU */}
            <div className="md:hidden w-full flex items-center justify-between">
              <div className="text-sm font-medium">Menu</div>

              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="h-9">
                    Open
                  </Button>
                </SheetTrigger>

                <SheetContent side="right" className="p-0">
                  <div className="p-4">
                    <div className="font-semibold text-lg">Hotel Avadh</div>
                    <div className="text-sm text-muted-foreground">Navigate</div>
                  </div>
                  <Separator />
                  <div className="p-4 flex flex-col gap-3">
                    {[...leftLinks, ...rightLinks].map((l) => (
                      <Link key={l.href} href={l.href} className="text-sm hover:underline">
                        {l.label}
                      </Link>
                    ))}
                    <Separator className="my-2" />
                    <Button asChild variant="outline">
                      <a href="https://wa.me/919999999999" target="_blank" rel="noreferrer">
                        WhatsApp
                      </a>
                    </Button>
                    <Button asChild>
                      <a href="/contact">Get Directions</a>
                    </Button>
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