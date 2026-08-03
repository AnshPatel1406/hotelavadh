import { z } from "zod";

export const UpdateRoomSchemaAdmin = z.object({
  roomNumber: z.number().int().positive("Room number must be a positive integer").optional(),
  type: z.enum(["single", "double", "suite"]).optional(),
  title: z.string().min(1, "Title is required").optional(),
  description: z.string().min(1, "Description is required").optional(),
  pricePerNight: z.number().positive("Price must be a positive number").optional(),
  maxGuests: z.number().int().min(1, "Max guests must be at least 1").optional(),
  images: z.array(z.string().url("Invalid image URL")).optional(),
  amenities: z.array(z.string()).optional(),
  isActive: z.boolean().optional(),
});
