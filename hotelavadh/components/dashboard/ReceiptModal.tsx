"use client";

import { useState } from "react";
import { Receipt, X, Printer } from "lucide-react";

export function ReceiptModal({ booking }: { booking: any }) {
  const [open, setOpen] = useState(false);

  // Calculate nights
  const checkIn = new Date(booking.checkInDate);
  const checkOut = new Date(booking.checkOutDate);
  const timeDiff = checkOut.getTime() - checkIn.getTime();
  let nights = Math.ceil(timeDiff / (1000 * 3600 * 24));
  if (nights <= 0) nights = 1; // Default to 1 night if same day

  const basePrice = booking.totalPrice; // assuming this is already pricePerNight * nights
  const extraChargesTotal = (booking.extraCharges || []).reduce((sum: number, charge: any) => sum + charge.amount, 0);
  const grandTotal = basePrice + extraChargesTotal;

  const handlePrint = () => {
    // In a real app, you might want to open a new window or use a dedicated print stylesheet
    window.print();
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1 text-teal-600 hover:text-teal-900 transition-colors"
        title="View Receipt"
      >
        <Receipt className="h-4 w-4" /> <span className="text-xs">Receipt</span>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 print:bg-white print:p-0">
          <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl overflow-hidden print:shadow-none print:w-full print:max-w-none">
            <button
                onClick={() => setOpen(false)}
                className="absolute right-4 top-4 rounded-md p-1 hover:bg-gray-100 transition-colors z-10 print:hidden"
              >
                <X className="h-5 w-5 text-gray-500" />
            </button>

            <div className="p-8 print:p-4">
              {/* Receipt Header */}
              <div className="text-center border-b pb-6 mb-6">
                <h1 className="text-2xl font-bold tracking-tight text-gray-900">HOTEL AVADH</h1>
                <p className="text-sm text-gray-500">Official Checkout Receipt</p>
              </div>

              {/* Guest & Stay Details */}
              <div className="grid grid-cols-2 gap-4 text-sm mb-6">
                <div>
                  <p className="text-gray-500 mb-1">Guest Name:</p>
                  <p className="font-semibold">{booking.user?.name || booking.guestName || "Guest"}</p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1">Room Details:</p>
                  <p className="font-semibold">{booking.room?.title} (Room #{booking.room?.roomNumber})</p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1">Check-in:</p>
                  <p className="font-medium">{checkIn.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}</p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1">Check-out:</p>
                  <p className="font-medium">{checkOut.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}</p>
                </div>
              </div>

              {/* Itemized Bill */}
              <div className="border-t border-b py-4 mb-4">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-500">
                      <th className="pb-2 font-medium">Description</th>
                      <th className="pb-2 font-medium text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Base Charge */}
                    <tr>
                      <td className="py-2">
                        Room Charge ({nights} night{nights > 1 ? "s" : ""})
                      </td>
                      <td className="py-2 text-right">₹{basePrice.toFixed(2)}</td>
                    </tr>
                    
                    {/* Extra Charges */}
                    {(booking.extraCharges || []).map((charge: any, idx: number) => (
                      <tr key={idx} className="text-gray-600">
                        <td className="py-2">
                          <span className="block">{charge.description}</span>
                          <span className="text-xs text-gray-400">{new Date(charge.date).toLocaleString("en-IN", { dateStyle: "short", timeStyle: "short" })}</span>
                        </td>
                        <td className="py-2 text-right">₹{charge.amount.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Total */}
              <div className="flex justify-between items-center text-lg font-bold text-gray-900 mb-8">
                <span>Grand Total</span>
                <span>₹{grandTotal.toFixed(2)}</span>
              </div>

              {/* Note about GST */}
              <p className="text-center text-xs text-gray-400 mb-6">
                * Note: GST formatting and detailed tax breakdown will be added in a future update.
              </p>

              {/* Actions */}
              <div className="flex justify-center print:hidden">
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-2 rounded-lg bg-gray-900 px-6 py-2 text-sm font-medium text-white hover:bg-gray-800 transition-colors"
                >
                  <Printer className="h-4 w-4" /> Print Receipt
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
