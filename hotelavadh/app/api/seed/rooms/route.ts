import connectToDatabase from "@/src/lib/mongodb";
import Room from "@/src/models/Room";

export async function POST() {
  await connectToDatabase();

  // Clears existing rooms (so you don't get duplicates while testing)
  await Room.deleteMany({});

  const rooms = await Room.insertMany([
    {
      roomNumber: 101,
      type: "single",
      title: "Single Room",
      description: "Comfortable single room with AC and WiFi.",
      pricePerNight: 1999,
      maxGuests: 1,
      images: [],
      amenities: ["WiFi", "AC", "TV"],
      isActive: true,
    },
    {
      roomNumber: 201,
      type: "double",
      title: "Double Room",
      description: "Spacious double room with breakfast included.",
      pricePerNight: 2999,
      maxGuests: 2,
      images: [],
      amenities: ["WiFi", "AC", "TV", "Breakfast"],
      isActive: true,
    },
    {
      roomNumber: 301,
      type: "suite",
      title: "Suite Room",
      description: "Luxury suite with living area and bathtub.",
      pricePerNight: 4999,
      maxGuests: 4,
      images: [],
      amenities: ["WiFi", "AC", "TV", "Breakfast", "Bathtub"],
      isActive: true,
    },
  ]);

  return Response.json({ success: true, count: rooms.length });
}