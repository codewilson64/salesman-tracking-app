import {
  View,
  Text,
  ActivityIndicator,
  Image,
  Pressable,
  Alert,
  TextInput,
  Modal,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";

import { useGetSalesmanById } from "../../hooks/salesman/useGetSalesmanById";
import { useDeleteSalesman } from "../../hooks/salesman/useDeleteSalesman";

import back from "../../assets/globalIcons/back.png";
import dots from "../../assets/globalIcons/dots.png";

const SalesmanDetail = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [showMenu, setShowMenu] = useState(false);

  const [confirmVisible, setConfirmVisible] = useState(false);
  const [confirmText, setConfirmText] = useState("");

  const { data: salesman, isLoading, isError } = useGetSalesmanById(id);
  const { mutateAsync: deleteSalesman, isPending } = useDeleteSalesman();

  const handleDelete = () => {
    setShowMenu(false);

    Alert.alert(
      `Delete ${salesman?.name}?`,
      "This will permanently delete this salesman account. This cannot be undone.",
      [
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
      ]
    );
  };

  const confirmDelete = async () => {
    const requiredText = "delete salesman";

    if (confirmText.trim().toLowerCase() !== requiredText) {
      Alert.alert(
        "Invalid confirmation",
        `Please type "${requiredText}" exactly.`
      );

      return;
    }

    try {
      await deleteSalesman(id);

      setConfirmVisible(false);
      setConfirmText("");

      router.back();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = () => {
    setShowMenu(false);

    router.push({
      pathname: "/screens/salesmen/edit/[id]",
      params: { id },
    });
  };

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (isError || !salesman) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-red-500">Error loading salesman</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 p-4 bg-white">
      {/* Header */}
      <View className="mb-6 relative">
        <Pressable
          onPress={() => router.back()}
          className="absolute left-0 top-0 p-2 z-10"
        >
          <Image source={back} className="w-6 h-6" resizeMode="contain" />
        </Pressable>

        {/* Dots menu */}
        <View className="absolute right-0 top-0 z-20">
          <Pressable
            onPress={() => setShowMenu(!showMenu)}
            className="p-2"
          >
            <Image source={dots} className="w-6 h-6" resizeMode="contain" />
          </Pressable>

          {showMenu && (
            <View className="absolute top-10 right-0 bg-white rounded-xl shadow border border-gray-200 w-36 overflow-hidden">
              <Pressable
                onPress={handleEdit}
                className="px-4 py-3 border-b border-gray-100"
              >
                <Text className="text-gray-800">Edit</Text>
              </Pressable>

              <Pressable
                onPress={handleDelete}
                disabled={isPending}
                className="px-4 py-3"
              >
                <Text className="text-red-600">Delete</Text>
              </Pressable>
            </View>
          )}
        </View>

        {/* Avatar */}
        <View className="items-center">
          <Image
            source={{
              uri: salesman.profileImage
                ? salesman.profileImage
                : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    salesman.name
                  )}&size=128`,
            }}
            className="w-32 h-32 rounded-full mb-4"
          />

          <Text className="text-2xl font-bold">
            {salesman.name}
          </Text>

          <Text className="text-gray-500">
            {salesman.role}
          </Text>
        </View>
      </View>

      {/* Info */}
      <View className="mt-4">
        <View className="p-4 border-b border-gray-200">
          <Text className="text-gray-500 text-sm">No HP</Text>
          <Text className="text-lg font-medium">
            {salesman.phone}
          </Text>
        </View>

        <View className="p-4 border-b border-gray-200">
          <Text className="text-gray-500 text-sm">Email</Text>
          <Text className="text-lg font-medium">
            {salesman.email}
          </Text>
        </View>

        <View className="p-4 border-b border-gray-200">
          <Text className="text-gray-500 text-sm">Alamat</Text>
          <Text className="text-lg font-medium">
            {salesman.address}
          </Text>
        </View>
      </View>

      <Modal
        visible={confirmVisible}
        transparent
        animationType="fade"
      >
        <View className="flex-1 justify-center items-center bg-black/50 px-6">
          <View className="bg-white w-full rounded-2xl p-6">

            <Text className="text-xl font-bold mb-3">
              Delete Salesman
            </Text>

            <Text className="text-gray-600 mb-4">
              Type{" "}
              <Text className="font-bold">
                delete salesman
              </Text>{" "}
              to confirm.
            </Text>

            <TextInput
              value={confirmText}
              onChangeText={setConfirmText}
              placeholder="delete salesman"
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
                <Text className="text-gray-500">
                  Cancel
                </Text>
              </Pressable>

              <Pressable
                onPress={confirmDelete}
                disabled={isPending}
              >
                <Text className="text-red-600 font-semibold">
                  {isPending ? "Deleting..." : "Delete"}
                </Text>
              </Pressable>

            </View>

          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default SalesmanDetail;