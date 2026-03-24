import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { z } from "zod";
import { customerSchema } from "../../libs/customer.schema";
import { useUpdateCustomer } from "../../hooks/customer/useUpdateCustomer";
import { useGetCustomerById } from "../../hooks/customer/useGetCustomerById";
import { useGetAllArea } from "../../hooks/area/useGetAllAreas";

import { FormInput } from "../../components/areaInputForm/FormInput";
import { FormSelectModal } from "../../components/areaInputForm/FormSelectModal";

/* ================= TYPES ================= */

type FormData = z.infer<typeof customerSchema>;

type Area = {
  id: string;
  areaName: string;
  salesmanName: string;
};

/* ================= SCREEN ================= */

export default function EditCustomerScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const { mutateAsync, isPending } = useUpdateCustomer();
  const { data, isLoading } = useGetCustomerById(id);
  const { data: areas } = useGetAllArea();

  const {
    control,
    handleSubmit,
    reset,
    setError,
    watch,
    formState: { isDirty, errors },
  } = useForm<FormData>();

  /* ================= PREFILL ================= */

  useEffect(() => {
    if (data) {
      reset({
        areaId: data.areaId,
        customerName: data.customerName,
        shopName: data.shopName,
        phone: data.phone,
        address: data.address,
        description: data.description,
      });
    }
  }, [data]);

  /* ================= WATCH AREA ================= */

  const selectedAreaId = watch("areaId");

  const selectedArea: Area | undefined = areas?.find(
    (a: Area) => a.id === selectedAreaId
  );

  /* ================= SUBMIT ================= */

  const onSubmit = async (form: FormData) => {
    try {
      await mutateAsync({ id, data: form });
      router.back();
    } catch {
      setError("root", { message: "Update failed" });
    }
  };

  /* ================= STATES ================= */

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  /* ================= RENDER ================= */

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior="padding"
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
    >
      <SafeAreaView>
        <ScrollView contentContainerStyle={{ padding: 24 }}>
          <Text className="text-3xl font-bold mb-8 text-center">
            Edit Customer
          </Text>

          <View className="gap-y-6">
            {/* AREA */}
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

            {/* AUTO SALESMAN */}
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

          {/* BUTTON */}
          <Pressable
            disabled={!isDirty || isPending}
            onPress={handleSubmit(onSubmit)}
            className={`mt-8 p-4 rounded-lg ${
              !isDirty ? "bg-gray-400" : "bg-black"
            }`}
          >
            <Text className="text-white text-center">
              {isPending ? "Updating..." : "Update Customer"}
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