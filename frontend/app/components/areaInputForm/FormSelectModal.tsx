import {
  View,
  Text,
  Pressable,
  Modal,
  ScrollView,
} from "react-native";
import { useState, useEffect } from "react";
import { Controller } from "react-hook-form";
import Feather from "@expo/vector-icons/Feather";

export const FormSelectModal = ({
  control,
  name,
  label,
  options,
  getLabel,
}: any) => {
  const [visible, setVisible] = useState(false);
  const [tempValue, setTempValue] = useState();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { value, onChange }, fieldState: { error } }) => {
        // ✅ Safe usage (not conditional)
        useEffect(() => {
          if (visible) {
            setTempValue(value);
          }
        }, [visible, value]);

        const selected = options.find((o: any) => o.value === value);

        return (
          <View>
            <Text className="mb-3">{label}</Text>

            {/* SELECT BUTTON */}
            <Pressable
              onPress={() => setVisible(true)}
              className="border border-gray-300 rounded-lg p-4"
            >
              <Text>
                {selected ? getLabel(selected) : `Select ${label}`}
              </Text>
            </Pressable>

            {/* MODAL */}
            <Modal visible={visible} transparent animationType="fade">
              <View className="flex-1 justify-center items-center bg-black/40">
                <View className="bg-white w-[90%] max-h-[75%] rounded-2xl py-7">

                  <Text className="text-lg font-bold mb-4 text-center">
                    Select {label}
                  </Text>

                  <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
                    {options.map((item: any) => {
                      const isSelected = tempValue === item.value;

                      return (
                        <Pressable
                          key={item.value}
                          onPress={() => setTempValue(item.value)}
                          className={`flex-row justify-between px-5 py-4 ${
                            isSelected ? "bg-blue-200/40" : ""
                          }`}
                        >
                          <Text>{getLabel(item)}</Text>

                          {isSelected && (
                            <Feather name="check" size={18} color="black" />
                          )}
                        </Pressable>
                      );
                    })}
                  </ScrollView>

                  {/* ACTIONS */}
                  <View className="flex-row justify-between px-5 mt-4">
                    <Pressable onPress={() => setTempValue(undefined)}>
                      <Text className="text-gray-500">Clear</Text>
                    </Pressable>

                    <Pressable
                      onPress={() => {
                        onChange(tempValue);
                        setVisible(false);
                      }}
                    >
                      <Text className="font-semibold">Done</Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            </Modal>

            {/* ✅ CORRECT ERROR HANDLING */}
            {error && (
              <Text className="text-red-500 mt-1">
                {error.message}
              </Text>
            )}
          </View>
        );
      }}
    />
  );
};