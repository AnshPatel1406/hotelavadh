import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectToDatabase from "@/src/lib/mongodb";
import Room from "@/src/models/Room";
import { RoomList } from "@/components/dashboard/RoomList";

export default async function DashboardRoomsPage() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role || "user";
  
  await connectToDatabase();
  const rooms = await Room.find().sort({ roomNumber: 1 }).lean();

  // Convert ObjectIds to strings to pass to client component safely
  const serializedRooms = rooms.map(room => ({
    ...room,
    _id: room._id.toString(),
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Rooms</h1>
        <p className="text-muted-foreground mt-2">
          View and manage hotel rooms.
        </p>
      </div>

      <RoomList initialRooms={serializedRooms} role={role} />
    </div>
  );
}
