import connectToDatabase from "@/src/lib/mongodb";
import Room from "@/src/models/Room";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid room id", id },
        { status: 400 }
      );
    }

    const room = await Room.findById(id).lean();

    if (!room) {
      return NextResponse.json(
        { success: false, message: "Room not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, room });
  } catch (error) {
    console.log("GET ROOM BY ID ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch room" },
      { status: 500 }
    );
  }
}

import { UpdateRoomSchemaAdmin } from "@/src/schemas/UpdateRoomSchemaAdmin";
import { getServerSession } from "next-auth";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession();
    if (!session || (session.user as any).role !== "admin") {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
    }

    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, message: "Invalid room id" }, { status: 400 });
    }

    const body = await req.json();
    const result = UpdateRoomSchemaAdmin.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: "Validation error", errors: result.error.issues },
        { status: 400 }
      );
    }

    await connectToDatabase();
    
    // If roomNumber is updated, ensure it's not taken
    if (result.data.roomNumber) {
      const existingRoom = await Room.findOne({ 
        roomNumber: result.data.roomNumber,
        _id: { $ne: id }
      });
      if (existingRoom) {
        return NextResponse.json({ success: false, message: "Room number already exists" }, { status: 409 });
      }
    }

    const updatedRoom = await Room.findByIdAndUpdate(
      id,
      { $set: result.data },
      { new: true, runValidators: true }
    );

    if (!updatedRoom) {
      return NextResponse.json({ success: false, message: "Room not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, room: updatedRoom });
  } catch (error) {
    console.log("PATCH ROOM ERROR:", error);
    return NextResponse.json({ success: false, message: "Failed to update room" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession();
    if (!session || (session.user as any).role !== "admin") {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
    }

    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, message: "Invalid room id" }, { status: 400 });
    }

    await connectToDatabase();

    const deletedRoom = await Room.findByIdAndDelete(id);

    if (!deletedRoom) {
      return NextResponse.json({ success: false, message: "Room not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Room deleted successfully" });
  } catch (error) {
    console.log("DELETE ROOM ERROR:", error);
    return NextResponse.json({ success: false, message: "Failed to delete room" }, { status: 500 });
  }
}