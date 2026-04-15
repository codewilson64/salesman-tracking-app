import {
  Text,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
  Image,
} from "react-native";
import back from '../../../assets/globalIcons/back.png'
import { SafeAreaView } from "react-native-safe-area-context";
import { useForm, useFieldArray } from "react-hook-form";
import { useLocalSearchParams, useRouter } from "expo-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCheckoutVisit } from "../../../hooks/visit/useCheckoutVisit";
import { useGetAllProduct } from "../../../hooks/product/useGetAllProduct";
import { checkoutVisitSchema, TCheckoutVisit } from "../../../libs/checkout.schema";
import { FormSelectModal } from "../../../components/areaInputForm/FormSelectModal";
import { FormInput } from "../../../components/areaInputForm/FormInput";
import { useVisitDraftStore } from "../../../stores/visitStore";
import { useEffect } from "react";
import { mapCheckoutToDraft } from "../../../utils/mapCheckoutToDraft";
import { ProductFieldItem } from "../../../components/ProductFieldItem";

const results = ["new order", "follow-up", "shop closed"];
const transactionTypes = ["cash", "credit"];

const CheckoutVisit = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const {isPending } = useCheckoutVisit();
  const { data: products } = useGetAllProduct()

  const { setDraft, getDraft } = useVisitDraftStore();

  const {
    control,
    handleSubmit,
    setError,
    watch,
    reset,
    formState: { errors },
  } = useForm<TCheckoutVisit>({
    resolver: zodResolver(checkoutVisitSchema),
    defaultValues: {
      id: id,
      notes: "",
      products: [],
      paidAmount: 0,
      paymentType: null,
    },
  });

  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: "products",
  });

  /* ================= PREFILL FORM ================= */

  useEffect(() => {
    if (!id) return;

    const draft = getDraft(id);

    if (draft) {
      reset({
        result: draft.result as any,
        transactionType: draft.transactionType ?? undefined,
        products: draft.products.map((p) => ({
          productId: p.productId,
          quantity: p.quantity,
          discount: p.discount,
        })),
        orderBy: draft.orderBy || "",
        paymentType: draft.paymentType || null,
        paidAmount: draft.paidAmount || 0,
        notes: draft.notes || "",
      });

      replace(draft.products);
    }
  }, [id]);

   /* ================= WATCH AREA ================= */

  const selectedResult = watch("result");
  const selectedTransactionType = watch("transactionType");
  const paidAmount = watch("paidAmount");  

   /* ================= SUBMIT ================= */

  const onSubmit = async (data: TCheckoutVisit) => {
    try {
      const draft = mapCheckoutToDraft(data, products);
      setDraft(id, draft);

      router.back();
    } catch (err) {
      setError("root", { message: "Save failed" });
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior="padding"
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
    >
      <SafeAreaView className="flex-1">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          className="flex-1"
        >
          <ScrollView 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ padding: 24 }}
            keyboardShouldPersistTaps="handled"
          >
            <View className="flex-row items-center mb-8">
              <Pressable
                onPress={() => router.back()}
                className="mr-3"
              >
                <Image
                  source={back}
                  className="w-6 h-6"
                  resizeMode="contain"
                />
              </Pressable>

              <Text className="text-2xl font-bold">Checkout visit</Text>
            </View>

            {/* RESULT DROPDOWN */}
            <View className="gap-4">
              <FormSelectModal
                  control={control}
                  name="result"
                  label="Visit Result"
                  options={results.map((r) => ({ value: r }))}
                  getLabel={(item: { value: string }) => item.value}
                  errors={errors}
              />

              {selectedResult === "new order" && (
                <>
                  <FormSelectModal
                    control={control}
                    name="transactionType"
                    label="Transaction Type"
                    options={transactionTypes.map((t) => ({ value: t }))}
                    getLabel={(item: { value: string }) => item.value}
                    errors={errors}
                  />

                  {/* ADD PRODUCT BUTTON */}
                  <Pressable
                    onPress={() =>
                      append({
                        productId: "",
                        quantity: 1,
                        discount: 0,
                      })
                    }
                    className="bg-green-600 p-3 rounded-lg"
                  >
                    <Text className="text-white text-center">Add Product</Text>
                  </Pressable>

                  {errors.products && (
                    <Text className="text-red-500">
                      {errors.products.message}
                    </Text>
                  )}

                  {/* PRODUCT LIST */}
                  {fields.map((field, index) => (
                    <ProductFieldItem
                      key={field.id}
                      field={field}
                      index={index}
                      control={control}
                      watch={watch}
                      products={products}
                      remove={remove}
                      errors={errors}
                    />
                  ))}

                  {/* ORDER BY */}
                  <FormInput
                    control={control}
                    name="orderBy"
                    label="Order by"
                  />

                  {/* PAYMENT SECTION */}
                  {/* CASH */}
                  {selectedTransactionType === "cash" && (
                    <FormSelectModal
                      control={control}
                      name="paymentType"
                      label="Payment Method"
                      options={[
                        { value: "cash" },
                        { value: "transfer" },
                      ]}
                      getLabel={(item: { value: string }) => item.value}
                      errors={errors}
                    />
                  )}

                  {/* CREDIT */}
                  {selectedTransactionType === "credit" && (
                    <>
                      <FormInput
                        control={control}
                        name="paidAmount"
                        label="Paid Amount"
                        keyboardType="numeric"
                      />

                      {Number(paidAmount) > 0 && (
                        <FormSelectModal
                          control={control}
                          name="paymentType"
                          label="Payment Method"
                          options={[
                            { value: "cash" },
                            { value: "transfer" },
                          ]}
                          getLabel={(item: { value: string }) => item.value}
                          errors={errors}
                        />
                      )}
                    </>
                  )}
                </>
              )}

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
                {isPending ? "Saving..." : "Save"}
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
    </KeyboardAvoidingView>
  );
};

export default CheckoutVisit;