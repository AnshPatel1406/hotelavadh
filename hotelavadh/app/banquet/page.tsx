import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  AirVent,
  MonitorPlay,
  Sparkles,
  UserCheck,
  Sofa,
  ParkingCircle,
  Wifi,
  Church,
  Handshake,
  Gift,
  Briefcase,
  Diamond,
  Users,
  Trees,
  Building2,
  Music,
  Check,
  ArrowRight,
} from "lucide-react";

const venues = [
  {
    id: "banquet",
    name: "Royal AC Banquet Hall",
    tagline: "Indoor Elegance & Climate-Controlled Comfort",
    icon: Building2,
    badge: "Indoor • Fully Air-Conditioned",
    capacity: "50 to 450 Guests",
    area: "4,500+ Sq. Ft.",
    desc: "A luxurious indoor setting featuring grand crystal chandeliers, high ceilings, centralized air-conditioning, and professional stage setup. Ideal for engagement ceremonies, corporate seminars, birthday parties, and intimate receptions.",
    highlights: [
      "Centralized High-Power Air Conditioning",
      "Integrated High-Fidelity Audio & Projector Setup",
      "Decorated VIP Stage with Adjustable Mood Lighting",
      "Dedicated Bridal & Groom Dressing Rooms",
      "In-House Buffet & Fine Dining Counter Area",
    ],
  },
  {
    id: "party-plot",
    name: "Grand Party Plot & Royal Lawn",
    tagline: "Majestic Open-Air Celebrations Under the Stars",
    icon: Trees,
    badge: "Open-Air • Lush Green Lawn",
    capacity: "400 to 2,000+ Guests",
    area: "35,000+ Sq. Ft.",
    desc: "An expansive manicured green landscape surrounded by natural beauty on the Himmatnagar-Idar Highway. Perfect for grand destination weddings, high-energy Sangeet & Garba nights, lavish receptions, and mega cultural events.",
    highlights: [
      "Lush Manicured Natural Turf with Open Sky Ambience",
      "Vast Area for Royal Mandap & Mega Stage Setups",
      "Spacious Dining Pavilions for 1000+ Simultaneous Diners",
      "Massive Valet Parking Space for 250+ Vehicles",
      "Stunning Ambient Architectural Night Lighting",
    ],
  },
];

const eventTypes = [
  { title: "Grand Weddings", icon: Church, desc: "Traditional ceremonies & royal mandap on the lawn" },
  { title: "Sangeet & Garba", icon: Music, desc: "High-energy musical nights under the stars" },
  { title: "Receptions", icon: Handshake, desc: "Lavish post-wedding feasts & celebrations" },
  { title: "Ring Ceremonies", icon: Diamond, desc: "Intimate family engagements in the AC banquet" },
  { title: "Milestone Birthdays", icon: Gift, desc: "Themed birthday bashes & family reunions" },
  { title: "Corporate Conclaves", icon: Briefcase, desc: "Business seminars, dealer meets & product launches" },
];

const sharedAmenities = [
  { title: "Fully Air-Conditioned Hall", icon: AirVent },
  { title: "Acoustic Audio-Visual Rig", icon: MonitorPlay },
  { title: "Custom Theme Décor & Lighting", icon: Sparkles },
  { title: "Experienced Hospitality Crew", icon: UserCheck },
  { title: "Luxurious Lounge & Seating", icon: Sofa },
  { title: "Expansive Valet Parking", icon: ParkingCircle },
  { title: "Dedicated High-Speed Wi-Fi", icon: Wifi },
  { title: "24/7 Power Backup Facility", icon: Sparkles },
];

