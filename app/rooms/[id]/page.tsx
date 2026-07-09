import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function RoomDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const res = await fetch(`http://localhost:3000/api/rooms/${id}`, { cache: "no-store" });
  const data = await res.json();

  if (!data.success) return <div className="py-10">Room not found</div>;

  const room = data.room;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="capitalize">{room.type}</Badge>
          <span className="text-sm text-muted-foreground">Room #{room.roomNumber}</span>
        </div>
        <h1 className="text-3xl font-semibold tracking-tight">{room.title}</h1>
        <p className="text-muted-foreground">{room.description}</p>
      </div>

      <Card>
        <CardContent className="p-6 grid gap-4 md:grid-cols-3">
          <div>
            <div className="text-sm text-muted-foreground">Price</div>
            <div className="text-lg font-semibold">₹{room.pricePerNight}/night</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Max Guests</div>
            <div className="text-lg font-semibold">{room.maxGuests}</div>
          </div>
          <div className="flex md:justify-end">
            <Button className="w-full md:w-auto">
              Book Now (later)
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-2">
        <h2 className="text-lg font-medium">Amenities</h2>
        <div className="grid gap-2 grid-cols-2 md:grid-cols-4">
          {(room.amenities || []).map((a: string) => (
            <div key={a} className="border rounded-xl px-3 py-2 text-sm">
              {a}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}