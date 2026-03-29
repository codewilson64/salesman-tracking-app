import { z } from "zod";

export const salesmanSchema = z.object({
  email: z.email("Invalid email"),
  password: z.string()
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/,
    "Password must be at least 8 characters and include uppercase, lowercase, number, and symbol"
  ),
  name: z.string().min(1),
  address: z.string().optional(),
  phone: z.string().optional(),
  profileImage: z.url().optional(),
  profileImageId: z.string().optional(),
});

export type TSalesmanInput = z.infer<typeof salesmanSchema>;