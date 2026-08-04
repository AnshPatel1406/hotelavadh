import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectToDatabase from "@/src/lib/mongodb";
import Booking from "@/src/models/Bookings";
import mongoose from "mongoose";

export async function POST(
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

    const { description, amount } = await req.json();

    if (!description || !amount || amount <= 0) {
      return NextResponse.json({ success: false, message: "Invalid description or amount" }, { status: 400 });
    }

    await connectToDatabase();

    const booking = await Booking.findById(id);
    if (!booking) {
      return NextResponse.json({ success: false, message: "Booking not found" }, { status: 404 });
    }

    if (booking.status !== "checked_in" && booking.status !== "confirmed") {
      return NextResponse.json(
        { success: false, message: `Cannot add charges to booking with status '${booking.status}'` },
        { status: 400 }
      );
    }

    booking.extraCharges.push({
      description,
      amount: Number(amount),
      date: new Date(),
    });

    await booking.save();

    return NextResponse.json({
      success: true,
      message: "Charge added successfully",
      booking,
    });
  } catch (error) {
    console.error("ADD CHARGE ERROR:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
