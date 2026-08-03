import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import connectToDatabase from "@/src/lib/mongodb";
import Booking from "@/src/models/Bookings";
import Image from "next/image";
import Link from "next/link";
import { CalendarCheck, BedDouble, Clock, CheckCircle2, XCircle, LogIn, LogOut as LogOutIcon } from "lucide-react";

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
  pending:      { label: "Pending Payment", color: "bg-yellow-100 text-yellow-800", icon: Clock },
  confirmed:    { label: "Confirmed",        color: "bg-green-100 text-green-800",  icon: CheckCircle2 },
  checked_in:   { label: "Checked In",       color: "bg-blue-100 text-blue-800",   icon: LogIn },
  checked_out:  { label: "Checked Out",      color: "bg-gray-100 text-gray-800",   icon: LogOutIcon },
  cancelled:    { label: "Cancelled",        color: "bg-red-100 text-red-800",     icon: XCircle },
};

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  await connectToDatabase();

  const bookings = await Booking.find({ user: (session.user as any).id })
    .populate("room", "title type roomNumber")
    .sort({ createdAt: -1 })
    .lean();

  const activeBookings = bookings.filter(b => b.status === "confirmed" || b.status === "checked_in");
  const pastBookings = bookings.filter(b => b.status === "checked_out" || b.status === "cancelled");
  const pendingBookings = bookings.filter(b => b.status === "pending");

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="mx-auto max-w-4xl px-4 space-y-8">

        {/* Profile Header */}
        <div className="flex items-center gap-5 bg-white rounded-2xl p-6 shadow-sm border">
          {session.user.image ? (
            <Image src={session.user.image} alt="Profile" width={72} height={72} className="rounded-full object-cover" />
          ) : (
            <div className="h-18 w-18 flex items-center justify-center rounded-full bg-[#0F5C5C] text-white text-2xl font-bold px-5 py-4">
              {session.user.name?.charAt(0)?.toUpperCase() || "G"}
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{session.user.name}</h1>
            <p className="text-sm text-gray-500">{session.user.email}</p>
            <span className="mt-1 inline-block rounded-full bg-[#0F5C5C]/10 text-[#0F5C5C] px-3 py-0.5 text-xs font-medium capitalize">
              {(session.user as any).role || "Guest"}
            </span>
          </div>
        </div>

        {/* Active / Confirmed Bookings */}
        {activeBookings.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900">Active Bookings</h2>
            {activeBookings.map((booking: any) => {
              const statusInfo = statusConfig[booking.status];
              const StatusIcon = statusInfo.icon;
              return (
                <div key={booking._id.toString()} className="bg-white rounded-2xl shadow-sm border overflow-hidden">
                  <div className="flex flex-col md:flex-row">
                    {/* Booking Info */}
                    <div className="flex-1 p-6 space-y-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {(booking.room as any)?.title || "Room"}
                          </h3>
                          <p className="text-sm text-gray-500 capitalize">
                            {(booking.room as any)?.type} · Room #{(booking.room as any)?.roomNumber}
                          </p>
                        </div>
                        <span className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${statusInfo.color}`}>
                          <StatusIcon className="h-3.5 w-3.5" />
                          {statusInfo.label}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <CalendarCheck className="h-4 w-4 text-[#0F5C5C]" />
                          <span>Check-in: <strong>{new Date(booking.checkInDate).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}</strong></span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <CalendarCheck className="h-4 w-4 text-gray-400" />
                          <span>Check-out: <strong>{new Date(booking.checkOutDate).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}</strong></span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <BedDouble className="h-4 w-4 text-[#0F5C5C]" />
                          <span>Guests: <strong>{booking.guests}</strong></span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <span className="text-gray-400 font-mono">₹</span>
                          <span>Total: <strong>₹{booking.totalPrice}</strong></span>
                        </div>
                      </div>

                      {/* Check-in Code */}
                      {booking.checkInCode && (
                        <div className="bg-[#0F5C5C]/5 rounded-xl p-4">
                          <p className="text-xs text-gray-500 mb-2 font-medium uppercase tracking-wide">Your Check-in Code</p>
                          <p className="font-mono text-3xl font-extrabold text-[#0F5C5C] tracking-widest">
                            {booking.checkInCode}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">Show this at the front desk if QR is unavailable</p>
                        </div>
                      )}
                    </div>

                    {/* QR Code */}
                    {booking.qrData && (
                      <div className="flex flex-col items-center justify-center border-t md:border-t-0 md:border-l p-6 bg-gray-50 gap-3">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Check-in QR</p>
                        <Image
                          src={booking.qrData}
                          alt="Check-in QR Code"
                          width={160}
                          height={160}
                          className="rounded-xl border-2 border-[#0F5C5C]/20"
                        />
                        <p className="text-xs text-gray-400 text-center">Scan at front desk</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </section>
        )}

        {/* Pending Bookings */}
        {pendingBookings.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900">Pending Payment</h2>
            {pendingBookings.map((booking: any) => (
              <div key={booking._id.toString()} className="bg-white rounded-2xl shadow-sm border p-6 flex items-center justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-gray-900">{(booking.room as any)?.title}</h3>
                  <p className="text-sm text-gray-500">
                    {new Date(booking.checkInDate).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })} →{" "}
                    {new Date(booking.checkOutDate).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-gray-900">₹{booking.totalPrice}</span>
                  <span className="rounded-full bg-yellow-100 text-yellow-800 px-3 py-1 text-xs font-medium flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" /> Pending
                  </span>
                </div>
              </div>
            ))}
          </section>
        )}

        {/* Past Bookings */}
        {pastBookings.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900">Past Bookings</h2>
            {pastBookings.map((booking: any) => {
              const statusInfo = statusConfig[booking.status];
              return (
                <div key={booking._id.toString()} className="bg-white rounded-2xl shadow-sm border p-5 flex items-center justify-between gap-4 opacity-75">
                  <div>
                    <h3 className="font-semibold text-gray-700">{(booking.room as any)?.title}</h3>
                    <p className="text-sm text-gray-400">
                      {new Date(booking.checkInDate).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })} →{" "}
                      {new Date(booking.checkOutDate).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
                    </p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusInfo.color}`}>
                    {statusInfo.label}
                  </span>
                </div>
              );
            })}
          </section>
        )}

        {/* Empty State */}
        {bookings.length === 0 && (
          <div className="bg-white rounded-2xl shadow-sm border p-12 text-center">
            <BedDouble className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700">No bookings yet</h3>
            <p className="text-sm text-gray-500 mt-1 mb-6">Book a room and it will appear here.</p>
            <Link href="/rooms" className="inline-block rounded-md bg-[#0F5C5C] text-white px-5 py-2 text-sm font-medium hover:bg-[#0d4f4f]">
              Browse Rooms
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}