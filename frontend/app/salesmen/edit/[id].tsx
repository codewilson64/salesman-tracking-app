import { View, Text, TextInput, Pressable, ActivityIndicator } from "react-native";
import { Controller, useForm } from "react-hook-form";
import { useEffect } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useUpdateSalesman } from "../../hooks/useUpdateSalesman";
import { useGetSalesmanById } from "../../hooks/useGetSalesmanById";

type FormData = {
  name: string;
  address?: string;
  phone?: string;
};

export default function EditSalesmanScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { mutateAsync, isPending } = useUpdateSalesman();
  const { data, isLoading } = useGetSalesmanById(id);

  const {
    control,
    handleSubmit,
    setError,
    formState: { isDirty },
    reset,
  } = useForm<FormData>();

  useEffect(() => {
    if (data) {
      reset({
        name: data.name ?? "",
        address: data.address ?? "",
        phone: data.phone ?? "",
      });
    }
  }, [data, reset]);

  const onSubmit = async (data: FormData) => {
    try {
      await mutateAsync({ id, data });
      router.back();
    } catch (err: any) {
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
    <View className="flex-1 justify-center px-6 bg-white">
      <Text className="text-3xl font-bold mb-8 text-center">
        Edit Salesman
      </Text>

      <View className="gap-y-6">
        {/* NAME */}
        <View>
          <Text className="mb-3 text-gray-700">Full Name</Text>
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, value } }) => (
              <TextInput
                value={value}
                onChangeText={onChange}
                className="border border-gray-300 rounded-lg p-4"
              />
            )}
          />
        </View>

        {/* ADDRESS */}
        <View>
          <Text className="mb-3 text-gray-700">Address</Text>
          <Controller
            control={control}
            name="address"
            render={({ field: { onChange, value } }) => (
              <TextInput
                value={value}
                onChangeText={onChange}
                className="border border-gray-300 rounded-lg p-4"
              />
            )}
          />
        </View>

        {/* PHONE */}
        <View>
          <Text className="mb-3 text-gray-700">Phone</Text>
          <Controller
            control={control}
            name="phone"
            render={({ field: { onChange, value } }) => (
              <TextInput
                keyboardType="phone-pad"
                value={value}
                onChangeText={onChange}
                className="border border-gray-300 rounded-lg p-4"
              />
            )}
          />
        </View>
      </View>

      {/* BUTTON */}
      <Pressable
        disabled={!isDirty || isPending}
        onPress={handleSubmit(onSubmit)}
        className={`rounded-lg p-4 mt-8 ${
          !isDirty ? "bg-gray-400" : "bg-black"
        }`}
      >
        <Text className="text-white text-center font-semibold">
          {isPending ? "Updating..." : "Update Salesman"}
        </Text>
      </Pressable>
    </View>
  );
}