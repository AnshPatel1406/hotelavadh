import mongoose, { Schema, Document, Model } from "mongoose";

export interface IRoom extends Document {
  roomNumber: number;
  type: "single" | "double" | "suite";
  price: number;
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const roomsSchema = new Schema<IRoom>(
  {
    roomNumber: { type: Number, required: true, unique: true },
    type: { type: String, enum: ["single", "double", "suite"], required: true },
    price: { type: Number, required: true },
    isAvailable: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Room: Model<IRoom> =
  mongoose.models.Room || mongoose.model<IRoom>("Room", roomsSchema);

export default Room;
