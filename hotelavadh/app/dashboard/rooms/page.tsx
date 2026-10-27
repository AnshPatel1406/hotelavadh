import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectToDatabase from "@/src/lib/mongodb";
import Room from "@/src/models/Room";
import Booking from "@/src/models/Bookings";
import { RoomList } from "@/components/dashboard/RoomList";

export default async function DashboardRoomsPage() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role || "user";

  await connectToDatabase();
  const rooms = await Room.find().sort({ roomNumber: 1 }).lean();

  // Fetch currently active/checked-in bookings to track room occupancy in real time
  const activeBookings = await Booking.find({
    status: "checked_in",
  })
    .populate("user", "name email phone")
    .lean();

  const bookingsByRoom: Record<string, any> = {};
  for (const b of activeBookings) {
    if (b.room) {
      const roomKey = b.room.toString();
      const userObj = b.user as any;
      bookingsByRoom[roomKey] = {
        _id: b._id.toString(),
        checkInCode: b.checkInCode || (b._id ? b._id.toString().slice(-6).toUpperCase() : ""),
        guestName: b.guestName || userObj?.name || "Guest",
        guestPhone: b.guestPhone || userObj?.phone || "",
        guestEmail: b.guestEmail || userObj?.email || "",
        checkInDate: b.checkInDate ? b.checkInDate.toISOString() : "",
        checkOutDate: b.checkOutDate ? b.checkOutDate.toISOString() : "",
        totalPrice: b.totalPrice,
        extraCharges: (b.extraCharges || []).map((c: any) => ({
          description: c.description,
          amount: c.amount,
          date: c.date ? c.date.toISOString() : "",
        })),
        guests: b.guests,
        status: b.status,
        specialRequests: b.specialRequests || "",
      };
    }
  }

  // Convert ObjectIds and dates to plain serializable objects for client
  const serializedRooms = rooms.map((room) => ({
    ...room,
    _id: room._id.toString(),
    createdAt: room.createdAt ? room.createdAt.toISOString() : undefined,
    updatedAt: room.updatedAt ? room.updatedAt.toISOString() : undefined,
    activeBooking: bookingsByRoom[room._id.toString()] || null,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Rooms &amp; Occupancy</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Live room status: Green rooms are vacant and ready for walk-ins. Red rooms are currently occupied by guests.
        </p>
      </div>

      <RoomList initialRooms={serializedRooms} role={role} />
    </div>
  );
}
