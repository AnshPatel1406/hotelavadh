import Link from "next/link";
import { Separator } from "@/components/ui/separator";

export default function Footer() {
  return (
    <footer className="mt-12 border-t">
      {/* Top strip (same teal as navbar) */}
      <div className="bg-[#0F5C5C] text-white">
        <div className="mx-auto max-w-6xl px-4 py-10 grid gap-8 md:grid-cols-3">
          <div className="space-y-2">
            <div className="font-semibold text-lg tracking-tight">Hotel Avadh</div>
            <p className="text-sm text-white/80">
              Comfortable stays, great dining, and premium hospitality.
            </p>
          </div>

          <div className="space-y-2">
            <div className="font-medium">Contact</div>
            <div className="text-sm text-white/80 space-y-1">
              <a className="block hover:underline" href="tel:+919428504802">
                +91 94285 04802
              </a>
              <a className="block hover:underline" href="mailto:info@hotelavadh.com">
                info@hotelavadh.com
              </a>
              <div>Himmatnagar, Gujarat</div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="font-medium">Quick Links</div>
            <div className="text-sm text-white/80 grid gap-1">
              <Link className="hover:underline" href="/rooms">Rooms</Link>
              <Link className="hover:underline" href="/dining">Dining</Link>
              <Link className="hover:underline" href="/banquet">Banquet</Link>
              <Link className="hover:underline" href="/gallery">Gallery</Link>
              <Link className="hover:underline" href="/contact">Contact</Link>
            </div>
          </div>
        </div>
      </div>

      <Separator />

      {/* Bottom strip */}
      <div className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-4 text-xs text-muted-foreground flex justify-between items-center">
          <span>© {new Date().getFullYear()} Hotel Avadh</span>

          <span className="flex items-center gap-2">
            Built by
            <a
              href="https://www.linkedin.com/in/ansh-patel-7257aa25a/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline inline-flex items-center gap-1"
            >
              Ansh Patel
              {/* LinkedIn icon (no lucide dependency) */}
              <svg
                viewBox="0 0 24 24"
                className="w-4 h-4"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.35V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.6 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124zM6.814 20.452H3.86V9h2.954v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.727v20.545C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.273V1.727C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}