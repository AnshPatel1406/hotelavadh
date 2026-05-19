import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const highlights = [
  { title: "Pure Veg & Jain Options", desc: "Jain food available on request." },
  { title: "Lunch & Dinner", desc: "Fresh meals served daily with seasonal specials." },
  { title: "Family Friendly", desc: "Comfortable seating and warm ambience." },
];

export default function DiningPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <Badge variant="secondary">Dining</Badge>
        <h1 className="text-3xl font-semibold tracking-tight">Restaurant</h1>
        <p className="text-muted-foreground">
          Enjoy delicious food with a calm and premium ambience.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {highlights.map((h) => (
          <Card key={h.title} className="hover:shadow-sm transition">
            <CardContent className="p-5 space-y-2">
              <div className="font-medium">{h.title}</div>
              <div className="text-sm text-muted-foreground">{h.desc}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1">
            <div className="font-medium">Timings</div>
            <div className="text-sm text-muted-foreground">
              Lunch: 12:00 PM – 3:30 PM • Dinner: 7:00 PM – 11:00 PM
            </div>
          </div>
          <div className="flex gap-3">
            <Button asChild variant="outline">
              <a href="tel:+919999999999">Call</a>
            </Button>
            <Button asChild>
              <a href="https://wa.me/919999999999" target="_blank" rel="noreferrer">
                WhatsApp
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-3 grid-cols-2 md:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-32 rounded-2xl border bg-muted" />
        ))}
      </div>
    </div>
  );
}