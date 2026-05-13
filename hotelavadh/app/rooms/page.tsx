import Link from "next/link";

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
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Rooms</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {rooms.map((room) => (
          <Link
            key={room._id}
            href={`/rooms/${room._id}`}
            className="border rounded-xl p-4 hover:shadow"
          >
            <div className="text-lg font-medium">{room.title}</div>
            <div className="text-sm text-gray-600">
              Room #{room.roomNumber} • {room.type}
            </div>
            <div className="mt-2 text-sm text-gray-700 line-clamp-2">
              {room.description}
            </div>
            <div className="mt-2 text-sm">Max Guests: {room.maxGuests}</div>
            <div className="mt-2 font-semibold">₹{room.pricePerNight}/night</div>
          </Link>
        ))}
      </div>
    </div>
  );
}