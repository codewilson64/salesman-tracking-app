import z from "zod";

export const visitSchema = z.object({
  areaId: z.uuid("Invalid area ID"),
  customerId: z.uuid("Invalid customer ID"),
});

export type TVisitInput = z.infer<typeof visitSchema>;