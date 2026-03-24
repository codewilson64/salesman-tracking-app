import { z } from "zod"

export const signUpSchema = z.object({
  email: z.email("Invalid email"),
  password: z.string().regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/,
    "Password must be at least 8 characters and include uppercase, lowercase, number, and symbol"
  ),
  companyName: z.string().min(1, "Company name is required")
})

export type TsignUpSchema = z.infer<typeof signUpSchema>

export const loginSchema = z.object({
  email: z.email("Invalid email"),
  password: z.string().min(1, "Password required"),
})

export type TloginSchema = z.infer<typeof loginSchema>