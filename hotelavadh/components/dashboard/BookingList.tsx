"use client";

import { useState } from "react";
import { Search, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AddBookingModal } from "@/components/dashboard/AddBookingModal";

export function BookingList({ initialBookings, rooms, role }: { initialBookings: any[]; rooms: any[]; role: string }) {
  const [bookings, setBookings] = useState(initialBookings);
  const [searchTerm, setSearchTerm] = useState("");
  const isAdmin = role === "admin";
  const isStaff = role === "admin" || role === "reception";

  const handleCancel = async (bookingId: string) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;

    try {
      const res = await fetch(`/api/bookings/${bookingId}/cancel`, { method: "PATCH" });
      if (res.ok) {
        setBookings(bookings.map((b) => b._id === bookingId ? { ...b, status: "cancelled" } : b));
      } else {
        alert("Failed to cancel booking");
      }
    } catch (err) {
      console.error(err);
      alert("Error cancelling booking");
    }
  };

  const filteredBookings = bookings.filter((b) => 
    b.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.user?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-3 flex-wrap">
        <CardTitle>Manage Bookings</CardTitle>
        <div className="flex items-center gap-3">
          {isStaff && <AddBookingModal rooms={rooms} onCreated={() => window.location.reload()} />}
          <div className="relative w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search guests..."
            className="h-9 w-full rounded-md border border-gray-300 pl-9 pr-4 text-sm outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-500">
            <thead className="bg-gray-50 text-xs uppercase text-gray-700">
              <tr>
                <th className="px-6 py-3">Guest</th>
                <th className="px-6 py-3">Room</th>
                <th className="px-6 py-3">Check In</th>
                <th className="px-6 py-3">Check Out</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((booking) => (
                <tr key={booking._id} className="border-b bg-white hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900">{booking.user?.name}</p>
                    <p className="text-xs text-gray-500">{booking.user?.email}</p>
                  </td>
                  <td className="px-6 py-4">{booking.room?.title}</td>
                  <td className="px-6 py-4">{new Date(booking.checkInDate).toLocaleDateString()}</td>
                  <td className="px-6 py-4">{new Date(booking.checkOutDate).toLocaleDateString()}</td>
                  <td className="px-6 py-4 capitalize">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      booking.status === "confirmed" ? "bg-green-100 text-green-800" :
                      booking.status === "cancelled" ? "bg-red-100 text-red-800" :
                      "bg-yellow-100 text-yellow-800"
                    }`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 flex items-center gap-3">
                    {booking.status === "confirmed" && isAdmin && (
                      <button onClick={() => handleCancel(booking._id)} className="flex items-center gap-1 text-red-600 hover:text-red-900" title="Cancel Booking">
                        <XCircle className="h-4 w-4" /> <span className="text-xs">Cancel</span>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {filteredBookings.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    No bookings found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
