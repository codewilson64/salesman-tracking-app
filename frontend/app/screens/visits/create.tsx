import {
  View,
  Text,
  Pressable,
  KeyboardAvoidingView,
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

import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import back from '../../assets/globalIcons/back.png'

import { visitSchema } from "../../libs/visit.schema";
import { useCreateVisit } from "../../hooks/visit/useCreateVisit";
import { useGetAllArea } from "../../hooks/area/useGetAllAreas";
import { takePhoto } from "../../utils/takePhoto";
import { useGetCustomersByArea } from "../../hooks/area/useGetCustomersByArea";
import { Customer } from "../../types/customer";
import { FormSelectModal } from "../../components/areaInputForm/FormSelectModal";
import { Area } from "../../types/area";
import { useCheckInDistance } from "../../hooks/location/useCheckInDistance";
import { useCurrentLocation } from "../../hooks/location/useCurrentLocation";
import { pickImageFromLibrary } from "../../utils/pickImage";

type FormData = z.infer<typeof visitSchema>;

export default function CreateVisitScreen() {
  const {
    control,
    handleSubmit,
    setError,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(visitSchema),
  });

  const router = useRouter();
  const [image, setImage] = useState<string | null>(null);
  const [isCheckingIn, setIsCheckingIn] = useState(false);

  const { data: areas } = useGetAllArea();
  const { mutateAsync } = useCreateVisit();

  const { getCurrentLocation } = useCurrentLocation();
  
  const pickImage = async () => {
    const uri = await takePhoto();
      if (uri) {
        setImage(uri);
        setValue("checkInImage", uri, {
          shouldValidate: true,
        });
      }
  };

  /* ================= WATCH ================= */

  const selectedAreaId = watch("areaId");
  const selectedCustomerId = watch("customerId");

  /* ================= FETCH CUSTOMERS ================= */

  const { data: customers = [] } = useGetCustomersByArea(selectedAreaId);

  const selectedCustomer: Customer | undefined = customers.find(
    (c: Customer) => c.id === selectedCustomerId
  );

  const { distance, isLoading: isDistanceLoading, error: distanceError, calculateDistance } = useCheckInDistance({
    latitude: selectedCustomer?.latitude,
    longitude: selectedCustomer?.longitude,
  });

  const MAX_CHECK_IN_DISTANCE = 100;
  const isTooFar = distance != null && distance > MAX_CHECK_IN_DISTANCE;
  const isCheckInDisabled = isSubmitting || isDistanceLoading || isCheckingIn || !selectedCustomerId;


  /* ================= SUBMIT ================= */

  const onSubmit = async (data: FormData) => {
    try {
      setIsCheckingIn(true);

      const newDistance = await calculateDistance();

      if (newDistance == null) return;
      if (newDistance > MAX_CHECK_IN_DISTANCE) return;

      const location = await getCurrentLocation();

      const payload = {
        ...data,
        checkInLatitude: location.latitude,
        checkInLongitude: location.longitude,
        checkInGpsAccuracy: location.gpsAccuracy ?? undefined,
      };

      await mutateAsync({ data: payload, image });
      router.back();
    } 
    catch (err: any) {
      setError("root", {
        message: err?.response?.data?.message || err?.message || "Create failed",
      });
    }
    finally {
      setIsCheckingIn(false)
    }
  };
  /* ================= RENDER ================= */

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        className="flex-1"
        behavior="padding"
        keyboardVerticalOffset={0}
      >
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

            <Text className="text-2xl font-bold">Check In Kunjungan</Text>
          </View>

          {/* IMAGE */}
          <View className="mb-6">
              <Text className="mb-3">Foto Check In</Text>
                <Pressable
                  onPress={pickImage}
                  className="w-full h-60 border border-gray-300 rounded-xl items-center justify-center mb-2 overflow-hidden"
                >
                  {image ? (
                    <>
                      {/* IMAGE */}
                      <Image
                        source={{ uri: image }}
                        className="w-full h-full"
                        resizeMode="cover"
                      />

                      {/* REMOVE BUTTON */}
                      <Pressable
                        onPress={(e) => {
                          e.stopPropagation();
                          setImage(null);
                          setValue("checkInImage", "", {
                            shouldValidate: true,
                          });
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
                
                {errors.checkInImage && (
                  <Text className="text-red-500 mb-4">
                    Photo is required
                  </Text>
                )}
          </View>

          <View className="gap-y-6">
            {/* AREA SELECT */}
            <FormSelectModal
              control={control}
              name="areaId"
              label="Kawasan / Area"
              options={
                areas?.map((a: Area) => ({
                  value: a.id,
                  name: a.areaName,
                })) || []
              }
              getLabel={(item: { value: string; name: string }) => item.name}
              errors={errors}
              onChangeExtra={() => {
                setValue("customerId", "");
              }}
            />

            {/* CUSTOMER SELECT */}
            <FormSelectModal
              control={control}
              name="customerId"
              label="Toko"
              options={
                customers?.map((c: Customer) => ({
                  value: c.id,
                  name: c.shopName,
                })) || []
              }
              getLabel={(item: { value: string; name: string }) => item.name}
              errors={errors}
              disabled={!selectedAreaId}
            />

            {/* AUTO-FILL ADDRESS */}
            <View>
              <Text className="mb-2">Alamat</Text>
              <View className="border border-gray-300 rounded-lg p-3 bg-gray-100">
                <Text className="text-gray-700">
                  {selectedCustomer?.address || ""}
                </Text>
              </View>
            </View>
            
            {/* AUTO-FILL COORDINATE */}
            <View>
              <Text className="mb-2">Titik Lokasi</Text>
              <View className="border border-gray-300 rounded-lg p-3 bg-gray-100">
                <Text className="text-gray-700">
                  {selectedCustomer?.latitude != null &&
                  selectedCustomer?.longitude != null
                    ? `${selectedCustomer.latitude}, ${selectedCustomer.longitude}`
                    : ""}
                </Text>
              </View>
            </View>
            
            <View>
              <Text className="mb-2">
                Jarak Check In
              </Text>

              <View className="border border-gray-300 rounded-lg p-3 bg-gray-100">
                <Text className={isTooFar ? "text-red-500" : "text-gray-700"}>
                  {isDistanceLoading 
                    ? "Getting GPS location..." 
                    : distance != null 
                    ? `${distance} m` 
                    : selectedCustomerId 
                    ? "" 
                    : ""}
                </Text>
              </View>

              {distanceError && (
                <Text className="text-red-500 mt-2">{distanceError}</Text>
              )}

              {isTooFar && (
                <Text className="text-red-500 mt-2">
                  Check-in gagal. Anda berada lebih dari 100 meter dari lokasi toko.
                </Text>
              )}
            </View>
          </View>

          {/* SUBMIT */}
          <Pressable
            onPress={handleSubmit(onSubmit)}
            disabled={isCheckInDisabled}
            className={`rounded-lg p-4 mt-8 ${isCheckInDisabled ? "bg-gray-400" : "bg-black"}`}
          >
            <Text className="text-white text-center font-semibold">
              {isSubmitting ? "Checking in..." : "Check In"}
            </Text>
          </Pressable>

          {errors.root && (
            <Text className="text-red-500 text-center mt-4">
              {errors.root.message}
            </Text>
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      {isCheckingIn && (
        <View className="absolute inset-0 bg-black/50 justify-center items-center z-50">
          <ActivityIndicator size="large" color="white" />

          <Text className="text-white text-lg font-semibold mt-4">
            Checking in...
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}