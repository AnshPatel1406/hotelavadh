export interface WhatsAppReservationDetails {
  guestName?: string;
  guestEmail?: string;
  guestPhone?: string;
  roomTitle: string;
  roomNumber?: string | number;
  roomType?: string;
  pricePerNight?: number;
  checkInDate: Date | string;
  checkOutDate: Date | string;
  nights?: number;
  guests: number;
  totalPrice: number;
  bookingRef?: string;
  specialRequests?: string;
}

/**
 * Format stay date into "Sun, 25 Oct, 2026"
 */
export function formatStayDate(d: Date | string): string {
  if (!d) return "";
  let dateObj: Date;
  if (typeof d === "string") {
    // If format is YYYY-MM-DD, parse year, month, day to avoid timezone drift
    if (/^\d{4}-\d{2}-\d{2}$/.test(d)) {
      const [year, month, day] = d.split("-").map(Number);
      dateObj = new Date(year, month - 1, day, 12, 0, 0);
    } else {
      dateObj = new Date(d);
    }
  } else {
    dateObj = d;
  }

  if (isNaN(dateObj.getTime())) return String(d);

  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const weekday = weekdays[dateObj.getDay()];
  const day = dateObj.getDate();
  const month = months[dateObj.getMonth()];
  const year = dateObj.getFullYear();

  return `${weekday}, ${day} ${month}, ${year}`;
}

/**
 * Generates the standardized WhatsApp reservation message for Hotel Avadh
 */
export function generateWhatsAppReservationMessage(
  details: WhatsAppReservationDetails
): string {
  const guestName = details.guestName?.trim() || "Valued Guest";
  const guestEmail = details.guestEmail?.trim() || "Provided on account";
  const guestPhone = details.guestPhone?.trim() || "Available via WhatsApp";

  const roomTitle = details.roomTitle || "Avadh Room";
  const roomType = (details.roomType || "Room").toUpperCase();
  const roomNumberStr = details.roomNumber
    ? String(details.roomNumber).replace(/^#/, "")
    : "";

  // Calculate nights if not provided
  let nights = details.nights;
  if (!nights || nights < 1) {
    const inTime = new Date(details.checkInDate).getTime();
    const outTime = new Date(details.checkOutDate).getTime();
    nights = Math.max(1, Math.round((outTime - inTime) / (1000 * 60 * 60 * 24)));
  }

  const rate =
    details.pricePerNight ||
    (nights > 0 ? Math.round(details.totalPrice / nights) : details.totalPrice);

  const checkInFormatted = formatStayDate(details.checkInDate);
  const checkOutFormatted = formatStayDate(details.checkOutDate);

  const lines: string[] = [
    "🏨 *HOTEL AVADH - ROOM RESERVATION REQUEST*",
    "━━━━━━━━━━━━━━━━━━━━━━━━━━",
    "👤 *GUEST INFORMATION*",
    `• *Name:* ${guestName}`,
    `• *Email:* ${guestEmail}`,
    `• *Phone:* ${guestPhone}`,
    "🛏️ *ROOM DETAILS*",
    `• *Room:* ${roomTitle}`,
  ];

  if (roomNumberStr) {
    lines.push(`• *Room No:* #${roomNumberStr}`);
  }

  lines.push(
    `• *Type:* ${roomType}`,
    `• *Rate:* ₹${rate.toLocaleString("en-IN")} / night`,
    "📅 *STAY DATES*",
    `• *Check-in:* ${checkInFormatted} (From 12:00 PM)`,
    `• *Check-out:* ${checkOutFormatted} (By 11:00 AM)`,
    `• *Duration:* ${nights} ${nights === 1 ? "Night" : "Nights"}`,
    `• *Guests:* ${details.guests} ${details.guests === 1 ? "Guest" : "Guests"}`,
    "💳 *TOTAL ESTIMATE*",
    `• *Amount:* ₹${details.totalPrice.toLocaleString("en-IN")} (Payable upon confirmation)`
  );

  if (details.bookingRef) {
    const refCode = details.bookingRef.replace(/^#/, "");
    lines.push(`🔖 *BOOKING REFERENCE:* #${refCode}`);
  }

  // Include special requests if any, omitting internal "Guest Phone" tag
  if (details.specialRequests?.trim()) {
    const cleanedNotes = details.specialRequests
      .split("\n")
      .filter((l) => !l.toLowerCase().startsWith("guest phone:"))
      .map((l) => l.replace(/^special requests:\s*/i, "").trim())
      .filter(Boolean)
      .join(", ");

    if (cleanedNotes) {
      lines.push("📝 *SPECIAL REQUESTS*", `• ${cleanedNotes}`);
    }
  }

  lines.push(
    "━━━━━━━━━━━━━━━━━━━━━━━━━━",
    "Hello Hotel Avadh Team! 🙏 I would like to confirm this room reservation. Please contact me regarding room availability and payment details. Thank you!"
  );

  return lines.join("\n");
}

export const HOTEL_ADMIN_PHONE = "919428504802";

/**
 * Builds the wa.me click-to-chat URL with the complete encoded reservation message
 */
export function generateWhatsAppBookingUrl(
  details: WhatsAppReservationDetails
): string {
  const message = generateWhatsAppReservationMessage(details);
  return `https://wa.me/${HOTEL_ADMIN_PHONE}?text=${encodeURIComponent(message)}`;
}
