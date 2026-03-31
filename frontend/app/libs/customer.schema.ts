import { z } from "zod";

export const customerSchema = z.object({
  areaId: z.uuid("Invalid area ID"),
  customerName: z.string().min(1, "Customer name is required"),
  shopName: z.string().min(1, "Shop name is required"),
  phone: z.string(),
  address: z.string(),
  description: z.string().optional(),
  latitude: z.number(),
  longitude: z.number(), 
  customerImage: z.url().optional(),
  customerImageId: z.string().optional(),
});

export type TCustomerInput = z.infer<typeof customerSchema>;