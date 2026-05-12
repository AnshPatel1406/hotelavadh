// import { NextResponse } from "next/server";
// import { connectToDatabase } from "../../../src/lib/mongodb";
// import User from "../../../src/models/User";

// export async function GET() {
//   await connectToDatabase();
//   const users = await User.find().select("name phone email role createdAt").lean();
//   return NextResponse.json(users);
// }

// export async function POST(request: Request) {
//   await connectToDatabase();
//   const payload = await request.json();
//   const { name, phone, email, password, role } = payload;

//   if (!name || !phone || !password) {
//     return NextResponse.json(
//       { message: "name, phone, and password are required." },
//       { status: 400 }
//     );
//   }

//   const existingUser = await User.findOne({ phone });
//   if (existingUser) {
//     return NextResponse.json(
//       { message: "A user with this phone already exists." },
//       { status: 409 }
//     );
//   }

//   const user = await User.create({ name, phone, email, password, role: role || "user" });
//   return NextResponse.json(user, { status: 201 });
// }
