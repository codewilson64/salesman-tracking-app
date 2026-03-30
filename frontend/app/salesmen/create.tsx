import { useState } from "react";
import { View, Text, TextInput, Pressable, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { salesmanSchema, TSalesmanInput } from "../libs/salesmen.schema";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCreateSalesman } from "../hooks/salesman/useCreateSalesmen";
import { Image } from "react-native";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6'
import { pickImageFromLibrary } from "../utils/pickImage";

export default function CreateSalesmanScreen() {
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<TSalesmanInput>({
    resolver: zodResolver(salesmanSchema),
  });

  const router = useRouter();
  const { mutateAsync, isPending } = useCreateSalesman();
  const [image, setImage] = useState<string | null>(null);

  const pickImage = async () => {
    const uri = await pickImageFromLibrary();
    if (uri) setImage(uri);
  };

  const onSubmit = async (data: TSalesmanInput) => {
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
          <Text className="text-3xl font-bold mb-8 text-center">
            Create Salesman
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
              {errors.name && (
                <Text className="text-red-500 mt-1">
                  {errors.name.message}
                </Text>
              )}
            </View>

            {/* EMAIL */}
            <View>
              <Text className="mb-3 text-gray-700">Email</Text>
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    autoCapitalize="none"
                    keyboardType="email-address"
                    value={value}
                    onChangeText={onChange}
                    className="border border-gray-300 rounded-lg p-4"
                  />
                )}
              />
              {errors.email && (
                <Text className="text-red-500 mt-1">
                  {errors.email.message}
                </Text>
              )}
            </View>

            {/* PASSWORD */}
            <View>
              <Text className="mb-3 text-gray-700">Password</Text>
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    secureTextEntry
                    value={value}
                    onChangeText={onChange}
                    className="border border-gray-300 rounded-lg p-4"
                  />
                )}
              />
              {errors.password && (
                <Text className="text-red-500 mt-1">
                  {errors.password.message}
                </Text>
              )}
            </View>

            {/* ADDRESS */}
            <View>
              <Text className="mb-3 text-gray-700">Address (optional)</Text>
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
              <Text className="mb-3 text-gray-700">Phone (optional)</Text>
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
                      <Text className="text-gray-500">Pick Profile Image</Text>
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
                {isPending ? "Creating..." : "Create Salesman"}
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