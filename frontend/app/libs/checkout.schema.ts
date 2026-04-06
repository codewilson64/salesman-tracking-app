import { z } from "zod";

export const results = ["new order", "follow-up", "shop closed"] as const;
export const transactionTypes = ["cash", "credit"] as const;

const transactionItemSchema = z.object({
  productId: z.uuid("Invalid product ID"),
  quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
  price: z.coerce.number().min(0, "Price must be >= 0"),
  discount: z.coerce.number().min(0).default(0),
});

export const checkoutVisitSchema = z.object({
  result: z.enum(results),
  notes: z.string().min(1, "Notes is required"),
  transactionType: z.enum(transactionTypes).optional(),
  products: z.array(transactionItemSchema).optional(),
})
.superRefine((data, ctx) => {
  if (data.result === "new order") {
    if (!data.transactionType) {
      ctx.addIssue({
        code: "custom",
        message: "Transaction type is required",
        path: ["transactionType"],
      });
    }

    if (!data.products || data.products.length === 0) {
      ctx.addIssue({
        code: "custom",
        message: "At least one product is required",
        path: ["products"],
      });
    }
  }
});
  

export type TCheckoutVisit = z.input<typeof checkoutVisitSchema>;
export type TCheckoutVisitParsed = z.output<typeof checkoutVisitSchema>;