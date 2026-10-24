"use client";

import { useState } from "react";
import { X, Plus, Loader2, CheckCircle2, Phone, Mail, Calendar, User, FileText } from "lucide-react";

interface Room {
  _id: string;
  title: string;
  roomNumber: number;
  pricePerNight: number;
  maxGuests: number;
}

export function AddBookingModal({
  rooms,
  onCreated,
}: {
  rooms: Room[];
  onCreated: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    roomId: "",
    guestName: "",
    guestPhone: "",
    guestEmail: "",
    checkInDate: "",
    checkOutDate: "",
    guests: "1",
    specialRequests: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const selectedRoom = rooms.find((r) => r._id === form.roomId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, guests: Number(form.guests) }),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.message || "Failed to create booking");
      } else {
        const refId = data.booking.checkInCode || (data.booking._id ? data.booking._id.toString().slice(-6).toUpperCase() : "");
        setSuccess(`Booking created successfully! Reference ID: #${refId}`);
        setForm({
          roomId: "",
          guestName: "",
          guestPhone: "",
          guestEmail: "",
          checkInDate: "",
          checkOutDate: "",
          guests: "1",
          specialRequests: "",
        });
        onCreated();
        setTimeout(() => {
          setOpen(false);
          setSuccess("");
        }, 2200);
      }
    } catch {
      setError("An unexpected error occurred while creating booking.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-xl bg-stone-900 px-4 py-2 text-xs font-medium text-white hover:bg-stone-800 transition shadow-sm active:scale-95"
      >
        <Plus className="h-3.5 w-3.5" />
        Add Walk-in Booking
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-lg rounded-3xl bg-white shadow-2xl mx-4 max-h-[92vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <div>
                <h2 className="text-base font-bold text-gray-900">Add Manual / Walk-in Booking</h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Generates an instant Reference ID without sending email codes.
                </p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4 text-xs">
              {/* Room Select */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  Select Room *
                </label>
                <select
                  required
                  className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-xs text-stone-900 outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 bg-white"
                  value={form.roomId}
                  onChange={(e) => setForm({ ...form, roomId: e.target.value })}
                >
                  <option value="">Choose an active room</option>
                  {rooms.map((r) => (
                    <option key={r._id} value={r._id}>
                      Room #{r.roomNumber} — {r.title} (₹{r.pricePerNight.toLocaleString("en-IN")}/night)
                    </option>
                  ))}
                </select>
              </div>

              {/* Guest Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="flex items-center gap-1 text-xs font-medium text-gray-700 mb-1">
                    <User className="h-3 w-3 text-gray-400" />
                    Guest Name *
                  </label>
                  <input
                    required
                    type="text"
                    className="w-full rounded-xl border border-gray-300 px-3 py-2 text-xs outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900"
                    placeholder="Guest Full Name"
                    value={form.guestName}
                    onChange={(e) => setForm({ ...form, guestName: e.target.value })}
                  />
                </div>
                <div>
                  <label className="flex items-center gap-1 text-xs font-medium text-gray-700 mb-1">
                    <Phone className="h-3 w-3 text-gray-400" />
                    Phone / WhatsApp Number
                  </label>
                  <input
                    type="tel"
                    className="w-full rounded-xl border border-gray-300 px-3 py-2 text-xs outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900"
                    placeholder="+91 98765 43210"
                    value={form.guestPhone}
                    onChange={(e) => setForm({ ...form, guestPhone: e.target.value })}
                  />
                </div>
              </div>

              {/* Guest Email (Optional) */}
              <div>
                <label className="flex items-center gap-1 text-xs font-medium text-gray-700 mb-1">
                  <Mail className="h-3 w-3 text-gray-400" />
                  Guest Email <span className="text-[10px] text-gray-400 font-normal">(optional)</span>
                </label>
                <input
                  type="email"
                  className="w-full rounded-xl border border-gray-300 px-3 py-2 text-xs outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900"
                  placeholder="guest@example.com (optional)"
                  value={form.guestEmail}
                  onChange={(e) => setForm({ ...form, guestEmail: e.target.value })}
                />
              </div>

              {/* Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="flex items-center gap-1 text-xs font-medium text-gray-700 mb-1">
                    <Calendar className="h-3 w-3 text-gray-400" />
                    Check-in Date & Time *
                  </label>
                  <input
                    required
                    type="datetime-local"
                    className="w-full rounded-xl border border-gray-300 px-3 py-2 text-xs outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900"
                    value={form.checkInDate}
                    onChange={(e) => setForm({ ...form, checkInDate: e.target.value })}
                  />
                </div>
                <div>
                  <label className="flex items-center gap-1 text-xs font-medium text-gray-700 mb-1">
                    <Calendar className="h-3 w-3 text-gray-400" />
                    Check-out Date & Time *
                  </label>
                  <input
                    required
                    type="datetime-local"
                    className="w-full rounded-xl border border-gray-300 px-3 py-2 text-xs outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900"
                    value={form.checkOutDate}
                    onChange={(e) => setForm({ ...form, checkOutDate: e.target.value })}
                  />
                </div>
              </div>

              {/* Guests Count */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Number of Guests{selectedRoom ? ` (Max allowed: ${selectedRoom.maxGuests})` : ""}
                </label>
                <input
                  required
                  type="number"
                  min={1}
                  max={selectedRoom?.maxGuests || 10}
                  className="w-full rounded-xl border border-gray-300 px-3 py-2 text-xs outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900"
                  value={form.guests}
                  onChange={(e) => setForm({ ...form, guests: e.target.value })}
                />
              </div>

              {/* Special Requests */}
              <div>
                <label className="flex items-center gap-1 text-xs font-medium text-gray-700 mb-1">
                  <FileText className="h-3 w-3 text-gray-400" />
                  Special Requests / Staff Notes
                </label>
                <textarea
                  rows={2}
                  className="w-full rounded-xl border border-gray-300 px-3 py-2 text-xs outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 resize-none"
                  placeholder="e.g. Paid in cash at reception, early check-in granted..."
                  value={form.specialRequests}
                  onChange={(e) => setForm({ ...form, specialRequests: e.target.value })}
                />
              </div>

              {/* Messages */}
              {error && (
                <div className="rounded-xl bg-rose-50 p-3 text-xs text-rose-700 border border-rose-200">
                  {error}
                </div>
              )}
              {success && (
                <div className="rounded-xl bg-emerald-50 p-3 text-xs text-emerald-800 border border-emerald-200 flex items-center gap-2 font-medium">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>{success}</span>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-4 py-2 text-xs font-medium text-gray-600 hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center gap-2 rounded-xl bg-stone-900 px-5 py-2.5 text-xs font-medium text-white hover:bg-stone-800 transition disabled:opacity-60 shadow-sm"
                >
                  {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  {loading ? "Creating..." : "Create Walk-in Booking"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
