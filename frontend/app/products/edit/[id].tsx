import { View, Text, TextInput, Pressable, ActivityIndicator, KeyboardAvoidingView, Platform, Image } from "react-native";
import { Controller, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useUpdateProduct } from "../../hooks/product/useUpdateProduct";
import { useGetProductById } from "../../hooks/product/useGetProductById";
import { productSchema } from "../../libs/product.schema";
import z from "zod";
import { pickImageFromLibrary } from "../../utils/pickImage";

type FormData = z.infer<typeof productSchema>;

export default function EditProductScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { mutateAsync, isPending } = useUpdateProduct();
  const { data: product, isLoading } = useGetProductById(id);

  const {
    control,
    handleSubmit,
    setError,
    formState: { isDirty, errors },
    reset,
  } = useForm<FormData>();

  const [image, setImage] = useState<string | null>(null);
  const isDisabled = (!isDirty && !image) || isPending;

  const pickImage = async () => {
    const uri = await pickImageFromLibrary();
    if (uri) setImage(uri);
  };

  useEffect(() => {
    if (product) {
      reset({
        name: product.name ?? "",
        description: product.description ?? "",
        price: product.price ?? "",
      });
    }
  }, [product, reset]);

  const onSubmit = async (data: FormData) => {
    try {
      await mutateAsync({ id, data, image, oldImageId: product?.productImageId });
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

      <View className="items-center mb-6">
          <Pressable onPress={pickImage}>
            <Image
              source={{
                uri:
                  image ||
                  product?.productImage ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  product?.name || "User"
                )}&background=random&size=64`,
              }}
                className="w-32 h-32 rounded-full"
            />
          </Pressable>
      
        <Text className="text-gray-500 mt-2">Tap to change photo</Text>
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
        disabled={isDisabled}
        onPress={handleSubmit(onSubmit)}
        className={`rounded-lg p-4 mt-8 ${
          isDisabled ? "bg-gray-400" : "bg-black"
        }`}
      >
        <Text className="text-white text-center font-semibold">
          {isPending ? "Updating..." : "Update Product"}
        </Text>
      </Pressable>

      {/* GLOBAL ERROR */}
        {errors.root && (
          <Text className="text-red-500 text-center mt-4">
            {errors.root.message}
          </Text>
      )}
    </KeyboardAvoidingView>
  );
}