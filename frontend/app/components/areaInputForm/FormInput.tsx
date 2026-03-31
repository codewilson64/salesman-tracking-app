import { View, Text, TextInput, Pressable } from "react-native";
import { Controller } from "react-hook-form";

export const FormInput = ({ control, name, label, errors, editable = true, onPress }: any) => {
  return (
    <View>
      <Text className="mb-3">{label}</Text>

      <View className="relative">
        <Controller
          control={control}
          name={name}
          render={({ field: { onChange, value } }) => (
            <Pressable
              onPress={!editable ? onPress : undefined}
              className="border border-gray-300 rounded-lg"
            >
            <TextInput
              value={value}
              onChangeText={onChange}
              editable={editable}
              pointerEvents="none"
              className={`rounded-lg p-4 ${
                !editable ? "bg-gray-100" : ""
              }`}
            />
            </Pressable>
          )}
        />
      </View>

      {errors?.[name] && (
        <Text className="text-red-500 mt-1">
          {errors[name].message}
        </Text>
      )}
    </View>
  );
};