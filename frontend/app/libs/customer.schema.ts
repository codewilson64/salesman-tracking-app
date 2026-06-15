import { z } from "zod";

export const customerSchema = z.object({
  areaId: z.uuid("Area is required"),
  customerName: z.string().min(1, "Customer name is required"),
  shopName: z.string().min(1, "Shop name is required"),
  phone: z.string().min(1, "Phone is required").regex(/^[0-9]+$/, "Phone must contain only numbers"),
  address: z.string().min(1, "Address is required"),
  description: z.string().optional(),
  
  latitude: z.number().optional(),
  longitude: z.number().optional(),

  customerImage: z.string().optional(),
  customerImageId: z.string().optional(),
});

export type TCustomerInput = z.infer<typeof customerSchema>;