import {
  View,
  Text,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Image,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  TextInput,
  Modal,
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

import { useAuthStore } from "../../stores/authStore";
import { useDeleteMyAccount } from "../../hooks/account/useDeleteMyAccount";
import { useDeleteCompanyAccount } from "../../hooks/account/useDeleteCompanyAccount";

type FormData = z.infer<typeof updateProfileSchema>;

export default function EditProfileScreen() {
  const router = useRouter();

  const logout = useAuthStore((state) => state.logout);

  const { data: user, isLoading } = useGetMe();
  const { mutateAsync, isPending } = useUpdateProfile();

  const { mutateAsync: deleteAccount, isPending: isDeletingUser } = useDeleteMyAccount();
  const { mutateAsync: deleteCompany, isPending: isDeletingCompany } = useDeleteCompanyAccount();

  const isDeleting = isDeletingUser || isDeletingCompany;

  const isAdmin = user?.role === "owner";

  const {
    control,
    handleSubmit,
    formState: { isDirty, errors },
  } = useForm<FormData>({
    resolver: zodResolver(updateProfileSchema),
    values: {
      name: user?.name ?? "",
      email: user?.email ?? "",
      address: user?.address ?? "",
      phone: user?.phone ?? "",
    },
  });

  const [image, setImage] = useState<string | null>(null);

  const [confirmVisible, setConfirmVisible] = useState(false);
  const [confirmText, setConfirmText] = useState("");

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

  const handleDeleteAccount = () => {
    const title = isAdmin ? "Delete Company" : "Delete Account";

    const message = isAdmin
      ? "This will permanently delete your company and ALL data (salesmen, customers, transactions). This cannot be undone."
      : "This will permanently delete your account and all your data. This cannot be undone.";

    Alert.alert(title, message, [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Yes",
        style: "destructive",
        onPress: () => {
          setConfirmVisible(true);
        },
      },
    ]);
  };

  const confirmDelete = async () => {
    const requiredText = isAdmin ? "delete company" : "delete account";

    if (confirmText.trim().toLowerCase() !== requiredText) {
      Alert.alert(
        "Invalid confirmation",
        `Please type "${requiredText}" exactly.`
      );
      return;
    }

    try {
      if (isAdmin) {
        await deleteCompany();
      } else {
        await deleteAccount();
      }

      logout();
      router.replace("/login");
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
    <SafeAreaView className="flex-1 bg-gray-100">
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

            {/* Name */}
            <FormInput
              control={control}
              name="name"
              label="Nama"
              errors={errors}
            />

            {/* EMAIL */}
            <FormInput
              control={control}
              name="email"
              label="Email"
              errors={errors}
            />

            {/* Address */}
            <FormInput
              control={control}
              name="address"
              label="Alamat"
              errors={errors}
            />

            {/* Phone */}
            <FormInput
              control={control}
              name="phone"
              label="No HP"
              errors={errors}
            />

            <TouchableOpacity
              onPress={() => router.push("screens/profile/password")}
              className="flex-row items-center active:opacity-70"
            >
              {/* Left: Icon + Label */}
              <View className="flex-row items-center flex-1">
                <Text className="font-normal text-blue-600 text-lg underline capitalize">
                  Change password
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleDeleteAccount}
              className="flex-row items-center active:opacity-70"
            >
              {/* Left: Icon + Label */}
              <View className="flex-row items-center flex-1">
                <Text className="font-normal text-red-600 text-lg underline capitalize">
                  {isDeleting
                    ? "Deleting..."
                    : isAdmin
                    ? "Delete company"
                    : "Delete account"}
                </Text>
              </View>
            </TouchableOpacity>
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
      </KeyboardAvoidingView>

      <Modal
        visible={confirmVisible}
        transparent
        animationType="fade"
      >
        <View className="flex-1 justify-center items-center bg-black/50 px-6">
          <View className="bg-white w-full rounded-2xl p-6">
            <Text className="text-xl font-bold mb-3">
              {isAdmin ? "Delete Company" : "Delete Account"}
            </Text>

            <Text className="text-gray-600 mb-4">
              Type{" "}
              <Text className="font-bold">
                {isAdmin ? "delete company" : "delete account"}
              </Text>{" "}
              to confirm.
            </Text>

            <TextInput
              value={confirmText}
              onChangeText={setConfirmText}
              placeholder={isAdmin ? "delete company" : "delete account"}
              autoCapitalize="none"
              className="border border-gray-300 rounded-lg px-4 py-3 mb-4"
            />

            <View className="flex-row justify-end gap-3">
              <Pressable
                onPress={() => {
                  setConfirmVisible(false);
                  setConfirmText("");
                }}
              >
                <Text className="text-gray-500">Cancel</Text>
              </Pressable>

              <Pressable
                onPress={confirmDelete}
              >
                <Text className="text-red-600 font-semibold">
                  Delete
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}