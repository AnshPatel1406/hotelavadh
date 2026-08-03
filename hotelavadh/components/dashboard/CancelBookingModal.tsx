"use client";

import { useState } from "react";
import { XCircle, Loader2, X } from "lucide-react";

export function CancelBookingModal({ booking, onCanceled }: { booking: any; onCanceled: () => void }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleCancel = async () => {
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`/api/bookings/${booking._id}/cancel`, { method: "PATCH" });
      const data = await res.json();
      
      if (res.ok && data.success) {
        setSuccess(true);
        setTimeout(() => {
          onCanceled();
          setOpen(false);
          setSuccess(false);
        }, 1500);
      } else {
        setError(data.message || "Failed to cancel booking");
      }
    } catch (err) {
      console.error(err);
      setError("Error cancelling booking");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1 text-red-600 hover:text-red-900 transition-colors"
        title="Cancel Booking"
      >
        <XCircle className="h-4 w-4" /> <span className="text-xs">Cancel</span>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-white shadow-2xl mx-4 overflow-hidden relative">
            
            {/* Header / Dismiss */}
            <button onClick={() => setOpen(false)} className="absolute right-4 top-4 rounded-md p-1 hover:bg-gray-100">
                <X className="h-5 w-5 text-gray-500" />
            </button>

            <div className="p-6 text-center pt-10">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100 mb-4">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Cancel Booking?</h2>
              <p className="text-sm text-gray-500">
                Are you sure you want to cancel the booking for <strong>{booking.user?.name}</strong> in <strong>{booking.room?.title}</strong>? This action cannot be undone.
              </p>

              {error && (
                <div className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-600 border border-red-100">
                  {error}
                </div>
              )}
              {success && (
                <div className="mt-4 rounded-md bg-green-50 p-3 text-sm text-green-700 border border-green-100">
                  Booking cancelled successfully.
                </div>
              )}
            </div>

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
                onClick={handleCancel}
                disabled={loading || success}
                className="flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition-colors disabled:opacity-60"
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                {loading ? "Cancelling..." : "Confirm Cancel"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
