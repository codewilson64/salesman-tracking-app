import { z } from "zod";

export const salesmanSchema = z.object({
  username: z.string().min(3),
  email: z.email("Invalid email"),
  password: z.string().min(8),
  name: z.string().min(1),
  address: z.string().optional(),
  phone: z.string().optional(),
});

export type TSalesmanInput = z.infer<typeof salesmanSchema>;