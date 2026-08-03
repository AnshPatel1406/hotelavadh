import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectToDatabase from "@/src/lib/mongodb";
import Booking from "@/src/models/Bookings";
import mongoose from "mongoose";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession();
    if (!session || !(session.user as any)?.id) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, message: "Invalid booking id" }, { status: 400 });
    }

    await connectToDatabase();

    const booking = await Booking.findById(id);

    if (!booking) {
      return NextResponse.json({ success: false, message: "Booking not found" }, { status: 404 });
    }

    // Only allow the owner or an admin to cancel
    if (booking.user.toString() !== (session.user as any).id && (session.user as any).role !== "admin") {
      return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
    }

    if (booking.status === "cancelled") {
      return NextResponse.json({ success: false, message: "Booking is already cancelled" }, { status: 400 });
    }

    booking.status = "cancelled";
    await booking.save();

    return NextResponse.json({ success: true, message: "Booking cancelled successfully", booking });
  } catch (error) {
    console.error("CANCEL BOOKING ERROR:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
