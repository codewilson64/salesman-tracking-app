import { z } from "zod";

export const forgotPasswordSchema = z.object({
  email: z.email(),
});

export type TForgotPassword = z.infer<typeof forgotPasswordSchema>;