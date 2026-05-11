import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPayment extends Document {
  booking: mongoose.Types.ObjectId;
  amount: number;
  paymentMethod: "credit_card" | "debit_card" | "paypal" | "cash";
  paymentStatus: "pending" | "completed" | "failed";
  createdAt: Date;
  updatedAt: Date;
}

const paymentsSchema = new Schema<IPayment>(
  {
    booking: { type: Schema.Types.ObjectId, ref: "Booking", required: true },
    amount: { type: Number, required: true },
    paymentMethod: {
      type: String,
      enum: ["credit_card", "debit_card", "paypal", "cash"],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const Payment: Model<IPayment> =
  mongoose.models.Payment || mongoose.model<IPayment>("Payment", paymentsSchema);

export default Payment;
