import { z } from "zod";

const resultEnum = z.enum([
  "new order",
  "follow-up",
  "shop closed",
]);

export const checkoutVisitSchema = z.object({
  result: resultEnum,
  notes: z.string().max(500, "Notes cannot exceed 500 characters"),
});

export type TCheckoutVisit = z.infer<typeof checkoutVisitSchema>;