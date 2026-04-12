import {
  View,
  Text,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  ActivityIndicator,
} from "react-native";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { z } from "zod";
import { useState } from "react";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import back from '../../assets/globalIcons/back.png'
import { customerSchema } from "../../libs/customer.schema";
import { useCreateCustomer } from "../../hooks/customer/useCreateCustomer";
import { useGetAllArea } from "../../hooks/area/useGetAllAreas";
import { useGetLocation } from "../../hooks/location/useGetLocation";
import { takePhoto } from "../../utils/takePhoto";
import { Area } from "../../types/area";
import { FormSelectModal } from "../../components/areaInputForm/FormSelectModal";
import { FormInput } from "../../components/areaInputForm/FormInput";

type FormData = z.infer<typeof customerSchema>;

export default function CreateCustomerScreen() {
  const {
    control,
    handleSubmit,
    setError,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      customerName: "",
      shopName: "",
      phone: "",
      address: "",
    }
  });

  const router = useRouter();
  const [image, setImage] = useState<string | null>(null);

  const { data: areas } = useGetAllArea();
  const { mutateAsync, isPending } = useCreateCustomer();
  const { getLocation, loading: locationLoading } = useGetLocation();
  
  const pickImage = async () => {
    const uri = await takePhoto();
    if (uri) {
      setImage(uri);
      setValue("customerImage", uri); // ✅ sync to RHF
    }
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

  const handleGetCoordinate = async () => {
    const coordinate = await getLocation();

    if (coordinate) {
      const [lat, lng] = coordinate.split(",").map(Number);

      setValue("latitude", lat);
      setValue("longitude", lng);
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

            <Text className="text-2xl font-bold">Create customer</Text>
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

            {/* LOCATION */}
            <View>
              <Text className="mb-3">Location pin</Text>

              <Pressable
                onPress={handleGetCoordinate}
                className="border border-gray-300 rounded-lg p-4 bg-gray-100 flex-row justify-between items-center"
              >
                <Text>
                  {watch("latitude") && watch("longitude")
                    ? `${watch("latitude")}, ${watch("longitude")}`
                    : "Pick location"}
                </Text>

                {locationLoading ? (
                  <ActivityIndicator size={22} color="gray" />
                ) : (
                  <MaterialCommunityIcons
                    name="map-marker-outline"
                    size={22}
                    color="gray"
                  />
                )}
              </Pressable>

              {(errors.latitude || errors.longitude) && (
                <Text className="text-red-500 mt-1">
                  Location is required
                </Text>
              )}
            </View>

            {/* IMAGE */}
            <View>
              <Text className="mb-3 text-gray-700">Photo</Text>
                <Pressable
                  onPress={pickImage}
                  className="w-full h-60 border border-gray-300 rounded-xl items-center justify-center mb-1 overflow-hidden"
                >
                  {image ? (
                    <>
                      <Image
                        source={{ uri: image }}
                        className="w-full h-full"
                        resizeMode="cover"
                      />
            
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

                {errors.customerImage && (
                  <Text className="text-red-500 mb-4">
                    Photo is required
                  </Text>
                )}
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