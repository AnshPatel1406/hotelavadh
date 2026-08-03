import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectToDatabase from "@/src/lib/mongodb";
import User from "@/src/models/User";

export async function GET() {
  try {
    const session = await getServerSession();
    
    if (!session || !(session.user as any)?.id) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    const userId = (session.user as any).id;
    const user = await User.findById(userId).lean();

    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error("GET USER PROFILE ERROR:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}