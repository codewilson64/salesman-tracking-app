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
import { visitSchema } from "../libs/visit.schema";
import { useCreateVisit } from "../hooks/visit/useCreateVisit";
import { useGetAllArea } from "../hooks/area/useGetAllAreas";
import { useGetCustomersByArea } from "../hooks/area/useGetCustomersByArea";

import { FormSelectModal } from "../components/areaInputForm/FormSelectModal";
import { useState } from "react";
import { takePhoto } from "../utils/takePhoto";
import { Customer } from "../types/customer";
import { Area } from "../types/area";

import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import back from '../assets/globalIcons/back.png'

type FormData = z.infer<typeof visitSchema>;

export default function CreateVisitScreen() {
  const {
    control,
    handleSubmit,
    setError,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(visitSchema),
  });

  const router = useRouter();
  const { mutateAsync, isPending } = useCreateVisit();
  const { data: areas } = useGetAllArea();
  const [image, setImage] = useState<string | null>(null);
  
  const pickImage = async () => {
    const uri = await takePhoto();
    if (uri) setImage(uri);
  };

  /* ================= WATCH ================= */

  const selectedAreaId = watch("areaId");
  const selectedCustomerId = watch("customerId");

  /* ================= FETCH CUSTOMERS ================= */

  const { data: customers = [] } = useGetCustomersByArea(selectedAreaId);

  const selectedCustomer: Customer | undefined = customers.find(
    (c: Customer) => c.id === selectedCustomerId
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

            <Text className="text-2xl font-bold">Create visit</Text>
          </View>

          {/* IMAGE */}
          <View>
              <Text className="mb-3 text-gray-700">Check in photo</Text>
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
                      <Text className="text-gray-500">Take photo</Text>
                    </View>
                  )}
                </Pressable>
          </View>

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
              onChangeExtra={() => {
                // reset customer when area changes
                setValue("customerId", "");
              }}
            />

            {/* CUSTOMER SELECT */}
            <FormSelectModal
              control={control}
              name="customerId"
              label="Customer"
              options={
                customers?.map((c: Customer) => ({
                  value: c.id,
                  name: c.shopName,
                })) || []
              }
              getLabel={(item: any) => item.name}
              errors={errors}
              disabled={!selectedAreaId}
            />

            {/* AUTO-FILL ADDRESS */}
            <View>
              <Text className="mb-2">Address</Text>
              <View className="border border-gray-300 rounded-lg p-3 bg-gray-100">
                <Text className="text-gray-700">
                  {selectedCustomer?.address || ""}
                </Text>
              </View>
            </View>
            
            {/* AUTO-FILL COORDINATE */}
            <View>
              <Text className="mb-2">Location pin</Text>
              <View className="border border-gray-300 rounded-lg p-3 bg-gray-100">
                <Text className="text-gray-700">
                  {selectedCustomer?.latitude != null &&
                  selectedCustomer?.longitude != null
                    ? `${selectedCustomer.latitude}, ${selectedCustomer.longitude}`
                    : ""}
                </Text>
              </View>
            </View>

            
          </View>

          {/* SUBMIT */}
          <Pressable
            onPress={handleSubmit(onSubmit)}
            disabled={isPending}
            className="bg-black rounded-lg p-4 mt-8"
          >
            <Text className="text-white text-center font-semibold">
              {isPending ? "Checking in..." : "Check In"}
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