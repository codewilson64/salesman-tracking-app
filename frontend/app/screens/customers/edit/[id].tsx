import { View, Text, Pressable, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, Image } from "react-native";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { z } from "zod";
import back from '../../../assets/globalIcons/back.png'

import { customerSchema } from "../../../libs/customer.schema";
import { useUpdateCustomer } from "../../../hooks/customer/useUpdateCustomer";
import { useGetCustomerById } from "../../../hooks/customer/useGetCustomerById";
import { useGetAllArea } from "../../../hooks/area/useGetAllAreas";
import { pickImageFromLibrary } from "../../../utils/pickImage";
import { Area } from "../../../types/area";
import { FormSelectModal } from "../../../components/areaInputForm/FormSelectModal";
import { FormInput } from "../../../components/areaInputForm/FormInput";


type FormData = z.infer<typeof customerSchema>;

export default function EditCustomerScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { mutateAsync, isPending } = useUpdateCustomer();
  const { data: customer, isLoading } = useGetCustomerById(id);
  const { data: areas } = useGetAllArea();

  const {
    control,
    handleSubmit,
    reset,
    setError,
    watch,
    formState: { isDirty, errors },
  } = useForm<FormData>();

  const [image, setImage] = useState<string | null>(null);
  const isDisabled = (!isDirty && !image) || isPending;

  const pickImage = async () => {
    const uri = await pickImageFromLibrary();
      if (uri) setImage(uri);
  };

  useEffect(() => {
    if (customer) {
      reset({
        areaId: customer.areaId,
        customerName: customer.customerName,
        shopName: customer.shopName,
        phone: customer.phone,
        address: customer.address,
        description: customer.description,
      });
    }
  }, [customer]);

  const selectedAreaId = watch("areaId");

  const selectedArea: Area | undefined = areas?.find(
    (a: Area) => a.id === selectedAreaId
  );

  const onSubmit = async (data: FormData) => {
    try {
      await mutateAsync({ id, data, image, oldImageId: customer?.customerImageId });
      router.back();
    } catch {
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

            <Text className="text-2xl font-bold">Edit Customer</Text>
          </View>

          <View className="gap-y-6">
            {/* IMAGE */}
            <View className="items-center">
              <Pressable onPress={pickImage}>
                <Image
                  source={{
                    uri:
                      image ||
                      customer?.customerImage ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        customer?.shopName || "User"
                      )}&background=random&size=64`,
                  }}
                  className="w-32 h-32 rounded-full"
                />
              </Pressable>

              <Text className="text-gray-500 mt-2">
                Tap to change photo
              </Text>
            </View>

            {/* AREA */}
            <FormSelectModal
              control={control}
              name="areaId"
              label="Area"
              options={
                areas?.map((a: Area) => ({
                  value: a.id,
                  name: a.areaName,
                })) || []
              }
              getLabel={(item: any) => item.name}
              errors={errors}
            />

            {/* SALESMAN (AUTO) */}
            <View>
              <Text className="mb-3 text-gray-700">Salesman</Text>
              <View className="border border-gray-300 rounded-lg p-4 bg-gray-100">
                <Text className="text-gray-700 capitalize">
                  {selectedArea?.salesmanName || "Select area first"}
                </Text>
              </View>
            </View>

            {/* INPUTS */}
            <FormInput
              control={control}
              name="customerName"
              label="Customer Name"
              errors={errors}
            />

            <FormInput
              control={control}
              name="shopName"
              label="Shop Name"
              errors={errors}
            />

            <FormInput
              control={control}
              name="phone"
              label="Phone"
              errors={errors}
            />

            <FormInput
              control={control}
              name="address"
              label="Address"
              errors={errors}
            />

            <FormInput
              control={control}
              name="description"
              label="Description"
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
              {isPending ? "Updating..." : "Update Customer"}
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