"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AddRoomModal } from "@/components/dashboard/AddRoomModal";
import { EditRoomModal } from "@/components/dashboard/EditRoomModal";
import { DeleteRoomModal } from "@/components/dashboard/DeleteRoomModal";

export function RoomList({ initialRooms, role }: { initialRooms: any[]; role: string }) {
  const [rooms, setRooms] = useState(initialRooms);
  const isStaff = role === "admin" || role === "reception";



  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Manage Rooms</CardTitle>
        {isStaff && <AddRoomModal onCreated={() => window.location.reload()} />}
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-500">
            <thead className="bg-gray-50 text-xs uppercase text-gray-700">
              <tr>
                <th className="px-6 py-3">Room No.</th>
                <th className="px-6 py-3">Type</th>
                <th className="px-6 py-3">Price/Night</th>
                <th className="px-6 py-3">Guests</th>
                <th className="px-6 py-3">Status</th>
                {isStaff && <th className="px-6 py-3">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {rooms.map((room) => (
                <tr key={room._id} className="border-b bg-white">
                  <td className="px-6 py-4 font-medium text-gray-900">{room.roomNumber}</td>
                  <td className="px-6 py-4 capitalize">{room.type}</td>
                  <td className="px-6 py-4">₹{room.pricePerNight}</td>
                  <td className="px-6 py-4">{room.maxGuests} max</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${room.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                      {room.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  {isStaff && (
                    <td className="px-6 py-4 flex items-center gap-3">
                      <EditRoomModal room={room} onUpdated={() => window.location.reload()} />
                      <DeleteRoomModal room={room} onDelete={() => window.location.reload()} />
                    </td>
                  )}
                </tr>
              ))}
              {rooms.length === 0 && (
                <tr>
                  <td colSpan={isStaff ? 6 : 5} className="px-6 py-4 text-center">
                    No rooms found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
