"use client";

import { useState } from "react";
import { CheckCircle, Loader2, X } from "lucide-react";

export function CheckOutBookingModal({ booking, onCompleted }: { booking: any; onCompleted: () => void }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleCheckOut = async () => {
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`/api/bookings/${booking._id}/checkout`, { method: "PATCH" });
      const data = await res.json();
      
      if (res.ok && data.success) {
        setSuccess(true);
        setTimeout(() => {
          onCompleted();
          setOpen(false);
          setSuccess(false);
        }, 1500);
      } else {
        setError(data.message || "Failed to complete order");
      }
    } catch (err) {
      console.error(err);
      setError("Error completing order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1 rounded-lg bg-stone-100 border border-stone-300 px-2.5 py-1 text-xs font-medium text-stone-800 hover:bg-stone-200 transition shadow-sm active:scale-95"
        title="Check-out Guest & Finish Order"
      >
        <CheckCircle className="h-3.5 w-3.5 text-stone-700" />
        <span>Check Out / Finish</span>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white shadow-2xl mx-4 overflow-hidden relative">
            
            {/* Header / Dismiss */}
            <button onClick={() => setOpen(false)} className="absolute right-4 top-4 rounded-md p-1 hover:bg-gray-100">
                <X className="h-5 w-5 text-gray-500" />
            </button>

            <div className="p-6 text-center pt-8 space-y-3">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-stone-100 text-stone-800 mb-2">
                <CheckCircle className="h-7 w-7" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Check Out & Finish Order?</h2>

              <div className="inline-block rounded-lg bg-stone-100 border border-stone-200 px-3 py-1 font-mono text-xs font-bold text-stone-800">
                Ref: #{booking.checkInCode || (booking._id ? booking._id.toString().slice(-6).toUpperCase() : "")}
              </div>

              <p className="text-xs text-gray-500 leading-relaxed">
                Confirm check-out for <strong>{booking.user?.name || booking.guestName}</strong> in <strong>{booking.room?.title}</strong>. This will mark the booking status as <strong>Order Finished (Checked Out)</strong>.
              </p>

              {error && (
                <div className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-600 border border-red-100">
                  {error}
                </div>
              )}
              {success && (
                <div className="mt-4 rounded-md bg-green-50 p-3 text-sm text-green-700 border border-green-100">
                  Order completed successfully.
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
                onClick={handleCheckOut}
                disabled={loading || success}
                className="flex items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 transition-colors disabled:opacity-60"
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                {loading ? "Completing..." : "Complete Order"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
