import z from "zod";

export const updateTransactionPaymentSchema = z.object({
  paidAmount: z.coerce.number().min(0),
  paymentType: z.enum(["cash", "transfer"]).nullable().optional(),
});

export type TUpdateTransactionPaymentInput = z.infer<typeof updateTransactionPaymentSchema>;