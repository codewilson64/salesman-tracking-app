import z from "zod";

export const visitSchema = z.object({
  areaId: z.uuid("Area is required"),
  customerId: z.uuid("Please select customer"),
  checkInImage: z.string().min(1, "Photo is required"),
  checkInImageId: z.string().optional(),
});

export type TVisitInput = z.infer<typeof visitSchema>;