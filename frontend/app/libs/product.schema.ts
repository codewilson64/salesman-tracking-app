import { z } from "zod";
import { units } from "../constants/units";

export const productSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  description: z.string().optional(),
  price: z.coerce.number().min(0, "Price must be at least 0"),
  unit: z.enum(units, { message: "Unit is required" }),
  productImage: z.url().optional(),
  productImageId: z.string().optional(),
});

export type TProductInput = z.input<typeof productSchema>;