import { z } from "zod";

export const CreatePaymentSchema = z.object({
  bookingId: z.string().min(1, "Booking ID is required"),
});
