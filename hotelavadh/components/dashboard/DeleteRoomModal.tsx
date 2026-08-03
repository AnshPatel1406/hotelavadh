"use client";

import { useState } from "react";
import { Trash2, Loader2, X } from "lucide-react";

export function DeleteRoomModal({ room, onDelete }: { room: any; onDelete: () => void }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = async () => {
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`/api/rooms/${room._id}`, { method: "DELETE" });
      const data = await res.json();
      
      if (res.ok && data.success) {
        onDelete();
        setOpen(false);
      } else {
        setError(data.message || "Failed to delete room");
      }
    } catch (err) {
      console.error(err);
      setError("Error deleting room");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-red-600 hover:text-red-900"
        title="Delete"
      >
        <Trash2 className="h-4 w-4" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-white shadow-2xl mx-4 overflow-hidden">
            
            <div className="p-6 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100 mb-4">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Delete Room {room.roomNumber}?</h2>
              <p className="text-sm text-gray-500">
                Are you sure you want to delete <strong>{room.title}</strong>? This action cannot be undone and will remove the room from the platform.
              </p>

              {error && (
                <div className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-600">
                  {error}
                </div>
              )}
            </div>

            <div className="bg-gray-50 px-6 py-4 flex items-center gap-3 justify-end border-t">
              <button
                type="button"
                onClick={() => setOpen(false)}
                disabled={loading}
                className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={loading}
                className="flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition-colors disabled:opacity-60"
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                {loading ? "Deleting..." : "Delete Room"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
