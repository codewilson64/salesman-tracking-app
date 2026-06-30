import { z } from "zod";

export const results = ["Order Baru", "Titip Baru", "Update Titipan", "Follow Up", "Tutup Toko"] as const;
export const transactionTypes = ["Tunai", "Kredit"] as const;
export const paymentTypes = ["Tunai", "Transfer"] as const;

export const transactionItemSchema = z.object({
  productId: z.uuid("Please choose a product"),
  quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
  discount: z.coerce.number().min(0).default(0),
});

export const updateConsignmentItemSchema = z.object({
  productId: z.uuid("Please choose a product"),
  currentStock: z.coerce.number().min(0).default(0),
  remainingStock: z.coerce.number().min(0).default(0),
  addedStock: z.coerce.number().min(0).default(0),
  returnedStock: z.coerce.number().min(0).default(0),
});

export const checkoutVisitSchema = z.object({
  id: z.uuid().optional(),
  result: z.enum(results, "Please select visit result"),
  transactionType: z.enum(transactionTypes).nullable().optional(),

  products: z.array(transactionItemSchema).optional(),
  consignmentItems: z.array(updateConsignmentItemSchema).optional(),

  orderBy: z.string().optional(),
  dueDate: z.string().nullable().optional(),
  paidAmount: z.coerce.number().optional(),
  paymentType: z.enum(paymentTypes).nullable().optional(),
  notes: z.string(),

  checkOutLatitude: z.number().optional(),
  checkOutLongitude: z.number().optional(),
  checkOutGpsAccuracy: z.number().nullable().optional(),
})
.superRefine((data, ctx) => {
  const isOrder = data.result === "Order Baru";
  const isTitip = data.result === "Titip Baru";
  const isUpdateTitipan = data.result === "Update Titipan";

  if (isOrder || isTitip) {
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
        message: isTitip ? "required" : "Order by is required",
        path: ["orderBy"],
      });
    }
  }

  if (isUpdateTitipan) {
    if (!data.consignmentItems || data.consignmentItems.length === 0) {
      ctx.addIssue({
        code: "custom",
        message: "At least one consignment item is required",
        path: ["consignmentItems"],
      });
    }
  }

  if (isOrder) {
    if (!data.transactionType) {
      ctx.addIssue({
        code: "custom",
        message: "Transaction type is required",
        path: ["transactionType"],
      });
    }

    if (data.transactionType === "Tunai" && !data.paymentType) {
      ctx.addIssue({
        code: "custom",
        message: "Payment type is required",
        path: ["paymentType"],
      });
    }

    if (
      data.transactionType === "Kredit" && Number(data.paidAmount) > 0 && !data.paymentType
    ) {
      ctx.addIssue({
        code: "custom",
        message: "Payment type is required",
        path: ["paymentType"],
      });
    }

    if (data.transactionType === "Kredit" && !data.dueDate) {
      ctx.addIssue({
        code: "custom",
        message: "Due date is required for credit transaction",
        path: ["dueDate"],
      });
    }
  }
});

export type TTransactionItemInput = z.input<typeof transactionItemSchema>;
export type TTransactionItem = z.output<typeof transactionItemSchema>;
export type TUpdateConsignmentItem = z.output<typeof updateConsignmentItemSchema>;
export type TCheckoutVisit = z.input<typeof checkoutVisitSchema>;
