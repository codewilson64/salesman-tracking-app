import z from "zod";

export const updateProfileSchema = z.object({
  email: z.email().optional(),
  profileImage: z.string().optional(),
  profileImageId: z.string().optional(),
});

export type TUpdateProfileInput = z.input<typeof updateProfileSchema>;