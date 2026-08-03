import connectToDatabase from "@/src/lib/mongodb";
import Room from "@/src/models/Room";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Connect MongoDB
    await connectToDatabase();

    // Fetch only active rooms
    // Sort by room number ascending
    const rooms = await Room.find({
      isActive: true,
    }).sort({
      roomNumber: 1,
    });

    // Return rooms data
    return NextResponse.json({
      success: true,
      count: rooms.length,
      rooms,
    });

  } catch (error) {
    console.log("GET ROOMS ERROR:", error);
    return NextResponse.json({
      success: false,
      message: "Failed to fetch rooms",
    });
  }
}

import { CreateRoomSchemaAdmin } from "@/src/schemas/CreateRoomSchemaAdmin";
import { getServerSession } from "next-auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    if (!session || (session.user as any).role !== "admin") {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    const result = CreateRoomSchemaAdmin.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: "Validation error", errors: result.error.errors },
        { status: 400 }
      );
    }

    await connectToDatabase();
    
    // Check if room number already exists
    const existingRoom = await Room.findOne({ roomNumber: result.data.roomNumber });
    if (existingRoom) {
      return NextResponse.json({ success: false, message: "Room number already exists" }, { status: 409 });
    }

    const newRoom = await Room.create(result.data);

    return NextResponse.json({ success: true, room: newRoom }, { status: 201 });
  } catch (error) {
    console.log("POST ROOM ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create room" },
      { status: 500 }
    );
  }
}