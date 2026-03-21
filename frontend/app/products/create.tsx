import { View, Text, TextInput, Pressable, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { productSchema, TProductInput } from "../libs/product.schema";
import { useCreateProduct } from "../hooks/product/useCreateProduct";

export default function CreateProductScreen() {
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<TProductInput>({
    resolver: zodResolver(productSchema),
  });

  const router = useRouter();
  const { mutateAsync, isPending } = useCreateProduct();

  const onSubmit = async (data: TProductInput) => {
    try {
      await mutateAsync(data);
      router.back();
    } catch (err: any) {
      setError("root", { message: "Create failed" });
    }
  };

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
            Create Product
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
              {errors.name && (
                <Text className="text-red-500 mt-1">
                  {errors.name.message}
                </Text>
              )}
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
              {errors.description && (
                <Text className="text-red-500 mt-1">
                  {errors.description.message}
                </Text>
              )}
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
              {errors.price && (
                <Text className="text-red-500 mt-1">
                  {errors.price.message}
                </Text>
              )}
            </View>
          </View>

            <Pressable
              onPress={handleSubmit(onSubmit)}
              disabled={isPending}
              className="bg-black rounded-lg p-4 mt-8"
            >
              <Text className="text-white text-center font-semibold">
                {isPending ? "Creating..." : "Create Product"}
              </Text>
            </Pressable>

          {/* GLOBAL ERROR */}
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