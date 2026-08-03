import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import Razorpay from "razorpay";
import connectToDatabase from "@/src/lib/mongodb";
import Booking from "@/src/models/Bookings";
import { CreatePaymentSchema } from "@/src/schemas/CreatePaymentSchema";

export async function POST(req: Request) {
  try {
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID as string,
      key_secret: process.env.RAZORPAY_KEY_SECRET as string,
    });
    const session = await getServerSession();
    if (!session || !(session.user as any)?.id) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const result = CreatePaymentSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: "Validation error", errors: result.error.issues },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const booking = await Booking.findById(result.data.bookingId);
    if (!booking) {
      return NextResponse.json({ success: false, message: "Booking not found" }, { status: 404 });
    }

    if (booking.user.toString() !== (session.user as any).id) {
      return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
    }

    if (booking.status !== "pending") {
      return NextResponse.json({ success: false, message: "Booking is not in pending state" }, { status: 400 });
    }

    // Razorpay amount is in paise (multiply by 100)
    const options = {
      amount: Math.round(booking.totalPrice * 100),
      currency: "INR",
      receipt: `receipt_${booking._id.toString()}`,
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error("CREATE RAZORPAY ORDER ERROR:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
