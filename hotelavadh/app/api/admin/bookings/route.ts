import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { z } from "zod";
import connectToDatabase from "@/src/lib/mongodb";
import Booking from "@/src/models/Bookings";
import Room from "@/src/models/Room";
import User from "@/src/models/User";
import { generateCheckInCode, generateQRCode } from "@/src/lib/checkin";

const AdminBookingSchema = z.object({
  roomId: z.string().min(1, "Room is required"),
  checkInDate: z.string().min(1, "Check-in date is required"),
  checkOutDate: z.string().min(1, "Check-out date is required"),
  guests: z.number().min(1, "At least 1 guest required"),
  guestName: z.string().min(1, "Guest name is required"),
  guestEmail: z.string().optional(),
  guestPhone: z.string().optional(),
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

    const { roomId, checkInDate, checkOutDate, guests, guestName, guestEmail, guestPhone, specialRequests } = result.data;

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

    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
    const totalPrice = nights * room.pricePerNight;

    // Find or create linked user
    const emailToUse = guestEmail?.trim()
      ? guestEmail.trim().toLowerCase()
      : `walkin_${Date.now()}@hotelavadh.local`;

    let linkedUser = await User.findOne({ email: emailToUse });
    if (!linkedUser) {
      linkedUser = await User.create({
        name: guestName.trim(),
        email: emailToUse,
        phone: guestPhone?.trim() || undefined,
        role: "user",
        provider: "credentials",
      });
    }

    // Generate random reference ID (like WhatsApp bookings)
    const referenceId = generateCheckInCode();

    const combinedNotes = [
      guestPhone?.trim() ? `Guest Phone: ${guestPhone.trim()}` : "",
      specialRequests?.trim() ? `Special Requests: ${specialRequests.trim()}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    // Create walk-in booking as confirmed
    const booking = await Booking.create({
      user: linkedUser._id,
      room: room._id,
      checkInDate: checkIn,
      checkOutDate: checkOut,
      guests,
      specialRequests: combinedNotes || undefined,
      totalPrice,
      status: "confirmed",
      checkInCode: referenceId,
      guestEmail: guestEmail?.trim() ? guestEmail.trim().toLowerCase() : undefined,
      guestName: guestName.trim(),
      bookedBy: role,
    });

    // Generate QR with booking ID & reference code
    const qrDataUrl = await generateQRCode(booking._id.toString(), referenceId);
    booking.qrData = qrDataUrl;
    await booking.save();

    // Link to user document
    await User.findByIdAndUpdate(linkedUser._id, { $push: { bookings: booking._id } });

    // No email codes or emails sent for manual/walk-in bookings
    return NextResponse.json({ success: true, booking }, { status: 201 });
  } catch (error) {
    console.error("ADMIN BOOKING ERROR:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
