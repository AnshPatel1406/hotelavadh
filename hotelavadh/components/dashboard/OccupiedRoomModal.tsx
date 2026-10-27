"use client";

import { useState } from "react";
import {
  X,
  User,
  Phone,
  Mail,
  Calendar,
  LogOut,
  Plus,
  Loader2,
  DollarSign,
  MessageCircle,
  Clock,
  ShieldCheck,
  Receipt,
} from "lucide-react";
import { AddChargeModal } from "@/components/dashboard/AddChargeModal";

interface OccupiedRoomModalProps {
  room: {
    _id: string;
    roomNumber: number;
    title: string;
    type: string;
    pricePerNight: number;
    activeBooking: {
      _id: string;
      checkInCode: string;
      guestName: string;
      guestPhone?: string;
      guestEmail?: string;
      checkInDate: string;
      checkOutDate: string;
      totalPrice: number;
      extraCharges?: { description: string; amount: number; date?: string }[];
      guests: number;
      status: string;
      specialRequests?: string;
    };
  };
  open: boolean;
  onClose: () => void;
  onRefresh: () => void;
}

export function OccupiedRoomModal({
  room,
  open,
  onClose,
  onRefresh,
}: OccupiedRoomModalProps) {
  const [checkingOut, setCheckingOut] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  if (!open || !room.activeBooking) return null;

  const b = room.activeBooking;

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "N/A";
    const d = new Date(dateStr);
    return isNaN(d.getTime())
      ? dateStr
      : d.toLocaleDateString("en-IN", {
          weekday: "short",
          day: "numeric",
          month: "short",
          year: "numeric",
        });
  };

  const extraTotal = (b.extraCharges || []).reduce((acc, c) => acc + (c.amount || 0), 0);
  const grandTotal = b.totalPrice + extraTotal;

  const handleCheckOut = async () => {
    if (!confirm(`Confirm check-out for ${b.guestName} (Room #${room.roomNumber})?`)) {
      return;
    }

    setCheckingOut(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch(`/api/bookings/${b._id}/checkout`, {
        method: "PATCH",
      });
      const data = await res.json();

      if (!data.success) {
        setError(data.message || "Failed to check out guest");
      } else {
        setSuccess(`Guest checked out successfully! Room #${room.roomNumber} is now vacant.`);
        setTimeout(() => {
          onClose();
          onRefresh();
        }, 1200);
      }
    } catch {
      setError("An error occurred during check-out. Please try again.");
    } finally {
      setCheckingOut(false);
    }
  };

  const whatsappPhone = b.guestPhone ? b.guestPhone.replace(/[^0-9]/g, "") : "";
  const whatsappUrl = whatsappPhone
    ? `https://wa.me/${whatsappPhone.startsWith("91") ? whatsappPhone : `91${whatsappPhone}`}?text=Hello%20${encodeURIComponent(b.guestName)},%20this%20is%20Hotel%20Avadh%20Reception%20regarding%20your%20stay%20in%20Room%20%23${room.roomNumber}.`
    : "";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg rounded-3xl bg-white shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header (Rich Rose / Red Theme) */}
        <div className="bg-gradient-to-r from-rose-600 via-rose-700 to-red-800 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 border border-white/25 text-white font-mono font-bold text-lg shadow-xs">
              #{room.roomNumber}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold tracking-tight text-white">
                  Room #{room.roomNumber}
                </h2>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-2.5 py-0.5 text-[11px] font-semibold text-white">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 animate-pulse" />
                  Occupied
                </span>
              </div>
              <p className="text-xs text-rose-100 font-medium">
                {room.title} • {room.type.toUpperCase()}
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

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-sm">
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

          {/* Guest Profile Card */}
          <div className="rounded-2xl border border-gray-200 bg-stone-50/70 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
                Current Guest Information
              </span>
              <span className="inline-flex items-center gap-1 rounded-md bg-stone-900 text-white font-mono text-xs px-2 py-0.5 font-bold">
                <ShieldCheck className="h-3 w-3 text-[#E6CA65]" />
                #{b.checkInCode || "REF"}
              </span>
            </div>

            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-full bg-rose-100 border border-rose-200 flex items-center justify-center text-rose-700 font-bold text-base shrink-0">
                {b.guestName.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-base font-bold text-gray-900 truncate">
                  {b.guestName}
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600 mt-1">
                  {b.guestPhone ? (
                    <span className="flex items-center gap-1 font-mono text-gray-800">
                      <Phone className="h-3 w-3 text-gray-400" />
                      {b.guestPhone}
                    </span>
                  ) : (
                    <span className="text-gray-400">No phone provided</span>
                  )}

                  {b.guestEmail && (
                    <span className="flex items-center gap-1 text-gray-600 truncate">
                      <Mail className="h-3 w-3 text-gray-400" />
                      {b.guestEmail}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Guest Communication */}
            {whatsappUrl && (
              <div className="pt-1 flex gap-2">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3 py-1.5 transition-colors shadow-2xs"
                >
                  <MessageCircle className="h-3.5 w-3.5" />
                  Chat on WhatsApp
                </a>
                <a
                  href={`tel:${b.guestPhone}`}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 text-gray-800 text-xs font-semibold px-3 py-1.5 transition-colors"
                >
                  <Phone className="h-3.5 w-3.5 text-gray-500" />
                  Call Guest
                </a>
              </div>
            )}
          </div>

          {/* Stay Dates & Capacity */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-gray-200 bg-white p-3.5 space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <Calendar className="h-3.5 w-3.5 text-gray-400" />
                <span>Check-in</span>
              </div>
              <div className="font-semibold text-gray-900 text-sm">
                {formatDate(b.checkInDate)}
              </div>
              <div className="text-[11px] text-gray-400">From 12:00 PM</div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-3.5 space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <Clock className="h-3.5 w-3.5 text-gray-400" />
                <span>Expected Check-out</span>
              </div>
              <div className="font-semibold text-gray-900 text-sm">
                {formatDate(b.checkOutDate)}
              </div>
              <div className="text-[11px] text-gray-400">By 11:00 AM</div>
            </div>
          </div>

          {/* Billing & Extra Charges Breakdown */}
          <div className="rounded-2xl border border-gray-200 bg-white p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gray-700">
                <Receipt className="h-4 w-4 text-[#0F5C5C]" />
                <span>Bill &amp; Folio Summary</span>
              </div>
              <AddChargeModal
                booking={b}
                onAdded={() => {
                  onRefresh();
                }}
              />
            </div>

            <div className="space-y-1.5 text-xs divide-y divide-gray-100">
              <div className="flex justify-between py-1 text-gray-600">
                <span>Room Charges:</span>
                <span className="font-mono font-semibold text-gray-900">
                  ₹{b.totalPrice.toLocaleString("en-IN")}
                </span>
              </div>

              {b.extraCharges && b.extraCharges.length > 0 && (
                <div className="pt-1 space-y-1">
                  <div className="text-[11px] text-gray-500 font-medium">Extra Charges:</div>
                  {b.extraCharges.map((c, idx) => (
                    <div key={idx} className="flex justify-between pl-2 text-gray-500 text-[11px]">
                      <span>• {c.description}</span>
                      <span className="font-mono font-medium text-gray-800">
                        +₹{c.amount.toLocaleString("en-IN")}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex justify-between pt-2 text-sm font-bold text-gray-900">
                <span>Total Amount Due:</span>
                <span className="font-mono text-base text-[#0F5C5C]">
                  ₹{grandTotal.toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          </div>

          {b.specialRequests && (
            <div className="rounded-xl bg-amber-50/70 border border-amber-200/60 p-3 text-xs text-amber-900">
              <span className="font-bold">Special Requests:</span> {b.specialRequests}
            </div>
          )}
        </div>

        {/* Modal Actions Footer */}
        <div className="border-t border-gray-100 p-4 bg-stone-50/80 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl px-4 py-2.5 text-xs font-medium text-gray-600 hover:bg-gray-200 transition-colors"
          >
            Close
          </button>

          <button
            type="button"
            disabled={checkingOut}
            onClick={handleCheckOut}
            className="flex items-center gap-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs px-5 py-2.5 shadow-sm active:scale-95 transition-all disabled:opacity-50"
          >
            {checkingOut ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <LogOut className="h-4 w-4" />
            )}
            <span>{checkingOut ? "Checking Out..." : "Check Out Guest Now"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
