import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const features = [
  {
    title: "Rooms",
    desc: "Comfortable rooms for solo, family & premium stays.",
    href: "/rooms",
    badge: "Stay",
  },
  {
    title: "Dining",
    desc: "Delicious veg & non-veg options with great ambience.",
    href: "/dining",
    badge: "Eat",
  },
  {
    title: "Banquet",
    desc: "Perfect venue for weddings, parties & corporate events.",
    href: "/banquet",
    badge: "Celebrate",
  },
];

const amenities = [
  "Free Wi-Fi",
  "Parking",
  "Power Backup",
  "Restaurant",
  "Room Service",
  "Travel Desk",
  "CCTV",
  "Banquet Hall",
];

export default function HomePage() {
  return (
    <div className="py-10 space-y-12">
      {/* Hero */}
      <section className="rounded-2xl border p-6 md:p-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="space-y-4">
          <Badge variant="secondary">Hotel • Dining • Banquet</Badge>
          <h1 className="text-3xl md:text-5xl font-semibold tracking-tight">
            Comfort. Dining. Hospitality.
          </h1>
          <p className="text-muted-foreground max-w-xl">
            A premium stay experience with beautiful rooms, delicious food, and a banquet for every celebration.
          </p>
          <div className="flex gap-3">
            <Button asChild>
              <Link href="/rooms">Explore Rooms</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/contact">Contact</Link>
            </Button>
          </div>
        </div>

        <div className="w-full md:w-[420px] h-[220px] md:h-[260px] rounded-2xl bg-muted border overflow-hidden">
  <div className="w-full h-full bg-gradient-to-br from-muted to-background" />
</div>
      </section>

      {/* Feature cards */}
      <section className="space-y-4">
        <div className="flex items-end justify-between">
          <h2 className="text-xl font-semibold">Explore</h2>
          <span className="text-sm text-muted-foreground">Rooms • Dining • Banquet</span>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {features.map((f) => (
            <Card key={f.title} className="hover:shadow-sm transition">
              <CardContent className="p-5 space-y-3">
                <Badge variant="outline">{f.badge}</Badge>
                <div className="text-lg font-medium">{f.title}</div>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
                <Button asChild variant="outline">
                  <Link href={f.href}>Learn more</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Separator />

      {/* Amenities */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Amenities</h2>
        <div className="grid gap-3 grid-cols-2 md:grid-cols-4">
          {amenities.map((a) => (
            <div key={a} className="border rounded-xl p-3 text-sm">
              {a}
            </div>
          ))}
        </div>
      </section>

      {/* CTA (call/whatsapp like Vintana) */}
      <section className="rounded-2xl border p-6 md:p-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-2">
          <div className="text-lg font-medium">Need a quick booking?</div>
          <div className="text-sm text-muted-foreground">
            Call or WhatsApp us and we’ll help you instantly.
          </div>
        </div>
        <div className="flex gap-3">
          <Button asChild variant="outline">
            <a href="tel:+919999999999">Call Now</a>
          </Button>
          <Button asChild>
            <a href="https://wa.me/919999999999" target="_blank" rel="noreferrer">
              WhatsApp
            </a>
          </Button>
        </div>
      </section>
    </div>
  );
}