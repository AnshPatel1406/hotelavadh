"use client";

import { useState } from "react";
import { CheckCircle2, Loader2, X, CreditCard, ShieldCheck } from "lucide-react";

interface ConfirmPaymentModalProps {
  booking: any;
  onConfirmed: () => void;
}

export function ConfirmPaymentModal({ booking, onConfirmed }: ConfirmPaymentModalProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const refCode =
    booking.checkInCode ||
    (booking._id ? booking._id.toString().slice(-6).toUpperCase() : "AVADH");

  const handleConfirmPayment = async () => {
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`/api/bookings/${booking._id}/confirm`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setSuccess(true);
        setTimeout(() => {
          onConfirmed();
          setOpen(false);
          setSuccess(false);
        }, 1200);
      } else {
        setError(data.message || "Failed to confirm payment");
      }
    } catch (err) {
      console.error("Confirm payment error:", err);
      setError("An unexpected error occurred while confirming payment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 border border-emerald-200 px-2.5 py-1 text-xs font-medium text-emerald-800 hover:bg-emerald-100 transition shadow-sm active:scale-95"
        title="Mark Payment Received & Confirm Booking"
      >
        <CreditCard className="h-3.5 w-3.5 text-emerald-600" />
        <span>Payment Received</span>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Header Dismiss */}
            <button
              onClick={() => setOpen(false)}
              className="absolute right-4 top-4 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="p-6 pt-7 space-y-4 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                <CheckCircle2 className="h-7 w-7" />
              </div>

              <div>
                <h2 className="text-xl font-bold text-gray-900">Mark Payment Received</h2>
                <p className="text-xs text-gray-500 mt-1">
                  Update reservation status from Pending to Confirmed.
                </p>
              </div>

              {/* Booking Reference card */}
              <div className="rounded-xl border border-gray-100 bg-gray-50/80 p-4 text-left space-y-2 text-xs">
                <div className="flex justify-between items-center pb-2 border-b border-gray-200/60">
                  <span className="text-gray-500 uppercase tracking-wider font-medium text-[10px]">
                    Booking Reference
                  </span>
                  <span className="font-mono font-bold text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded border border-emerald-200 text-sm">
                    #{refCode}
                  </span>
                </div>

                <div className="flex justify-between text-gray-700">
                  <span className="text-gray-500">Guest:</span>
                  <span className="font-medium">{booking.user?.name || booking.guestName || "Guest"}</span>
                </div>

                <div className="flex justify-between text-gray-700">
                  <span className="text-gray-500">Room:</span>
                  <span className="font-medium">{booking.room?.title || "Room"}</span>
                </div>

                <div className="flex justify-between text-gray-700">
                  <span className="text-gray-500">Amount Due:</span>
                  <span className="font-semibold text-gray-900">₹{booking.totalPrice?.toLocaleString("en-IN")}</span>
                </div>
              </div>

              {error && (
                <div className="rounded-lg bg-rose-50 p-3 text-xs text-rose-700 border border-rose-200">
                  {error}
                </div>
              )}

              {success && (
                <div className="rounded-lg bg-emerald-50 p-3 text-xs text-emerald-700 border border-emerald-200">
                  ✓ Payment marked as received! Booking is now Confirmed.
                </div>
              )}
            </div>

            <div className="bg-gray-50 px-6 py-4 flex items-center gap-3 justify-end border-t">
              <button
                type="button"
                onClick={() => setOpen(false)}
                disabled={loading || success}
                className="rounded-lg px-4 py-2 text-xs font-medium text-gray-600 hover:bg-gray-200 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmPayment}
                disabled={loading || success}
                className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-emerald-600 px-5 py-2 text-xs font-medium text-white hover:bg-emerald-700 transition disabled:opacity-60 shadow-sm"
              >
                {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                {loading ? "Confirming..." : "Confirm Payment"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
