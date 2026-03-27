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
import { visitSchema } from "../libs/visit.schema";
import { useCreateVisit } from "../hooks/visit/useCreateVisit";
import { useGetAllArea } from "../hooks/area/useGetAllAreas";
import { useGetCustomersByArea } from "../hooks/area/useGetCustomersByArea";

import { FormSelectModal } from "../components/areaInputForm/FormSelectModal";

/* ================= TYPES ================= */

type FormData = z.infer<typeof visitSchema>;

type Area = {
  id: string;
  areaName: string;
};

type Customer = {
  id: string;
  shopName: string;
  address: string;
};

/* ================= SCREEN ================= */

export default function CreateVisitScreen() {
  const {
    control,
    handleSubmit,
    setError,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(visitSchema),
  });

  const router = useRouter();
  const { mutateAsync, isPending } = useCreateVisit();
  const { data: areas } = useGetAllArea();

  /* ================= WATCH ================= */

  const selectedAreaId = watch("areaId");
  const selectedCustomerId = watch("customerId");

  /* ================= FETCH CUSTOMERS ================= */

  const { data: customers = [] } = useGetCustomersByArea(selectedAreaId);
  console.log("customers by area:", customers);

  const selectedCustomer: Customer | undefined = customers.find(
    (c: Customer) => c.id === selectedCustomerId
  );

  /* ================= SUBMIT ================= */

  const onSubmit = async (data: FormData) => {
    try {
      await mutateAsync(data);
      router.back();
    } catch (err: any) {
      setError("root", { message: "Create visit failed" });
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
            Create Visit
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
              onChangeExtra={() => {
                // reset customer when area changes
                setValue("customerId", "");
              }}
            />

            {/* CUSTOMER SELECT */}
            <FormSelectModal
              control={control}
              name="customerId"
              label="Customer"
              options={
                customers?.map((c: Customer) => ({
                  value: c.id,
                  name: c.shopName,
                })) || []
              }
              getLabel={(item: any) => item.name}
              errors={errors}
              disabled={!selectedAreaId}
            />

            {/* AUTO-FILL ADDRESS */}
            <View>
              <Text className="mb-2">Address</Text>
              <View className="border border-gray-300 rounded-lg p-3 bg-gray-100">
                <Text className="text-gray-700">
                  {selectedCustomer?.address || "Select customer first"}
                </Text>
              </View>
            </View>
          </View>

          {/* SUBMIT */}
          <Pressable
            onPress={handleSubmit(onSubmit)}
            disabled={isPending}
            className="bg-black rounded-lg p-4 mt-8"
          >
            <Text className="text-white text-center font-semibold">
              {isPending ? "Checking in..." : "Check In"}
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