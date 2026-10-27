import Link from "next/link";
import mongoose from "mongoose";
import { Badge } from "@/components/ui/badge";
import { BookingForm } from "@/components/site/BookingForm";
import connectToDatabase from "@/src/lib/mongodb";
import Room from "@/src/models/Room";
import {
  ArrowLeft,
  Users,
  Check,
  ShieldCheck,
  Clock,
  Coffee,
  Wifi,
  Sparkles,
  Phone,
  MessageCircle,
} from "lucide-react";

export const dynamic = "force-dynamic";

const typeAccentStyle: Record<string, string> = {
  single: "from-stone-200 via-stone-100 to-amber-50",
  double: "from-amber-100 via-amber-50 to-stone-50",
  suite: "from-yellow-100 via-amber-50 to-stone-100",
  deluxe: "from-stone-200 via-amber-50 to-stone-50",
  premium: "from-amber-100 via-yellow-50 to-stone-50",
};

export default async function RoomDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return (
      <div className="py-20 text-center space-y-4">
        <h2 className="text-2xl font-light text-stone-800">Invalid Room ID</h2>
        <p className="text-muted-foreground text-sm">The selected room cannot be located.</p>
        <Link
          href="/rooms"
          className="inline-flex items-center gap-2 rounded-full bg-stone-900 px-6 py-2.5 text-sm font-medium text-white hover:bg-stone-800 transition"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Rooms
        </Link>
      </div>
    );
  }

  await connectToDatabase();
  const room = (await Room.findById(id).lean()) as any;

  if (!room) {
    return (
      <div className="py-20 text-center space-y-4">
        <h2 className="text-2xl font-light text-stone-800">Room Not Found</h2>
        <p className="text-muted-foreground text-sm">This accommodation is currently unavailable.</p>
        <Link
          href="/rooms"
          className="inline-flex items-center gap-2 rounded-full bg-stone-900 px-6 py-2.5 text-sm font-medium text-white hover:bg-stone-800 transition"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Rooms
        </Link>
      </div>
    );
  }

  const accentGradient = typeAccentStyle[room.type] || "from-stone-100 to-stone-50";

  return (
    <div className="space-y-10 pb-16">
      {/* ── BREADCRUMB / BACK LINK ── */}
      <div>
        <Link
          href="/rooms"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition group font-medium"
        >
          <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
          Back to all rooms
        </Link>
      </div>

      {/* ── MAIN CONTENT GRID ── */}
      <div className="grid gap-10 lg:grid-cols-12 items-start">
        {/* Left Column: Room Presentation (7 cols) */}
        <div className="lg:col-span-7 space-y-8">
          {/* Header Title & Badges */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center rounded-full border border-stone-300 bg-stone-50 px-3 py-1 text-xs font-medium uppercase tracking-wider text-stone-700">
                {room.type} Room
              </span>
              <span className="inline-flex items-center rounded-full border border-stone-200 bg-muted/30 px-3 py-1 text-xs font-mono text-muted-foreground">
                Room #{room.roomNumber}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs text-emerald-800 font-medium">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse" />
                Available for Booking
              </span>
            </div>

            <h1
              className="text-3xl md:text-5xl font-light tracking-tight text-foreground leading-[1.15]"
              style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
            >
              {room.title}
            </h1>

            <p className="text-muted-foreground leading-relaxed text-base md:text-lg pt-1">
              {room.description ||
                "Experience serene comfort with handcrafted furnishings, attentive room amenities, and an inviting ambiance tailored for relaxing stays."}
            </p>
          </div>

          {/* Visual Showcase Card with Ambient Gradient */}
          <div
            className={`relative h-64 md:h-80 w-full rounded-3xl border border-border/60 bg-gradient-to-br ${accentGradient} p-8 flex flex-col justify-between overflow-hidden shadow-sm`}
          >
            {/* Watermark Room Number */}
            <span
              className="absolute -bottom-6 -right-4 text-9xl font-light text-foreground/5 select-none pointer-events-none"
              style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
            >
              {room.roomNumber}
            </span>

            <div className="flex items-center justify-between z-10">
              <span className="rounded-full bg-background/80 backdrop-blur-sm border border-border/50 px-3 py-1 text-xs font-medium text-foreground">
                Hotel Avadh Accommodation
              </span>
              <div className="flex items-center gap-1 text-xs text-muted-foreground bg-background/80 backdrop-blur-sm border border-border/50 px-3 py-1 rounded-full">
                <Users className="h-3.5 w-3.5" />
                <span>Up to {room.maxGuests} Guests</span>
              </div>
            </div>

            <div className="z-10 bg-background/70 backdrop-blur-md border border-border/40 rounded-2xl p-4 max-w-sm">
              <div className="text-xs uppercase tracking-wider text-muted-foreground">Best Rate Guarantee</div>
              <div className="text-xl font-light text-foreground mt-0.5">
                ₹{room.pricePerNight.toLocaleString("en-IN")}{" "}
                <span className="text-xs text-muted-foreground font-normal">/ night</span>
              </div>
              <div className="text-[11px] text-muted-foreground mt-1">
                Direct booking via WhatsApp with quick confirmation.
              </div>
            </div>
          </div>

          {/* Stay Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Max Capacity", val: `${room.maxGuests} Guests`, icon: Users },
              { label: "Check-in", val: "From 12:00 PM", icon: Clock },
              { label: "Check-out", val: "By 11:00 AM", icon: Clock },
              { label: "Reservation", val: "Instant WhatsApp", icon: ShieldCheck },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-border/60 bg-muted/20 p-4 space-y-1"
                >
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  <div className="text-xs text-muted-foreground">{item.label}</div>
                  <div className="text-sm font-medium text-foreground">{item.val}</div>
                </div>
              );
            })}
          </div>

          {/* Amenities Section */}
          <div className="space-y-4 pt-2">
            <div>
              <h2
                className="text-2xl font-light text-foreground"
                style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
              >
                Room Amenities & Features
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Thoughtfully provided essentials to ensure your absolute comfort throughout your stay.
              </p>
            </div>

            <div className="grid gap-2.5 sm:grid-cols-2 md:grid-cols-3">
              {(room.amenities && room.amenities.length > 0
                ? room.amenities
                : [
                    "High-Speed Wi-Fi",
                    "Air Conditioning",
                    "Daily Housekeeping",
                    "Hot & Cold Water",
                    "Flat Screen Television",
                    "Room Service Available",
                  ]
              ).map((amenity: string) => (
                <div
                  key={amenity}
                  className="flex items-center gap-2.5 rounded-2xl border border-border/60 bg-background px-4 py-3 text-sm text-foreground/90 shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
                >
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 shrink-0">
                    <Check className="h-3 w-3 stroke-[3]" />
                  </div>
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Hotel Information & Contact Card */}
          <div className="rounded-3xl border border-border/60 bg-muted/30 p-6 space-y-4">
            <h3 className="text-base font-medium text-foreground flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-600" />
              Need Any Help or Custom Inquiries?
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Have special questions, corporate booking needs, or customized requests? Feel free to contact the Hotel Avadh front desk anytime.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <a
                href="tel:+919876598765"
                className="inline-flex items-center gap-2 rounded-xl border border-border/80 bg-background px-4 py-2.5 text-xs font-medium text-foreground hover:bg-muted/50 transition"
              >
                <Phone className="h-3.5 w-3.5 text-stone-500" />
                Call +91 98765 98765
              </a>
              <a
                href="https://wa.me/919876598765"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-medium text-white hover:bg-emerald-700 transition"
              >
                <MessageCircle className="h-3.5 w-3.5" />
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>

        {/* Right Column: Booking Form (5 cols, sticky) */}
        <div className="lg:col-span-5 lg:sticky lg:top-24">
          <BookingForm
            roomId={room._id.toString()}
            pricePerNight={room.pricePerNight}
            maxGuests={room.maxGuests}
            roomTitle={room.title}
            roomNumber={room.roomNumber}
            roomType={room.type}
          />
        </div>
      </div>
    </div>
  );
}