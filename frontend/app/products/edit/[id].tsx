import { View, Text, TextInput, Pressable, ActivityIndicator, KeyboardAvoidingView, Platform } from "react-native";
import { Controller, useForm } from "react-hook-form";
import { useEffect } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useUpdateProduct } from "../../hooks/product/useUpdateProduct";
import { useGetProductById } from "../../hooks/product/useGetProductById";

type FormData = {
  name: string;
  description?: string;
  price: number;
};

export default function EditProductScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { mutateAsync, isPending } = useUpdateProduct();
  const { data, isLoading } = useGetProductById(id);

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
        description: data.description ?? "",
        price: data.price ?? "",
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
    <KeyboardAvoidingView
      className="flex-1 justify-center px-6 bg-white"
      behavior="padding"
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
    > 
      <Text className="text-3xl font-bold mb-8 text-center">
        Edit Product
      </Text>

      <View className="gap-y-6">
        {/* NAME */}
        <View>
          <Text className="mb-3 text-gray-700">Name</Text>
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

        {/* DESC */}
        <View>
          <Text className="mb-3 text-gray-700">Description</Text>
          <Controller
            control={control}
            name="description"
            render={({ field: { onChange, value } }) => (
              <TextInput
                value={value}
                onChangeText={onChange}
                className="border border-gray-300 rounded-lg p-4"
              />
            )}
          />
        </View>

        {/* PRICE */}
        <View>
          <Text className="mb-3 text-gray-700">Price</Text>
          <Controller
            control={control}
            name="price"
            render={({ field: { onChange, value } }) => (
              <TextInput
                value={value?.toString() ?? ""}
                onChangeText={(text) => onChange(Number(text))}
                keyboardType="numeric"
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
          {isPending ? "Updating..." : "Update Product"}
        </Text>
      </Pressable>
    </KeyboardAvoidingView>
  );
}