import {
  Text,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useForm } from "react-hook-form";
import { useRouter } from "expo-router";
import { FormSelectModal } from "../components/areaInputForm/FormSelectModal";
import { FormInput } from "../components/areaInputForm/FormInput";
import { useCheckoutVisit } from "../hooks/visit/useCheckoutVisit";
import { checkoutVisitSchema, TCheckoutVisit } from "../libs/checkout.schema";
import { zodResolver } from "@hookform/resolvers/zod";


const results = ["new order", "follow-up", "shop closed"];

const CheckoutVisit = () => {
  const router = useRouter();
  const { mutateAsync, isPending } = useCheckoutVisit();

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<TCheckoutVisit>({
    resolver: zodResolver(checkoutVisitSchema),
  });

  const onSubmit = async (data: TCheckoutVisit) => {
    try {
      await mutateAsync(data);
      router.back();
    } catch (err: any) {
      setError("root", { message: "Create failed" });
    }
  };

  return (
    <SafeAreaView className="flex-1 p-4">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text className="text-2xl font-bold mb-6">
            Checkout Visit
          </Text>

          {/* RESULT DROPDOWN */}
          <View className="gap-4">
            <FormSelectModal
                control={control}
                name="result"
                label="Visit Result"
                options={results.map((r) => ({ value: r }))}
                getLabel={(item: any) => item.value}
                errors={errors}
            />

            {/* NOTES */}
            <FormInput
                control={control}
                name="notes"
                label="Notes"
                placeholder="Enter visit notes..."
                multiline
            />
          </View>

          {/* SUBMIT */}
          <Pressable
            onPress={handleSubmit(onSubmit)}
            className="bg-blue-600 rounded-lg p-4 mt-6"
          >
            <Text className="text-white text-center font-semibold">
              {isPending ? "Checking out..." : "Checkout"}
            </Text>
          </Pressable>

          {/* GLOBAL ERROR */}
          {errors.root && (
            <Text className="text-red-500 text-center mt-4">
              {errors.root.message}
            </Text>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default CheckoutVisit;