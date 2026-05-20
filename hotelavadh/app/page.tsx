import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

/* ─── Data ─── */
const features = [
  {
    num: "01",
    tag: "Stay",
    title: "Rooms & Suites",
    desc: "Comfortable rooms for solo, family & premium stays. Each space is designed for rest and refinement.",
    href: "/rooms",
    cta: "Explore rooms",
  },
  {
    num: "02",
    tag: "Eat",
    title: "Dining",
    desc: "Delicious veg & non-veg options served with care. A warm ambience that makes every meal special.",
    href: "/dining",
    cta: "View menu",
  },
  {
    num: "03",
    tag: "Celebrate",
    title: "Banquet Hall",
    desc: "The perfect venue for weddings, parties & corporate events — tailored to your vision.",
    href: "/banquet",
    cta: "Book venue",
  },
];

const amenities = [
  "Free Wi-Fi",
  "Parking",
  "Power Backup",
  "Restaurant",
  "Room Service",
  "Travel Desk",
  "CCTV Security",
  "Banquet Hall",
];

export default function HomePage() {
  return (
    <div className="space-y-0">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden rounded-2xl border bg-white">
        {/* subtle teal glow */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_60%_40%,rgba(15,92,92,0.18)_0%,transparent_60%)]" />
        {/* subtle gradient wash */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white via-white to-[#0F5C5C]/[0.04]" />

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 px-8 md:px-14 py-16 md:py-20 items-center">
          {/* Left — copy */}
          <div className="space-y-6">
            <p className="flex items-center gap-3 text-[11px] tracking-[0.18em] uppercase text-[#0F5C5C] font-sans font-medium">
              Est. 2026 · Premium Hospitality
              <span className="block w-8 h-px bg-[#0F5C5C]/70" />
            </p>

            <h1 className="font-serif text-[2.6rem] md:text-[3.3rem] leading-[1.1] font-medium tracking-tight text-foreground">
              Comfort &{" "}
              <span className="text-[#0F5C5C]">Elegance</span>
              <br />
              Redefined.
            </h1>

            <p className="text-[15px] leading-[1.8] text-muted-foreground font-light max-w-sm">
              A premium stay experience with beautifully appointed rooms, exquisite dining, and the perfect banquet for every celebration.
            </p>

            <div className="flex flex-wrap gap-3 pt-1">
              <Button
                asChild
                className="bg-[#0F5C5C] text-white hover:bg-[#0B4A4A] rounded-none px-7 py-5 text-[13px] tracking-wide font-medium font-sans transition-colors"
              >
                <Link href="/rooms">Explore Rooms</Link>
              </Button>

              <Button
                asChild
                variant="outline"
                className="rounded-none border-[#0F5C5C]/30 bg-transparent text-[#0F5C5C] hover:bg-[#0F5C5C]/5 hover:border-[#0F5C5C]/50 px-7 py-5 text-[13px] tracking-wide font-sans transition-colors"
              >
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>

          {/* Right — image */}
          <div className="relative h-[260px] md:h-[320px] border border-[#0F5C5C]/20 rounded-sm overflow-hidden bg-[#0F5C5C]/[0.03]">
            <Image
              src="/homepage_images/Gemini_Avadh.png"
              alt="Hotel exterior"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="pt-14 space-y-6">
        <div className="flex items-baseline justify-between border-b border-border pb-4">
          <h2 className="font-serif text-2xl font-medium text-foreground">Our Offerings</h2>
          <span className="text-[11px] tracking-[0.1em] uppercase text-muted-foreground">
            Rooms · Dining · Banquet
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border rounded-sm overflow-hidden">
          {features.map((f) => (
            <div
              key={f.title}
              className="group relative bg-background hover:bg-[#0F5C5C]/[0.04] transition-colors duration-300 p-8 overflow-hidden"
            >
              <span className="absolute top-5 right-5 font-serif text-5xl font-light text-border select-none leading-none">
                {f.num}
              </span>

              <span className="inline-block text-[10px] tracking-[0.16em] uppercase text-[#0F5C5C] border border-[#0F5C5C]/25 px-2.5 py-1 mb-5 rounded-sm">
                {f.tag}
              </span>

              <h3 className="font-serif text-xl font-medium mb-2.5">{f.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground font-light mb-6">{f.desc}</p>

              <Link
                href={f.href}
                className="inline-flex items-center gap-2 text-[11px] tracking-[0.1em] uppercase text-[#0F5C5C] font-medium group-hover:gap-3 transition-all"
              >
                {f.cta}
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </Link>

              <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-[#0F5C5C] group-hover:w-full transition-all duration-300" />
            </div>
          ))}
        </div>
      </section>

      {/* ── Amenities ── */}
      <section className="pt-14 space-y-6">
        <div className="flex items-baseline justify-between border-b border-border pb-4">
          <h2 className="font-serif text-2xl font-medium text-foreground">Amenities</h2>
          <span className="text-[11px] tracking-[0.1em] uppercase text-muted-foreground">
            Included with every stay
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border rounded-sm overflow-hidden">
          {amenities.map((a) => (
            <div
              key={a}
              className="bg-background hover:bg-[#0F5C5C]/[0.04] transition-colors px-5 py-4 flex items-center gap-3 text-[13.5px] text-muted-foreground font-light"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#0F5C5C] flex-shrink-0" />
              {a}
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="pt-14">
        <div className="rounded-sm border border-[#0F5C5C]/20 bg-[#0F5C5C]/[0.04] px-8 md:px-12 py-9 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <p className="text-[10px] tracking-[0.16em] uppercase text-[#0F5C5C] mb-1.5">
              Quick Booking
            </p>
            <p className="font-serif text-2xl font-medium text-foreground mb-1">Need a reservation?</p>
            <p className="text-sm text-muted-foreground font-light">
              Call or WhatsApp us — we'll get you sorted instantly.
            </p>
          </div>

          <div className="flex gap-3 flex-shrink-0">
            <Button
              asChild
              variant="outline"
              className="rounded-none border-[#0F5C5C]/35 text-[#0F5C5C] hover:bg-[#0F5C5C]/5 hover:border-[#0F5C5C]/55 px-6 text-[13px] tracking-wide font-sans transition-colors"
            >
              <a href="tel:+919426365544">Call Now</a>
            </Button>

            <Button
              asChild
              className="rounded-none bg-[#0F5C5C] text-white hover:bg-[#0B4A4A] px-6 text-[13px] tracking-wide font-sans transition-colors"
            >
              <a href="https://wa.me/919426365544" target="_blank" rel="noreferrer">
                WhatsApp
              </a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}