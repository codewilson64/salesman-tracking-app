import z from "zod";

const dayEnum = z.enum([
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
]);

export const areaSchema = z.object({
  name: z.string().min(1, "Area name is required"),
  city: z.string().min(1, "City is required"),
  day: dayEnum,
  weeks: z
    .array(z.number().min(1).max(5))
    .min(1, "Select at least one week"),
  salesmanId: z.uuid("Salesman is required"),
});

export type TAreaInput = z.infer<typeof areaSchema>;