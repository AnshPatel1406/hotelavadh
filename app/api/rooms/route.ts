import connectToDatabase from "@/src/lib/mongodb";
import Room from "@/src/models/Room";

export async function GET() {
  try {
      return Response.json({
    success: true,
    message: "Demo Rooms API working",
  });
    // // Connect MongoDB
    // await connectToDatabase();

    // // Fetch only active rooms
    // // Sort by room number ascending
    // const rooms = await Room.find({
    //   isActive: true,
    // }).sort({
    //   roomNumber: 1,
    // });

    // // Return rooms data
    // return Response.json({
    //   success: true,
    //   count: rooms.length,
    //   rooms,
    // });

  } catch (error) {

    console.log("GET ROOMS ERROR:", error);

    return Response.json({
      success: false,
      message: "Failed to fetch rooms",
    });
  }
}