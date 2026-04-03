import { z } from "zod";

const resultEnum = z.enum([
  "new order",
  "follow-up",
  "shop closed",
]);

const transactionTypeEnum = z.enum([
  "cash", 
  "credit"
]);

const transactionItemSchema = z.object({
  productId: z.uuid("Invalid product ID"),
  quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
  price: z.coerce.number().min(0, "Price must be >= 0"),
});

export const checkoutVisitSchema = z.object({
  result: resultEnum,
  notes: z.string().min(1, "Notes is required"),
  transactionType: transactionTypeEnum.optional(),
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
  

export type TCheckoutVisit = z.infer<typeof checkoutVisitSchema>;