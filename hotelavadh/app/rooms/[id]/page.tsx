import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookingForm } from "@/components/site/BookingForm";
import connectToDatabase from "@/src/lib/mongodb";
import Room from "@/src/models/Room";
import mongoose from "mongoose";

export const dynamic = "force-dynamic";

export default async function RoomDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return <div className="py-10 text-center">Invalid room ID</div>;
  }

  await connectToDatabase();
  const room = await Room.findById(id).lean() as any;

  if (!room) return <div className="py-10 text-center">Room not found</div>;

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
          <div className="md:col-span-1">
            <BookingForm 
              roomId={room._id.toString()} 
              pricePerNight={room.pricePerNight} 
              maxGuests={room.maxGuests} 
            />
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