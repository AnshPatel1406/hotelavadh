import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const events = ["Wedding", "Reception", "Birthday", "Corporate", "Engagement", "Get-together"];

export default function BanquetPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <Badge variant="secondary">Banquet</Badge>
        <h1 className="text-3xl font-semibold tracking-tight">Banquet & Events</h1>
        <p className="text-muted-foreground">
          Host celebrations and events with premium arrangements and hospitality.
        </p>
      </div>

      <Card>
        <CardContent className="p-6 grid gap-4 md:grid-cols-3">
          <div>
            <div className="text-sm text-muted-foreground">Capacity</div>
            <div className="text-lg font-semibold">Up to 300 guests</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Setup</div>
            <div className="text-lg font-semibold">AC • Stage • Sound</div>
          </div>
          <div className="flex md:justify-end">
            <Button asChild className="w-full md:w-auto">
              <a href="/contact">Enquire Now</a>
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-3 grid-cols-2 md:grid-cols-3">
        {events.map((e) => (
          <div key={e} className="border rounded-2xl p-4 text-sm">
            {e}
          </div>
        ))}
      </div>

      <div className="grid gap-3 grid-cols-2 md:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-32 rounded-2xl border bg-muted" />
        ))}
      </div>
    </div>
  );
}