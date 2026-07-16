import bcrypt from "bcryptjs";
import connectToDatabase from "@/src/lib/mongodb";
import User from "@/src/models/User";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const name = String(body.name || "").trim();
    const email = String(body.email || "").toLowerCase().trim();
    const password = String(body.password || "");

    if (!name || !email || password.length < 6) {
      return NextResponse.json({ success: false, message: "Invalid input" }, { status: 400 });
    }
 
    await connectToDatabase();

    const exists = await User.findOne({ email });
    if (exists) {
      return NextResponse.json({ success: false, message: "Email already registered" }, { status: 409 });
    }

    const hashed = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      password: hashed,
      provider: "credentials",
      role: "user",
    });

    return NextResponse.json({ success: true, message: "User created" });
  } catch (e) {
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}