"use client";

import { useState } from "react";
import { X, Pencil, Loader2, Plus, Check } from "lucide-react";

const DEFAULT_AMENITY_OPTIONS = [
  "Air Conditioning", "Wi-Fi", "TV", "Mini Bar", "Room Service",
  "Bathtub", "Shower", "King Bed", "Twin Beds", "City View",
  "Swimming Pool Access", "Gym Access", "Safe", "Balcony",
];

export function EditRoomModal({ room, onUpdated }: { room: any; onUpdated: () => void }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [availableOptions, setAvailableOptions] = useState<string[]>(() =>
    Array.from(new Set([...DEFAULT_AMENITY_OPTIONS, ...(room.amenities || [])]))
  );
  const [customAmenity, setCustomAmenity] = useState("");
  const [form, setForm] = useState({
    roomNumber: room.roomNumber.toString(),
    type: room.type,
    title: room.title,
    description: room.description,
    pricePerNight: room.pricePerNight.toString(),
    maxGuests: room.maxGuests.toString(),
    amenities: (room.amenities as string[]) || [],
    isActive: room.isActive,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const addCustomAmenity = () => {
    const trimmed = customAmenity.trim();
    if (!trimmed) return;

    if (!form.amenities.includes(trimmed)) {
      setForm((prev) => ({
        ...prev,
        amenities: [...prev.amenities, trimmed],
      }));
    }

    if (!availableOptions.includes(trimmed)) {
      setAvailableOptions((prev) => [...prev, trimmed]);
    }

    setCustomAmenity("");
  };

  const removeAmenity = (a: string) => {
    setForm((prev) => ({
      ...prev,
      amenities: prev.amenities.filter((x: string) => x !== a),
    }));
  };

  const toggleAmenity = (a: string) => {
    if (form.amenities.includes(a)) {
      removeAmenity(a);
    } else {
      setForm((prev) => ({
        ...prev,
        amenities: [...prev.amenities, a],
      }));
    }
  };

  const removeOptionPermanently = (a: string) => {
    removeAmenity(a);
    setAvailableOptions((prev) => prev.filter((x) => x !== a));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await fetch(`/api/rooms/${room._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          roomNumber: Number(form.roomNumber),
          pricePerNight: Number(form.pricePerNight),
          maxGuests: Number(form.maxGuests),
        }),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.message || "Failed to update room");
      } else {
        setSuccess("Room updated successfully!");
        onUpdated();
        setTimeout(() => { setOpen(false); setSuccess(""); }, 2000);
      }
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-blue-600 hover:text-blue-900"
        title="Edit"
      >
        <Pencil className="h-4 w-4" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl mx-4 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between border-b px-6 py-4 sticky top-0 bg-white z-10">
              <h2 className="text-lg font-semibold text-gray-900">Edit Room {room.roomNumber}</h2>
              <button onClick={() => setOpen(false)} className="rounded-md p-1 hover:bg-gray-100">
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
              {/* Room Number & Type */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Room Number *</label>
                  <input
                    required
                    type="number"
                    min={1}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                    value={form.roomNumber}
                    onChange={(e) => setForm({ ...form, roomNumber: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Room Type *</label>
                  <select
                    required
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value as any })}
                  >
                    <option value="single">Single</option>
                    <option value="double">Double</option>
                    <option value="suite">Suite</option>
                  </select>
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Room Title *</label>
                <input
                  required
                  type="text"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                <textarea
                  required
                  rows={3}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>

              {/* Price & Guests */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price/Night (₹) *</label>
                  <input
                    required
                    type="number"
                    min={0}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                    value={form.pricePerNight}
                    onChange={(e) => setForm({ ...form, pricePerNight: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Max Guests *</label>
                  <input
                    required
                    type="number"
                    min={1}
                    max={10}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                    value={form.maxGuests}
                    onChange={(e) => setForm({ ...form, maxGuests: e.target.value })}
                  />
                </div>
              </div>

              {/* Amenities Management */}
              <div className="space-y-2.5 pt-1">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-gray-700">
                    Amenities ({form.amenities.length} selected)
                  </label>
                  {form.amenities.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setForm((prev) => ({ ...prev, amenities: [] }))}
                      className="text-xs text-red-600 hover:underline"
                    >
                      Clear all
                    </button>
                  )}
                </div>

                {/* Custom Amenity Input */}
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={customAmenity}
                    onChange={(e) => setCustomAmenity(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addCustomAmenity();
                      }
                    }}
                    placeholder="Type custom amenity (e.g. Geyser, Smart TV)..."
                    className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                  />
                  <button
                    type="button"
                    onClick={addCustomAmenity}
                    className="flex items-center gap-1.5 rounded-lg bg-gray-900 px-3.5 py-2 text-xs font-semibold text-white hover:bg-gray-800 transition-colors shrink-0"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add</span>
                  </button>
                </div>

                {/* Active Selected Amenities Badges */}
                {form.amenities.length > 0 ? (
                  <div className="rounded-xl bg-gray-50 p-3 border border-gray-200">
                    <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      Active Amenities on this Room (Click ✕ to remove)
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {form.amenities.map((a) => (
                        <span
                          key={a}
                          className="inline-flex items-center gap-1.5 rounded-full bg-[#0F5C5C] text-white px-3 py-1 text-xs font-medium shadow-xs"
                        >
                          <span>{a}</span>
                          <button
                            type="button"
                            onClick={() => removeAmenity(a)}
                            className="rounded-full p-0.5 hover:bg-white/20 text-white/90 hover:text-white transition-colors"
                            title={`Remove ${a}`}
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="rounded-lg bg-amber-50/70 border border-amber-200/60 px-3 py-2 text-xs text-amber-800">
                    No amenities added yet. Pick from the suggestions below or add custom amenities above.
                  </div>
                )}

                {/* Preset Suggestions Pool */}
                <div>
                  <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                    Quick Suggestions
                  </div>
                  <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1">
                    {availableOptions.map((a) => {
                      const isSelected = form.amenities.includes(a);
                      return (
                        <div
                          key={a}
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium border transition-all ${
                            isSelected
                              ? "bg-gray-900 text-white border-gray-900 shadow-xs"
                              : "bg-white text-gray-700 border-gray-300 hover:border-gray-900 hover:bg-gray-50"
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() => toggleAmenity(a)}
                            className="flex items-center gap-1"
                          >
                            {isSelected ? (
                              <Check className="h-3 w-3 text-emerald-400" />
                            ) : (
                              <Plus className="h-3 w-3 text-gray-400" />
                            )}
                            <span>{a}</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => removeOptionPermanently(a)}
                            className="ml-0.5 text-gray-400 hover:text-red-500 transition-colors p-0.5"
                            title={`Remove ${a} from options`}
                          >
                            <X className="h-2.5 w-2.5" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Active Status */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id={`isActive-${room._id}`}
                  checked={form.isActive}
                  onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-300 text-gray-900"
                />
                <label htmlFor={`isActive-${room._id}`} className="text-sm font-medium text-gray-700">Room is Active</label>
              </div>

              {/* Errors / Success */}
              {error && <p className="text-sm text-red-600 bg-red-50 rounded-md px-3 py-2">{error}</p>}
              {success && <p className="text-sm text-green-700 bg-green-50 rounded-md px-3 py-2">{success}</p>}

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-md px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-60"
                >
                  {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
