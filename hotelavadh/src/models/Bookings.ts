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
  },
  { timestamps: true }
);

const Booking: Model<IBooking> =
  mongoose.models.Booking || mongoose.model<IBooking>("Booking", bookingsSchema);

export default Booking;
