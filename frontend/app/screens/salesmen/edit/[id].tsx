import { View, Text, Pressable, ActivityIndicator, KeyboardAvoidingView, Platform, Image, ScrollView } from "react-native";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import z from "zod";
import back from '../../../assets/globalIcons/back.png'
import { salesmanSchema } from "../../../libs/salesmen.schema";
import { useUpdateSalesman } from "../../../hooks/salesman/useUpdateSalesman";
import { useGetSalesmanById } from "../../../hooks/salesman/useGetSalesmanById";
import { pickImageFromLibrary } from "../../../utils/pickImage";
import { SafeAreaView } from "react-native-safe-area-context";
import { FormInput } from "../../../components/areaInputForm/FormInput";
import { zodResolver } from "@hookform/resolvers/zod";

type FormData = z.infer<typeof salesmanSchema>;

export default function EditSalesmanScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const { mutateAsync, isPending } = useUpdateSalesman();
  const { data: salesman, isLoading } = useGetSalesmanById(id);
  
  const {
    control,
    handleSubmit,
    setError,
    formState: { isDirty, errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(salesmanSchema),
  });
  
  const [image, setImage] = useState<string | null>(null);
  const isDisabled = (!isDirty && !image) || isPending;

  const pickImage = async () => {
    const uri = await pickImageFromLibrary();
      if (uri) setImage(uri);
  };

  useEffect(() => {
    if (salesman) {
      reset({
        name: salesman.name ?? "",
        address: salesman.address ?? "",
        phone: salesman.phone ?? "",
      });
    }
  }, [salesman, reset]);

  const onSubmit = async (data: FormData) => {
    try {
      await mutateAsync({ id, data, image, oldImageId: salesman?.profileImageId });
      router.back();
    } catch (err) {
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
      <SafeAreaView className="flex-1">
        <ScrollView
          contentContainerStyle={{ padding: 24 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* HEADER */}
          <View className="flex-row items-center mb-8">
            <Pressable onPress={() => router.back()} className="mr-3">
              <Image
                source={back}
                className="w-6 h-6"
                resizeMode="contain"
              />
            </Pressable>

            <Text className="text-2xl font-bold">Edit Salesman</Text>
          </View>

          <View className="gap-y-6">
            {/* IMAGE */}
            <View className="items-center">
              <Pressable onPress={pickImage}>
                <Image
                  source={{
                    uri:
                      image ||
                      salesman?.profileImage ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        salesman?.name || "User"
                      )}&background=random&size=64`,
                  }}
                  className="w-32 h-32 rounded-full"
                />
              </Pressable>

              <Text className="text-gray-500 mt-2">
                Tap to change photo
              </Text>
            </View>

            {/* NAME */}
            <FormInput 
              control={control} 
              name="name" 
              label="Name" 
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
              {isPending ? "Updating..." : "Update Salesman"}
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