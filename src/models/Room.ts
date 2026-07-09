import mongoose, { Schema, Document, Model, models } from "mongoose";

export interface IRoom extends Document {
  roomNumber: number;
  type: "single" | "double" | "suite";
  title: string;
  description: string;
  pricePerNight: number;
  maxGuests: number;
  images: string[];
  amenities: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const roomSchema = new Schema<IRoom>(
  {
    roomNumber: { type: Number, required: true, unique: true },

    type: { type: String, enum: ["single", "double", "suite"], required: true },

    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },

    pricePerNight: { type: Number, required: true, min: 0 },
    maxGuests: { type: Number, required: true, min: 1 },

    images: [{ type: String, trim: true }],
    amenities: [{ type: String, trim: true }],

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Room: Model<IRoom> = models.Room || mongoose.model<IRoom>("Room", roomSchema);
export default Room;