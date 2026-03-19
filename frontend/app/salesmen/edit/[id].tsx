import { View, Text, TextInput, Pressable } from "react-native";
import { Controller, useForm } from "react-hook-form";
import { useEffect } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSalesmanStore } from "../../stores/salesmenStore";

type FormData = {
  name: string;
  address?: string;
  phone?: string;
};

export default function EditSalesmanScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const {
    selectedSalesmen,
    getSalesmanById,
    updateSalesman,
    loading,
  } = useSalesmanStore();

  const {
    control,
    handleSubmit,
    setValue,
    formState: { isDirty, isSubmitting },
  } = useForm<FormData>();

  // Fetch data
  useEffect(() => {
    if (id) {
      getSalesmanById(id as string);
    }
  }, [id]);

  // Prefill form
  useEffect(() => {
    if (selectedSalesmen) {
      setValue("name", selectedSalesmen.name);
      setValue("address", selectedSalesmen.address);
      setValue("phone", selectedSalesmen.phone);
    }
  }, [selectedSalesmen]);

  const onSubmit = async (data: FormData) => {
    try {
      await updateSalesman(id as string, data);
      router.replace("/salesmen");
    } catch (err) {
      console.error(err);
    }
  };

  if (loading || !selectedSalesmen) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Loading...</Text>
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
        disabled={!isDirty || isSubmitting}
        onPress={handleSubmit(onSubmit)}
        className={`rounded-lg p-4 mt-8 ${
          !isDirty ? "bg-gray-400" : "bg-black"
        }`}
      >
        <Text className="text-white text-center font-semibold">
          {isSubmitting ? "Updating..." : "Update Salesman"}
        </Text>
      </Pressable>
    </View>
  );
}