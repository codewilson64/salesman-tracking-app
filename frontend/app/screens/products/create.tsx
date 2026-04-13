import { View, Text, Pressable, KeyboardAvoidingView, Platform, ScrollView, Image } from "react-native";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { useState } from "react";

import { productSchema, TProductInput } from "../../libs/product.schema";
import { useCreateProduct } from "../../hooks/product/useCreateProduct";
import { pickImageFromLibrary } from "../../utils/pickImage";
import { FormInput } from "../../components/areaInputForm/FormInput";

import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import back from '../../assets/globalIcons/back.png'

export default function CreateProductScreen() {
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<TProductInput>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      price: 0,
    }
  });

  const router = useRouter();
  const [image, setImage] = useState<string | null>(null);

  const { mutateAsync, isPending } = useCreateProduct();

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
            <FormInput 
              control={control} 
              name="name" 
              label="Name" 
              errors={errors} 
            />

            {/* DESC */}
            <FormInput 
              control={control} 
              name="description" 
              label="Description" 
              errors={errors} 
            />

            {/* PRICE */}
            <FormInput 
              control={control} 
              name="price" 
              label="Price" 
              errors={errors} 
            />

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