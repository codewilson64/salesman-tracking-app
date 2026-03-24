import { useMutation, useQueryClient } from "@tanstack/react-query";
import { customerSchema } from "../../libs/customer.schema";
import { updateCustomerById } from "../../services/customer/customerService";
import z from "zod";

type FormData = Partial<z.infer<typeof customerSchema>>;

export const useUpdateCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: FormData;
    }) => updateCustomerById(id, data),

    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      queryClient.invalidateQueries({ queryKey: ["customer", variables.id] });
    },
  });
};