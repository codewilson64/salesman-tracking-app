import { View, Text, TextInput } from "react-native";
import { Controller } from "react-hook-form";

export const FormInput = ({ control, name, label, errors }: any) => {
  return (
    <View>
      <Text className="mb-3 text-gray-700">{label}</Text>

      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, value } }) => (
          <TextInput
            value={value}
            onChangeText={onChange}
            className="border border-gray-300 rounded-lg p-4"
          />
        )}
      />

      {errors?.[name] && (
        <Text className="text-red-500 mt-1">
          {errors[name].message}
        </Text>
      )}
    </View>
  );
};