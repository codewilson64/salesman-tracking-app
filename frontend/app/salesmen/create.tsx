import { View, Text, TextInput, Pressable, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { createSalesmanSchema, TcreateSalesmanSchema } from "../libs/salesmen.schema";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCreateSalesman } from "../hooks/useCreateSalesmen";

export default function CreateSalesmanScreen() {
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<TcreateSalesmanSchema>({
    resolver: zodResolver(createSalesmanSchema),
  });

  const router = useRouter();
  const { mutateAsync, isPending } = useCreateSalesman();

  const onSubmit = async (data: TcreateSalesmanSchema) => {
    try {
      await mutateAsync(data);
      router.back();
    } catch (err: any) {
      setError("root", { message: "Create failed" });
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior="padding"
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
    >
      <SafeAreaView>
        <ScrollView 
          contentContainerStyle={{ padding: 24 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Text className="text-3xl font-bold mb-8 text-center">
            Create Salesman
          </Text>

          <View className="gap-y-6">
            {/* USERNAME */}
            <View>
              <Text className="mb-3 text-gray-700">Username</Text>
              <Controller
                control={control}
                name="username"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    value={value}
                    onChangeText={onChange}
                    className="border border-gray-300 rounded-lg p-4"
                  />
                )}
              />
              {errors.username && (
                <Text className="text-red-500 mt-1">
                  {errors.username.message}
                </Text>
              )}
            </View>

            {/* EMAIL */}
            <View>
              <Text className="mb-3 text-gray-700">Email</Text>
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    autoCapitalize="none"
                    keyboardType="email-address"
                    value={value}
                    onChangeText={onChange}
                    className="border border-gray-300 rounded-lg p-4"
                  />
                )}
              />
              {errors.email && (
                <Text className="text-red-500 mt-1">
                  {errors.email.message}
                </Text>
              )}
            </View>

            {/* PASSWORD */}
            <View>
              <Text className="mb-3 text-gray-700">Password</Text>
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    secureTextEntry
                    value={value}
                    onChangeText={onChange}
                    className="border border-gray-300 rounded-lg p-4"
                  />
                )}
              />
              {errors.password && (
                <Text className="text-red-500 mt-1">
                  {errors.password.message}
                </Text>
              )}
            </View>

            {/* NAME */}
            <View>
              <Text className="mb-3 text-gray-700">Full Name</Text>
              <Controller
                control={control}
                name="name"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    value={value}
                    onChangeText={onChange}
                    className="border border-gray-300 rounded-lg p-4"
                  />
                )}
              />
              {errors.name && (
                <Text className="text-red-500 mt-1">
                  {errors.name.message}
                </Text>
              )}
            </View>

            {/* ADDRESS */}
            <View>
              <Text className="mb-3 text-gray-700">Address (optional)</Text>
              <Controller
                control={control}
                name="address"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    value={value}
                    onChangeText={onChange}
                    className="border border-gray-300 rounded-lg p-4"
                  />
                )}
              />
            </View>

            {/* PHONE */}
            <View>
              <Text className="mb-3 text-gray-700">Phone (optional)</Text>
              <Controller
                control={control}
                name="phone"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    keyboardType="phone-pad"
                    value={value}
                    onChangeText={onChange}
                    className="border border-gray-300 rounded-lg p-4"
                  />
                )}
              />
            </View>
          </View>

            <Pressable
              onPress={handleSubmit(onSubmit)}
              disabled={isPending}
              className="bg-black rounded-lg p-4 mt-8"
            >
              <Text className="text-white text-center font-semibold">
                {isPending ? "Creating..." : "Create Salesman"}
              </Text>
            </Pressable>

          {/* GLOBAL ERROR */}
          {errors.root && (
            <Text className="text-red-500 text-center mt-4">
              {errors.root.message}
            </Text>
          )}
        </ScrollView>

      </SafeAreaView>
    </KeyboardAvoidingView>
 );
}