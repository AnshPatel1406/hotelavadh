// import { NextResponse } from "next/server";
// import { connectToDatabase } from "../../../src/lib/mongodb";
// import Booking from "../../../src/models/Bookings";
// import Room from "../../../src/models/Rooms";

// export async function GET() {
//   await connectToDatabase();
//   const bookings = await Booking.find()
//     .populate("user", "name phone email")
//     .populate("room", "roomNumber type price isAvailable")
//     .sort({ checkInDate: 1 })
//     .lean();
//   return NextResponse.json(bookings);
// }

// export async function POST(request: Request) {
//   await connectToDatabase();
//   const payload = await request.json();
//   const { user, room, checkInDate, checkOutDate, totalPrice } = payload;

//   if (!user || !room || !checkInDate || !checkOutDate || totalPrice == null) {
//     return NextResponse.json(
//       { message: "user, room, checkInDate, checkOutDate, and totalPrice are required." },
//       { status: 400 }
//     );
//   }

//   const existingRoom = await Room.findById(room);
//   if (!existingRoom) {
//     return NextResponse.json({ message: "Room not found." }, { status: 404 });
//   }

//   if (!existingRoom.isAvailable) {
//     return NextResponse.json({ message: "Room is not available." }, { status: 409 });
//   }

//   const booking = await Booking.create({
//     user,
//     room,
//     checkInDate: new Date(checkInDate),
//     checkOutDate: new Date(checkOutDate),
//     totalPrice,
//   });

//   await Room.findByIdAndUpdate(room, { isAvailable: false });
//   return NextResponse.json(booking, { status: 201 });
// }
