"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AddBookingModal } from "@/components/dashboard/AddBookingModal";
import { CheckOutBookingModal } from "@/components/dashboard/CheckOutBookingModal";
import { CheckInBookingModal } from "@/components/dashboard/CheckInBookingModal";
import { AddChargeModal } from "@/components/dashboard/AddChargeModal";
import { ReceiptModal } from "@/components/dashboard/ReceiptModal";
import { CancelBookingModal } from "@/components/dashboard/CancelBookingModal";
import { ConfirmPaymentModal } from "@/components/dashboard/ConfirmPaymentModal";

export function BookingList({
  initialBookings,
  rooms,
  role,
}: {
  initialBookings: any[];
  rooms: any[];
  role: string;
}) {
  const [bookings] = useState(initialBookings);
  const [searchTerm, setSearchTerm] = useState("");
  const isStaff = role === "admin" || role === "reception";

  const filteredBookings = bookings.filter((b) => {
    const q = searchTerm.toLowerCase().trim();
    if (!q) return true;
    const refCode = (
      b.checkInCode ||
      (b._id ? b._id.toString().slice(-6) : "")
    ).toLowerCase();
    const guestName = (b.user?.name || b.guestName || "").toLowerCase();
    const guestEmail = (b.user?.email || b.guestEmail || "").toLowerCase();
    const roomTitle = (b.room?.title || "").toLowerCase();
    const notes = (b.specialRequests || "").toLowerCase();
    return (
      refCode.includes(q) ||
      guestName.includes(q) ||
      guestEmail.includes(q) ||
      roomTitle.includes(q) ||
      notes.includes(q)
    );
  });

  return (
    <Card className="rounded-2xl border border-gray-200/80 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between gap-4 flex-wrap border-b border-gray-100 pb-5">
        <div>
          <CardTitle className="text-xl font-bold text-gray-900">Manage Reservations</CardTitle>
          <p className="text-xs text-gray-500 mt-1">
            Track, verify, check in, and check out guest bookings using their reference ID.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {isStaff && (
            <AddBookingModal rooms={rooms} onCreated={() => window.location.reload()} />
          )}

          <div className="relative w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by Ref ID, guest, room..."
              className="h-9 w-full rounded-xl border border-gray-300 pl-9 pr-4 text-xs outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 transition"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-600">
            <thead className="bg-gray-50/80 text-[11px] uppercase tracking-wider text-gray-700 border-b border-gray-200">
              <tr>
                <th className="px-5 py-3.5">Reference ID</th>
                <th className="px-5 py-3.5">Guest</th>
                <th className="px-5 py-3.5">Room</th>
                <th className="px-5 py-3.5">Dates</th>
                <th className="px-5 py-3.5">Amount</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredBookings.map((booking) => {
                const refCode =
                  booking.checkInCode ||
                  (booking._id
                    ? booking._id.toString().slice(-6).toUpperCase()
                    : "AVADH");

                return (
                  <tr key={booking._id} className="bg-white hover:bg-stone-50/60 transition">
                    {/* Booking Reference ID */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold text-xs text-stone-900 bg-stone-100 px-2.5 py-1 rounded-md border border-stone-300 shadow-2xs">
                          #{refCode}
                        </span>
                      </div>
                    </td>

                    {/* Guest details */}
                    <td className="px-5 py-4">
                      <p className="font-semibold text-gray-900">
                        {booking.user?.name || booking.guestName || "Guest"}
                      </p>
                      <p className="text-gray-500 text-[11px]">
                        {booking.user?.email || booking.guestEmail || ""}
                      </p>
                      {booking.specialRequests && booking.specialRequests.includes("Guest Phone:") && (
                        <p className="text-[11px] text-emerald-700 font-mono mt-0.5">
                          {booking.specialRequests.split("\n")[0]}
                        </p>
                      )}
                    </td>

                    {/* Room details */}
                    <td className="px-5 py-4">
                      <p className="font-medium text-gray-900">{booking.room?.title || "Room"}</p>
                      <p className="text-[11px] text-gray-500">
                        {booking.guests} guest{booking.guests > 1 ? "s" : ""}
                      </p>
                    </td>

                    {/* Dates */}
                    <td className="px-5 py-4 whitespace-nowrap text-[11px]">
                      <div>
                        In:{" "}
                        <strong>
                          {new Date(booking.checkInDate).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                          })}
                        </strong>
                      </div>
                      <div>
                        Out:{" "}
                        <strong>
                          {new Date(booking.checkOutDate).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                          })}
                        </strong>
                      </div>
                    </td>

                    {/* Amount */}
                    <td className="px-5 py-4 font-semibold text-gray-900 whitespace-nowrap">
                      ₹{booking.totalPrice?.toLocaleString("en-IN")}
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                          booking.status === "confirmed"
                            ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                            : booking.status === "checked_in"
                            ? "bg-blue-100 text-blue-800 border border-blue-200"
                            : booking.status === "checked_out"
                            ? "bg-stone-100 text-stone-800 border border-stone-300"
                            : booking.status === "cancelled"
                            ? "bg-rose-100 text-rose-800 border border-rose-200"
                            : "bg-amber-100 text-amber-800 border border-amber-200"
                        }`}
                      >
                        {booking.status === "checked_out"
                          ? "Order Finished"
                          : booking.status === "pending"
                          ? "Pending Payment"
                          : booking.status.replace("_", " ")}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 flex-wrap">
                        {/* Status: PENDING */}
                        {booking.status === "pending" && isStaff && (
                          <>
                            <ConfirmPaymentModal
                              booking={booking}
                              onConfirmed={() => window.location.reload()}
                            />
                            <CheckInBookingModal
                              booking={booking}
                              onCheckedIn={() => window.location.reload()}
                            />
                            <CancelBookingModal
                              booking={booking}
                              onCanceled={() => window.location.reload()}
                            />
                          </>
                        )}

                        {/* Status: CONFIRMED */}
                        {booking.status === "confirmed" && isStaff && (
                          <>
                            <CheckInBookingModal
                              booking={booking}
                              onCheckedIn={() => window.location.reload()}
                            />
                            <CheckOutBookingModal
                              booking={booking}
                              onCompleted={() => window.location.reload()}
                            />
                            <CancelBookingModal
                              booking={booking}
                              onCanceled={() => window.location.reload()}
                            />
                          </>
                        )}

                        {/* Status: CHECKED IN */}
                        {booking.status === "checked_in" && isStaff && (
                          <>
                            <CheckOutBookingModal
                              booking={booking}
                              onCompleted={() => window.location.reload()}
                            />
                            <AddChargeModal
                              booking={booking}
                              onAdded={() => window.location.reload()}
                            />
                            <ReceiptModal booking={booking} />
                          </>
                        )}

                        {/* Status: CHECKED OUT (Order Finished) */}
                        {booking.status === "checked_out" && (
                          <div className="flex items-center gap-2">
                            <ReceiptModal booking={booking} />
                            <span className="text-[11px] text-stone-400 italic">
                              Order Finished
                            </span>
                          </div>
                        )}

                        {/* Status: CANCELLED */}
                        {booking.status === "cancelled" && (
                          <span className="text-[11px] text-rose-400 italic">Cancelled</span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredBookings.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    No bookings found matching &quot;{searchTerm}&quot;.
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
