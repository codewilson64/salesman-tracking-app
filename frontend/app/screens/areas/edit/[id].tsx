import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
  Image,
} from "react-native";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import z from "zod";
import back from '../../../assets/globalIcons/back.png'

import { areaSchema } from "../../../libs/area.schema";
import { useUpdateArea } from "../../../hooks/area/useUpdateArea";
import { useGetAreaById } from "../../../hooks/area/useGetAreaById";
import { useGetAllSalesmen } from "../../../hooks/salesman/useGetAllSalesmen";
import { FormInput } from "../../../components/areaInputForm/FormInput";
import { FormSelectModal } from "../../../components/areaInputForm/FormSelectModal";
import { FormMultiSelectModal } from "../../../components/areaInputForm/FormMultiSelectModal";
import { useAuthStore } from "../../../stores/authStore";
import { useGetSalesmanById } from "../../../hooks/salesman/useGetSalesmanById";
import { User } from "../../../types/user";
import { days } from "../../../constants/days";


type FormData = z.infer<typeof areaSchema>;

export default function EditAreaScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const user = useAuthStore((state) => state.user);
  
  const isAdmin = user?.role === "owner";
  const isSalesman = user?.role === "salesman";

  const { mutateAsync, isPending } = useUpdateArea();
  const { data, isLoading } = useGetAreaById(id);
  const { data: salesmen } = useGetAllSalesmen({ enabled: isAdmin });
  const { data: currentSalesman } = useGetSalesmanById(user?.id, { enabled: isSalesman });

  const {
    control,
    handleSubmit,
    reset,
    setError,
    formState: { isDirty, errors },
  } = useForm<FormData>();

  useEffect(() => {
    if (data) {
      reset({
        name: data.areaName,
        city: data.city,
        day: data.day,
        weeks: data.weeks,
        salesmanId: data.salesmanId,
      });
    }
  }, [data]);

  const onSubmit = async (form: FormData) => {
    try {
      await mutateAsync({ id, data: form });
      router.back();
    } catch {
      setError("root", { message: "Update failed" });
    }
  };

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1">
      <KeyboardAvoidingView
        className="flex-1 bg-white"
        behavior="padding"
        keyboardVerticalOffset={0}
      >
        <ScrollView
          contentContainerStyle={{ padding: 24 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* HEADER */}
          <View className="flex-row items-center mb-8">
            <Pressable onPress={() => router.back()} className="mr-3">
              <Image
                source={back}
                className="w-6 h-6"
                resizeMode="contain"
              />
            </Pressable>

            <Text className="text-2xl font-bold">Edit Area</Text>
          </View>

          <View className="gap-y-6">
            <FormInput
              control={control}
              name="name"
              label="Nama Area"
              errors={errors}
            />

            <FormInput
              control={control}
              name="city"
              label="Kota"
              errors={errors}
            />

            {isAdmin ? (
              <FormSelectModal
                control={control}
                name="salesmanId"
                label="Salesman"
                options={
                  salesmen?.map((s: User) => ({
                    value: s.id,
                    name: s.name,
                  })) || []
                }
                getLabel={(item: { value: string; name: string }) => item.name}
                errors={errors}
              />
            ) : (
              <View>
                <Text className="mb-2">Salesman</Text>
                <View className="border border-gray-300 rounded-lg p-3 bg-gray-100">
                  <Text className="text-gray-700">
                    {currentSalesman?.name || "Loading salesman..."}
                  </Text>
                </View>
              </View>
            )}

            <FormSelectModal
              control={control}
              name="day"
              label="Hari"
              options={days.map((d) => ({ value: d }))}
              getLabel={(item: any) => item.value}
              errors={errors}
            />

            <FormMultiSelectModal
              control={control}
              name="weeks"
              label="Minggu"
              options={[1, 2, 3, 4, 5]}
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
            <Text className="text-white text-center font-semibold">
              {isPending ? "Updating..." : "Update Area"}
            </Text>
          </Pressable>

          {/* GLOBAL ERROR */}
          {errors.root && (
            <Text className="text-red-500 text-center mt-4">
              {errors.root.message}
            </Text>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}