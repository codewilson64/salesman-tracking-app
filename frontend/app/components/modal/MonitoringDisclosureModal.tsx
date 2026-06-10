import { Modal, Pressable, Text, View } from "react-native";

type MonitoringDisclosureModalProps = {
  visible: boolean;
  onAccept: () => void;
  onDeny: () => void;
};

export const MonitoringDisclosureModal = ({
  visible,
  onAccept,
  onDeny,
}: MonitoringDisclosureModalProps) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onDeny}
    >
      <View className="flex-1 items-center justify-center bg-black/50 px-6">
        <View className="w-full max-w-md rounded-2xl bg-white p-6">
          <View className="mb-4 items-center">
            <View className="mb-3 h-12 w-12 items-center justify-center rounded-full bg-blue-100">
              <Text className="text-2xl">📍</Text>
            </View>

            <Text className="text-center text-xl font-bold text-gray-900">
              Use your location and photos
            </Text>
          </View>

          <Text className="mb-4 text-center text-base leading-6 text-gray-700">
            Sales Team Tracker uses your location during check-in and check-out
            to record visit activity, calculate your distance from the assigned
            customer location, and help your company verify field visits.
          </Text>

          <Text className="mb-6 text-center text-base leading-6 text-gray-700">
            The app also uses your camera and photo gallery to upload a required check-in photo as proof of field visit activity.
          </Text>

          <Text className="mb-6 text-center text-base leading-6 text-gray-700">
            By tapping “I Agree”, you consent to this location and photo-based visit
            verification.
          </Text>

          <View className="flex-row gap-3">
            <Pressable
              onPress={onDeny}
              className="flex-1 rounded-xl border border-gray-300 py-3"
            >
              <Text className="text-center font-semibold text-gray-700">
                DENY
              </Text>
            </Pressable>

            <Pressable
              onPress={onAccept}
              className="flex-1 rounded-xl bg-blue-600 py-3"
            >
              <Text className="text-center font-semibold text-white">
                I AGREE
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};