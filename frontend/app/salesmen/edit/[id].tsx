import { View, Text, TextInput, Pressable, ActivityIndicator, KeyboardAvoidingView, Platform, Image } from "react-native";
import { Controller, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useUpdateSalesman } from "../../hooks/salesman/useUpdateSalesman";
import { useGetSalesmanById } from "../../hooks/salesman/useGetSalesmanById";
import { salesmanSchema } from "../../libs/salesmen.schema";
import z from "zod";
import { pickImageFromLibrary } from "../../utils/pickImage";

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
  } = useForm<FormData>();
  
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
        Edit Salesman
      </Text>

      <View className="items-center mb-6">
        <Pressable onPress={pickImage}>
          <Image
            source={{
              uri:
                image ||
                salesman?.profileImage ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  salesman?.name || "User"
                )}`,
            }}
            className="w-32 h-32 rounded-full"
          />
        </Pressable>

        <Text className="text-gray-500 mt-2">Tap to change photo</Text>
      </View>

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
    </KeyboardAvoidingView>
  );
}