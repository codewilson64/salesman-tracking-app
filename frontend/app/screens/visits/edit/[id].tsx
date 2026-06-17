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
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { useLocalSearchParams, useRouter } from "expo-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCheckoutVisit } from "../../../hooks/visit/useCheckoutVisit";
import { useGetAllProduct } from "../../../hooks/product/useGetAllProduct";
import { checkoutVisitSchema, TCheckoutVisit } from "../../../libs/checkout.schema";
import { FormSelectModal } from "../../../components/areaInputForm/FormSelectModal";
import { FormInput } from "../../../components/areaInputForm/FormInput";
import { useVisitDraftStore } from "../../../stores/visitStore";
import { useEffect, useState } from "react";
import { mapCheckoutToDraft } from "../../../utils/mapCheckoutToDraft";
import { ProductFieldItem } from "../../../components/ProductFieldItem";
import { PaymentType, TransactionType, VisitResult } from "../../../types/visitDraft";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Product } from "../../../types/product";
import { Ionicons } from "@expo/vector-icons";

const results: VisitResult[] = ["new order", "follow-up", "shop closed"];
const transactionTypes: TransactionType[] = ["cash", "credit"];
const paymentTypes: PaymentType[] = ["cash", "transfer"];

type SelectOption<T extends string> = {
  value: T;
};

const CheckoutVisit = () => {
  const { id } = useLocalSearchParams<{ id: string }>();

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
      dueDate: undefined,
    },
  });
  
  const router = useRouter();

  const [showDueDatePicker, setShowDueDatePicker] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);

  const { isPending } = useCheckoutVisit();
  const { data: products } = useGetAllProduct()

  const { setDraft, getDraft } = useVisitDraftStore();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "products",
  });

  /* ================= PREFILL FORM ================= */

  useEffect(() => {
    if (!id) return;

    const draft = getDraft(id);

    if (draft) {
      reset({
        id,
        result: draft.result ?? undefined,
        transactionType: draft.transactionType,
        products: draft.products.map((p) => ({
          productId: p.productId,
          quantity: p.quantity,
          discount: p.discount,
        })),
        orderBy: draft.orderBy,
        paymentType: draft.paymentType,
        paidAmount: draft.paidAmount,
        notes: draft.notes,
        dueDate: draft.dueDate
      });
    }
  }, [id, getDraft, reset]);

   /* ================= WATCH AREA ================= */

  const selectedResult = watch("result");
  const selectedTransactionType = watch("transactionType");
  const paidAmount = watch("paidAmount");  
  const addedProducts = watch("products") || [];

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
      <SafeAreaView className="flex-1 bg-white">
        <KeyboardAvoidingView
          className="flex-1"
          behavior="padding"
          keyboardVerticalOffset={0}
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
                  options={results.map((value) => ({ value }))}
                  getLabel={(item: SelectOption<VisitResult>) => item.value}
                  errors={errors}
              />

              {selectedResult === "new order" && (
                <>
                  <FormSelectModal
                    control={control}
                    name="transactionType"
                    label="Transaction Type"
                    options={transactionTypes.map((value) => ({ value }))}
                    getLabel={(item: SelectOption<TransactionType>) => item.value}
                    errors={errors}
                  />

                  {/* ADD PRODUCT BUTTON */}
                  <Pressable
                    onPress={() => setShowProductModal(true)}
                    className="bg-green-600 p-3 rounded-lg"
                  >
                    <Text className="text-white text-center">Add Product</Text>
                  </Pressable>

                  <ProductFieldItem
                    visible={showProductModal}
                    products={products}
                    onClose={() => setShowProductModal(false)}
                    onSave={(product) => {
                      append(product);
                      setShowProductModal(false);
                    }}
                  />

                  {errors.products && (
                    <Text className="text-red-500">
                      {errors.products.message}
                    </Text>
                  )}

                  {/* ADDED PRODUCT LIST */}
                  <View className="gap-3">
                    {fields.map((field, index) => {
                      const item = addedProducts[index];

                      if (!item) return null;

                      const selectedProduct = products?.find(
                        (p: Product) => p.id === item.productId
                      );

                      const price = selectedProduct?.price || 0;
                      const unit = selectedProduct?.unit || "-";
                      const quantity = Number(item.quantity || 0);
                      const discount = Number(item.discount || 0);
                      const total = price * quantity - discount;

                      return (
                        <View
                          key={field.id}
                          className="border border-gray-300 rounded-lg p-3 bg-gray-50"
                        >
                          <View className="flex-row justify-between">
                            <View className="flex-1">
                              <Text className="font-semibold text-base">
                                {selectedProduct?.name || "Unknown Product"}
                              </Text>

                              <Text className="text-gray-600 mt-1">
                                Quantity: {quantity} {unit}
                              </Text>

                              <Text className="text-gray-600">
                                Price / {unit}: {price}
                              </Text>

                              <Text className="text-gray-600">
                                Discount: {discount}
                              </Text>

                              <Text className="font-semibold mt-1">
                                Total: {total}
                              </Text>
                            </View>

                            <Pressable
                              onPress={() => remove(index)}
                              className="self-start"
                            >
                              <Ionicons name="trash-outline" size={18} color="red" />
                            </Pressable>
                          </View>
                        </View>
                      );
                    })}
                  </View>

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
                      options={paymentTypes.map((value) => ({ value }))}
                      getLabel={(item: SelectOption<PaymentType>) => item.value}
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

                      {/* Due Date */}
                      <Controller
                        control={control}
                        name="dueDate"
                        render={({ field: { value, onChange } }) => (
                          <View>
                            <Text className="mb-2 font-normal">Due Date</Text>

                            <Pressable
                              onPress={() => setShowDueDatePicker(true)}
                              className="border border-gray-300 rounded-lg px-4 py-3"
                            >
                              <Text className={value ? "text-black" : "text-gray-400"}>
                                {value
                                  ? new Date(value).toLocaleDateString("id-ID", {
                                      day: "2-digit",
                                      month: "long",
                                      year: "numeric",
                                    })
                                  : "Select due date"}
                              </Text>
                            </Pressable>

                            {errors.dueDate && (
                              <Text className="text-red-500 mt-1">
                                {errors.dueDate.message}
                              </Text>
                            )}

                            {showDueDatePicker && (
                              <DateTimePicker
                                value={value ? new Date(value) : new Date()}
                                mode="date"
                                display={Platform.OS === "ios" ? "spinner" : "default"}
                                minimumDate={new Date()}
                                onChange={(event, selectedDate) => {
                                  setShowDueDatePicker(false);

                                  if (selectedDate) {
                                    onChange(selectedDate.toISOString());
                                  }
                                }}
                              />
                            )}
                          </View>
                        )}
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
  );
};

export default CheckoutVisit;