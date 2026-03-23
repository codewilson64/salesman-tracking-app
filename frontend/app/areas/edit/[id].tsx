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

import { areaSchema } from "../../libs/area.schema";
import z from "zod";
import { useUpdateArea } from "../../hooks/area/useUpdateArea";
import { useGetAreaById } from "../../hooks/area/useGetAreaById";
import { useGetAllSalesmen } from "../../hooks/salesman/useGetAllSalesmen";
import { FormInput } from "../../components/areaInputForm/FormInput";
import { FormSelectModal } from "../../components/areaInputForm/FormSelectModal";
import { FormMultiSelectModal } from "../../components/areaInputForm/FormMultiSelectModal";

type FormData = z.infer<typeof areaSchema>;

const days = ["monday","tuesday","wednesday","thursday","friday","saturday","sunday",];

export default function EditAreaScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const { mutateAsync, isPending } = useUpdateArea();
  const { data, isLoading } = useGetAreaById(id);
  const { data: salesmen } = useGetAllSalesmen();

  const {
    control,
    handleSubmit,
    reset,
    setError,
    formState: { isDirty, errors },
  } = useForm<FormData>();

  // PREFILL
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
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior="padding"
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
    >
      <SafeAreaView>
        <ScrollView contentContainerStyle={{ padding: 24 }}>
          <Text className="text-3xl font-bold mb-8 text-center">
            Edit Area
          </Text>

          <View className="gap-y-6">
            <FormInput control={control} name="name" label="Area Name" errors={errors} />
            
            <FormInput control={control} name="city" label="City" errors={errors} />
            
              <FormSelectModal
                control={control}
                name="salesmanId"
                label="Salesman"
                options={salesmen?.map((s: any) => ({
                   value: s.id,
                  name: s.name,
                })) || []}
                getLabel={(item: any) => item.name}
                errors={errors}
              />
            
              <FormSelectModal
                control={control}
                name="day"
                label="Day"
                options={days.map((d) => ({ value: d }))}
                getLabel={(item: any) => item.value}
                errors={errors}
              />
            
              <FormMultiSelectModal
                control={control}
                name="weeks"
                label="Weeks"
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
            <Text className="text-white text-center">
              {isPending ? "Updating..." : "Update Area"}
            </Text>
          </Pressable>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}