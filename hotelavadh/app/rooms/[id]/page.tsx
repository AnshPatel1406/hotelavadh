export default async function RoomDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {

  // Next.js 16 params are async
  const { id } = await params;

  const res = await fetch(
    `http://localhost:3000/api/rooms/${id}`,
    {
      cache: "no-store",
    }
  );

  const data = await res.json();

  if (!data.success) {
    return <div className="p-6">Room not found</div>;
  }

  const room = data.room;

  return (
    <div className="p-6 space-y-3">
      <h1 className="text-2xl font-semibold">{room.title}</h1>

      <div className="text-sm text-gray-600">
        Room #{room.roomNumber} • {room.type}
      </div>

      <p>{room.description}</p>

      <div>₹{room.pricePerNight}/night</div>

      <button className="border px-4 py-2 rounded-lg">
        Book Now
      </button>
    </div>
  );
}