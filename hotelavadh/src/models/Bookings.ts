import mongoose, { Schema, Document, Model } from "mongoose";

export interface IBooking extends Document {
  user: mongoose.Types.ObjectId;
  room: mongoose.Types.ObjectId;
  checkInDate: Date;
  checkOutDate: Date;
  totalPrice: number;
  status: "pending" | "confirmed" | "cancelled" | "checked_in" | "checked_out";
  guests: number;
  specialRequests?: string;
  // Check-in system fields
  checkInCode: string;         // Unique 6-char code for check-in
  qrData: string;              // Base64 QR image or URL
  guestEmail?: string;         // For walk-in bookings without a user account
  guestName?: string;          // For walk-in bookings without a user account
  bookedBy: "user" | "admin" | "reception"; // Who created this booking
  createdAt: Date;
  updatedAt: Date;
}

const bookingsSchema = new Schema<IBooking>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    room: { type: Schema.Types.ObjectId, ref: "Room", required: true },
    checkInDate: { type: Date, required: true },
    checkOutDate: { type: Date, required: true },
    totalPrice: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "checked_in", "checked_out"],
      default: "pending",
    },
    guests: { type: Number, required: true, min: 1 },
    specialRequests: { type: String, trim: true },
    checkInCode: { type: String, default: "" },
    qrData: { type: String, default: "" },
    guestEmail: { type: String, trim: true },
    guestName: { type: String, trim: true },
    bookedBy: {
      type: String,
      enum: ["user", "admin", "reception"],
      default: "user",
    },
  },
  { timestamps: true }
);

const Booking: Model<IBooking> =
  mongoose.models.Booking || mongoose.model<IBooking>("Booking", bookingsSchema);

export default Booking;
