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
import { UpdateConsignmentItemModal } from "../../../components/modal/UpdateConsignmentItemModal";
import { useGetVisitById } from "../../../hooks/visit/useGetVisitById";
import { CheckoutProductList } from "../../../components/checkout/CheckoutProductList";
import { CheckoutUpdateTitipanList } from "../../../components/checkout/CheckoutUpdateTitipanList";

const results: VisitResult[] = ["Order Baru", "Titip Baru", "Update Titipan", "Follow Up", "Tutup Toko"];
const transactionTypes: TransactionType[] = ["Tunai", "Kredit"];
const paymentTypes: PaymentType[] = ["Tunai", "Transfer"];

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
      consignmentItems: [],
      paidAmount: 0,
      paymentType: null,
      dueDate: undefined,
    },
  });
  
  const router = useRouter();

  const [showDueDatePicker, setShowDueDatePicker] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showUpdateConsignmentModal, setShowUpdateConsignmentModal] = useState(false);

  const { data: visit } = useGetVisitById(id);

  const { isPending } = useCheckoutVisit();
  const { data: products } = useGetAllProduct()

  const { setDraft, getDraft } = useVisitDraftStore();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "products",
  });

  const { fields: consignmentFields, append: appendConsignment, remove: removeConsignment } = useFieldArray({
    control,
    name: "consignmentItems",
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
        consignmentItems: draft.consignmentItems.map((item) => ({
          productId: item.productId,
          currentStock: item.currentStock,
          remainingStock: item.remainingStock,
          addedStock: item.addedStock,
          returnedStock: item.returnedStock,
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

  const isOrder = selectedResult === "Order Baru";
  const isTitip = selectedResult === "Titip Baru";
  const isUpdateTitipan = selectedResult === "Update Titipan";

  const paidAmount = watch("paidAmount");  
  const addedProducts = watch("products") || [];
  const addedConsignmentItems = watch("consignmentItems") || [];

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

              <Text className="text-2xl font-bold">Checkout Kunjungan</Text>
            </View>

            {/* RESULT DROPDOWN */}
            <View className="gap-4">
              <FormSelectModal
                  control={control}
                  name="result"
                  label="Hasil Kunjungan"
                  options={results.map((value) => ({ value }))}
                  getLabel={(item: SelectOption<VisitResult>) => item.value}
                  errors={errors}
              />

                {/* NEW ORDER */}
                {isOrder && (
                  <>
                    <FormSelectModal
                      control={control}
                      name="transactionType"
                      label="Tipe Transaksi"
                      options={transactionTypes.map((value) => ({ value }))}
                      getLabel={(item: SelectOption<TransactionType>) => item.value}
                      errors={errors}
                    />

                    <Pressable
                      onPress={() => setShowProductModal(true)}
                      className="bg-green-600 p-3 rounded-lg"
                    >
                      <Text className="text-white text-center">Tambah Produk</Text>
                    </Pressable>

                    <ProductFieldItem
                      visible={showProductModal}
                      products={products}
                      isTitip={false}
                      onClose={() => setShowProductModal(false)}
                      onSave={(product) => {
                        append(product);
                        setShowProductModal(false);
                      }}
                    />

                    {errors.products && (
                      <Text className="text-red-500">{errors.products.message}</Text>
                    )}

                    <CheckoutProductList
                      fields={fields}
                      items={addedProducts}
                      products={products}
                      isTitip={isTitip}
                      onRemove={remove}
                    />

                    <FormInput
                      control={control}
                      name="orderBy"
                      label="Diorder oleh"
                    />

                    {selectedTransactionType === "Tunai" && (
                      <FormSelectModal
                        control={control}
                        name="paymentType"
                        label="Metode Pembayaran"
                        options={paymentTypes.map((value) => ({ value }))}
                        getLabel={(item: SelectOption<PaymentType>) => item.value}
                        errors={errors}
                      />
                    )}

                    {selectedTransactionType === "Kredit" && (
                      <>
                        <FormInput
                          control={control}
                          name="paidAmount"
                          label="Jumlah Bayar"
                          keyboardType="numeric"
                        />

                        <Controller
                          control={control}
                          name="dueDate"
                          render={({ field: { value, onChange } }) => (
                            <View>
                              <Text className="mb-2 font-normal">Tanggal Jatuh Tempo</Text>

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
                                    if (selectedDate) onChange(selectedDate.toISOString());
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
                            label="Metode Pembayaran"
                            options={[{ value: "Tunai" }, { value: "Transfer" }]}
                            getLabel={(item: { value: string }) => item.value}
                            errors={errors}
                          />
                        )}
                      </>
                    )}
                  </>
                )}

                {/* TITIP BARU */}
                {isTitip && (
                  <>
                    <Pressable
                      onPress={() => setShowProductModal(true)}
                      className="bg-green-600 p-3 rounded-lg"
                    >
                      <Text className="text-white text-center">Tambah Produk</Text>
                    </Pressable>

                    <ProductFieldItem
                      visible={showProductModal}
                      products={products}
                      isTitip
                      onClose={() => setShowProductModal(false)}
                      onSave={(product) => {
                        append(product);
                        setShowProductModal(false);
                      }}
                    />

                    {errors.products && (
                      <Text className="text-red-500">{errors.products.message}</Text>
                    )}

                    <CheckoutProductList
                      fields={fields}
                      items={addedProducts}
                      products={products}
                      isTitip={isTitip}
                      onRemove={remove}
                    />

                    <FormInput
                      control={control}
                      name="orderBy"
                      label="Dititip kepada"
                    />
                  </>
                )}

                {/* UPDATE TITIPAN */}
                {isUpdateTitipan && (
                  <>
                    <Pressable
                      onPress={() => setShowUpdateConsignmentModal(true)}
                      className="bg-green-600 p-3 rounded-lg"
                    >
                      <Text className="text-white text-center">Tambah Produk</Text>
                    </Pressable>

                    <UpdateConsignmentItemModal
                      visible={showUpdateConsignmentModal}
                      products={products}
                      customerId={visit?.customerId}
                      onClose={() => setShowUpdateConsignmentModal(false)}
                      onSave={(item) => {
                        appendConsignment(item);
                        setShowUpdateConsignmentModal(false);
                      }}
                    />

                    <CheckoutUpdateTitipanList
                      fields={consignmentFields}
                      items={addedConsignmentItems}
                      products={products}
                      onRemove={removeConsignment}
                    />

                    {errors.consignmentItems && (
                      <Text className="text-red-500">{errors.consignmentItems.message}</Text>
                    )}
                  </>
                )}

              {/* NOTES */}
              <FormInput
                control={control}
                name="notes"
                label="Catatan"
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