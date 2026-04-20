import {
  View,
  Text,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Image,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";

import back from "../../assets/globalIcons/back.png";
import { FormInput } from "../../components/areaInputForm/FormInput";
import { pickImageFromLibrary } from "../../utils/pickImage";
import { updateProfileSchema } from "../../libs/profile.schema";

import { useUpdateProfile } from "../../hooks/profile/useUpdateProfile";
import { useGetMe } from "../../hooks/profile/useGetMe";

type FormData = z.infer<typeof updateProfileSchema>;

export default function EditProfileScreen() {
  const router = useRouter();

  const { data: user, isLoading } = useGetMe();
  const { mutateAsync, isPending } = useUpdateProfile();

  const {
    control,
    handleSubmit,
    formState: { isDirty, errors },
  } = useForm<FormData>({
    resolver: zodResolver(updateProfileSchema),
    values: {
      email: user?.email ?? "",
    },
  });

  const [image, setImage] = useState<string | null>(null);

  const isDisabled = (!isDirty && !image) || isPending;

  const pickImage = async () => {
    const uri = await pickImageFromLibrary();
    if (uri) setImage(uri);
  };

  const onSubmit = async (data: FormData) => {
    try {
      await mutateAsync({
        data,
        image,
        oldImageId: user?.profileImageId,
      });

      router.back();
    } catch (err) {
      console.error(err);
    }
  };

  if (isLoading || !user) {
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
              <Image source={back} className="w-6 h-6" />
            </Pressable>
            <Text className="text-2xl font-bold">Edit Profile</Text>
          </View>

          <View className="gap-y-6">
            {/* IMAGE */}
            <View className="items-center">
              <Pressable onPress={pickImage}>
                <Image
                  source={{
                    uri:
                      image ||
                      user.profileImage ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        user.email
                      )}&size=128`,
                  }}
                  className="w-32 h-32 rounded-full"
                />
              </Pressable>

              <Text className="text-gray-500 mt-2">
                Tap to change photo
              </Text>
            </View>

            {/* EMAIL */}
            <FormInput
              control={control}
              name="email"
              label="Email"
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
              {isPending ? "Saving..." : "Save Changes"}
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