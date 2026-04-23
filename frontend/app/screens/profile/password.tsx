import {
  View,
  Text,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Image,
  ScrollView,
  Alert,
} from "react-native";
import { useForm } from "react-hook-form";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";

import { FormInput } from "../../components/areaInputForm/FormInput";
import { changePasswordSchema } from "../../libs/changePassword";

import back from "../../assets/globalIcons/back.png";
import { useUpdatePassword } from "../../hooks/profile/useUpdatePassword";

type FormData = z.infer<typeof changePasswordSchema>;

export default function ChangePasswordScreen() {
  const router = useRouter();

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isDirty },
  } = useForm<FormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const { mutateAsync, isPending } = useUpdatePassword();

  const isDisabled = !isDirty || isPending;

  const onSubmit = async (data: FormData) => {
    try {
      await mutateAsync({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });

      Alert.alert("Success", "Password updated successfully");
      router.back();
    } catch (err) {
      setError("root", { message: "Update failed" });
    }
  };

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
              <Image source={back} className="w-6 h-6" />
            </Pressable>
            <Text className="text-2xl font-bold">Change Password</Text>
          </View>

          <View className="mb-8">
            <Text className="font-normal text-lg">
              Your password must be at least 8 characters and should include a combination
              of numbers, letters and special characters (%$@#).
            </Text>
          </View>

          <View className="gap-y-6">
            {/* CURRENT PASSWORD */}
            <FormInput
              control={control}
              name="currentPassword"
              label="Current Password"
              errors={errors}
              secureTextEntry
            />

            {/* NEW PASSWORD */}
            <FormInput
              control={control}
              name="newPassword"
              label="New Password"
              errors={errors}
              secureTextEntry
            />

            {/* CONFIRM PASSWORD */}
            <FormInput
              control={control}
              name="confirmPassword"
              label="Retype New Password"
              errors={errors}
              secureTextEntry
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
              {isPending ? "Updating..." : "Update Password"}
            </Text>
          </Pressable>

          {/* ERROR */}
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