import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { z } from "zod";
import connectToDatabase from "@/src/lib/mongodb";
import Booking from "@/src/models/Bookings";
import Room from "@/src/models/Room";
import User from "@/src/models/User";
import { generateCheckInCode, generateQRCode } from "@/src/lib/checkin";
import { sendBookingConfirmationEmail } from "@/src/lib/email";

const AdminBookingSchema = z.object({
  roomId: z.string().min(1, "Room is required"),
  checkInDate: z.string().min(1, "Check-in date is required"),
  checkOutDate: z.string().min(1, "Check-out date is required"),
  guests: z.number().min(1, "At least 1 guest required"),
  guestName: z.string().min(1, "Guest name is required"),
  guestEmail: z.string().email("Valid guest email is required"),
  specialRequests: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const role = (session?.user as any)?.role;

    if (!session || (role !== "admin" && role !== "reception")) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    const result = AdminBookingSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: "Validation error", errors: result.error.issues },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const { roomId, checkInDate, checkOutDate, guests, guestName, guestEmail, specialRequests } = result.data;

    // Verify room
    const room = await Room.findById(roomId);
    if (!room || !room.isActive) {
      return NextResponse.json({ success: false, message: "Room not available" }, { status: 400 });
    }

    if (guests > room.maxGuests) {
      return NextResponse.json(
        { success: false, message: `Maximum ${room.maxGuests} guests allowed` },
        { status: 400 }
      );
    }

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    if (checkOut <= checkIn) {
      return NextResponse.json({ success: false, message: "Check-out must be after check-in" }, { status: 400 });
    }

    // Check conflicts
    const conflict = await Booking.findOne({
      room: room._id,
      status: { $in: ["confirmed", "checked_in"] },
      $or: [{ checkInDate: { $lt: checkOut }, checkOutDate: { $gt: checkIn } }],
    });

    if (conflict) {
      return NextResponse.json({ success: false, message: "Room is already booked for these dates" }, { status: 409 });
    }

    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
    const totalPrice = nights * room.pricePerNight;

    // Try to find or create a user by email for linking
    let linkedUser = await User.findOne({ email: guestEmail.toLowerCase() });
    if (!linkedUser) {
      linkedUser = await User.create({
        name: guestName,
        email: guestEmail.toLowerCase(),
        role: "user",
        provider: "credentials",
      });
    }

    const checkInCode = generateCheckInCode();

    // Create booking as confirmed immediately (walk-in, no payment needed)
    const booking = await Booking.create({
      user: linkedUser._id,
      room: room._id,
      checkInDate: checkIn,
      checkOutDate: checkOut,
      guests,
      specialRequests,
      totalPrice,
      status: "confirmed",
      checkInCode,
      guestEmail: guestEmail.toLowerCase(),
      guestName,
      bookedBy: role,
    });

    // Generate QR
    const qrDataUrl = await generateQRCode(booking._id.toString(), checkInCode);
    booking.qrData = qrDataUrl;
    await booking.save();

    // Link to user
    await User.findByIdAndUpdate(linkedUser._id, { $push: { bookings: booking._id } });

    // Send email (must await on Vercel)
    await sendBookingConfirmationEmail({
      guestEmail: guestEmail.toLowerCase(),
      guestName,
      bookingId: booking._id.toString(),
      roomTitle: room.title,
      checkInDate: checkIn.toLocaleString("en-IN", { dateStyle: "long", timeStyle: "short" }),
      checkOutDate: checkOut.toLocaleString("en-IN", { dateStyle: "long", timeStyle: "short" }),
      guests,
      checkInCode,
      qrDataUrl,
    });

    return NextResponse.json({ success: true, booking }, { status: 201 });
  } catch (error) {
    console.error("ADMIN BOOKING ERROR:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
