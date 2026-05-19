import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";
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



/* ─── Page ─── */
export default function HomePage() {
  return (
    <div className="space-y-0">

      {/* ── Hero ── */}
      <section className="relative bg-[#1C1712] overflow-hidden rounded-2xl">
        {/* subtle gold radial glow */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_70%_50%,rgba(184,134,11,0.08)_0%,transparent_60%)]" />

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 px-8 md:px-14 py-16 md:py-20 items-center">

          {/* Left — copy */}
          <div className="space-y-6">
            {/* eyebrow */}
            <p className="flex items-center gap-3 text-[11px] tracking-[0.18em] uppercase text-[#D4A843] font-sans font-medium">
              Est. 2026 · Premium Hospitality
              <span className="block w-8 h-px bg-[#D4A843]" />
            </p>

            <h1 className="font-serif text-[2.8rem] md:text-[3.4rem] leading-[1.1] font-medium tracking-tight text-[#FAF7F2]">
              Comfort &{" "}
              <em className="font-serif italic text-[#D4A843] not-italic">Elegance</em>
              <br />Redefined.
            </h1>

            <p className="text-[15px] leading-[1.8] text-[#FAF7F2]/55 font-light max-w-sm">
              A premium stay experience with beautifully appointed rooms, exquisite dining, and the perfect banquet for every celebration.
            </p>

            <div className="flex flex-wrap gap-3 pt-1">
              <Button
                asChild
                className="bg-[#D4A843] text-[#1C1712] hover:bg-[#B8860B] rounded-none px-7 py-5 text-[13px] tracking-wide font-medium font-sans transition-colors"
              >
                <Link href="/rooms">Explore Rooms</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="rounded-none border-[#FAF7F2]/20 bg-transparent text-[#FAF7F2]/75 hover:bg-[#FAF7F2]/5 hover:border-[#FAF7F2]/40 px-7 py-5 text-[13px] tracking-wide font-sans transition-colors"
              >
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>

          {/* Right — image placeholder */}
          <div className="relative h-[260px] md:h-[320px] border border-[#D4A843]/20 rounded-sm overflow-hidden bg-white/[0.02] flex items-center justify-center">
            <Image src="/homepage_images/Gemini_Avadh.png" alt="Hotel exterior" fill className="object-cover" />
      
          </div>
        </div>

      
      </section>

      {/* ── Features ── */}
      <section className="pt-14 space-y-6">
        {/* header */}
        <div className="flex items-baseline justify-between border-b border-border pb-4">
          <h2 className="font-serif text-2xl font-medium text-foreground">Our Offerings</h2>
          <span className="text-[11px] tracking-[0.1em] uppercase text-muted-foreground">
            Rooms · Dining · Banquet
          </span>
        </div>

        {/* card grid — 1px-gap technique */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border rounded-sm overflow-hidden">
          {features.map((f) => (
            <div
              key={f.title}
              className="group relative bg-background hover:bg-secondary/40 transition-colors duration-300 p-8 overflow-hidden"
            >
              {/* decorative number */}
              <span className="absolute top-5 right-5 font-serif text-5xl font-light text-border select-none leading-none">
                {f.num}
              </span>

              {/* tag */}
              <span className="inline-block text-[10px] tracking-[0.16em] uppercase text-[#8B6508] dark:text-[#D4A843] border border-[#D4A843]/30 px-2.5 py-1 mb-5 rounded-sm">
                {f.tag}
              </span>

              <h3 className="font-serif text-xl font-medium mb-2.5">{f.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground font-light mb-6">{f.desc}</p>

              <Link
                href={f.href}
                className="inline-flex items-center gap-2 text-[11px] tracking-[0.1em] uppercase text-[#8B6508] dark:text-[#D4A843] font-medium group-hover:gap-3 transition-all"
              >
                {f.cta}
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </Link>

              {/* bottom gold reveal line */}
              <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-[#D4A843] group-hover:w-full transition-all duration-300" />
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
              className="bg-background hover:bg-secondary/40 transition-colors px-5 py-4 flex items-center gap-3 text-[13.5px] text-muted-foreground font-light"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4A843] flex-shrink-0" />
              {a}
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="pt-14">
        <div className="rounded-sm border border-[#D4A843]/25 bg-[#F5E6C0]/40 dark:bg-[#8B6508]/10 px-8 md:px-12 py-9 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <p className="text-[10px] tracking-[0.16em] uppercase text-[#8B6508] dark:text-[#D4A843] mb-1.5">
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
              className="rounded-none border-[#D4A843]/50 text-[#8B6508] dark:text-[#D4A843] hover:bg-[#D4A843]/10 hover:border-[#D4A843] px-6 text-[13px] tracking-wide font-sans transition-colors"
            >
              <a href="tel:+919426365544">Call Now</a>
            </Button>
            <Button
              asChild
              className="rounded-none bg-[#8B6508] text-[#FAF7F2] hover:bg-[#B8860B] px-6 text-[13px] tracking-wide font-sans transition-colors"
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
