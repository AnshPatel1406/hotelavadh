import { NextResponse } from "next/server";
import { connectToDatabase } from "../../../src/lib/mongodb";
import Payment from "../../../src/models/Payments";
import Booking from "../../../src/models/Bookings";

export async function GET() {
  await connectToDatabase();
  const payments = await Payment.find()
    .populate("booking", "user room totalPrice")
    .sort({ createdAt: -1 })
    .lean();
  return NextResponse.json(payments);
}

export async function POST(request: Request) {
  await connectToDatabase();
  const payload = await request.json();
  const { booking, amount, paymentMethod } = payload;

  if (!booking || amount == null || !paymentMethod) {
    return NextResponse.json(
      { message: "booking, amount, and paymentMethod are required." },
      { status: 400 }
    );
  }

  const existingBooking = await Booking.findById(booking);
  if (!existingBooking) {
    return NextResponse.json({ message: "Booking not found." }, { status: 404 });
  }

  const payment = await Payment.create({
    booking,
    amount,
    paymentMethod,
    paymentStatus: "completed",
  });

  return NextResponse.json(payment, { status: 201 });
}
