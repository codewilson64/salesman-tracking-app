// components/AppUpdateModal.tsx

import { Modal, View, Text, TouchableOpacity, StyleSheet, Linking } from "react-native";

type Props = {
  visible: boolean;
  type: "optional" | "force";
  message: string;
  updateUrl: string;
  onDismiss: () => void;
};

export const AppUpdateModal = ({
  visible,
  type,
  message,
  updateUrl,
  onDismiss,
}: Props) => {
  const isForceUpdate = type === "force";

  const handleUpdate = async () => {
    if (!updateUrl) return;

    const canOpen = await Linking.canOpenURL(updateUrl);

    if (canOpen) {
      await Linking.openURL(updateUrl);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={isForceUpdate ? undefined : onDismiss}
    >
      <View className="flex-1 items-center justify-center bg-black/50 px-6">
        <View className="w-full rounded-2xl bg-white p-5">
          <Text className="mb-2 text-xl font-bold text-gray-900">
            {isForceUpdate ? "Update Required" : "Update Available"}
          </Text>

          <Text className="mb-5 text-[15px] leading-6 text-gray-600">
            {message}
          </Text>

          <TouchableOpacity
            activeOpacity={0.8}
            className="items-center rounded-xl bg-gray-900 py-4"
            onPress={handleUpdate}
          >
            <Text className="text-[15px] font-bold text-white">
              Update Now
            </Text>
          </TouchableOpacity>

          {!isForceUpdate && (
            <TouchableOpacity
              activeOpacity={0.8}
              className="mt-2 items-center py-4"
              onPress={onDismiss}
            >
              <Text className="text-[15px] font-semibold text-gray-600">
                Later
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
};