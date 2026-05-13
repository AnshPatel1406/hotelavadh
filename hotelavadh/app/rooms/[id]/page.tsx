export default async function RoomDetailsPage({ params }: { params: { id: string } }) {
  const res = await fetch(`http://localhost:3000/api/rooms/${params.id}`, { cache: "no-store" });
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

      <p className="text-gray-700">{room.description}</p>

      <div className="text-sm">Max Guests: {room.maxGuests}</div>
      <div className="text-lg font-semibold">₹{room.pricePerNight}/night</div>

      <div>
        <h2 className="font-medium mt-4">Amenities</h2>
        <ul className="list-disc pl-5 text-sm text-gray-700">
          {room.amenities?.map((a: string) => (
            <li key={a}>{a}</li>
          ))}
        </ul>
      </div>

      <button className="border rounded-lg px-4 py-2 mt-4">
        Book Now (next step)
      </button>
    </div>
  );
}