import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";

interface BookingEmailParams {
  guestEmail: string;
  guestName: string;
  bookingId: string;
  roomTitle: string;
  checkInDate: string;
  checkOutDate: string;
  guests: number;
  checkInCode: string;
  qrDataUrl: string; // base64 PNG data URL
}

export async function sendBookingConfirmationEmail(params: BookingEmailParams) {
  const {
    guestEmail,
    guestName,
    bookingId,
    roomTitle,
    checkInDate,
    checkOutDate,
    guests,
    checkInCode,
    qrDataUrl,
  } = params;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
          
          <!-- Header -->
          <tr>
            <td style="background:#0F5C5C;padding:32px 40px;text-align:center;">
              <h1 style="margin:0;color:#fff;font-size:26px;font-weight:700;letter-spacing:-0.5px;">Hotel Avadh</h1>
              <p style="margin:8px 0 0;color:rgba(255,255,255,0.75);font-size:14px;">Booking Confirmation</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              <p style="margin:0 0 24px;font-size:16px;color:#374151;">
                Dear <strong>${guestName}</strong>, your booking has been confirmed! 🎉
              </p>

              <!-- Booking Details -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;border-radius:8px;padding:24px;margin-bottom:32px;">
                <tr>
                  <td style="padding:6px 0;">
                    <span style="color:#6b7280;font-size:13px;">Room</span><br/>
                    <strong style="color:#111827;font-size:15px;">${roomTitle}</strong>
                  </td>
                </tr>
                <tr>
                  <td style="padding:6px 0;">
                    <span style="color:#6b7280;font-size:13px;">Check-in</span><br/>
                    <strong style="color:#111827;font-size:15px;">${checkInDate}</strong>
                  </td>
                </tr>
                <tr>
                  <td style="padding:6px 0;">
                    <span style="color:#6b7280;font-size:13px;">Check-out</span><br/>
                    <strong style="color:#111827;font-size:15px;">${checkOutDate}</strong>
                  </td>
                </tr>
                <tr>
                  <td style="padding:6px 0;">
                    <span style="color:#6b7280;font-size:13px;">Guests</span><br/>
                    <strong style="color:#111827;font-size:15px;">${guests}</strong>
                  </td>
                </tr>
                <tr>
                  <td style="padding:6px 0;">
                    <span style="color:#6b7280;font-size:13px;">Booking ID</span><br/>
                    <strong style="color:#111827;font-size:13px;font-family:monospace;">${bookingId}</strong>
                  </td>
                </tr>
              </table>

              <!-- Check-in Code -->
              <div style="text-align:center;margin-bottom:32px;">
                <p style="margin:0 0 12px;font-size:14px;color:#6b7280;">Your unique check-in code</p>
                <div style="display:inline-block;background:#0F5C5C;color:#fff;font-size:32px;font-weight:800;letter-spacing:10px;padding:16px 32px;border-radius:10px;font-family:monospace;">
                  ${checkInCode}
                </div>
                <p style="margin:12px 0 0;font-size:12px;color:#9ca3af;">Keep this code safe. Show it at the front desk if QR is unavailable.</p>
              </div>

              <!-- QR Code -->
              <div style="text-align:center;margin-bottom:32px;">
                <p style="margin:0 0 12px;font-size:14px;color:#6b7280;">Or scan this QR code at the front desk</p>
                <img src="${qrDataUrl}" alt="Check-in QR Code" width="180" height="180" style="border:1px solid #e5e7eb;border-radius:8px;" />
              </div>

              <p style="margin:0;font-size:13px;color:#9ca3af;text-align:center;">
                We look forward to welcoming you!<br/>
                <strong style="color:#0F5C5C;">Hotel Avadh</strong> · +91 94285 04802
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: guestEmail,
      subject: `Booking Confirmed — ${roomTitle} | Hotel Avadh`,
      html,
    });

    if (error) {
      console.error("RESEND EMAIL ERROR:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (err) {
    console.error("SEND EMAIL EXCEPTION:", err);
    return { success: false, error: err };
  }
}
