import { Badge } from "@/components/ui/badge";
import {
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  ExternalLink,
  ConciergeBell,
  UtensilsCrossed,
  PartyPopper,
} from "lucide-react";

const hotelName =
  "HOTEL AVADH, ROOMS,RESTAURANT,BREAKFAST, PARTY PLOTS";

const hotelCoordinates = "23.7340702,72.9796102";

const directionsUrl =
  `https://www.google.com/maps/dir/?api=1&destination=${hotelCoordinates}`;

const hours = [
  {
    label: "Front Desk",
    hours: "Open 24 hours",
    note: "Always here for you",
    icon: ConciergeBell,
    card: "border-teal-200 bg-teal-50/40 hover:bg-teal-50 hover:border-teal-300",
    chip: "bg-teal-100 border-teal-200 text-teal-700",
    labelColor: "text-teal-600/80",
    hoursColor: "text-teal-900",
    noteColor: "text-teal-700/70",
  },
  {
    label: "Restaurant",
    hours: "11 AM – 3:30 PM • 7 – 11 PM",
    note: "Lunch & Dinner daily",
    icon: UtensilsCrossed,
    card: "border-amber-200 bg-amber-50/40 hover:bg-amber-50 hover:border-amber-300",
    chip: "bg-amber-100 border-amber-200 text-amber-700",
    labelColor: "text-amber-600/80",
    hoursColor: "text-amber-900",
    noteColor: "text-amber-700/70",
  },
  {
    label: "Banquet Enquiries",
    hours: "9 AM – 8 PM",
    note: "Call or WhatsApp",
    icon: PartyPopper,
    card: "border-violet-200 bg-violet-50/40 hover:bg-violet-50 hover:border-violet-300",
    chip: "bg-violet-100 border-violet-200 text-violet-700",
    labelColor: "text-violet-600/80",
    hoursColor: "text-violet-900",
    noteColor: "text-violet-700/70",
  },
];

