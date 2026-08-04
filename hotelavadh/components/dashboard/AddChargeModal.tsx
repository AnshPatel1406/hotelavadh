"use client";

import { useState } from "react";
import { PlusCircle, Loader2, X } from "lucide-react";

export function AddChargeModal({ booking, onAdded }: { booking: any; onAdded: () => void }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount || Number(amount) <= 0) {
      setError("Please provide a valid description and amount.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await fetch(`/api/bookings/${booking._id}/charges`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description, amount: Number(amount) }),
      });
      const data = await res.json();
      
      if (res.ok && data.success) {
        setSuccess(true);
        setTimeout(() => {
          onAdded();
          setOpen(false);
          setSuccess(false);
          setDescription("");
          setAmount("");
        }, 1500);
      } else {
        setError(data.message || "Failed to add charge");
      }
    } catch (err) {
      console.error(err);
      setError("Error adding charge");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1 text-indigo-600 hover:text-indigo-900 transition-colors"
        title="Add Extra Charge"
      >
        <PlusCircle className="h-4 w-4" /> <span className="text-xs">Add Charge</span>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl overflow-hidden">
            <button
                onClick={() => setOpen(false)}
                className="absolute right-4 top-4 rounded-md p-1 hover:bg-gray-100 transition-colors z-10"
              >
                <X className="h-5 w-5 text-gray-500" />
            </button>

            <form onSubmit={handleSubmit} className="p-6 pt-10">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Add Extra Charge</h2>
              <p className="text-sm text-gray-500 mb-6">
                Add an incidental charge (like room service or laundry) for <strong>{booking.user?.name}</strong>.
              </p>

              <div className="space-y-4 text-left">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dinner Order"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹)</label>
                  <input
                    type="number"
                    required
                    min={1}
                    placeholder="e.g. 500"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
              </div>

              {error && (
                <div className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-600 border border-red-100">
                  {error}
                </div>
              )}
              {success && (
                <div className="mt-4 rounded-md bg-green-50 p-3 text-sm text-green-700 border border-green-100">
                  Charge added successfully.
                </div>
              )}
              
              <div className="mt-6 flex items-center gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || success}
                  className="flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors disabled:opacity-60"
                >
                  {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                  {loading ? "Adding..." : "Add Charge"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
