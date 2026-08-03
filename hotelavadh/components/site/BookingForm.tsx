"use client";

import { useState } from "react";
import Script from "next/script";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export function BookingForm({ roomId, pricePerNight, maxGuests }: { roomId: string, pricePerNight: number, maxGuests: number }) {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleBook = async () => {
    if (!checkIn || !checkOut) {
      alert("Please select dates");
      return;
    }

    setLoading(true);

    try {
      // 1. Create Booking
      const bookingRes = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomId,
          checkInDate: new Date(checkIn).toISOString(),
          checkOutDate: new Date(checkOut).toISOString(),
          guests: Number(guests)
        }),
      });

      const bookingData = await bookingRes.json();
      if (!bookingData.success) {
        alert(bookingData.message || "Failed to create booking");
        setLoading(false);
        return;
      }

      const bookingId = bookingData.booking._id;

      // 2. Create Razorpay Order
      const orderRes = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId }),
      });

      const orderData = await orderRes.json();
      if (!orderData.success) {
        alert(orderData.message || "Failed to create order");
        setLoading(false);
        return;
      }

      // 3. Open Razorpay Checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, 
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: "Avadh Hotel",
        description: "Room Booking",
        order_id: orderData.order.id,
        handler: async function (response: any) {
          // 4. Verify Payment
          const verifyRes = await fetch("/api/payments/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              bookingId,
            }),
          });
          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            alert("Booking Confirmed!");
            router.push("/profile");
          } else {
            alert("Payment Verification Failed");
          }
        },
        prefill: {
          name: "Guest",
        },
        theme: {
          color: "#111827",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function (response: any) {
        alert(response.error.description);
      });
      rzp.open();

    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Check-in Date & Time</label>
          <input
            type="datetime-local"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-900 focus:ring-gray-900 sm:text-sm p-2 border"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Check-out Date & Time</label>
          <input
            type="datetime-local"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-900 focus:ring-gray-900 sm:text-sm p-2 border"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Guests (Max: {maxGuests})</label>
          <input
            type="number"
            min={1}
            max={maxGuests}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-900 focus:ring-gray-900 sm:text-sm p-2 border"
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value))}
          />
        </div>
        
        <Button className="w-full" onClick={handleBook} disabled={loading}>
          {loading ? "Processing..." : "Book Now"}
        </Button>
      </div>
    </>
  );
}
