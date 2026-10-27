"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AddRoomModal } from "@/components/dashboard/AddRoomModal";
import { EditRoomModal } from "@/components/dashboard/EditRoomModal";
import { DeleteRoomModal } from "@/components/dashboard/DeleteRoomModal";
import { OccupiedRoomModal } from "@/components/dashboard/OccupiedRoomModal";
import { WalkInBookingModal } from "@/components/dashboard/WalkInBookingModal";
import {
  LayoutGrid,
  List,
  User,
  Phone,
  Calendar,
  Plus,
  ShieldCheck,
  DoorOpen,
  BedDouble,
  Users,
  Eye,
  LogOut,
} from "lucide-react";

export function RoomList({ initialRooms, role }: { initialRooms: any[]; role: string }) {
  const [rooms, setRooms] = useState(initialRooms);
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [filter, setFilter] = useState<"all" | "available" | "occupied">("all");

  // Selected room for viewing stay details (occupied modal)
  const [selectedOccupiedRoom, setSelectedOccupiedRoom] = useState<any | null>(null);

  // Selected room for walk-in check-in (walk-in modal)
  const [selectedWalkInRoom, setSelectedWalkInRoom] = useState<any | null>(null);

  const isStaff = role === "admin" || role === "reception";

  // Calculate live stats
  const totalCount = rooms.length;
  const occupiedCount = rooms.filter((r) => r.activeBooking !== null).length;
  const availableCount = rooms.filter((r) => r.activeBooking === null && r.isActive).length;
  const occupancyRate = totalCount > 0 ? Math.round((occupiedCount / totalCount) * 100) : 0;

  // Filter rooms
  const filteredRooms = rooms.filter((room) => {
    const isOccupied = room.activeBooking !== null;
    if (filter === "occupied") return isOccupied;
    if (filter === "available") return !isOccupied && room.isActive;
    return true;
  });

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return isNaN(d.getTime())
      ? dateStr
      : d.toLocaleDateString("en-IN", { month: "short", day: "numeric" });
  };

  return (
    <div className="space-y-6">
      {/* ── TOP STATS OVERVIEW ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
            <span>Total Rooms</span>
            <BedDouble className="h-4 w-4 text-gray-400" />
          </div>
          <div className="text-2xl font-bold text-gray-900 mt-1">{totalCount}</div>
          <div className="text-[11px] text-gray-400 mt-0.5">Hotel Inventory</div>
        </div>

        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-emerald-700 font-medium">
            <span>Available Rooms</span>
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-emerald-800 mt-1">{availableCount}</div>
          <div className="text-[11px] text-emerald-600 mt-0.5">Vacant &amp; Ready</div>
        </div>

        <div className="rounded-2xl border border-rose-200 bg-rose-50/50 p-4 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-rose-700 font-medium">
            <span>Occupied Rooms</span>
            <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
          </div>
          <div className="text-2xl font-bold text-rose-800 mt-1">{occupiedCount}</div>
          <div className="text-[11px] text-rose-600 mt-0.5">Guests Checked In</div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
            <span>Occupancy Rate</span>
            <Users className="h-4 w-4 text-gray-400" />
          </div>
          <div className="text-2xl font-bold text-gray-900 mt-1">{occupancyRate}%</div>
          <div className="text-[11px] text-gray-400 mt-0.5">Current Capacity</div>
        </div>
      </div>

      {/* ── CONTROLS & FILTERS BAR ── */}
      <Card className="border-border shadow-xs">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all ${
                filter === "all"
                  ? "bg-gray-900 text-white shadow-2xs"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              All ({totalCount})
            </button>
            <button
              onClick={() => setFilter("available")}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all flex items-center gap-1.5 ${
                filter === "available"
                  ? "bg-emerald-600 text-white shadow-2xs"
                  : "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
              }`}
            >
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Available ({availableCount})
            </button>
            <button
              onClick={() => setFilter("occupied")}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all flex items-center gap-1.5 ${
                filter === "occupied"
                  ? "bg-rose-600 text-white shadow-2xs"
                  : "bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100"
              }`}
            >
              <span className="h-2 w-2 rounded-full bg-rose-400" />
              Occupied ({occupiedCount})
            </button>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Switcher */}
            <div className="flex items-center rounded-xl bg-gray-100 p-1 border border-gray-200 text-xs">
              <button
                onClick={() => setViewMode("grid")}
                className={`flex items-center gap-1 rounded-lg px-2.5 py-1 font-medium transition-all ${
                  viewMode === "grid"
                    ? "bg-white text-gray-900 shadow-2xs font-bold"
                    : "text-gray-500 hover:text-gray-900"
                }`}
                title="Visual Room Grid"
              >
                <LayoutGrid className="h-3.5 w-3.5" />
                <span>Room Grid</span>
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={`flex items-center gap-1 rounded-lg px-2.5 py-1 font-medium transition-all ${
                  viewMode === "table"
                    ? "bg-white text-gray-900 shadow-2xs font-bold"
                    : "text-gray-500 hover:text-gray-900"
                }`}
                title="Spreadsheet Table"
              >
                <List className="h-3.5 w-3.5" />
                <span>Table</span>
              </button>
            </div>

            {isStaff && <AddRoomModal onCreated={() => window.location.reload()} />}
          </div>
        </CardHeader>

        <CardContent>
          {/* ══════════════════════════════════════════════════════════════
              GRID VIEW: VISUAL ROOM CARDS (GREEN = VACANT, RED = OCCUPIED)
             ══════════════════════════════════════════════════════════════ */}
          {viewMode === "grid" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredRooms.map((room) => {
                const isOccupied = room.activeBooking !== null;
                const b = room.activeBooking;

                return isOccupied ? (
                  /* ── RED CARD: OCCUPIED ROOM ── */
                  <div
                    key={room._id}
                    className="group relative rounded-2xl border-2 border-rose-300 bg-gradient-to-b from-rose-50/80 via-white to-white p-5 shadow-xs hover:shadow-md hover:border-rose-400 transition-all flex flex-col justify-between"
                  >
                    <div>
                      {/* Top Bar: Room # & Status */}
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-2xl font-black text-rose-950">
                              #{room.roomNumber}
                            </span>
                            <span className="capitalize text-xs font-semibold text-rose-700 bg-rose-100/80 border border-rose-200 px-2 py-0.5 rounded-md">
                              {room.type}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500 font-medium truncate max-w-[180px] mt-0.5">
                            {room.title}
                          </div>
                        </div>

                        {/* Occupied Badge */}
                        <div className="flex items-center gap-1.5 rounded-full bg-rose-600 text-white px-2.5 py-1 text-[11px] font-bold shadow-2xs">
                          <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                          <span>OCCUPIED</span>
                        </div>
                      </div>

                      {/* Guest Stay Info Box (Clickable) */}
                      <div
                        onClick={() => setSelectedOccupiedRoom(room)}
                        className="mt-4 rounded-xl border border-rose-200 bg-rose-50/50 p-3.5 space-y-2 cursor-pointer hover:bg-rose-100/60 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600">
                            Current Occupant
                          </span>
                          <span className="inline-flex items-center gap-0.5 font-mono text-[11px] font-bold text-gray-900 bg-white border border-rose-200 px-1.5 py-0.5 rounded">
                            <ShieldCheck className="h-3 w-3 text-[#B38E36]" />
                            #{b.checkInCode || "REF"}
                          </span>
                        </div>

                        <div className="font-bold text-gray-900 text-sm flex items-center gap-1.5 truncate">
                          <User className="h-3.5 w-3.5 text-rose-600 shrink-0" />
                          <span className="truncate">{b.guestName}</span>
                        </div>

                        {b.guestPhone && (
                          <div className="text-xs text-gray-600 font-mono flex items-center gap-1.5">
                            <Phone className="h-3 w-3 text-gray-400 shrink-0" />
                            <span>{b.guestPhone}</span>
                          </div>
                        )}

                        <div className="pt-1.5 border-t border-rose-200/60 flex items-center justify-between text-[11px] text-gray-600">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3 text-rose-500" />
                            {formatDate(b.checkInDate)} → {formatDate(b.checkOutDate)}
                          </span>
                          <span className="font-mono font-bold text-rose-900">
                            ₹{b.totalPrice.toLocaleString("en-IN")}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Card Actions */}
                    <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedOccupiedRoom(room)}
                        className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-gray-900 hover:bg-gray-800 text-white text-xs font-semibold py-2 transition shadow-2xs"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        <span>View Stay Details</span>
                      </button>

                      {isStaff && (
                        <div className="flex items-center gap-1 shrink-0">
                          <EditRoomModal room={room} onUpdated={() => window.location.reload()} />
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  /* ── GREEN CARD: AVAILABLE / VACANT ROOM ── */
                  <div
                    key={room._id}
                    className={`group relative rounded-2xl border-2 ${
                      room.isActive
                        ? "border-emerald-300 bg-gradient-to-b from-emerald-50/70 via-white to-white hover:border-emerald-500 hover:shadow-md"
                        : "border-gray-200 bg-gray-50 opacity-60"
                    } p-5 shadow-xs transition-all flex flex-col justify-between`}
                  >
                    <div>
                      {/* Top Bar: Room # & Available Status */}
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-2xl font-black text-gray-900">
                              #{room.roomNumber}
                            </span>
                            <span className="capitalize text-xs font-semibold text-emerald-800 bg-emerald-100/80 border border-emerald-200 px-2 py-0.5 rounded-md">
                              {room.type}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500 font-medium truncate max-w-[180px] mt-0.5">
                            {room.title}
                          </div>
                        </div>

                        {/* Available Badge */}
                        {room.isActive ? (
                          <div className="flex items-center gap-1.5 rounded-full bg-emerald-600 text-white px-2.5 py-1 text-[11px] font-bold shadow-2xs">
                            <span className="h-1.5 w-1.5 rounded-full bg-white" />
                            <span>AVAILABLE</span>
                          </div>
                        ) : (
                          <span className="rounded-full bg-gray-200 text-gray-600 px-2.5 py-1 text-[11px] font-semibold">
                            Inactive
                          </span>
                        )}
                      </div>

                      {/* Room Pricing & Capacity Box */}
                      <div className="mt-4 rounded-xl border border-emerald-200/80 bg-emerald-50/40 p-3.5 space-y-2">
                        <div className="flex items-baseline justify-between">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
                            Room Rate
                          </span>
                          <span className="font-mono text-base font-bold text-gray-900">
                            ₹{room.pricePerNight.toLocaleString("en-IN")}
                            <span className="text-[10px] text-gray-500 font-normal"> / night</span>
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-xs text-gray-600">
                          <span className="flex items-center gap-1 text-gray-500">
                            <Users className="h-3 w-3 text-emerald-600" />
                            Capacity:
                          </span>
                          <span className="font-semibold text-gray-800">
                            Up to {room.maxGuests} Guests
                          </span>
                        </div>

                        {room.amenities && room.amenities.length > 0 && (
                          <div className="pt-1.5 border-t border-emerald-200/60 flex flex-wrap gap-1">
                            {room.amenities.slice(0, 3).map((a: string) => (
                              <span
                                key={a}
                                className="text-[10px] rounded-md bg-white border border-emerald-200 px-1.5 py-0.5 text-gray-700 font-medium truncate max-w-[110px]"
                              >
                                {a}
                              </span>
                            ))}
                            {room.amenities.length > 3 && (
                              <span className="text-[10px] text-emerald-800 font-bold px-1">
                                +{room.amenities.length - 3} more
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Card Actions */}
                    <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                      {room.isActive && isStaff ? (
                        <button
                          type="button"
                          onClick={() => setSelectedWalkInRoom(room)}
                          className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold py-2 transition shadow-2xs active:scale-95"
                        >
                          <Plus className="h-3.5 w-3.5" />
                          <span>Walk-in Check-in</span>
                        </button>
                      ) : (
                        <span className="text-xs text-gray-400 italic">Room Unavailable</span>
                      )}

                      {isStaff && (
                        <div className="flex items-center gap-1 shrink-0">
                          <EditRoomModal room={room} onUpdated={() => window.location.reload()} />
                          <DeleteRoomModal room={room} onDelete={() => window.location.reload()} />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════
              TABLE VIEW (ALTERNATIVE SPREADSHEET VIEW)
             ══════════════════════════════════════════════════════════════ */}
          {viewMode === "table" && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-500">
                <thead className="bg-gray-50 text-xs uppercase text-gray-700">
                  <tr>
                    <th className="px-5 py-3">Room</th>
                    <th className="px-5 py-3">Type</th>
                    <th className="px-5 py-3">Price/Night</th>
                    <th className="px-5 py-3">Occupancy Status</th>
                    <th className="px-5 py-3">Current Guest</th>
                    <th className="px-5 py-3">Dates</th>
                    {isStaff && <th className="px-5 py-3 text-right">Actions</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredRooms.map((room) => {
                    const isOccupied = room.activeBooking !== null;
                    const b = room.activeBooking;

                    return (
                      <tr
                        key={room._id}
                        className={`hover:bg-stone-50/80 transition-colors ${
                          isOccupied ? "bg-rose-50/20" : "bg-white"
                        }`}
                      >
                        <td className="px-5 py-3.5 font-bold font-mono text-gray-900 text-base">
                          #{room.roomNumber}
                        </td>
                        <td className="px-5 py-3.5 capitalize font-medium text-gray-700">
                          {room.type}
                        </td>
                        <td className="px-5 py-3.5 font-mono">
                          ₹{room.pricePerNight.toLocaleString("en-IN")}
                        </td>
                        <td className="px-5 py-3.5">
                          {isOccupied ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
                              <span className="h-1.5 w-1.5 rounded-full bg-rose-600 animate-pulse" />
                              Occupied
                            </span>
                          ) : room.isActive ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                              Available
                            </span>
                          ) : (
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                              Inactive
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-3.5">
                          {isOccupied ? (
                            <div>
                              <div className="font-bold text-gray-900 flex items-center gap-1">
                                <span>{b.guestName}</span>
                                <span className="font-mono text-[10px] text-gray-500 bg-white border px-1 rounded">
                                  #{b.checkInCode}
                                </span>
                              </div>
                              {b.guestPhone && (
                                <div className="text-xs text-gray-500 font-mono">
                                  {b.guestPhone}
                                </div>
                              )}
                            </div>
                          ) : (
                            <span className="text-xs text-gray-400 italic">— Vacant —</span>
                          )}
                        </td>
                        <td className="px-5 py-3.5 text-xs text-gray-600">
                          {isOccupied ? (
                            <span>
                              {formatDate(b.checkInDate)} → {formatDate(b.checkOutDate)}
                            </span>
                          ) : (
                            <span className="text-gray-400">—</span>
                          )}
                        </td>
                        {isStaff && (
                          <td className="px-5 py-3.5 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {isOccupied ? (
                                <button
                                  type="button"
                                  onClick={() => setSelectedOccupiedRoom(room)}
                                  className="rounded-lg bg-gray-900 text-white px-2.5 py-1 text-xs font-semibold hover:bg-gray-800 transition shadow-2xs"
                                >
                                  View Stay
                                </button>
                              ) : (
                                room.isActive && (
                                  <button
                                    type="button"
                                    onClick={() => setSelectedWalkInRoom(room)}
                                    className="rounded-lg bg-emerald-600 text-white px-2.5 py-1 text-xs font-semibold hover:bg-emerald-700 transition shadow-2xs"
                                  >
                                    + Walk-in
                                  </button>
                                )
                              )}
                              <EditRoomModal room={room} onUpdated={() => window.location.reload()} />
                              {!isOccupied && (
                                <DeleteRoomModal
                                  room={room}
                                  onDelete={() => window.location.reload()}
                                />
                              )}
                            </div>
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {filteredRooms.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <DoorOpen className="h-10 w-10 mx-auto text-gray-300 mb-2" />
              <p className="font-medium">No rooms match your filter criteria.</p>
              <button
                onClick={() => setFilter("all")}
                className="text-xs text-[#0F5C5C] underline font-semibold mt-1"
              >
                Reset to All Rooms
              </button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── MODALS ── */}
      {selectedOccupiedRoom && (
        <OccupiedRoomModal
          room={selectedOccupiedRoom}
          open={Boolean(selectedOccupiedRoom)}
          onClose={() => setSelectedOccupiedRoom(null)}
          onRefresh={() => window.location.reload()}
        />
      )}

      {selectedWalkInRoom && (
        <WalkInBookingModal
          room={selectedWalkInRoom}
          open={Boolean(selectedWalkInRoom)}
          onClose={() => setSelectedWalkInRoom(null)}
          onCreated={() => window.location.reload()}
        />
      )}
    </div>
  );
}
