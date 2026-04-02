import z from "zod";

export const visitSchema = z.object({
  areaId: z.uuid("Invalid area ID"),
  customerId: z.uuid("Invalid customer ID"),
  checkInImage: z.url().optional(),
  checkInImageId: z.string().optional(),
});

export type TVisitInput = z.infer<typeof visitSchema>;