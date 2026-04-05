import { View, Text, TextInput, Pressable, KeyboardAvoidingView, Platform, ScrollView, Image } from "react-native";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { productSchema, TProductInput } from "../libs/product.schema";
import { useCreateProduct } from "../hooks/product/useCreateProduct";
import { useState } from "react";
import { pickImageFromLibrary } from "../utils/pickImage";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import back from '../assets/globalIcons/back.png'

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
  const [image, setImage] = useState<string | null>(null);

  const pickImage = async () => {
      const uri = await pickImageFromLibrary();
      if (uri) setImage(uri);
    };

  const onSubmit = async (data: TProductInput) => {
    try {
      await mutateAsync({ data, image });
      router.back();
    } catch (err: any) {
      setError("root", {
        message: err?.response?.data?.message || "Create failed",
      });
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
          <View className="flex-row items-center mb-8">
            <Pressable
              onPress={() => router.back()}
              className="mr-3"
            >
              <Image
                source={back}
                className="w-6 h-6"
                resizeMode="contain"
              />
            </Pressable>

            <Text className="text-2xl font-bold">Create product</Text>
          </View>

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

            {/* IMAGE */}
              <View>
              <Text className="mb-3 text-gray-700">Photo</Text>
                <Pressable
                  onPress={pickImage}
                  className="w-full h-60 border border-gray-300 rounded-xl items-center justify-center mb-6 overflow-hidden"
                >
                  {image ? (
                    <>
                      {/* IMAGE */}
                      <Image
                        source={{ uri: image }}
                        className="w-full h-full"
                        resizeMode="cover"
                      />

                      {/* ❌ REMOVE BUTTON */}
                      <Pressable
                        onPress={(e) => {
                          e.stopPropagation();
                          setImage(null);
                        }}
                        className="absolute top-2 right-2"
                      >
                        <FontAwesome6 name="xmark" size={18} color="white" />
                      </Pressable>
                    </>
                  ) : (
                    <View className="items-center gap-y-2">
                      <FontAwesome6 name="image-portrait" size={32} color="gray" />
                      <Text className="text-gray-500">Pick Product Image</Text>
                    </View>
                  )}
                </Pressable>
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