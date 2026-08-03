"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function RoomList({ initialRooms, role }: { initialRooms: any[]; role: string }) {
  const [rooms, setRooms] = useState(initialRooms);
  const isAdmin = role === "admin";

  const handleDelete = async (roomId: string) => {
    if (!isAdmin || !confirm("Are you sure you want to delete this room?")) return;

    try {
      const res = await fetch(`/api/rooms/${roomId}`, { method: "DELETE" });
      if (res.ok) {
        setRooms(rooms.filter((r) => r._id !== roomId));
      } else {
        alert("Failed to delete room");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting room");
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Manage Rooms</CardTitle>
        {isAdmin && (
          <button className="flex items-center gap-2 rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800">
            <Plus className="h-4 w-4" />
            Add Room
          </button>
        )}
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
                {isAdmin && <th className="px-6 py-3">Actions</th>}
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
                  {isAdmin && (
                    <td className="px-6 py-4 flex items-center gap-3">
                      <button className="text-blue-600 hover:text-blue-900" title="Edit">
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleDelete(room._id)} className="text-red-600 hover:text-red-900" title="Delete">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
              {rooms.length === 0 && (
                <tr>
                  <td colSpan={isAdmin ? 6 : 5} className="px-6 py-4 text-center">
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
