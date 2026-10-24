import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectToDatabase from "@/src/lib/mongodb";
import Booking from "@/src/models/Bookings";
import mongoose from "mongoose";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const role = (session?.user as any)?.role;

    if (!session || (role !== "admin" && role !== "reception")) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
    }

    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, message: "Invalid booking ID" }, { status: 400 });
    }

    await connectToDatabase();

    const booking = await Booking.findById(id).populate("room", "title");
    if (!booking) {
      return NextResponse.json({ success: false, message: "Booking not found" }, { status: 404 });
    }

    if (booking.status === "checked_in") {
      return NextResponse.json(
        { success: false, message: "Guest is already checked in" },
        { status: 400 }
      );
    }

    if (booking.status === "checked_out" || booking.status === "cancelled") {
      return NextResponse.json(
        { success: false, message: `Cannot check in: booking is currently '${booking.status}'` },
        { status: 400 }
      );
    }

    booking.status = "checked_in";
    await booking.save();

    return NextResponse.json({
      success: true,
      message: "Guest checked in successfully",
      booking,
    });
  } catch (error) {
    console.error("CHECK-IN ERROR:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
