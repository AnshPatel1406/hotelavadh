import connectToDatabase from "@/src/lib/mongodb";
import Room from "@/src/models/Room";
import mongoose from "mongoose";

export async function GET(req: Request) {
  try {
    await connectToDatabase();

    // Extract id from URL path: /api/rooms/<id>
    const pathname = new URL(req.url).pathname;
    const id = pathname.split("/").pop()?.trim() || "";

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return Response.json(
        { success: false, message: "Invalid room id", id },
        { status: 400 }
      );
    }

    const room = await Room.findById(id).lean();

    if (!room) {
      return Response.json(
        { success: false, message: "Room not found" },
        { status: 404 }
      );
    }

    return Response.json({ success: true, room });
  } catch (error) {
    console.log("GET ROOM BY ID ERROR:", error);
    return Response.json(
      { success: false, message: "Failed to fetch room" },
      { status: 500 }
    );
  }
}