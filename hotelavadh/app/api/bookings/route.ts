import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectToDatabase from "@/src/lib/mongodb";
import Booking from "@/src/models/Bookings";
import Room from "@/src/models/Room";
import User from "@/src/models/User";
import { CreateBookingSchema } from "@/src/schemas/CreateBookingSchema";
import { generateCheckInCode, generateQRCode } from "@/src/lib/checkin";
import { sendBookingConfirmationEmail } from "@/src/lib/email";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !(session.user as any)?.id) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    // Fetch bookings for the logged-in user, populate room details
    const bookings = await Booking.find({ user: (session.user as any).id })
      .populate("room", "title type pricePerNight images")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ success: true, count: bookings.length, bookings });
  } catch (error) {
    console.error("GET BOOKINGS ERROR:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !(session.user as any)?.id) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const result = CreateBookingSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: "Validation error", errors: result.error.issues },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Verify room exists and is active
    const room = await Room.findById(result.data.roomId);
    if (!room || !room.isActive) {
      return NextResponse.json({ success: false, message: "Room not available" }, { status: 400 });
    }

    if (result.data.guests > room.maxGuests) {
      return NextResponse.json(
        { success: false, message: `Maximum ${room.maxGuests} guests allowed for this room` },
        { status: 400 }
      );
    }

    // Check for conflicting bookings for this room
    const checkIn = new Date(result.data.checkInDate);
    const checkOut = new Date(result.data.checkOutDate);

    const conflictingBooking = await Booking.findOne({
      room: room._id,
      status: { $in: ["confirmed", "checked_in"] },
      $or: [
        { checkInDate: { $lt: checkOut }, checkOutDate: { $gt: checkIn } }
      ]
    });

    if (conflictingBooking) {
      return NextResponse.json({ success: false, message: "Room is already booked for these dates" }, { status: 409 });
    }

    // Calculate nights and price
    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
    const totalPrice = nights * room.pricePerNight;

    // Generate check-in code and QR
    const checkInCode = generateCheckInCode();

    // Create Booking first to get the ID
    const booking = await Booking.create({
      user: (session.user as any).id,
      room: room._id,
      checkInDate: checkIn,
      checkOutDate: checkOut,
      guests: result.data.guests,
      specialRequests: result.data.specialRequests,
      totalPrice,
      status: "pending",
      checkInCode,
      bookedBy: "user",
    });

    // Generate QR with booking ID baked in
    const qrDataUrl = await generateQRCode(booking._id.toString(), checkInCode);
    booking.qrData = qrDataUrl;
    await booking.save();

    // Push booking ID to user
    const user = await User.findByIdAndUpdate(
      (session.user as any).id,
      { $push: { bookings: booking._id } },
      { new: true }
    );

    // Send confirmation email (non-blocking — don't fail the booking if email fails)
    if (user?.email) {
      sendBookingConfirmationEmail({
        guestEmail: user.email,
        guestName: user.name || "Guest",
        bookingId: booking._id.toString(),
        roomTitle: room.title,
        checkInDate: checkIn.toLocaleDateString("en-IN", { dateStyle: "long" }),
        checkOutDate: checkOut.toLocaleDateString("en-IN", { dateStyle: "long" }),
        guests: result.data.guests,
        checkInCode,
        qrDataUrl,
      }).catch((err) => console.error("Email send failed:", err));
    }

    return NextResponse.json({ success: true, booking }, { status: 201 });
  } catch (error) {
    console.error("POST BOOKING ERROR:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}