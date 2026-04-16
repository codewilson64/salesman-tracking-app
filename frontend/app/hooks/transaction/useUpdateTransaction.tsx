import z from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTransactionPaymentSchema } from "../../libs/updateTransactionPayment.schema";
import { updateTransactionPayment } from "../../services/transaction/transactionService";

type FormData = z.infer<typeof updateTransactionPaymentSchema>;

export const useUpdateTransactionPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: FormData;
    }) => updateTransactionPayment(id, data),

    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["transaction", variables.id] });
    },
  });
};