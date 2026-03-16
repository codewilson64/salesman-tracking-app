import { View, Text, TextInput, Pressable } from "react-native";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema, TsignUpSchema } from "../libs/types";
import { useAuthStore } from "../stores/authStore";
import { Link } from "expo-router";

export default function SignupScreen() {
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<TsignUpSchema>({
    resolver: zodResolver(signUpSchema),
  });

  const signup = useAuthStore((state) => state.signup);

  const onSubmit = async (data: TsignUpSchema) => {
    try {
      await signup(data)
    } catch (error: any) {
      console.error(error.response.data);
      const message = error.response.data.error || "An error occurred";

      setError("root", { type: "server", message });
    }
  };

  return (
    <View className="flex-1 justify-center px-6 bg-white">
      <Text className="text-3xl font-bold mb-8 text-center">Sign Up</Text>

      <Controller
        control={control}
        name="username"
        render={({ field: { onChange, value } }) => (
          <TextInput
            placeholder="Username"
            value={value}
            onChangeText={onChange}
            className="border border-gray-300 rounded-lg p-4 mb-2"
          />
        )}
      />
      {errors.username && (
        <Text className="text-red-500 mb-3">{errors.username.message}</Text>
      )}

      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, value } }) => (
          <TextInput
            placeholder="Email"
            autoCapitalize="none"
            value={value}
            onChangeText={onChange}
            className="border border-gray-300 rounded-lg p-4 mb-2"
          />
        )}
      />
      {errors.email && (
        <Text className="text-red-500 mb-3">{errors.email.message}</Text>
      )}

      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, value } }) => (
          <TextInput
            placeholder="Password"
            secureTextEntry
            value={value}
            onChangeText={onChange}
            className="border border-gray-300 rounded-lg p-4 mb-4"
          />
        )}
      />
      {errors.password && (
        <Text className="text-red-500 mb-4">{errors.password.message}</Text>
      )}

      <Pressable
        onPress={handleSubmit(onSubmit)}
        className="bg-black rounded-lg p-4"
      >
        <Text className="text-white text-center font-semibold">
          {isSubmitting ? "Signing up..." : "Create Account"}
        </Text>
      </Pressable>

      <Text className="text-center mt-4">
        Already have an account?{" "}
        <Link href="/login">
          <Text className="underline text-blue-500 font-semibold">
            Login
          </Text>
        </Link>
      </Text>

      {errors.root && (
        <Text className="text-red-500 text-center mt-4">
          {errors.root.message}
        </Text>
      )}
    </View>
  );
}