import z from "zod";

export const updateSalesmanSchema = z.object({
  name: z.string().min(1, "Name is required"),
  address: z.string().optional(),
  phone: z.string().optional(),
});

export type TUpdateSalesmanInput = z.infer<typeof updateSalesmanSchema>;