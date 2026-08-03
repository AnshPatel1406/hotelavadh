import { z } from "zod";

export const CreateRoomSchemaAdmin = z.object({
  roomNumber: z.number().int().positive("Room number must be a positive integer"),
  type: z.enum(["single", "double", "suite"]),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  pricePerNight: z.number().positive("Price must be a positive number"),
  maxGuests: z.number().int().min(1, "Max guests must be at least 1"),
  images: z.array(z.string().url("Invalid image URL")).optional().default([]),
  amenities: z.array(z.string()).optional().default([]),
  isActive: z.boolean().optional().default(true),
});
