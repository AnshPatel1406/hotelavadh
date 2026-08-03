import { z } from "zod";

export const CreateBookingSchema = z.object({
  roomId: z.string().min(1, "Room ID is required"),
  checkInDate: z.string().datetime({ message: "Invalid check-in date" }),
  checkOutDate: z.string().datetime({ message: "Invalid check-out date" }),
  guests: z.number().int().min(1, "At least 1 guest required"),
  specialRequests: z.string().optional(),
}).refine(data => {
  return new Date(data.checkInDate) < new Date(data.checkOutDate);
}, {
  message: "Check-out date must be after check-in date",
  path: ["checkOutDate"],
});
