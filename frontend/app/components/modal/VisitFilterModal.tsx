import React from "react";
import { View, Text, Modal, TouchableOpacity, Platform } from "react-native";

type FilterOption = "all" | "Order Baru" | "Titip Baru" | "Update Titipan" | "Follow Up" | "Tutup Toko" | "checking in";

interface VisitFilterModalProps {
  visible: boolean;
  activeFilter: FilterOption;
  onFilterChange: (filter: FilterOption) => void;
  onClose: () => void;
}

const VisitFilterModal = ({
  visible,
  activeFilter,
  onFilterChange,
  onClose,
}: VisitFilterModalProps) => {
  const filterOptions = [
    { label: "All Visits", value: "all" as const },
    { label: "Order Baru", value: "Order Baru" as const },
    { label: "Titip Baru", value: "Titip Baru" as const },
    { label: "Update Titipan", value: "Update Titipan" as const },
    { label: "Follow Up", value: "Follow Up" as const },
    { label: "Tutup Toko", value: "Tutup Toko" as const },
    { label: "Checking In", value: "checking in" as const },
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent={true}
    >
      <View className="flex-1 justify-end bg-black/50">
        <View 
          className="bg-white rounded-t-3xl p-6"
          style={{ paddingBottom: Platform.OS === 'android' ? 30 : 40 }}
        >
          <Text className="text-2xl font-bold text-center mb-6 text-gray-900">
            Filter Visits
          </Text>

          {filterOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              onPress={() => {
                onFilterChange(option.value);
                onClose();
              }}
              className={`py-4 px-5 rounded-2xl mb-3 ${
                activeFilter === option.value ? "bg-blue-100" : "bg-gray-100"
              }`}
            >
              <Text
                className={`text-lg font-semibold ${
                  activeFilter === option.value ? "text-blue-700" : "text-gray-800"
                }`}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}

          <TouchableOpacity
            onPress={onClose}
            className="mt-4 py-4"
          >
            <Text className="text-center text-gray-500 font-medium text-lg">
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default VisitFilterModal;