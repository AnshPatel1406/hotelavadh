import { Badge } from "@/components/ui/badge";
import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="space-y-16">

      {/* ── HERO ── */}
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
          <span className="italic text-muted-foreground">hear from you</span>
        </h1>

        <p className="text-muted-foreground max-w-xl leading-relaxed text-base md:text-lg">
          Whether it's a booking, banquet enquiry, or just a question —
          reach out and we'll get back to you promptly.
        </p>
      </div>

      {/* ── MAIN GRID ── */}
      <div className="grid gap-5 md:grid-cols-5">

        {/* Contact details — 2 cols */}
        <div className="md:col-span-2 flex flex-col gap-4">

          {/* Phone */}
          <a
            href="tel:+919428504802"
            className="group flex items-start gap-4 rounded-2xl border border-border/60 bg-background px-5 py-5 hover:border-foreground/20 hover:bg-muted/20 transition"
          >
            <div className="shrink-0 h-10 w-10 rounded-xl bg-muted flex items-center justify-center group-hover:bg-background transition border border-border/40">
              <Phone className="h-4 w-4 text-foreground/70" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Phone</div>
              <div className="font-medium text-sm">+91 94285 4802</div>
              <div className="text-xs text-muted-foreground mt-0.5">Available 8 AM – 10 PM</div>
            </div>
            <span className="ml-auto self-center text-muted-foreground/40 group-hover:text-foreground/50 transition text-xs">→</span>
          </a>

          {/* WhatsApp */}
          <a
            href="https://wa.me/919428504802"
            target="_blank"
            rel="noreferrer"
            className="group flex items-start gap-4 rounded-2xl border border-green-200 bg-green-50/40 px-5 py-5 hover:bg-green-50 hover:border-green-300 transition"
          >
            <div className="shrink-0 h-10 w-10 rounded-xl bg-green-100 flex items-center justify-center border border-green-200">
              <MessageCircle className="h-4 w-4 text-green-700" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-widest text-green-600/70 mb-1">WhatsApp</div>
              <div className="font-medium text-sm text-green-900">+91 99999 99999</div>
              <div className="text-xs text-green-700/60 mt-0.5">Quick replies guaranteed</div>
            </div>
            <span className="ml-auto self-center text-green-400/60 group-hover:text-green-600 transition text-xs">→</span>
          </a>

          {/* Email */}
          <a
            href="mailto:info@hotelavadh.com"
            className="group flex items-start gap-4 rounded-2xl border border-border/60 bg-background px-5 py-5 hover:border-foreground/20 hover:bg-muted/20 transition"
          >
            <div className="shrink-0 h-10 w-10 rounded-xl bg-muted flex items-center justify-center group-hover:bg-background transition border border-border/40">
              <Mail className="h-4 w-4 text-foreground/70" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Email</div>
              <div className="font-medium text-sm">info@hotelavadh.com</div>
              <div className="text-xs text-muted-foreground mt-0.5">We reply within 24 hours</div>
            </div>
            <span className="ml-auto self-center text-muted-foreground/40 group-hover:text-foreground/50 transition text-xs">→</span>
          </a>

          {/* Address */}
          <div className="flex items-start gap-4 rounded-2xl border border-border/60 bg-background px-5 py-5">
            <div className="shrink-0 h-10 w-10 rounded-xl bg-muted flex items-center justify-center border border-border/40">
              <MapPin className="h-4 w-4 text-foreground/70" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Address</div>
              <div className="font-medium text-sm leading-snug">Hotel Avadh</div>
              <div className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                Himmatnagar, Sabarkantha<br />Gujarat, India
              </div>
            </div>
          </div>
        </div>

        {/* Map — 3 cols */}
        <div className="md:col-span-3 rounded-3xl border border-border/60 overflow-hidden bg-muted min-h-[380px]">
          <iframe
            title="Hotel Avadh on Google Maps"
            className="w-full h-full min-h-[380px]"
            loading="lazy"
            src="https://www.google.com/maps?q=Hotel%20Avadh%20Himmatnagar&output=embed"
          />
        </div>
      </div>

      {/* ── HOURS STRIP ── */}
      <div className="grid gap-3 grid-cols-1 sm:grid-cols-3">
        {[
          { label: "Front Desk", hours: "Open 24 hours", note: "Always here for you" },
          { label: "Restaurant", hours: "11 AM – 3:30 PM  •  7 – 11 PM", note: "Lunch & Dinner daily" },
          { label: "Banquet Enquiries", hours: "9 AM – 8 PM", note: "Call or WhatsApp" },
        ].map((h) => (
          <div key={h.label} className="rounded-2xl border border-border/50 bg-muted/20 px-5 py-4">
            <div className="text-xs uppercase tracking-widest text-muted-foreground mb-1">{h.label}</div>
            <div className="font-medium text-sm">{h.hours}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{h.note}</div>
          </div>
        ))}
      </div>

      {/* ── CTA ── */}
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
            href="tel:+919428504802"
            className="inline-flex items-center gap-2 rounded-full border border-background/30 text-background px-6 py-3 text-sm font-medium hover:bg-background/10 transition"
          >
            Call Us
          </a>
          <a
            href="https://wa.me/919428504802"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-background text-foreground px-6 py-3 text-sm font-medium hover:bg-background/90 transition"
          >
            WhatsApp →
          </a>
        </div>
      </div>

    </div>
  );
}