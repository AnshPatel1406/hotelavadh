import { z } from "zod";

export const CancelBookingSchema = z.object({
  reason: z.string().optional(),
});
