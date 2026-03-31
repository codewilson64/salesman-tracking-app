import {
  View,
  Text,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
} from "react-native";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { z } from "zod";
import { customerSchema } from "../libs/customer.schema";
import { useCreateCustomer } from "../hooks/customer/useCreateCustomer";
import { useGetAllArea } from "../hooks/area/useGetAllAreas";

import { FormInput } from "../components/areaInputForm/FormInput";
import { FormSelectModal } from "../components/areaInputForm/FormSelectModal";
import { useState } from "react";
import { pickImageFromLibrary } from "../utils/pickImage";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

/* ================= TYPES ================= */

type FormData = z.infer<typeof customerSchema>;

type Area = {
  id: string;
  areaName: string;
  salesmanName: string;
};

/* ================= SCREEN ================= */

export default function CreateCustomerScreen() {
  const {
    control,
    handleSubmit,
    setError,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(customerSchema),
  });

  const router = useRouter();
  const { mutateAsync, isPending } = useCreateCustomer();
  const { data: areas } = useGetAllArea();
  const [image, setImage] = useState<string | null>(null);
  
  const pickImage = async () => {
    const uri = await pickImageFromLibrary();
    if (uri) setImage(uri);
  };

  /* ================= WATCH AREA ================= */

  const selectedAreaId = watch("areaId");

  const selectedArea: Area | undefined = areas?.find(
    (a: Area) => a.id === selectedAreaId
  );

  /* ================= SUBMIT ================= */

  const onSubmit = async (data: FormData) => {
    try {
      await mutateAsync({ data, image });
      router.back();
    } catch (err: any) {
      setError("root", {
        message: err?.response?.data?.message || "Create failed",
      });
    }
  };

  /* ================= RENDER ================= */

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
            Create Customer
          </Text>

          <View className="gap-y-6">
            {/* AREA SELECT */}
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

            {/* AUTO-DERIVED SALESMAN */}
            <View>
              <Text className="mb-2">Salesman</Text>
              <View className="border border-gray-300 rounded-lg p-3 bg-gray-100">
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
                      <Text className="text-gray-500">Pick Customer Image</Text>
                    </View>
                  )}
                </Pressable>
              </View>
          </View>

          {/* SUBMIT */}
          <Pressable
            onPress={handleSubmit(onSubmit)}
            disabled={isPending}
            className="bg-black rounded-lg p-4 mt-8"
          >
            <Text className="text-white text-center font-semibold">
              {isPending ? "Creating..." : "Create Customer"}
            </Text>
          </Pressable>

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