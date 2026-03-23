import Feather from "@expo/vector-icons/Feather";
import { useEffect, useState } from "react";
import { Controller } from "react-hook-form";
import { Modal, Pressable, ScrollView, Text, View } from "react-native";

export const FormMultiSelectModal = ({
  control,
  name,
  label,
  options,
  errors,
}: any) => {
  const [visible, setVisible] = useState(false);
  const [tempValues, setTempValues] = useState<number[]>([]);

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { value = [], onChange } }) => {
        useEffect(() => {
          if (visible) {
            setTempValues(value);
          }
        }, [visible]);

        const toggle = (v: number) => {
          if (tempValues.includes(v)) {
            setTempValues(tempValues.filter((x) => x !== v));
          } else {
            setTempValues([...tempValues, v]);
          }
        };

        return (
          <View>
            <Text className="mb-3 text-gray-700">{label}</Text>

            <Pressable
              onPress={() => setVisible(true)}
              className="border border-gray-300 rounded-lg p-4"
            >
              <Text>
                {value.length ? `Week ${value.join(", ")}` : "Select Weeks"}
              </Text>
            </Pressable>

            <Modal visible={visible} transparent animationType="fade">
              <View className="flex-1 justify-center items-center bg-black/40">
                <View className="bg-white w-[90%] max-h-[75%] rounded-2xl py-7">

                  <Text className="text-lg font-bold mb-4 text-center">
                    Select {label}
                  </Text>

                  <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
                    {options.map((item: number) => {
                      const isSelected = tempValues.includes(item);

                      return (
                        <Pressable
                          key={item}
                          onPress={() => toggle(item)}
                          className={`flex-row justify-between px-5 py-4 ${
                            isSelected ? "bg-blue-200/40" : ""
                          }`}
                        >
                          <Text>Week {item}</Text>

                          {isSelected && (
                            <Feather name="check" size={16} />
                          )}
                        </Pressable>
                      );
                    })}
                  </ScrollView>

                  <View className="flex-row justify-between px-5 mt-4">
                    <Pressable onPress={() => setTempValues([])}>
                      <Text className="text-gray-500">Clear</Text>
                    </Pressable>

                    <Pressable
                      onPress={() => {
                        onChange(tempValues.sort((a, b) => a - b));
                        setVisible(false);
                      }}
                    >
                      <Text className="font-semibold">Done</Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            </Modal>

            {errors?.[name] && (
              <Text className="text-red-500 mt-1">
                {errors[name].message}
              </Text>
            )}
          </View>
        );
      }}
    />
  );
};