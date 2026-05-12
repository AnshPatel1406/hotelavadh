// import { NextResponse } from "next/server";
// import { connectToDatabase } from "../../../src/lib/mongodb";
// import Room from "../../../src/models/Rooms";

// export async function GET() {
//   await connectToDatabase();
//   const rooms = await Room.find().sort({ roomNumber: 1 }).lean();
//   return NextResponse.json(rooms);
// }

// export async function POST(request: Request) {
//   await connectToDatabase();
//   const payload = await request.json();
//   const { roomNumber, type, price } = payload;

//   if (!roomNumber || !type || price == null) {
//     return NextResponse.json(
//       { message: "roomNumber, type, and price are required." },
//       { status: 400 }
//     );
//   }

//   const existingRoom = await Room.findOne({ roomNumber });
//   if (existingRoom) {
//     return NextResponse.json(
//       { message: `Room ${roomNumber} already exists.` },
//       { status: 409 }
//     );
//   }

//   const room = await Room.create({ roomNumber, type, price, isAvailable: true });
//   return NextResponse.json(room, { status: 201 });
// }
