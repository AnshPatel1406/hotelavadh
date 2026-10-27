import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import connectToDatabase from "@/src/lib/mongodb";
import Booking from "@/src/models/Bookings";
import User from "@/src/models/User";
import { generateWhatsAppBookingUrl } from "@/src/lib/whatsapp";
import Image from "next/image";
import Link from "next/link";
import {
  CalendarCheck,
  BedDouble,
  Clock,
  CheckCircle2,
  XCircle,
  LogIn,
  LogOut as LogOutIcon,
  MessageCircle,
  ExternalLink,
  ShieldCheck,
  Tag,
} from "lucide-react";

export const dynamic = "force-dynamic";

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
  pending: {
    label: "Pending Payment",
    color: "bg-amber-100 text-amber-800 border-amber-200",
    icon: Clock,
  },
  confirmed: {
    label: "Confirmed",
    color: "bg-emerald-100 text-emerald-800 border-emerald-200",
    icon: CheckCircle2,
  },
  checked_in: {
    label: "Checked In",
    color: "bg-blue-100 text-blue-800 border-blue-200",
    icon: LogIn,
  },
  checked_out: {
    label: "Order Finished",
    color: "bg-stone-100 text-stone-800 border-stone-300",
    icon: LogOutIcon,
  },
  cancelled: {
    label: "Cancelled",
    color: "bg-rose-100 text-rose-800 border-rose-200",
    icon: XCircle,
  },
};

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  await connectToDatabase();

  const userRecord = await User.findById((session.user as any).id)
    .select("name email phone")
    .lean();

  const bookings = await Booking.find({ user: (session.user as any).id })
    .populate("room", "title type roomNumber pricePerNight")
    .sort({ createdAt: -1 })
    .lean();

  const activeBookings = bookings.filter(
    (b) => b.status === "confirmed" || b.status === "checked_in"
  );
  const pendingBookings = bookings.filter((b) => b.status === "pending");
  const pastBookings = bookings.filter(
    (b) => b.status === "checked_out" || b.status === "cancelled"
  );

  return (
    <div className="min-h-screen bg-stone-50/60 py-10">
      <div className="mx-auto max-w-4xl px-4 space-y-8">
        {/* Profile Header */}
        <div className="flex items-center gap-5 bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-stone-200">
          {session.user.image ? (
            <Image
              src={session.user.image}
              alt="Profile"
              width={76}
              height={76}
              className="rounded-full object-cover ring-2 ring-stone-200"
            />
          ) : (
            <div className="h-16 w-16 flex items-center justify-center rounded-2xl bg-stone-900 text-white text-2xl font-serif">
              {session.user.name?.charAt(0)?.toUpperCase() || "G"}
            </div>
          )}
          <div className="space-y-1">
            <h1
              className="text-2xl md:text-3xl font-light text-stone-900"
              style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
            >
              {session.user.name}
            </h1>
            <p className="text-xs text-stone-500 font-mono">{session.user.email}</p>
            <span className="inline-block rounded-full bg-stone-100 text-stone-700 border border-stone-200 px-3 py-0.5 text-xs font-medium capitalize">
              {(session.user as any).role || "Guest"}
            </span>
          </div>
        </div>

        {/* ── PENDING BOOKINGS ── */}
        {pendingBookings.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2
                  className="text-xl font-light text-stone-900"
                  style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
                >
                  Pending Reservations ({pendingBookings.length})
                </h2>
                <p className="text-xs text-stone-500">
                  Please share your Booking Reference ID with Hotel Avadh reception on WhatsApp to confirm payment.
                </p>
              </div>
            </div>

            {pendingBookings.map((booking: any) => {
              const refCode =
                booking.checkInCode ||
                (booking._id ? booking._id.toString().slice(-6).toUpperCase() : "AVADH");

              const specialRequestsPhone = booking.specialRequests?.match(
                /Guest Phone:\s*([^\r\n]+)/i
              )?.[1]?.trim();

              const guestPhone =
                booking.guestPhone ||
                specialRequestsPhone ||
                userRecord?.phone ||
                "Available via WhatsApp";

              const nights = Math.max(
                1,
                Math.round(
                  (new Date(booking.checkOutDate).getTime() -
                    new Date(booking.checkInDate).getTime()) /
                    (1000 * 60 * 60 * 24)
                )
              );

              const whatsappUrl = generateWhatsAppBookingUrl({
                guestName:
                  booking.guestName ||
                  session.user?.name ||
                  userRecord?.name ||
                  "Valued Guest",
                guestEmail:
                  booking.guestEmail ||
                  session.user?.email ||
                  userRecord?.email ||
                  "Provided on account",
                guestPhone,
                roomTitle: (booking.room as any)?.title || "Avadh Room",
                roomNumber: (booking.room as any)?.roomNumber,
                roomType: (booking.room as any)?.type,
                pricePerNight: (booking.room as any)?.pricePerNight,
                checkInDate: booking.checkInDate,
                checkOutDate: booking.checkOutDate,
                nights,
                guests: booking.guests || 1,
                totalPrice: booking.totalPrice,
                bookingRef: refCode,
                specialRequests: booking.specialRequests,
              });

              return (
                <div
                  key={booking._id.toString()}
                  className="rounded-3xl border border-amber-200 bg-amber-50/40 p-6 md:p-7 shadow-sm space-y-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3 border-b border-amber-200/60 pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-stone-500 uppercase tracking-wider font-medium">
                          Booking Reference
                        </span>
                        <span className="font-mono text-sm font-extrabold text-amber-900 bg-amber-100 border border-amber-300 px-2.5 py-0.5 rounded-lg">
                          #{refCode}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-stone-900 mt-1">
                        {(booking.room as any)?.title || "Room Reservation"}
                      </h3>
                    </div>

                    <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-300 bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-900">
                      <Clock className="h-3.5 w-3.5" />
                      Pending Confirmation
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-stone-600">
                    <div>
                      <span className="text-stone-400 block mb-0.5">Check-in</span>
                      <strong className="text-stone-900">
                        {new Date(booking.checkInDate).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </strong>
                    </div>
                    <div>
                      <span className="text-stone-400 block mb-0.5">Check-out</span>
                      <strong className="text-stone-900">
                        {new Date(booking.checkOutDate).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </strong>
                    </div>
                    <div>
                      <span className="text-stone-400 block mb-0.5">Guests</span>
                      <strong className="text-stone-900">{booking.guests} Person(s)</strong>
                    </div>
                    <div>
                      <span className="text-stone-400 block mb-0.5">Estimated Total</span>
                      <strong className="text-stone-900 text-sm">
                        ₹{booking.totalPrice?.toLocaleString("en-IN")}
                      </strong>
                    </div>
                  </div>

                  <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-amber-200/50">
                    <p className="text-[11px] text-stone-600">
                      Give this reference code (<strong>#{refCode}</strong>) when contacting reception.
                    </p>
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-medium text-white hover:bg-emerald-700 transition shadow-sm"
                    >
                      <MessageCircle className="h-3.5 w-3.5" />
                      Confirm on WhatsApp (+91 98765 98765)
                    </a>
                  </div>
                </div>
              );
            })}
          </section>
        )}

        {/* ── ACTIVE / CONFIRMED BOOKINGS ── */}
        {activeBookings.length > 0 && (
          <section className="space-y-4">
            <div>
              <h2
                className="text-xl font-light text-stone-900"
                style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
              >
                Active Bookings ({activeBookings.length})
              </h2>
              <p className="text-xs text-stone-500">
                Show your Booking Reference ID at the front desk when checking in.
              </p>
            </div>

            {activeBookings.map((booking: any) => {
              const statusInfo = statusConfig[booking.status] || statusConfig.confirmed;
              const StatusIcon = statusInfo.icon;
              const refCode =
                booking.checkInCode ||
                (booking._id ? booking._id.toString().slice(-6).toUpperCase() : "AVADH");

              return (
                <div
                  key={booking._id.toString()}
                  className="bg-white rounded-3xl shadow-sm border border-stone-200 overflow-hidden"
                >
                  <div className="p-6 md:p-7 space-y-5">
                    <div className="flex items-start justify-between gap-3 border-b border-stone-100 pb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[11px] font-medium text-stone-500 uppercase tracking-wider">
                            Booking Reference
                          </span>
                          <span className="font-mono text-sm font-extrabold text-stone-900 bg-stone-100 border border-stone-300 px-2.5 py-0.5 rounded-lg">
                            #{refCode}
                          </span>
                        </div>
                        <h3 className="text-xl font-semibold text-stone-900">
                          {(booking.room as any)?.title || "Room"}
                        </h3>
                        <p className="text-xs text-stone-500 capitalize">
                          {(booking.room as any)?.type} Room · Room #{(booking.room as any)?.roomNumber}
                        </p>
                      </div>

                      <span
                        className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold border ${statusInfo.color}`}
                      >
                        <StatusIcon className="h-3.5 w-3.5" />
                        {statusInfo.label}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                      <div className="flex items-center gap-2 text-stone-600">
                        <CalendarCheck className="h-4 w-4 text-stone-500" />
                        <span>
                          Check-in:{" "}
                          <strong className="text-stone-900">
                            {new Date(booking.checkInDate).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </strong>
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-stone-600">
                        <CalendarCheck className="h-4 w-4 text-stone-500" />
                        <span>
                          Check-out:{" "}
                          <strong className="text-stone-900">
                            {new Date(booking.checkOutDate).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </strong>
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-stone-600">
                        <BedDouble className="h-4 w-4 text-stone-500" />
                        <span>
                          Guests: <strong className="text-stone-900">{booking.guests}</strong>
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-stone-600">
                        <span className="text-stone-400 font-mono">₹</span>
                        <span>
                          Total: <strong className="text-stone-900">₹{booking.totalPrice?.toLocaleString("en-IN")}</strong>
                        </span>
                      </div>
                    </div>

                    {/* Prominent Reference & Check-in Code Box */}
                    <div className="rounded-2xl bg-stone-900 text-white p-5 flex items-center justify-between gap-4">
                      <div>
                        <p className="text-[10px] text-stone-300 uppercase tracking-widest font-medium">
                          Check-in Reference Code
                        </p>
                        <p className="font-mono text-2xl font-bold tracking-widest text-amber-300 mt-0.5">
                          #{refCode}
                        </p>
                        <p className="text-[11px] text-stone-400 mt-0.5">
                          Present this reference code at Hotel Avadh reception desk upon arrival
                        </p>
                      </div>
                      <ShieldCheck className="h-8 w-8 text-amber-400 shrink-0" />
                    </div>
                  </div>
                </div>
              );
            })}
          </section>
        )}

        {/* ── PAST BOOKINGS / ORDER FINISHED ── */}
        {pastBookings.length > 0 && (
          <section className="space-y-4">
            <div>
              <h2
                className="text-xl font-light text-stone-900"
                style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
              >
                Past Reservations ({pastBookings.length})
              </h2>
              <p className="text-xs text-stone-500">
                Completed stays and finished bookings.
              </p>
            </div>

            <div className="grid gap-3">
              {pastBookings.map((booking: any) => {
                const statusInfo = statusConfig[booking.status] || statusConfig.checked_out;
                const refCode =
                  booking.checkInCode ||
                  (booking._id ? booking._id.toString().slice(-6).toUpperCase() : "AVADH");

                return (
                  <div
                    key={booking._id.toString()}
                    className="bg-white rounded-2xl shadow-sm border border-stone-200/80 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-xs font-bold text-stone-800 bg-stone-100 px-2 py-0.5 rounded border border-stone-200">
                          #{refCode}
                        </span>
                        <h3 className="font-semibold text-stone-900 text-sm">
                          {(booking.room as any)?.title || "Room"}
                        </h3>
                      </div>
                      <p className="text-xs text-stone-500">
                        {new Date(booking.checkInDate).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                        })}{" "}
                        →{" "}
                        {new Date(booking.checkOutDate).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}{" "}
                        · ₹{booking.totalPrice?.toLocaleString("en-IN")}
                      </p>
                    </div>

                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold border self-start sm:self-auto ${statusInfo.color}`}
                    >
                      {statusInfo.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* ── EMPTY STATE ── */}
        {bookings.length === 0 && (
          <div className="bg-white rounded-3xl shadow-sm border border-stone-200 p-12 text-center space-y-4">
            <BedDouble className="h-12 w-12 text-stone-300 mx-auto" />
            <h3
              className="text-xl font-light text-stone-800"
              style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
            >
              No bookings yet
            </h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              Choose an accommodation from our rooms catalog and reserve via WhatsApp.
            </p>
            <Link
              href="/rooms"
              className="inline-flex items-center gap-2 rounded-2xl bg-stone-900 text-white px-6 py-3 text-xs font-medium hover:bg-stone-800 transition shadow-sm"
            >
              Browse Available Rooms →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}