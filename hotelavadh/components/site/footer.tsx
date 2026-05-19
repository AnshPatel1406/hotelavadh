import Link from "next/link";
import { Separator } from "@/components/ui/separator";

export default function Footer() {
  return (
    <footer className="border-t mt-12">
      <div className="mx-auto max-w-6xl px-4 py-10 grid gap-8 md:grid-cols-3">
        <div className="space-y-2">
          <div className="font-semibold text-lg">Hotel Avadh</div>
          <p className="text-sm text-muted-foreground">
            Comfortable stays, great dining, and premium hospitality.
          </p>
        </div>

        <div className="space-y-2">
          <div className="font-medium">Contact</div>
          <div className="text-sm text-muted-foreground space-y-1">
            <a className="block hover:underline" href="tel:+919999999999">+91 99999 99999</a>
            <a className="block hover:underline" href="mailto:info@hotelavadh.com">info@hotelavadh.com</a>
            <div>Himmatnagar, Gujarat</div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="font-medium">Quick Links</div>
          <div className="text-sm text-muted-foreground grid gap-1">
            <Link className="hover:underline" href="/rooms">Rooms</Link>
            <Link className="hover:underline" href="/dining">Dining</Link>
            <Link className="hover:underline" href="/banquet">Banquet</Link>
            <Link className="hover:underline" href="/gallery">Gallery</Link>
            <Link className="hover:underline" href="/contact">Contact</Link>
          </div>
        </div>
      </div>
      <Separator />
      <div className="mx-auto max-w-6xl px-4 py-4 text-xs text-muted-foreground flex justify-between">
        <span>© {new Date().getFullYear()} Hotel Avadh</span>
        <span>Built with Next.js + shadcn/ui</span>
      </div>
    </footer>
  );
}