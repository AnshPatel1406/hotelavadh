import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Users, BedDouble } from "lucide-react";

const rooms = [
  {
    id: "deluxe",
    title: "Deluxe Room",
    description: "Spacious and elegant room with city views and modern comforts.",
    pricePerNight: 3500,
    maxGuests: 3,
    type: "deluxe",
    roomNumber: 101,
    amenities: ["King Bed", "City View", "Free Wi-Fi", "AC", "TV"],
    accent: "from-stone-100 to-stone-50",
  },
  {
    id: "premium",
    title: "Premium Room",
    description: "Well-appointed room with extra space, plush furnishings and premium amenities.",
    pricePerNight: 4500,
    maxGuests: 4,
    type: "premium",
    roomNumber: 202,
    amenities: ["King Bed", "Pool View", "Free Wi-Fi", "AC", "TV", "Minibar"],
    accent: "from-amber-50 to-stone-50",
  },
  {
    id: "suite",
    title: "Suite",
    description: "Expansive suite with a separate seating lounge and luxurious finishing touches.",
    pricePerNight: 6500,
    maxGuests: 5,
    type: "suite",
    roomNumber: 303,
    amenities: ["King Bed", "Lounge Area", "Panoramic View", "Jacuzzi", "Butler Service"],
    accent: "from-yellow-50 to-amber-50",
  },
];

const typeBadgeStyle: Record<string, string> = {
  deluxe: "border-stone-300 text-stone-700 bg-stone-50",
  premium: "border-amber-300 text-amber-700 bg-amber-50",
  suite: "border-yellow-300 text-yellow-700 bg-yellow-50",
};

export default function RoomsPage() {
  return (
    <div className="space-y-16">

      {/* ── HERO ── */}
      <div className="space-y-5 pt-2">
        <Badge
          variant="outline"
          className="rounded-full px-4 py-1 text-xs tracking-[0.18em] uppercase font-medium border-stone-300 text-stone-600 bg-stone-50"
        >
          Accommodations
        </Badge>

        <h1
          className="text-4xl md:text-6xl font-light tracking-tight leading-[1.1]"
          style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
        >
          Rest in
          <br />
          <span className="italic text-muted-foreground">Refined</span> Comfort
        </h1>

        <p className="text-muted-foreground max-w-xl leading-relaxed text-base md:text-lg">
          Each room is thoughtfully designed to offer a peaceful retreat — blending
          warm hospitality with contemporary comforts for an unforgettable stay.
        </p>
      </div>

      {/* ── ROOM CARDS ── */}
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {rooms.map((room, i) => (
          <div
            key={room.id}
            // href={`/rooms/${room.id}`}
            className="group relative flex flex-col rounded-3xl border border-border/60 bg-background overflow-hidden hover:border-foreground/20 hover:shadow-md transition-all duration-300"
          >
            {/* image placeholder with gradient tint */}
            <div className={`relative h-48 bg-gradient-to-br ${room.accent} border-b border-border/40`}>
              {/* room number watermark */}
              <span
                className="absolute bottom-3 right-4 text-6xl font-light text-foreground/5 select-none leading-none"
                style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
              >
                {room.roomNumber}
              </span>
              {/* type badge */}
              <div className="absolute top-4 left-4">
                <span
                  className={`inline-flex rounded-full border px-3 py-1 text-[11px] uppercase tracking-widest font-medium ${typeBadgeStyle[room.type]}`}
                >
                  {room.type}
                </span>
              </div>
              {/* arrow on hover */}
              <div className="absolute top-4 right-4 h-8 w-8 rounded-full bg-background/80 border border-border/60 flex items-center justify-center opacity-0 group-hover:opacity-100 translate-x-1 group-hover:translate-x-0 transition-all duration-200">
                
              </div>
            </div>

            {/* content */}
            <div className="flex flex-col flex-1 p-6 gap-4">
              <div>
                <h2
                  className="text-xl font-light tracking-tight mb-1"
                  style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
                >
                  {room.title}
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {room.description}
                </p>
              </div>

              {/* amenity pills */}
              <div className="flex flex-wrap gap-1.5">
                {room.amenities.map((a) => (
                  <span
                    key={a}
                    className="rounded-full border border-border/50 bg-muted/30 px-2.5 py-0.5 text-[11px] text-muted-foreground"
                  >
                    {a}
                  </span>
                ))}
              </div>

              {/* footer */}
              <div className="mt-auto pt-4 border-t border-border/40 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Users className="h-3.5 w-3.5" />
                  <span>Up to {room.maxGuests} guests</span>
                </div>
                <div className="text-right">
                  <span
                    className="text-xl font-light"
                    style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
                  >
                    ₹{room.pricePerNight.toLocaleString("en-IN")}
                  </span>
                  <span className="text-xs text-muted-foreground"> /night</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── PERKS STRIP ── */}
      <div className="grid gap-3 grid-cols-2 md:grid-cols-4">
        {[
          { icon: "🛎️", label: "24/7 Room Service" },
          { icon: "🧹", label: "Daily Housekeeping" },
          { icon: "🅿️", label: "Complimentary Parking" },
          { icon: "🍽️", label: "Breakfast Included" },
        ].map((p) => (
          <div
            key={p.label}
            className="flex flex-col items-center gap-2 rounded-2xl border border-border/50 bg-muted/20 px-4 py-5 text-center"
          >
            <span className="text-2xl">{p.icon}</span>
            <span className="text-xs font-medium leading-tight">{p.label}</span>
          </div>
        ))}
      </div>

      {/* ── CTA ── */}
      <div className="rounded-3xl bg-foreground text-background px-8 py-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-background/50 mb-2">
            Need help choosing?
          </p>
          <h3
            className="text-2xl md:text-3xl font-light leading-tight"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            We'll find the perfect
            <br />
            <span className="italic">room for you.</span>
          </h3>
        </div>
        <a
          href="tel:+919428504802"
          className="shrink-0 self-start md:self-auto inline-flex items-center gap-2 rounded-full bg-background text-foreground px-8 py-3 text-sm font-medium hover:bg-background/90 transition"
        >
          Call Us →
        </a>
      </div>

    </div>
  );
}