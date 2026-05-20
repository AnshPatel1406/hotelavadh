import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const rooms = [
  {
    id: "deluxe",
    title: "Deluxe Room",
    description: "Spacious and elegant room with city views and modern comforts.",
    pricePerNight: 3500,
    maxGuests: 3,
    type: "deluxe",
    roomNumber: 101,
  },
  {
    id: "premium",
    title: "Premium Room",
    description: "Well-appointed room with extra space and premium amenities.",
    pricePerNight: 4500,
    maxGuests: 4,
    type: "premium",
    roomNumber: 202,
  },
  {
    id: "suite",
    title: "Suite",
    description: "Large suite with separate seating area and luxurious details.",
    pricePerNight: 6500,
    maxGuests: 5,
    type: "suite",
    roomNumber: 303,
  },
];

export default function RoomsPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <Badge variant="secondary">Rooms</Badge>
        <h1 className="text-3xl font-semibold tracking-tight">Stay with comfort</h1>
        <p className="text-muted-foreground">
          Choose from our selection of rooms designed for a relaxing and memorable stay.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {rooms.map((room) => (
          <Link key={room.id} href={`/rooms/${room.id}`} className="group">
            <Card className="h-full transition hover:shadow-sm">
              <CardContent className="p-5 space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="text-lg font-medium">{room.title}</div>
                    <div className="text-sm text-muted-foreground">Room #{room.roomNumber}</div>
                  </div>
                  <Badge variant="secondary" className="capitalize">
                    {room.type}
                  </Badge>
                </div>

                <p className="text-sm text-muted-foreground">{room.description}</p>

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