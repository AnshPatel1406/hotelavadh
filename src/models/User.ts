import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  name: string;
  phone?: string;
  email?: string;
  password?: string;
  role: "admin" | "user";
  createdAt: Date;
  updatedAt: Date;
  bookings?: mongoose.Types.ObjectId[];
  image?: string; // Optional field for user profile image URL
  provider?: "google" | "credentials";
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, sparse: true, trim: true, unique: true },
    email: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      sparse: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"]
    },
    image: {
      type: String,
      default: "",
    },
    password: { type: String , select: false }, // Do not return password by default
    role: { type: String, enum: ["admin", "user"], default: "user" },
    bookings: [{ type: Schema.Types.ObjectId, ref: "Booking" }],
    provider: {
      type: String,
      enum: ["google", "credentials"],
      default: "credentials"
    },
  },
  { timestamps: true }
);

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export default User;
