import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPayment extends Document {
  booking: mongoose.Types.ObjectId;
  amount: number;
  paymentMethod: "credit_card" | "debit_card" | "paypal" | "cash" | "razorpay";
  paymentStatus: "pending" | "completed" | "failed" | "refunded";
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const paymentsSchema = new Schema<IPayment>(
  {
    booking: { type: Schema.Types.ObjectId, ref: "Booking", required: true },
    amount: { type: Number, required: true },
    paymentMethod: {
      type: String,
      enum: ["credit_card", "debit_card", "paypal", "cash", "razorpay"],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "failed", "refunded"],
      default: "pending",
    },
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
  },
  { timestamps: true }
);

const Payment: Model<IPayment> =
  mongoose.models.Payment || mongoose.model<IPayment>("Payment", paymentsSchema);

export default Payment;
