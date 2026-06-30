import { z } from "zod";

export const updateConsignmentItemSchema = z.object({
  productId: z.uuid("Product is required"),

  currentStock: z.coerce
    .number()
    .min(0, "Current stock cannot be negative"),

  remainingStock: z.coerce
    .number()
    .min(0, "Remaining stock cannot be negative"),

  addedStock: z.coerce
    .number()
    .min(0, "Added stock cannot be negative")
    .default(0),

  returnedStock: z.coerce
    .number()
    .min(0, "Returned stock cannot be negative")
    .default(0),
})
.superRefine((data, ctx) => {
  if (data.remainingStock + data.returnedStock > data.currentStock) {
    ctx.addIssue({
      code: "custom",
      message: "Remaining stock + returned stock cannot exceed current stock",
      path: ["remainingStock"],
    });
  }
});

export type TUpdateConsignmentItemInput = z.input<typeof updateConsignmentItemSchema>;
export type TUpdateConsignmentItem = z.output<typeof updateConsignmentItemSchema>;