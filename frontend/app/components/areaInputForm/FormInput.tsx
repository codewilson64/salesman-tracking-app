import { View, Text, TextInput, Pressable } from "react-native";
import { Controller } from "react-hook-form";

export const FormInput = ({
  control,
  name,
  label,
  editable = true,
  onPress,
}: any) => {
  return (
    <View>
      <Text className="mb-3">{label}</Text>

      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <>
            <Pressable
              onPress={!editable ? onPress : undefined}
              className="border border-gray-300 rounded-lg"
            >
              <TextInput
                value={value?.toString() || ""}
                onChangeText={onChange}
                editable={editable}
                className={`rounded-lg p-4 ${
                  !editable ? "bg-gray-100" : ""
                }`}
              />
            </Pressable>

            {error && (
              <Text className="text-red-500 mt-1">
                {error.message}
              </Text>
            )}
          </>
        )}
      />
    </View>
  );
};