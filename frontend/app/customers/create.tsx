import {
  View,
  Text,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { z } from "zod";
import { customerSchema } from "../libs/customer.schema";
import { useCreateCustomer } from "../hooks/customer/useCreateCustomer";
import { useGetAllArea } from "../hooks/area/useGetAllAreas";

import { FormInput } from "../components/areaInputForm/FormInput";
import { FormSelectModal } from "../components/areaInputForm/FormSelectModal";

/* ================= TYPES ================= */

type FormData = z.infer<typeof customerSchema>;

type Area = {
  id: string;
  areaName: string;
  salesmanName: string;
};

/* ================= SCREEN ================= */

export default function CreateCustomerScreen() {
  const {
    control,
    handleSubmit,
    setError,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(customerSchema),
  });

  const router = useRouter();
  const { mutateAsync, isPending } = useCreateCustomer();
  const { data: areas } = useGetAllArea();

  /* ================= WATCH AREA ================= */

  const selectedAreaId = watch("areaId");

  const selectedArea: Area | undefined = areas?.find(
    (a: Area) => a.id === selectedAreaId
  );

  /* ================= SUBMIT ================= */

  const onSubmit = async (data: FormData) => {
    try {
      await mutateAsync(data);
      router.back();
    } catch (err: any) {
      setError("root", { message: "Create failed" });
    }
  };

  /* ================= RENDER ================= */

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior="padding"
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
    >
      <SafeAreaView>
        <ScrollView
          contentContainerStyle={{ padding: 24 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Text className="text-3xl font-bold mb-8 text-center">
            Create Customer
          </Text>

          <View className="gap-y-6">
            {/* AREA SELECT */}
            <FormSelectModal
              control={control}
              name="areaId"
              label="Area"
              options={
                areas?.map((a: Area) => ({
                  value: a.id,
                  name: a.areaName,
                })) || []
              }
              getLabel={(item: any) => item.name}
              errors={errors}
            />

            {/* AUTO-DERIVED SALESMAN */}
            <View>
              <Text className="mb-2 font-semibold">Salesman</Text>
              <View className="border border-gray-300 rounded-lg p-3 bg-gray-100">
                <Text className="text-gray-700 capitalize">
                  {selectedArea?.salesmanName || "Select area first"}
                </Text>
              </View>
            </View>

            {/* INPUTS */}
            <FormInput
              control={control}
              name="customerName"
              label="Customer Name"
              errors={errors}
            />

            <FormInput
              control={control}
              name="shopName"
              label="Shop Name"
              errors={errors}
            />

            <FormInput
              control={control}
              name="phone"
              label="Phone"
              errors={errors}
            />

            <FormInput
              control={control}
              name="address"
              label="Address"
              errors={errors}
            />

            <FormInput
              control={control}
              name="description"
              label="Description"
              errors={errors}
            />
          </View>

          {/* SUBMIT */}
          <Pressable
            onPress={handleSubmit(onSubmit)}
            disabled={isPending}
            className="bg-black rounded-lg p-4 mt-8"
          >
            <Text className="text-white text-center font-semibold">
              {isPending ? "Creating..." : "Create Customer"}
            </Text>
          </Pressable>

          {errors.root && (
            <Text className="text-red-500 text-center mt-4">
              {errors.root.message}
            </Text>
          )}
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}