import connectToDatabase from "@/src/lib/mongodb";

export async function GET() {
  try {
    await connectToDatabase();

    return Response.json({
      success: true,
      message: "Database connected successfully",
    });
  } catch (error) {
    return Response.json({
      success: false,
      message: "Database connection failed",
    });
  }
}