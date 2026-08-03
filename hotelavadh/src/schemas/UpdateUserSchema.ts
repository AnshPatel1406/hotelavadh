import { z } from "zod";

export const UpdateUserSchema = z.object({
  name: z.string().min(1, "Name cannot be empty").optional(),
  phone: z.string().optional(),
  image: z.string().url("Invalid image URL").optional(),
});
