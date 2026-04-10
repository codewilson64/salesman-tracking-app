import { z } from "zod";

export const results = ["new order", "follow-up", "shop closed"] as const;
export const transactionTypes = ["cash", "credit"] as const;

const transactionItemSchema = z.object({
  productId: z.uuid("Please choose a product"),
  quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
  discount: z.coerce.number().min(0).default(0),
});

export const checkoutVisitSchema = z.object({
  id: z.uuid().optional(),
  result: z.enum(results, "Please select visit result"),
  transactionType: z.enum(transactionTypes).nullable().optional(),
  products: z.array(transactionItemSchema).optional(),
  orderBy: z.string().optional(),
  notes: z.string().min(1, "Notes is required"),
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

    if (!data.orderBy) {
      ctx.addIssue({
        code: "custom",
        message: "Order by is required",
        path: ["orderBy"],
      });
    }
  }
});
  

export type TCheckoutVisit = z.input<typeof checkoutVisitSchema>;
