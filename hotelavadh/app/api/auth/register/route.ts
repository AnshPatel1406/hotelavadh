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

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name || !email || !password) {
      return NextResponse.json({ success: false, message: "Invalid input" }, { status: 400 });
    }

    if (!emailRegex.test(email)) {
      return NextResponse.json({ success: false, message: "Invalid email format" }, { status: 400 });
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
  console.error("Register error:", e);

  return NextResponse.json(
    { success: false, message: "Server error" },
    { status: 500 }
  );
}
}