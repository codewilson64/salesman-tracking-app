import { z } from "zod"

export const signUpSchema = z.object({
  username: z.string().min(1, "Username is required"),
  email: z.email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters long."),
})

export type TsignUpSchema = z.infer<typeof signUpSchema>

export const loginSchema = z.object({
  email: z.email("Invalid email"),
  password: z.string().min(1, "Password is required"),
})

export type TloginSchema = z.infer<typeof loginSchema>