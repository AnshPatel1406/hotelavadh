import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import crypto from "crypto";
import connectToDatabase from "@/src/lib/mongodb";
import Booking from "@/src/models/Bookings";
import Payment from "@/src/models/Payments";
import User from "@/src/models/User";
import Room from "@/src/models/Room";
import { VerifyPaymentSchema } from "@/src/schemas/VerifyPaymentSchema";
import { sendBookingConfirmationEmail } from "@/src/lib/email";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !(session.user as any)?.id) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const result = VerifyPaymentSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: "Validation error", errors: result.error.issues },
        { status: 400 }
      );
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } = result.data;

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET as string)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return NextResponse.json({ success: false, message: "Invalid payment signature" }, { status: 400 });
    }

    await connectToDatabase();

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return NextResponse.json({ success: false, message: "Booking not found" }, { status: 404 });
    }

    if (booking.user.toString() !== (session.user as any).id) {
      return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
    }

    // Update booking status to confirmed
    booking.status = "confirmed";
    await booking.save();

    // Create payment record
    const payment = await Payment.create({
      booking: booking._id,
      amount: booking.totalPrice,
      paymentMethod: "razorpay",
      paymentStatus: "completed",
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
    });

    // Send confirmation email now that booking is confirmed
    const [user, room] = await Promise.all([
      User.findById(booking.user),
      Room.findById(booking.room),
    ]);

    if (user?.email && room) {
      await sendBookingConfirmationEmail({
        guestEmail: user.email,
        guestName: user.name || "Guest",
        bookingId: booking._id.toString(),
        roomTitle: room.title,
        checkInDate: new Date(booking.checkInDate).toLocaleDateString("en-IN", { dateStyle: "long" }),
        checkOutDate: new Date(booking.checkOutDate).toLocaleDateString("en-IN", { dateStyle: "long" }),
        guests: booking.guests,
        checkInCode: booking.checkInCode,
        qrDataUrl: booking.qrData,
      });
    }

    return NextResponse.json({ success: true, message: "Payment verified successfully", payment });
  } catch (error) {
    console.error("VERIFY RAZORPAY PAYMENT ERROR:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}

