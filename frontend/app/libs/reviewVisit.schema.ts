import z from "zod";

export const reviewVisitSchema = z.object({
  status: z.enum(["approved", "rejected"], {
    message: "Please select status",
  }),
  adminNote: z.string().optional(),
  rejectionReason: z.string().optional(),
}).refine(
  (data) =>
    data.status === "approved" || !!data.rejectionReason,
  {
    message: "Rejection reason is required",
    path: ["rejectionReason"],
  }
);;

export type TReviewVisitInput = z.infer<typeof reviewVisitSchema>;