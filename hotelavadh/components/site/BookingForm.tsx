"use client";

import { useState, useMemo } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  Calendar,
  Users,
  MessageCircle,
  Lock,
  X,
  Phone,
  FileText,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { generateWhatsAppBookingUrl } from "@/src/lib/whatsapp";

interface BookingFormProps {
  roomId: string;
  pricePerNight: number;
  maxGuests: number;
  roomTitle?: string;
  roomNumber?: string | number;
  roomType?: string;
}

export function BookingForm({
  roomId,
  pricePerNight,
  maxGuests,
  roomTitle = "Avadh Premium Room",
  roomNumber = "",
  roomType = "Room",
}: BookingFormProps) {
  const { data: session, status } = useSession();

  // Smart defaults: Check-in tomorrow, Check-out day after tomorrow
  const todayStr = useMemo(() => {
    const d = new Date();
    return d.toISOString().split("T")[0];
  }, []);

  const defaultCheckIn = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
  }, []);

  const defaultCheckOut = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split("T")[0];
  }, []);

  const [checkIn, setCheckIn] = useState(defaultCheckIn);
  const [checkOut, setCheckOut] = useState(defaultCheckOut);
  const [guests, setGuests] = useState(1);
  const [phone, setPhone] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [whatsappSentUrl, setWhatsappSentUrl] = useState<string | null>(null);
  const [bookingRef, setBookingRef] = useState<string | null>(null);

  // Calculate nights
  const nights = useMemo(() => {
    if (!checkIn || !checkOut) return 1;
    const dIn = new Date(`${checkIn}T12:00:00`);
    const dOut = new Date(`${checkOut}T11:00:00`);
    const diffTime = dOut.getTime() - dIn.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1;
  }, [checkIn, checkOut]);

  const totalPrice = useMemo(() => {
    return nights * pricePerNight;
  }, [nights, pricePerNight]);

  // Format dates for WhatsApp message
  const formatDisplayDate = (dateStr: string) => {
    if (!dateStr) return "";
    try {
      const d = new Date(`${dateStr}T12:00:00`);
      return d.toLocaleDateString("en-IN", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const handleBook = async () => {
    setErrorMessage(null);

    // 1. Check if user is logged in
    const isLoggedIn = status === "authenticated" && Boolean(session?.user);
    if (!isLoggedIn) {
      setErrorMessage("Please log in first to book this room.");
      setShowLoginModal(true);
      return;
    }

    // 2. Validate dates
    if (!checkIn || !checkOut) {
      setErrorMessage("Please select both check-in and check-out dates.");
      return;
    }

    const dIn = new Date(`${checkIn}T12:00:00`);
    const dOut = new Date(`${checkOut}T11:00:00`);
    if (dOut <= dIn) {
      setErrorMessage("Check-out date must be after check-in date (minimum 1 night).");
      return;
    }

    if (guests < 1 || guests > maxGuests) {
      setErrorMessage(`Please select between 1 and ${maxGuests} guests.`);
      return;
    }

    // 3. Validate contact phone with proper regex (REQUIRED)
    const trimmedPhone = phone.trim();
    if (!trimmedPhone) {
      setErrorMessage("Please enter your WhatsApp / contact phone number to proceed.");
      document.getElementById("booking-phone")?.focus();
      return;
    }

    // Strip spaces, dashes, parentheses
    const normalizedPhone = trimmedPhone.replace(/[\s\-()]/g, "");
    const digitsOnly = trimmedPhone.replace(/\D/g, "");

    // Proper Indian phone regex:
    // 10 digits starting with 6, 7, 8, or 9
    // OR 12 digits starting with 91 (or +91) followed by 10 digits starting with 6, 7, 8, or 9
    // OR 11 digits starting with 0 followed by 10 digits starting with 6, 7, 8, or 9
    const indianPhoneRegex = /^(?:\+?91|0)?[6-9]\d{9}$/;
    const isValidDigitsLength =
      digitsOnly.length === 10 ||
      (digitsOnly.length === 12 && digitsOnly.startsWith("91")) ||
      (digitsOnly.length === 11 && digitsOnly.startsWith("0"));

    if (!indianPhoneRegex.test(normalizedPhone) || !isValidDigitsLength) {
      setErrorMessage("Please enter a valid 10-digit mobile number (or 12 digits starting with 91).");
      document.getElementById("booking-phone")?.focus();
      return;
    }

    setLoading(true);

    let createdBookingRef: string | null = null;

    try {
      // 3. Save pending booking record to DB for tracking & email
      const checkInIso = new Date(`${checkIn}T12:00:00.000Z`).toISOString();
      const checkOutIso = new Date(`${checkOut}T11:00:00.000Z`).toISOString();

      const combinedNotes = [
        phone.trim() ? `Guest Phone: ${phone.trim()}` : "",
        specialRequests.trim() ? `Special Requests: ${specialRequests.trim()}` : "",
      ]
        .filter(Boolean)
        .join("\n");

      const bookingRes = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomId,
          checkInDate: checkInIso,
          checkOutDate: checkOutIso,
          guests: Number(guests),
          phone: phone.trim() || undefined,
          specialRequests: combinedNotes || undefined,
        }),
      });

      if (bookingRes.status === 401) {
        setErrorMessage("Please log in first to book this room.");
        setShowLoginModal(true);
        setLoading(false);
        return;
      }

      const bookingData = await bookingRes.json();

      if (!bookingRes.ok || !bookingData.success) {
        console.warn("Booking API notice:", bookingData.message);
      } else if (bookingData.booking) {
        createdBookingRef =
          bookingData.booking.checkInCode ||
          bookingData.booking._id?.toString().slice(-6).toUpperCase();
        setBookingRef(createdBookingRef);
      }
    } catch (err) {
      console.error("Booking error:", err);
      // We still proceed to WhatsApp so the user doesn't lose their booking inquiry!
    } finally {
      setLoading(false);
    }

    // 4. Construct WhatsApp Message for Hotel Admin (+91 98765 98765)
    const targetUrl = generateWhatsAppBookingUrl({
      guestName: session?.user?.name || "Valued Guest",
      guestEmail: session?.user?.email || "Provided on account",
      guestPhone: phone.trim() || "Available via WhatsApp",
      roomTitle,
      roomNumber,
      roomType,
      pricePerNight,
      checkInDate: checkIn,
      checkOutDate: checkOut,
      nights,
      guests,
      totalPrice,
      bookingRef: createdBookingRef || undefined,
      specialRequests: specialRequests.trim() || undefined,
    });

    setWhatsappSentUrl(targetUrl);

    // Redirect / open WhatsApp
    try {
      window.open(targetUrl, "_blank");
    } catch {
      window.location.href = targetUrl;
    }
  };

  // If already redirected to WhatsApp, show nice confirmation UI
  if (whatsappSentUrl) {
    return (
      <div className="rounded-3xl border border-emerald-200 bg-emerald-50/60 p-6 md:p-8 text-center space-y-5 shadow-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 shadow-inner">
          <MessageCircle className="h-8 w-8 fill-emerald-600 text-white" />
        </div>

        <div className="space-y-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-800">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Inquiry Prepared
          </span>
          <h3 className="text-2xl font-serif font-medium text-stone-900">
            Connecting to Hotel Avadh WhatsApp
          </h3>
          <p className="text-sm text-stone-600 max-w-md mx-auto leading-relaxed">
            Your reservation details for <strong>{roomTitle}</strong> have been formatted and ready to send to our hotel admin at <strong>+91 98765 98765</strong>.
          </p>
        </div>

        {bookingRef && (
          <div className="inline-block rounded-xl border border-emerald-200 bg-white/80 px-4 py-2 text-xs font-mono text-emerald-900">
            Booking Reference: <strong>#{bookingRef}</strong>
          </div>
        )}

        <div className="pt-2 space-y-3">
          <a
            href={whatsappSentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-6 py-3.5 text-base font-medium text-white shadow-md hover:bg-emerald-700 transition active:scale-[0.98]"
          >
            <MessageCircle className="h-5 w-5" />
            Open WhatsApp Chat Now
            <ExternalLink className="h-4 w-4 opacity-80" />
          </a>

          <div className="flex items-center justify-center gap-4 text-xs text-stone-500 pt-1">
            <button
              type="button"
              onClick={() => setWhatsappSentUrl(null)}
              className="text-stone-700 underline hover:text-stone-900"
            >
              Modify Booking Details
            </button>
            <span>•</span>
            <Link href="/profile" className="text-stone-700 underline hover:text-stone-900">
              View My Bookings
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* ── PLEASE LOGIN FIRST MODAL ── */}
      {showLoginModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-3xl border border-stone-200 bg-white p-7 shadow-2xl text-center space-y-5">
            <button
              onClick={() => setShowLoginModal(false)}
              className="absolute top-4 right-4 rounded-full p-1.5 text-stone-400 hover:bg-stone-100 hover:text-stone-700 transition"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 border border-amber-200/80">
              <Lock className="h-8 w-8" />
            </div>

            <div className="space-y-2">
              <h3
                className="text-2xl font-normal tracking-tight text-stone-900"
                style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
              >
                Please Login First
              </h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                You must be logged in to reserve a room at Hotel Avadh. Logging in allows us to personalize your stay details and connect directly with our desk on WhatsApp.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <Link
                href={`/login?callbackUrl=${encodeURIComponent(
                  typeof window !== "undefined" ? window.location.pathname : `/rooms/${roomId}`
                )}`}
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-stone-900 px-5 py-3.5 text-sm font-medium text-white shadow-md hover:bg-stone-800 transition active:scale-[0.99]"
              >
                Log In to Continue
                <ArrowRight className="h-4 w-4" />
              </Link>

              <div className="flex items-center justify-center gap-1.5 text-xs text-stone-500">
                <span>New guest?</span>
                <Link
                  href="/signup"
                  className="font-medium text-amber-700 hover:underline"
                >
                  Create an account
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── BOOKING FORM CONTAINER ── */}
      <div className="rounded-3xl border border-stone-200/90 bg-white/95 p-6 md:p-7 shadow-sm space-y-6">
        {/* Header price tag */}
        <div className="flex items-baseline justify-between border-b border-stone-100 pb-4">
          <div>
            <span className="text-xs uppercase tracking-wider text-stone-500 font-medium">Rate</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span
                className="text-3xl font-light text-stone-900"
                style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
              >
                ₹{pricePerNight.toLocaleString("en-IN")}
              </span>
              <span className="text-xs text-stone-500">/ night</span>
            </div>
          </div>

          <div className="text-right">
            <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200/70 rounded-full px-2.5 py-1">
              <ShieldCheck className="h-3.5 w-3.5" />
              WhatsApp Booking
            </span>
          </div>
        </div>

        {/* Not logged in notification banner */}
        {status === "unauthenticated" && (
          <div className="rounded-2xl border border-amber-200/80 bg-amber-50/70 p-3.5 flex items-start gap-3 text-xs text-amber-900">
            <Lock className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
            <div className="space-y-1">
              <p className="font-medium">Please login first to book</p>
              <p className="text-amber-700 leading-normal">
                Sign in to prefill your details and chat directly with hotel reception.{" "}
                <Link
                  href={`/login?callbackUrl=${encodeURIComponent(
                    typeof window !== "undefined" ? window.location.pathname : `/rooms/${roomId}`
                  )}`}
                  className="font-semibold underline hover:text-amber-950"
                >
                  Log In now
                </Link>
              </p>
            </div>
          </div>
        )}

        {/* Error message */}
        {errorMessage && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50/80 p-3.5 flex items-start gap-2.5 text-xs text-rose-800 animate-in fade-in">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-600 mt-0.5" />
            <p>{errorMessage}</p>
          </div>
        )}

        {/* Inputs */}
        <div className="space-y-4">
          {/* Check-in Date */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-stone-600 mb-1.5">
              <Calendar className="h-3.5 w-3.5 text-stone-400" />
              Check-in Date
            </label>
            <input
              type="date"
              min={todayStr}
              value={checkIn}
              onChange={(e) => {
                setCheckIn(e.target.value);
                setErrorMessage(null);
              }}
              className="w-full rounded-2xl border border-stone-200 bg-stone-50/50 px-3.5 py-2.5 text-sm text-stone-900 outline-none transition focus:border-stone-900 focus:bg-white focus:ring-1 focus:ring-stone-900"
            />
            <span className="text-[11px] text-stone-500 mt-1 block">Check-in starts from 12:00 PM</span>
          </div>

          {/* Check-out Date */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-stone-600 mb-1.5">
              <Calendar className="h-3.5 w-3.5 text-stone-400" />
              Check-out Date
            </label>
            <input
              type="date"
              min={checkIn || todayStr}
              value={checkOut}
              onChange={(e) => {
                setCheckOut(e.target.value);
                setErrorMessage(null);
              }}
              className="w-full rounded-2xl border border-stone-200 bg-stone-50/50 px-3.5 py-2.5 text-sm text-stone-900 outline-none transition focus:border-stone-900 focus:bg-white focus:ring-1 focus:ring-stone-900"
            />
            <span className="text-[11px] text-stone-500 mt-1 block">Check-out by 11:00 AM</span>
          </div>

          {/* Guests count */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-stone-600">
                <Users className="h-3.5 w-3.5 text-stone-400" />
                Guests
              </label>
              <span className="text-[11px] text-stone-500">Max {maxGuests} guests</span>
            </div>
            <div className="flex items-center rounded-2xl border border-stone-200 bg-stone-50/50 px-3 py-1.5">
              <button
                type="button"
                onClick={() => setGuests((g) => Math.max(1, g - 1))}
                disabled={guests <= 1}
                className="flex h-8 w-8 items-center justify-center rounded-xl bg-white text-stone-700 shadow-sm transition hover:bg-stone-100 disabled:opacity-40"
              >
                -
              </button>
              <span className="flex-1 text-center text-sm font-medium text-stone-900">
                {guests} {guests === 1 ? "Guest" : "Guests"}
              </span>
              <button
                type="button"
                onClick={() => setGuests((g) => Math.min(maxGuests, g + 1))}
                disabled={guests >= maxGuests}
                className="flex h-8 w-8 items-center justify-center rounded-xl bg-white text-stone-700 shadow-sm transition hover:bg-stone-100 disabled:opacity-40"
              >
                +
              </button>
            </div>
          </div>


          {/* Contact Phone (Required) */}
          <div>
            <label
              htmlFor="booking-phone"
              className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-stone-600 mb-1.5"
            >
              <Phone className="h-3.5 w-3.5 text-stone-400" />
              WhatsApp / Contact Number
              <span className="text-[10px] text-rose-600 font-medium">
                (required)
              </span>
            </label>

            <input
              id="booking-phone"
              type="tel"
              maxLength={16}
              placeholder="+91 98765 43210"
              value={phone}
              required
              onChange={(e) => {
                setPhone(e.target.value);
                setErrorMessage(null);
              }}
              aria-invalid={Boolean(errorMessage && errorMessage.toLowerCase().includes("phone"))}
              className={`w-full rounded-2xl border px-3.5 py-2.5 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 ${
                errorMessage && errorMessage.toLowerCase().includes("phone")
                  ? "border-rose-400 bg-rose-50/40 ring-1 ring-rose-400 focus:border-rose-500 focus:ring-rose-500"
                  : "border-stone-200 bg-stone-50/50 focus:border-stone-900 focus:bg-white focus:ring-1 focus:ring-stone-900"
              }`}
            />
            {errorMessage && errorMessage.toLowerCase().includes("phone") ? (
              <p className="mt-1 text-xs text-rose-600 font-medium">{errorMessage}</p>
            ) : (
              <span className="text-[11px] text-stone-500 mt-1 block">
                10-digit mobile number (e.g. 9876543210) or 12-digit with 91
              </span>
            )}
          </div>


          {/* Special Requests (Optional) */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-stone-600 mb-1.5">
              <FileText className="h-3.5 w-3.5 text-stone-400" />
              Special Requests
              <span className="text-[10px] text-stone-400 font-normal lowercase">(optional)</span>
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Early check-in, ground floor preference, airport pickup..."
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
              className="w-full rounded-2xl border border-stone-200 bg-stone-50/50 px-3.5 py-2.5 text-sm text-stone-900 outline-none transition focus:border-stone-900 focus:bg-white focus:ring-1 focus:ring-stone-900 placeholder:text-stone-400 resize-none"
            />
          </div>
        </div>

        {/* Price Breakdown */}
        <div className="rounded-2xl border border-stone-100 bg-stone-50/70 p-4 space-y-2 text-xs">
          <div className="flex justify-between text-stone-600">
            <span>
              ₹{pricePerNight.toLocaleString("en-IN")} × {nights} {nights === 1 ? "night" : "nights"}
            </span>
            <span className="font-medium text-stone-800">
              ₹{(nights * pricePerNight).toLocaleString("en-IN")}
            </span>
          </div>

          <div className="flex justify-between text-stone-600">
            <span>Guests</span>
            <span className="font-medium text-stone-800">{guests} person(s)</span>
          </div>

          <div className="border-t border-stone-200/80 pt-2 flex items-baseline justify-between text-stone-900 font-medium">
            <span className="text-sm">Estimated Total</span>
            <span
              className="text-lg font-normal"
              style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
            >
              ₹{totalPrice.toLocaleString("en-IN")}
            </span>
          </div>
        </div>

        {/* Book Button */}
        <button
          type="button"
          onClick={handleBook}
          disabled={loading}
          className="group relative flex w-full items-center justify-center gap-2.5 rounded-2xl bg-emerald-600 px-6 py-4 text-sm font-medium text-white shadow-md hover:bg-emerald-700 transition active:scale-[0.99] disabled:opacity-70 cursor-pointer"
        >
          <MessageCircle className="h-5 w-5 fill-white text-emerald-600" />
          <span>{loading ? "Preparing Reservation..." : "Book via WhatsApp"}</span>
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </button>

        {/* Assurance text */}
        <p className="text-center text-[11px] text-stone-500 leading-relaxed">
          Clicking book connects you directly to Hotel Avadh WhatsApp desk (<strong>+91 98765 98765</strong>) with your prefilled details. Pay later on confirmation.
        </p>
      </div>
    </>
  );
}
