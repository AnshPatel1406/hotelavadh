import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type Room = {
  _id: string;
  title: string;
  description: string;
  pricePerNight: number;
  maxGuests: number;
  type: string;
  roomNumber: number;
};

export default async function RoomsPage() {
  const res = await fetch("http://localhost:3000/api/rooms", { cache: "no-store" });
  const data = await res.json();
  const rooms: Room[] = data.rooms || [];

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Rooms</h1>
        <p className="text-muted-foreground">
          Browse our comfortable rooms and pick what fits your stay.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {rooms.map((room) => (
          <Link key={room._id} href={`/rooms/${room._id}`} className="group">
            <Card className="h-full transition hover:shadow-sm">
              <CardContent className="p-5 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="text-lg font-medium">{room.title}</div>
                    <div className="text-sm text-muted-foreground">
                      Room #{room.roomNumber}
                    </div>
                  </div>
                  <Badge variant="secondary" className="capitalize">
                    {room.type}
                  </Badge>
                </div>

                <p className="text-sm text-muted-foreground line-clamp-2">
                  {room.description}
                </p>

                <div className="flex items-center justify-between pt-2">
                  <div className="text-sm text-muted-foreground">
                    Max Guests: <span className="text-foreground">{room.maxGuests}</span>
                  </div>
                  <div className="text-base font-semibold">
                    ₹{room.pricePerNight}
                    <span className="text-sm font-normal text-muted-foreground">/night</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}