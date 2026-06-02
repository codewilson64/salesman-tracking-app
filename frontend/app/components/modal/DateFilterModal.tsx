import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  Pressable,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { DateFilter } from "../../hooks/useDateFilter";

type DateFilterModalProps = {
  visible: boolean;
  onClose: () => void;
  onApply: (startDate: Date | null, endDate: Date | null) => void;
  initialFilter: DateFilter;
};

const DateFilterModal = ({
  visible,
  onClose,
  onApply,
  initialFilter,
}: DateFilterModalProps) => {
  const [startDate, setStartDate] = useState<Date | null>(initialFilter.startDate);
  const [endDate, setEndDate] = useState<Date | null>(initialFilter.endDate);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (visible) {
      setStartDate(initialFilter.startDate);
      setEndDate(initialFilter.endDate);
      setError("");
    }
  }, [visible, initialFilter]);

  const validateDates = (newStart: Date | null, newEnd: Date | null): string => {
    if (!newStart || !newEnd) return "";
    if (newEnd < newStart) return "End date cannot be before start date";
    return "";
  };

  const handleStartDateChange = (selectedDate: Date) => {
    const validationError = validateDates(selectedDate, endDate);
    setStartDate(selectedDate);
    setError(validationError);
  };

  const handleEndDateChange = (selectedDate: Date) => {
    const validationError = validateDates(startDate, selectedDate);
    setEndDate(selectedDate);
    setError(validationError);
  };

  const handleApply = () => {
    const validationError = validateDates(startDate, endDate);
    if (validationError) {
      setError(validationError);
      return;
    }

    onApply(startDate, endDate);
    onClose();
  };

  const handleReset = () => {
    setStartDate(null);
    setEndDate(null);
    setError("");
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent={true} // Important for Android
    >
      {/* Full Screen Overlay */}
      <View className="flex-1 bg-black/60 justify-end">
        <View 
          className="bg-white rounded-t-3xl px-6 pt-6 pb-10"
          style={{ paddingBottom: Platform.OS === 'android' ? 30 : 40 }}
        >
          <Text className="text-2xl font-bold text-center text-gray-800 mb-8">
            Filter by Date Range
          </Text>

          {/* Start Date */}
          <View className="mb-6">
            <Text className="text-base font-medium text-gray-600 mb-2">Start Date</Text>
            <Pressable
              className="border border-gray-300 rounded-2xl px-4 py-4 bg-gray-50 active:bg-gray-100"
              onPress={() => setShowStartPicker(true)}
            >
              <Text className="text-base text-gray-800">
                {startDate ? startDate.toLocaleDateString("id-ID") : "Select Start Date"}
              </Text>
            </Pressable>
          </View>

          {showStartPicker && (
            <View className="mb-6 rounded-2xl">
              <DateTimePicker
                value={startDate || new Date()}
                mode="date"
                display="default"
                onChange={(_, selectedDate) => {
                  setShowStartPicker(false);
                  if (selectedDate) handleStartDateChange(selectedDate);
                }}
              />
            </View>
          )}

          {/* End Date */}
          <View className="mb-6">
            <Text className="text-base font-medium text-gray-600 mb-2">End Date</Text>
            <Pressable
              className="border border-gray-300 rounded-2xl px-4 py-4 bg-gray-50 active:bg-gray-100"
              onPress={() => setShowEndPicker(true)}
            >
              <Text className="text-base text-gray-800">
                {endDate ? endDate.toLocaleDateString("id-ID") : "Select End Date"}
              </Text>
            </Pressable>
          </View>

          {showEndPicker && (
            <View className="mb-6 rounded-2xl">
              <DateTimePicker
                value={endDate || new Date()}
                mode="date"
                display="default"
                onChange={(_, selectedDate) => {
                  setShowEndPicker(false);
                  if (selectedDate) handleEndDateChange(selectedDate);
                }}
              />
            </View>
          )}

          {error ? (
            <Text className="text-red-500 text-center mb-6 font-medium">{error}</Text>
          ) : null}

          {/* Action Buttons */}
          <View className="flex-row justify-between mt-4">
            <Pressable onPress={handleReset} className="px-5 py-3">
              <Text className="text-gray-500 font-semibold">Reset</Text>
            </Pressable>

            <Pressable
              onPress={onClose}
              className="bg-gray-200 px-7 py-3.5 rounded-2xl"
            >
              <Text className="text-gray-700 font-semibold">Cancel</Text>
            </Pressable>

            <Pressable
              onPress={handleApply}
              disabled={!!error}
              className={`px-7 py-3.5 rounded-2xl ${error ? "bg-blue-300" : "bg-blue-600"}`}
            >
              <Text className="text-white font-semibold">Apply Filter</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default DateFilterModal;