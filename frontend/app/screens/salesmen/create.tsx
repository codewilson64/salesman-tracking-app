import { useState } from "react";
import { View, Text, TextInput, Pressable, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "react-native";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6'
import back from '../../assets/globalIcons/back.png'
import { salesmanSchema, TSalesmanInput } from "../../libs/salesmen.schema";
import { useCreateSalesman } from "../../hooks/salesman/useCreateSalesmen";
import { pickImageFromLibrary } from "../../utils/pickImage";
import { FormInput } from "../../components/areaInputForm/FormInput";

export default function CreateSalesmanScreen() {
  const {
    control,
    handleSubmit,
    setError,
    setValue,
    formState: { errors },
  } = useForm<TSalesmanInput>({
    resolver: zodResolver(salesmanSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    }
  });

  const router = useRouter();
  const [image, setImage] = useState<string | null>(null);

  const { mutateAsync, isPending } = useCreateSalesman();

  const pickImage = async () => {
    const uri = await pickImageFromLibrary();
      if (uri) {
        setImage(uri);
        setValue("profileImage", uri); // ✅ sync to RHF
      }
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

            <Text className="text-2xl font-bold">Create salesmen</Text>
          </View>

          <View className="gap-y-6">
            {/* NAME */}
            <FormInput 
              control={control} 
              name="name" 
              label="Fullname" 
              errors={errors} 
            />

            {/* EMAIL */}
            <FormInput 
              control={control} 
              name="email" 
              label="Email" 
              errors={errors} 
            />

            {/* PASSWORD */}
            <FormInput 
              control={control} 
              name="password" 
              label="Password" 
              errors={errors} 
            />

            {/* ADDRESS */}
            <FormInput 
              control={control} 
              name="address" 
              label="Address" 
              errors={errors} 
            />

            {/* PHONE */}
            <FormInput 
              control={control} 
              name="phone" 
              label="Phone" 
              errors={errors} 
            />
            
            {/* IMAGE */}
              <View>
              <Text className="mb-3 text-gray-700">Photo</Text>
                <Pressable
                  onPress={pickImage}
                  className="w-full h-60 border border-gray-300 rounded-xl items-center justify-center mb-1 overflow-hidden"
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
                {errors.profileImage && (
                  <Text className="text-red-500 mb-4">
                    Photo is required
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