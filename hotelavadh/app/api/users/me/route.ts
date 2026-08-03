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

import { UpdateUserSchema } from "@/src/schemas/UpdateUserSchema";

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession();
    
    if (!session || !(session.user as any)?.id) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const result = UpdateUserSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: "Validation error", errors: result.error.errors },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const userId = (session.user as any).id;
    
    // We only update name, phone, image based on schema
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: result.data },
      { new: true, runValidators: true }
    ).lean();

    if (!updatedUser) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("PATCH USER PROFILE ERROR:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}