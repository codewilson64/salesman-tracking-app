import z from "zod";

export const updateProfileSchema = z.object({
  name: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  email: z.email().optional(),
  profileImage: z.string().optional(),
  profileImageId: z.string().optional(),
});

export type TUpdateProfileInput = z.input<typeof updateProfileSchema>;