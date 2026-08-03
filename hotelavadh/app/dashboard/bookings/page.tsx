import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectToDatabase from "@/src/lib/mongodb";
import Booking from "@/src/models/Bookings";
import { BookingList } from "@/components/dashboard/BookingList";

export default async function DashboardBookingsPage() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role || "user";
  
  await connectToDatabase();
  
  const bookings = await Booking.find()
    .sort({ createdAt: -1 })
    .populate("room", "title")
    .populate("user", "name email")
    .lean();

  const serializedBookings = bookings.map(booking => ({
    ...booking,
    _id: booking._id.toString(),
    user: booking.user ? { ...booking.user, _id: booking.user._id?.toString() } : null,
    room: booking.room ? { ...booking.room, _id: booking.room._id?.toString() } : null,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Bookings</h1>
        <p className="text-muted-foreground mt-2">
          View and manage guest reservations.
        </p>
      </div>

      <BookingList initialBookings={serializedBookings} role={role} />
    </div>
  );
}
