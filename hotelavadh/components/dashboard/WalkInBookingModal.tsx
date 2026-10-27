"use client";

import { useState } from "react";
import { X, Plus, Loader2, CheckCircle2, User, Phone, Calendar, Users, DollarSign } from "lucide-react";

interface WalkInRoom {
  _id: string;
  roomNumber: number;
  title: string;
  type: string;
  pricePerNight: number;
  maxGuests: number;
}

interface WalkInBookingModalProps {
  room: WalkInRoom;
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}

export function WalkInBookingModal({
  room,
  open,
  onClose,
  onCreated,
}: WalkInBookingModalProps) {
  const todayStr = new Date().toISOString().slice(0, 10);
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().slice(0, 10);

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    guestName: "",
    guestPhone: "",
    guestEmail: "",
    checkInDate: todayStr,
    checkOutDate: tomorrowStr,
    guests: "1",
    specialRequests: "",
    checkInNow: true,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  if (!open) return null;

  // Calculate nights and estimated total
  const checkIn = new Date(form.checkInDate);
  const checkOut = new Date(form.checkOutDate);
  const nights =
    !isNaN(checkIn.getTime()) && !isNaN(checkOut.getTime()) && checkOut > checkIn
      ? Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))
      : 1;
  const estimatedTotal = nights * room.pricePerNight;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomId: room._id,
          guestName: form.guestName.trim(),
          guestPhone: form.guestPhone.trim(),
          guestEmail: form.guestEmail.trim(),
          checkInDate: form.checkInDate,
          checkOutDate: form.checkOutDate,
          guests: Number(form.guests),
          specialRequests: form.specialRequests.trim(),
          status: form.checkInNow ? "checked_in" : "confirmed",
          checkInNow: form.checkInNow,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.message || "Failed to create walk-in booking");
      } else {
        const refCode =
          data.booking?.checkInCode ||
          (data.booking?._id ? data.booking._id.toString().slice(-6).toUpperCase() : "");

        setSuccess(
          `Guest checked in successfully! Reference ID: #${refCode}. Room #${room.roomNumber} is now marked Occupied.`
        );

        setTimeout(() => {
          onClose();
          onCreated();
        }, 1500);
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg rounded-3xl bg-white shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header (Emerald Theme for Available Room) */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/20 border border-white/30 text-white font-mono font-bold text-lg shadow-xs">
              #{room.roomNumber}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white">Walk-in Check-in</h2>
                <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-[11px] font-semibold text-white">
                  Room #{room.roomNumber}
                </span>
              </div>
              <p className="text-xs text-emerald-100">
                {room.title} • ₹{room.pricePerNight.toLocaleString("en-IN")}/night
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-white/80 hover:text-white hover:bg-white/20 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-sm flex-1">
          {error && (
            <div className="p-3 bg-red-50 text-red-700 rounded-xl text-xs font-medium border border-red-200">
              {error}
            </div>
          )}
          {success && (
            <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-semibold border border-emerald-200">
              {success}
            </div>
          )}

          {/* Guest Name & Mobile Phone */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Guest Full Name *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <input
                  required
                  type="text"
                  placeholder="e.g. Ansh Patel"
                  value={form.guestName}
                  onChange={(e) => setForm({ ...form, guestName: e.target.value })}
                  className="w-full rounded-xl border border-gray-300 pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Mobile Number *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <input
                    required
                    type="tel"
                    placeholder="9426365544"
                    value={form.guestPhone}
                    onChange={(e) => setForm({ ...form, guestPhone: e.target.value })}
                    className="w-full rounded-xl border border-gray-300 pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Email (Optional)
                </label>
                <input
                  type="email"
                  placeholder="guest@gmail.com"
                  value={form.guestEmail}
                  onChange={(e) => setForm({ ...form, guestEmail: e.target.value })}
                  className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>
            </div>
          </div>

          {/* Stay Dates */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Check-in Date *
              </label>
              <input
                required
                type="date"
                value={form.checkInDate}
                onChange={(e) => setForm({ ...form, checkInDate: e.target.value })}
                className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Check-out Date *
              </label>
              <input
                required
                type="date"
                value={form.checkOutDate}
                onChange={(e) => setForm({ ...form, checkOutDate: e.target.value })}
                className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>
          </div>

          {/* Guests count & Rate Summary */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Number of Guests
              </label>
              <select
                value={form.guests}
                onChange={(e) => setForm({ ...form, guests: e.target.value })}
                className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
              >
                {Array.from({ length: room.maxGuests || 4 }).map((_, i) => (
                  <option key={i + 1} value={String(i + 1)}>
                    {i + 1} {i === 0 ? "Guest" : "Guests"}
                  </option>
                ))}
              </select>
            </div>

            <div className="rounded-xl bg-stone-50 border border-gray-200 p-2.5 flex flex-col justify-center">
              <div className="text-[11px] text-gray-500 uppercase">Total Estimate</div>
              <div className="text-base font-bold text-emerald-800 font-mono">
                ₹{estimatedTotal.toLocaleString("en-IN")}
                <span className="text-xs font-normal text-gray-500 ml-1">
                  ({nights} {nights === 1 ? "night" : "nights"})
                </span>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Special Requests / ID Notes
            </label>
            <input
              type="text"
              placeholder="e.g. Aadhaar verified, extra pillow requested"
              value={form.specialRequests}
              onChange={(e) => setForm({ ...form, specialRequests: e.target.value })}
              className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
          </div>

          {/* Direct Check-in Option */}
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-3.5 flex items-start gap-3">
            <input
              type="checkbox"
              id="checkInNow"
              checked={form.checkInNow}
              onChange={(e) => setForm({ ...form, checkInNow: e.target.checked })}
              className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 mt-0.5"
            />
            <label htmlFor="checkInNow" className="text-xs text-gray-800 cursor-pointer">
              <span className="font-bold text-emerald-900 block">
                Check In Immediately (Mark Room as Occupied / Red)
              </span>
              Guest is physically at reception desk. Check-in status will be active immediately.
            </label>
          </div>

          {/* Actions */}
          <div className="border-t border-gray-100 pt-3 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-4 py-2 text-xs font-medium text-gray-600 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-5 py-2.5 shadow-sm active:scale-95 transition-all disabled:opacity-50"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              <span>{loading ? "Processing..." : form.checkInNow ? "Confirm & Check In Now" : "Confirm Booking"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