export default function ContactPage() {
  return (
    <div className="space-y-16">
      {/* HERO */}
      <div className="space-y-5 pt-2">
        <Badge
          variant="outline"
          className="rounded-full px-4 py-1 text-xs tracking-[0.18em] uppercase font-medium border-stone-300 text-stone-600 bg-stone-50"
        >
          Contact Us
        </Badge>

        <h1
          className="text-4xl md:text-6xl font-light tracking-tight leading-[1.1]"
          style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
        >
          We'd love to
          <br />
          <span className="italic text-muted-foreground">
            hear from you
          </span>
        </h1>

        <p className="text-muted-foreground max-w-xl leading-relaxed text-base md:text-lg">
          Whether it's a booking, banquet enquiry, or just a question —
          reach out and we'll get back to you promptly.
        </p>
      </div>

      {/* CONTACT DETAILS + MAP */}
      <div className="grid gap-5 md:grid-cols-5">
        <div className="md:col-span-2 flex flex-col gap-4">
          {/* Phone */}
          <a
            href="tel:+919876598765"
            className="group flex items-start gap-4 rounded-2xl border border-blue-200 bg-blue-50/40 px-5 py-5 hover:bg-blue-50 hover:border-blue-300 transition"
          >
            <div className="shrink-0 h-10 w-10 rounded-xl bg-blue-100 flex items-center justify-center border border-blue-200">
              <Phone className="h-4 w-4 text-blue-700" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-widest text-blue-600/70 mb-1">
                Phone
              </div>
              <div className="font-medium text-sm text-blue-900">+91 98765 98765</div>
              <div className="text-xs text-blue-700/60 mt-0.5">
                Available 8 AM – 10 PM
              </div>
            </div>
            <span className="ml-auto self-center text-blue-400/60">→</span>
          </a>

          {/* WhatsApp */}
          <a
            href="https://wa.me/919876598765"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-start gap-4 rounded-2xl border border-green-200 bg-green-50/40 px-5 py-5 hover:bg-green-50 hover:border-green-300 transition"
          >
            <div className="shrink-0 h-10 w-10 rounded-xl bg-green-100 flex items-center justify-center border border-green-200">
              <MessageCircle className="h-4 w-4 text-green-700" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-widest text-green-600/70 mb-1">
                WhatsApp
              </div>
              <div className="font-medium text-sm text-green-900">+91 98765 98765</div>
              <div className="text-xs text-green-700/60 mt-0.5">
                Quick replies
              </div>
            </div>
            <span className="ml-auto self-center text-green-400/60">→</span>
          </a>

          {/* Email */}
          <a
            href="mailto:info@hotelavadh.co.in"
            className="group flex items-start gap-4 rounded-2xl border border-orange-200 bg-orange-50/40 px-5 py-5 hover:bg-orange-50 hover:border-orange-300 transition"
          >
            <div className="shrink-0 h-10 w-10 rounded-xl bg-orange-100 flex items-center justify-center border border-orange-200">
              <Mail className="h-4 w-4 text-orange-700" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-widest text-orange-600/70 mb-1">
                Email
              </div>
              <div className="font-medium text-sm text-orange-900">
                info@hotelavadh.co.in
              </div>
              <div className="text-xs text-orange-700/60 mt-0.5">
                We reply within 24 hours
              </div>
            </div>
            <span className="ml-auto self-center text-orange-400/60">→</span>
          </a>

          {/* Address */}
          <div className="flex items-start gap-4 rounded-2xl border border-rose-200 bg-rose-50/40 px-5 py-5">
            <div className="shrink-0 h-10 w-10 rounded-xl bg-rose-100 flex items-center justify-center border border-rose-200">
              <MapPin className="h-4 w-4 text-rose-700" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-widest text-rose-600/70 mb-1">
                Address
              </div>
              <div className="font-medium text-sm text-rose-900">
                Hotel Avadh
              </div>
              <div className="text-xs text-rose-800/80 mt-1 leading-relaxed">
                Himmatnagar-Idar Highway, Hinglaj,
                <br />
                Idar, Gujarat 383110
              </div>
            </div>
          </div>
        </div>

        {/* MAP */}
        <div className="md:col-span-3 flex flex-col rounded-3xl border border-rose-200 overflow-hidden bg-muted">
          {/* Map header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-rose-50/60 p-5 border-b border-rose-100">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 shrink-0 rounded-xl bg-rose-100 border border-rose-200 flex items-center justify-center">
                <MapPin className="h-5 w-5 text-rose-700" />
              </div>
              <div>
                <h2 className="font-semibold text-sm leading-relaxed text-rose-900">
                  {hotelName}
                </h2>
                <p className="text-xs text-rose-700/70 mt-1">
                  Himmatnagar-Idar Highway, Hinglaj, Idar, Gujarat 383110
                </p>
              </div>
            </div>

            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-foreground text-background px-5 py-3 text-sm font-medium hover:opacity-85 transition"
            >
              <MapPin className="h-4 w-4" />
              Get Directions
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>

          <iframe
            title="Hotel Avadh location on Google Maps"
            className="block w-full flex-1 h-[300px] md:h-auto md:min-h-[200px]"
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            src={`https://maps.google.com/maps?q=${hotelCoordinates}&z=17&output=embed`}
          />

          {/* Map footer link */}
          <div className="bg-blue-50/50 border-t border-blue-100 p-4">
            <a
              href="https://maps.app.goo.gl/n6FiQP1z3TBKCb47A"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 text-sm font-medium text-blue-600 underline decoration-blue-300 underline-offset-4 hover:text-blue-800 hover:decoration-blue-600 transition-colors"
            >
              View Hotel Avadh on Google Maps
              <ExternalLink className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>
        </div>
      </div>

      {/* HOURS */}
      <div className="grid gap-3 grid-cols-1 sm:grid-cols-3">
        {hours.map((h) => {
          const Icon = h.icon;
          return (
            <div
              key={h.label}
              className={`flex items-start gap-4 rounded-2xl border px-5 py-5 transition ${h.card}`}
            >
              <div
                className={`shrink-0 h-10 w-10 rounded-xl border flex items-center justify-center ${h.chip}`}
              >
                <Icon className="h-4 w-4" />
              </div>
              <div>
                <div
                  className={`text-xs uppercase tracking-widest mb-1 ${h.labelColor}`}
                >
                  {h.label}
                </div>
                <div className={`font-medium text-sm ${h.hoursColor}`}>
                  {h.hours}
                </div>
                <div className={`text-xs mt-0.5 ${h.noteColor}`}>
                  {h.note}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* CTA */}
      <div className="rounded-3xl bg-foreground text-background px-8 py-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-background/50 mb-2">
            Planning something special?
          </p>
          <h3
            className="text-2xl md:text-3xl font-light leading-tight"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            Let's make it
            <br />
            <span className="italic">happen together.</span>
          </h3>
        </div>

        <div className="flex flex-wrap gap-3 self-start md:self-auto">
          <a
            href="tel:+919876598765"
            className="inline-flex items-center gap-2 rounded-full border border-background/30 text-background px-6 py-3 text-sm font-medium hover:bg-background/10 transition"
          >
            Call Us
          </a>
          <a
            href="https://wa.me/919876598765"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-background text-foreground px-6 py-3 text-sm font-medium hover:bg-background/90 transition"
          >
            WhatsApp →
          </a>
        </div>
      </div>
    </div>
  );
}