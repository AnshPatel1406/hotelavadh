"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/rooms", label: "Rooms" },
  { href: "/dining", label: "Dining" },
  { href: "/banquet", label: "Banquet" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="w-full border-b">
      {/* Top bar (like Vintana) */}
      <div className="bg-muted/40">
        <div className="mx-auto max-w-6xl px-4 py-2 flex items-center justify-between text-sm">
          <div className="flex gap-4">
            <a className="hover:underline" href="tel:+919999999999">
              +91 99999 99999
            </a>
            <span className="text-muted-foreground hidden sm:inline">|</span>
            <a className="hover:underline hidden sm:inline" href="mailto:info@hotelavadh.com">
              info@hotelavadh.com
            </a>
          </div>
          <div className="hidden sm:flex gap-3 text-muted-foreground">
            <span>Comfort. Dining. Hospitality.</span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
        <Link href="/" className="font-semibold text-lg tracking-tight">
          Hotel Avadh
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`text-sm hover:underline ${active ? "font-medium" : "text-muted-foreground"}`}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-2">
          <Button asChild variant="outline">
            <a href="https://wa.me/919999999999" target="_blank" rel="noreferrer">
              WhatsApp
            </a>
          </Button>
          <Button asChild>
            <a href="/contact">Get Directions</a>
          </Button>
        </div>

        {/* Mobile nav */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline">Menu</Button>
            </SheetTrigger>
            <SheetContent side="right" className="p-0">
              <div className="p-4">
                <div className="font-semibold text-lg">Hotel Avadh</div>
                <div className="text-sm text-muted-foreground">Navigate</div>
              </div>
              <Separator />
              <div className="p-4 flex flex-col gap-3">
                {navLinks.map((l) => (
                  <Link key={l.href} href={l.href} className="text-sm">
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
    </header>
  );
}