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

import back from '../../assets/globalIcons/back.png'
import { areaSchema } from "../../libs/area.schema";
import { useCreateArea } from "../../hooks/area/useCreateArea";
import { useGetAllSalesmen } from "../../hooks/salesman/useGetAllSalesmen";
import { FormInput } from "../../components/areaInputForm/FormInput";
import { FormSelectModal } from "../../components/areaInputForm/FormSelectModal";
import { FormMultiSelectModal } from "../../components/areaInputForm/FormMultiSelectModal";
import { Salesman } from "../../types/salesman";

type FormData = z.infer<typeof areaSchema>;

const days = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

export default function CreateAreaScreen() {
  const {
    control,
    handleSubmit,
    setError,
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

  const { data: salesmen } = useGetAllSalesmen();
  const { mutateAsync, isPending } = useCreateArea();

  const onSubmit = async (data: FormData) => {
    try {
      await mutateAsync(data);
      router.back();
    } catch (err) {
      setError("root", { message: "Create failed" });
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

            <FormSelectModal
              control={control}
              name="salesmanId"
              label="Salesman"
              options={salesmen?.map((s: Salesman) => ({
                value: s.id,
                name: s.name,
              })) || []}
              getLabel={(item: Salesman) => item.name}
              errors={errors}
            />

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
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}