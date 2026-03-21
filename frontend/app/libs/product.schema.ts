import { z } from "zod";

export const productSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  description: z.string().optional(),
  price: z.number().min(0, "Price must be at least 0"),
});

export type TProductInput = z.infer<typeof productSchema>;