import {
  View,
  Text,
  Pressable,
  KeyboardAvoidingView,
  ScrollView,
  Image,
} from "react-native";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { z } from "zod";

import back from '../../assets/globalIcons/back.png'
import { areaSchema } from "../../libs/area.schema";
import { useCreateArea } from "../../hooks/area/useCreateArea";
import { useGetAllSalesmen } from "../../hooks/salesman/useGetAllSalesmen";
import { FormInput } from "../../components/areaInputForm/FormInput";
import { FormSelectModal } from "../../components/areaInputForm/FormSelectModal";
import { FormMultiSelectModal } from "../../components/areaInputForm/FormMultiSelectModal";
import { User } from "../../types/user";
import { useAuthStore } from "../../stores/authStore";
import { useGetSalesmanById } from "../../hooks/salesman/useGetSalesmanById";
import { useEffect } from "react";
import { days } from "../../constants/days";

type FormData = z.infer<typeof areaSchema>;

export default function CreateAreaScreen() {
  const {
    control,
    handleSubmit,
    setError,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(areaSchema),
    defaultValues: {
      name: "",
      city: "",
      weeks: [],
    }
  });

  const router = useRouter();

  const user = useAuthStore((state) => state.user);

  const isAdmin = user?.role === "owner";
  const isSalesman = user?.role === "salesman";

  const { data: salesmen } = useGetAllSalesmen({ enabled: isAdmin });
  const { data: currentSalesman } = useGetSalesmanById(user?.id, { enabled: isSalesman });

  const { mutateAsync, isPending } = useCreateArea();

  useEffect(() => {
    if (isSalesman && user?.id) {
      setValue("salesmanId", user.id, {
        shouldValidate: true,
      });
    }
  }, [isSalesman, user?.id, setValue]);

  const onSubmit = async (data: FormData) => {
    try {
      await mutateAsync(data);
      router.back();
    } catch (err) {
      setError("root", { message: "Create failed" });
    }
  };

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

            <Text className="text-2xl font-bold">Create area</Text>
          </View>

          <View className="gap-y-6">
            <FormInput 
              control={control} 
              name="name" 
              label="Area Name" 
              errors={errors} 
            />

            <FormInput 
              control={control} 
              name="city" 
              label="City" 
              errors={errors} 
            />

            {isAdmin ? (
              <FormSelectModal
                control={control}
                name="salesmanId"
                label="Salesman"
                options={
                  salesmen?.map((s: User) => ({
                    value: s.id,
                    name: s.name,
                  })) || []
                }
                getLabel={(item: { value: string; name: string }) => item.name}
                errors={errors}
              />
            ) : (
              <View>
                <Text className="mb-2">Salesman</Text>
                <View className="border border-gray-300 rounded-lg p-3 bg-gray-100">
                  <Text className="text-gray-700">
                    {currentSalesman?.name || "Loading salesman..."}
                  </Text>
                </View>
              </View>
            )}

            <FormSelectModal
              control={control}
              name="day"
              label="Day"
              options={days.map((d) => ({ value: d }))}
              getLabel={(item: { value: string }) => item.value}
              errors={errors}
            />

            <FormMultiSelectModal
              control={control}
              name="weeks"
              label="Weeks"
              options={[1, 2, 3, 4, 5]}
              errors={errors}
            />
          </View>

          {/* SUBMIT */}
          <Pressable
            onPress={handleSubmit(onSubmit)}
            disabled={isPending}
            className="bg-black rounded-lg p-4 mt-8"
          >
            <Text className="text-white text-center font-semibold">
              {isPending ? "Creating..." : "Create Area"}
            </Text>
          </Pressable>

          {errors.root && (
            <Text className="text-red-500 text-center mt-4">
              {errors.root.message}
            </Text>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}