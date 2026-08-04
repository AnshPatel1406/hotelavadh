import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import connectToDatabase from "@/src/lib/mongodb";
import Booking from "@/src/models/Bookings";
import Room from "@/src/models/Room";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Banknote, Users, BedDouble, CalendarCheck } from "lucide-react";

export default async function AnalyticsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user || ((session.user as any).role !== "admin" && (session.user as any).role !== "reception")) {
    redirect("/dashboard");
  }

  await connectToDatabase();

  const bookings = await Booking.find().populate("room").lean();
  const rooms = await Room.find().lean();

  // Calculate metrics
  let totalRevenue = 0;
  let revenueByRoomType: Record<string, number> = {};
  
  const statusCounts = {
    pending: 0,
    confirmed: 0,
    checked_in: 0,
    checked_out: 0,
    cancelled: 0,
  };

  bookings.forEach((booking: any) => {
    // Count statuses
    if (statusCounts[booking.status as keyof typeof statusCounts] !== undefined) {
      statusCounts[booking.status as keyof typeof statusCounts]++;
    }

    // Revenue calculation (only for checked_out or confirmed/checked_in bookings that are paid)
    if (booking.status === "checked_out" || booking.status === "checked_in" || booking.status === "confirmed") {
      let bookingTotal = booking.totalPrice || 0;
      if (booking.extraCharges && Array.isArray(booking.extraCharges)) {
        bookingTotal += booking.extraCharges.reduce((acc: number, charge: any) => acc + charge.amount, 0);
      }
      totalRevenue += bookingTotal;

      const roomType = booking.room?.type || "Unknown";
      revenueByRoomType[roomType] = (revenueByRoomType[roomType] || 0) + bookingTotal;
    }
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground mt-2">
          Detailed breakdown of revenue and booking statistics.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <Banknote className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalRevenue.toLocaleString("en-IN")}</div>
            <p className="text-xs text-muted-foreground">From confirmed & completed stays</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Stays</CardTitle>
            <CalendarCheck className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statusCounts.checked_out}</div>
            <p className="text-xs text-muted-foreground">Total checked-out bookings</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Rooms</CardTitle>
            <BedDouble className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rooms.length}</div>
            <p className="text-xs text-muted-foreground">Active in system</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Guests</CardTitle>
            <Users className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {bookings.reduce((acc: number, b: any) => acc + (b.guests || 1), 0)}
            </div>
            <p className="text-xs text-muted-foreground">All-time hosted guests</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Booking Status Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(statusCounts).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between">
                  <span className="capitalize font-medium text-sm text-muted-foreground">{status.replace("_", " ")}</span>
                  <span className="font-bold">{count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue by Room Type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(revenueByRoomType).map(([type, amount]) => (
                <div key={type} className="flex items-center justify-between">
                  <span className="capitalize font-medium text-sm text-muted-foreground">{type}</span>
                  <span className="font-bold">₹{amount.toLocaleString("en-IN")}</span>
                </div>
              ))}
              {Object.keys(revenueByRoomType).length === 0 && (
                <div className="text-sm text-muted-foreground text-center py-4">No revenue data yet.</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
