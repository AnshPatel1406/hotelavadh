"use client";

import { useState } from "react";
import { QrCode, Loader2, X } from "lucide-react";

export function CheckInBookingModal({ booking, onCheckedIn }: { booking: any; onCheckedIn: () => void }) {
  const [checkInCode, setCheckInCode] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleCheckIn = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (checkInCode.length !== 6) {
      setError("Check-in code must be exactly 6 characters.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await fetch(`/api/bookings/${booking._id}/checkin`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ checkInCode: checkInCode.toUpperCase() }),
      });
      const data = await res.json();
      
      if (res.ok && data.success) {
        setSuccess(true);
        setTimeout(() => {
          onCheckedIn();
          setOpen(false);
          setSuccess(false);
          setCheckInCode("");
        }, 1500);
      } else {
        setError(data.message || "Failed to check in");
      }
    } catch (err) {
      console.error(err);
      setError("Error checking in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1 text-blue-600 hover:text-blue-900 transition-colors"
        title="Check-in Guest"
      >
        <QrCode className="h-4 w-4" /> <span className="text-xs">Check In</span>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-white shadow-2xl mx-4 overflow-hidden relative">
            
            {/* Header / Dismiss */}
            <button onClick={() => setOpen(false)} className="absolute right-4 top-4 rounded-md p-1 hover:bg-gray-100">
                <X className="h-5 w-5 text-gray-500" />
            </button>

            <form onSubmit={handleCheckIn} className="p-6 text-center pt-10">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 mb-4">
                <QrCode className="h-6 w-6 text-blue-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Check In Guest</h2>
              <p className="text-sm text-gray-500 mb-4">
                Please enter the 6-character check-in code for <strong>{booking.user?.name}</strong> to verify their booking for <strong>{booking.room?.title}</strong>.
              </p>

              <input
                type="text"
                placeholder="Enter 6-digit code"
                value={checkInCode}
                onChange={(e) => setCheckInCode(e.target.value.toUpperCase())}
                maxLength={6}
                className="w-full text-center tracking-[0.5em] font-mono text-2xl uppercase rounded-md border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                required
              />

              {error && (
                <div className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-600 border border-red-100">
                  {error}
                </div>
              )}
              {success && (
                <div className="mt-4 rounded-md bg-green-50 p-3 text-sm text-green-700 border border-green-100">
                  Guest successfully checked in.
                </div>
              )}
            </form>

            <div className="bg-gray-50 px-6 py-4 flex items-center gap-3 justify-end border-t">
              <button
                type="button"
                onClick={() => setOpen(false)}
                disabled={loading || success}
                className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors"
              >
                Go Back
              </button>
              <button
                type="button"
                onClick={handleCheckIn}
                disabled={loading || success || checkInCode.length !== 6}
                className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors disabled:opacity-60"
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                {loading ? "Verifying..." : "Confirm Check-in"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
