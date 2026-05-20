import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
  AirVent,
  MonitorPlay,
  Sparkles,
  UserCheck,
  Sofa,
  ParkingCircle,
  Wifi,
  LayoutDashboard,
  Church,
  Handshake,
  Gift,
  Briefcase,
  Diamond,
  Users,
} from "lucide-react";

const eventTypes = [
  { title: "Wedding", icon: Church, desc: "Ceremonies & receptions" },
  { title: "Reception", icon: Handshake, desc: "Post-ceremony gatherings" },
  { title: "Birthday", icon: Gift, desc: "Milestone celebrations" },
  { title: "Corporate", icon: Briefcase, desc: "Business events" },
  { title: "Engagement", icon: Diamond, desc: "Proposal celebrations" },
  { title: "Get-together", icon: Users, desc: "Social gatherings" },
];

const banquetAmenities = [
  { title: "Fully Air-Conditioned", icon: AirVent },
  { title: "Audio Visual Setup", icon: MonitorPlay },
  { title: "Decorative Stage", icon: Sparkles },
  { title: "Professional Staff", icon: UserCheck },
  { title: "Luxurious Décor", icon: Sofa },
  { title: "Valet Parking", icon: ParkingCircle },
  { title: "High-Speed Internet", icon: Wifi },
  { title: "Spacious Hall", icon: LayoutDashboard },
];

export default function BanquetPage() {
  return (
    <div className="space-y-16">

      {/* ── HERO ── */}
      <div className="relative space-y-5 pt-2">
        <Badge
          variant="outline"
          className="rounded-full px-4 py-1 text-xs tracking-[0.18em] uppercase font-medium border-amber-300 text-amber-700 bg-amber-50"
        >
          Banquet &amp; Events
        </Badge>

        <h1
          className="text-4xl md:text-6xl font-light tracking-tight leading-[1.1]"
          style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
        >
          Where Every
          <br />
          <span className="italic text-muted-foreground">Occasion</span> Shines
        </h1>

        <p className="text-muted-foreground max-w-xl leading-relaxed text-base md:text-lg">
          Premium arrangements, elegant ambience, and flawless hospitality —
          crafted to make your celebration truly unforgettable.
        </p>

        <div className="pt-2 flex flex-wrap gap-3">
          <Button
            asChild
            className="rounded-full px-6 bg-foreground text-background hover:bg-foreground/90"
          >
            <a href="/contact">Enquire Now</a>
          </Button>
          <Button asChild variant="outline" className="rounded-full px-6">
            <a href="#gallery">View Gallery</a>
          </Button>
        </div>

        {/* decorative rule */}
        <div className="absolute -bottom-8 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

      {/* ── EVENT TYPES ── */}
      <div className="space-y-6">
        <div className="flex items-end justify-between">
          <h2
            className="text-2xl md:text-3xl font-light tracking-tight"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            Events We Host
          </h2>
          <span className="hidden md:block text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Every Occasion
          </span>
        </div>

        <div className="grid gap-3 grid-cols-2 md:grid-cols-3">
          {eventTypes.map((event) => {
            const Icon = event.icon;
            return (
              <div
                key={event.title}
                className="group relative border border-border/60 rounded-2xl p-5 md:p-7 flex flex-col gap-3 overflow-hidden transition-all hover:border-foreground/20 hover:shadow-sm cursor-default bg-background"
              >
                {/* subtle top-left accent */}
                <div className="absolute top-0 left-0 w-16 h-16 rounded-br-full bg-muted/30 -translate-x-4 -translate-y-4 transition group-hover:scale-110" />

                <div className="relative z-10 flex items-center justify-between">
                  <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center">
                    <Icon className="h-5 w-5 text-foreground/70" />
                  </div>
                  <span className="text-[10px] uppercase tracking-widest text-muted-foreground opacity-0 group-hover:opacity-100 transition">
                    →
                  </span>
                </div>

                <div className="relative z-10">
                  <div className="font-medium text-sm md:text-base">{event.title}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{event.desc}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── AMENITIES ── */}
      <div className="space-y-6">
        <div className="flex items-end justify-between">
          <h2
            className="text-2xl md:text-3xl font-light tracking-tight"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            What's Included
          </h2>
          <span className="hidden md:block text-xs uppercase tracking-[0.2em] text-muted-foreground">
            All Amenities
          </span>
        </div>

        {/* alternating pill-list style */}
        <div className="grid gap-2 grid-cols-1 md:grid-cols-2">
          {banquetAmenities.map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="flex items-center gap-4 rounded-xl border border-border/50 bg-muted/20 px-5 py-4 hover:bg-muted/40 transition"
              >
                <div className="shrink-0 h-10 w-10 rounded-lg bg-background border border-border/60 flex items-center justify-center shadow-sm">
                  <Icon className="h-4 w-4 text-foreground/70" />
                </div>
                <span className="text-sm md:text-base font-medium">{item.title}</span>
                <span className="ml-auto text-xs text-muted-foreground font-mono">
                 {/* {String(i + 1).padStart(2, "0")} // numbering can be added if desired */}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── GALLERY ── */}
      <div className="space-y-6" id="gallery">
        <div className="flex items-end justify-between">
          <h2
            className="text-2xl md:text-3xl font-light tracking-tight"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            Gallery
          </h2>
          <span className="hidden md:block text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Event Moments
          </span>
        </div>

        {/* Masonry-style varied heights */}
        <div className="grid gap-3 grid-cols-2 md:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className={[
                "rounded-2xl border bg-muted/50 hover:bg-muted/80 transition hover:scale-[1.02] cursor-pointer",
                // vary heights for masonry feel
                i === 0 || i === 5 ? "h-48 md:h-56" : "h-32 md:h-40",
              ].join(" ")}
            />
          ))}
        </div>
      </div>

      {/* ── CTA STRIP ── */}
      <div className="rounded-3xl bg-foreground text-background px-8 py-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-background/50 mb-2">
            Ready to celebrate?
          </p>
          <h3
            className="text-2xl md:text-3xl font-light leading-tight"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            Let us make it
            <br />
            <span className="italic">extraordinary.</span>
          </h3>
        </div>
        <Button
          asChild
          size="lg"
          className="shrink-0 rounded-full bg-background text-foreground hover:bg-background/90 px-8 self-start md:self-auto"
        >
          <a href="/contact">Get In Touch →</a>
        </Button>
      </div>

    </div>
  );
}