export default function BanquetPage() {
  return (
    <div className="space-y-16 pb-12">
      {/* ── HERO ── */}
      <div className="relative space-y-5 pt-2">
        <Badge
          variant="outline"
          className="rounded-full px-4 py-1 text-xs tracking-[0.18em] uppercase font-medium border-amber-300 text-amber-700 bg-amber-50"
        >
          Venues &amp; Celebrations
        </Badge>

        <h1
          className="text-4xl md:text-6xl font-light tracking-tight leading-[1.1]"
          style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
        >
          Grand Banquet Hall
          <br />
          <span className="italic text-muted-foreground">&amp; Open-Air Party Plot</span>
        </h1>

        <p className="text-muted-foreground max-w-2xl leading-relaxed text-base md:text-lg">
          Whether you envision an intimate indoor gathering in our fully air-conditioned banquet hall or a royal wedding celebration with 2,000+ guests under the open sky on our lush green party plot, Hotel Avadh provides the perfect canvas.
        </p>

        <div className="pt-2 flex flex-wrap gap-3">
          <Button
            asChild
            className="rounded-full px-6 bg-[#0F5C5C] hover:bg-[#0C4A4A] text-white shadow-sm"
          >
            <a
              href="https://wa.me/919428504802?text=Hello%20Hotel%20Avadh%20Team!%20I%20would%20like%20to%20enquire%20about%20booking%20the%20Banquet%20Hall%20/%20Party%20Plot%20for%20an%20event."
              target="_blank"
              rel="noreferrer"
            >
              Enquire on WhatsApp
            </a>
          </Button>
          <Button asChild variant="outline" className="rounded-full px-6 border-gray-300 hover:bg-stone-50">
            <Link href="/contact">Schedule Site Visit</Link>
          </Button>
        </div>

        {/* decorative rule */}
        <div className="absolute -bottom-8 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

      {/* ── DUAL VENUES SHOWCASE ── */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-2">
          <div>
            <h2
              className="text-2xl md:text-4xl font-light tracking-tight text-gray-900"
              style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
            >
              Two Distinct Venues. Infinite Possibilities.
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Select the ideal setting for your milestone occasion.
            </p>
          </div>
          <span className="text-xs uppercase tracking-[0.2em] text-[#0F5C5C] font-semibold">
            Indoor &amp; Outdoor Spaces
          </span>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {venues.map((venue) => {
            const Icon = venue.icon;
            return (
              <div
                key={venue.id}
                className="rounded-3xl border border-border/80 bg-gradient-to-b from-stone-50/60 to-white p-7 md:p-8 flex flex-col justify-between shadow-sm hover:shadow-md transition-all hover:border-[#0F5C5C]/40"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-[#0F5C5C]/10 text-[#0F5C5C] px-3.5 py-1 text-xs font-semibold">
                      {venue.badge}
                    </span>
                    <div className="h-10 w-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-[#0F5C5C] shadow-xs">
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>

                  <div>
                    <h3
                      className="text-2xl font-serif font-bold text-gray-900"
                      style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
                    >
                      {venue.name}
                    </h3>
                    <p className="text-xs font-medium uppercase tracking-wider text-amber-700 mt-1">
                      {venue.tagline}
                    </p>
                  </div>

                  <p className="text-sm text-gray-600 leading-relaxed">
                    {venue.desc}
                  </p>

                  <div className="grid grid-cols-2 gap-3 py-2 border-y border-gray-200/60">
                    <div className="bg-white rounded-xl p-3 border border-gray-100">
                      <div className="text-[11px] text-gray-500 uppercase tracking-wider">Capacity</div>
                      <div className="text-sm font-bold text-gray-900 mt-0.5">{venue.capacity}</div>
                    </div>
                    <div className="bg-white rounded-xl p-3 border border-gray-100">
                      <div className="text-[11px] text-gray-500 uppercase tracking-wider">Space Area</div>
                      <div className="text-sm font-bold text-gray-900 mt-0.5">{venue.area}</div>
                    </div>
                  </div>

                  <div className="space-y-2 pt-1">
                    <div className="text-xs font-semibold text-gray-900 uppercase tracking-wider">
                      Key Highlights
                    </div>
                    <ul className="space-y-1.5">
                      {venue.highlights.map((h, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-gray-600">
                          <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-gray-100">
                  <Button
                    asChild
                    variant="outline"
                    className="w-full justify-center rounded-xl h-10 border-[#0F5C5C]/30 text-[#0F5C5C] hover:bg-[#0F5C5C] hover:text-white transition-colors"
                  >
                    <a
                      href={`https://wa.me/919428504802?text=Hello%20Hotel%20Avadh!%20I%20am%20interested%20in%20reserving%20the%20${encodeURIComponent(venue.name)}%20for%20my%20event.`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Enquire for {venue.name} <ArrowRight className="h-3.5 w-3.5 ml-1" />
                    </a>
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
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
            Customised Celebrations
          </span>
        </div>

        <div className="grid gap-3 grid-cols-2 md:grid-cols-3">
          {eventTypes.map((event) => {
            const Icon = event.icon;
            return (
              <div
                key={event.title}
                className="group relative border border-border/60 rounded-2xl p-5 md:p-6 flex flex-col gap-3 overflow-hidden transition-all hover:border-[#0F5C5C]/40 hover:shadow-sm cursor-default bg-background"
              >
                <div className="relative z-10 flex items-center justify-between">
                  <div className="h-10 w-10 rounded-xl bg-stone-100 flex items-center justify-center text-[#0F5C5C]">
                    <Icon className="h-5 w-5" />
                  </div>
                </div>

                <div className="relative z-10">
                  <div className="font-semibold text-sm md:text-base text-gray-900">{event.title}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{event.desc}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── AMENITIES & SERVICES ── */}
      <div className="space-y-6">
        <div className="flex items-end justify-between">
          <h2
            className="text-2xl md:text-3xl font-light tracking-tight"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            Included Services &amp; Facilities
          </h2>
          <span className="hidden md:block text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Full Hospitality
          </span>
        </div>

        <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
          {sharedAmenities.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="flex items-center gap-3 rounded-xl border border-border/50 bg-stone-50/50 p-4 hover:bg-stone-50 transition"
              >
                <div className="shrink-0 h-9 w-9 rounded-lg bg-white border border-border/60 flex items-center justify-center shadow-2xs text-[#0F5C5C]">
                  <Icon className="h-4 w-4" />
                </div>
                <span className="text-xs md:text-sm font-medium text-gray-800">{item.title}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── CTA STRIP ── */}
      <div className="rounded-3xl bg-gradient-to-br from-[#0F5C5C] to-[#0A3D3D] text-white p-8 md:p-12 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.2em] text-[#E6CA65] font-semibold">
            Make Your Dream Event A Reality
          </p>
          <h3
            className="text-2xl md:text-4xl font-light leading-tight text-white"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            Book Hotel Avadh Banquet &amp; Party Plot
          </h3>
          <p className="text-sm text-white/80 max-w-xl">
            Himmatnagar-Idar Highway, Hinglaj, Idar, Gujarat 383110. Contact our events team for custom catering packages, dates, and live venue tours.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 shrink-0">
          <Button
            asChild
            size="lg"
            className="rounded-full bg-white text-[#0F5C5C] hover:bg-white/90 px-8 font-semibold shadow-md"
          >
            <a
              href="https://wa.me/919428504802?text=Hello%20Hotel%20Avadh!%20I%20would%20like%20to%20plan%20an%20event%20at%20your%20Banquet%20/%20Party%20Plot."
              target="_blank"
              rel="noreferrer"
            >
              Chat on WhatsApp
            </a>
          </Button>
          <Button
            asChild
            size="lg"
            className="rounded-full bg-white text-[#0F5C5C] hover:bg-white/90 px-8 font-semibold shadow-md"
          >
            <Link href="/contact">Contact Reception</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}