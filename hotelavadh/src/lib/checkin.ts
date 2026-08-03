import QRCode from "qrcode";

/**
 * Generates a random 6-character alphanumeric check-in code.
 * Uses uppercase letters and numbers for clarity (avoids 0/O confusion).
 */
export function generateCheckInCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

/**
 * Generates a QR code as a base64 PNG data URL.
 * The QR encodes a check-in verification URL with the booking ID and code.
 */
export async function generateQRCode(bookingId: string, checkInCode: string): Promise<string> {
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const verifyUrl = `${baseUrl}/checkin/${bookingId}?code=${checkInCode}`;
  
  const qrDataUrl = await QRCode.toDataURL(verifyUrl, {
    errorCorrectionLevel: "H",
    type: "image/png",
    margin: 2,
    color: {
      dark: "#0F5C5C",
      light: "#FFFFFF",
    },
    width: 300,
  });

  return qrDataUrl;
}
