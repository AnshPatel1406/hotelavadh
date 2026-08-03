import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import Razorpay from "razorpay";
import connectToDatabase from "@/src/lib/mongodb";
import Payment from "@/src/models/Payments";
import Booking from "@/src/models/Bookings";
import mongoose from "mongoose";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID as string,
  key_secret: process.env.RAZORPAY_KEY_SECRET as string,
});

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession();
    if (!session || (session.user as any).role !== "admin") {
      // Refunds are usually admin-only for safety
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
    }

    const { id: paymentId } = await params;
    if (!mongoose.Types.ObjectId.isValid(paymentId)) {
      return NextResponse.json({ success: false, message: "Invalid payment id" }, { status: 400 });
    }

    await connectToDatabase();

    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return NextResponse.json({ success: false, message: "Payment not found" }, { status: 404 });
    }

    if (payment.paymentStatus !== "completed" || payment.paymentMethod !== "razorpay") {
      return NextResponse.json({ success: false, message: "Only completed Razorpay payments can be refunded" }, { status: 400 });
    }

    if (!payment.razorpayPaymentId) {
      return NextResponse.json({ success: false, message: "Razorpay payment ID missing" }, { status: 400 });
    }

    // Call Razorpay API to issue full refund
    const refund = await razorpay.payments.refund(payment.razorpayPaymentId, {
      amount: Math.round(payment.amount * 100),
      speed: "normal"
    });

    // Update payment status
    payment.paymentStatus = "refunded";
    await payment.save();

    // Optionally update booking status if not already cancelled
    const booking = await Booking.findById(payment.booking);
    if (booking && booking.status !== "cancelled") {
      booking.status = "cancelled";
      await booking.save();
    }

    return NextResponse.json({ success: true, message: "Refund initiated successfully", refund });
  } catch (error) {
    console.error("RAZORPAY REFUND ERROR:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
