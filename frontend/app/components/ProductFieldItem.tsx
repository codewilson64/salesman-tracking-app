import {
  View,
  Text,
  Pressable,
  Modal,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Product } from "../types/product";
import { FormSelectModal } from "./areaInputForm/FormSelectModal";
import { FormInput } from "./areaInputForm/FormInput";

import {
  transactionItemSchema,
  TTransactionItem,
  TTransactionItemInput,
} from "../libs/checkout.schema";

type Props = {
  visible: boolean;
  products: Product[] | undefined;
  isTitip?: boolean;
  onClose: () => void;
  onSave: (data: TTransactionItem) => void;
};

export const ProductFieldItem = ({
  visible,
  products,
  isTitip = false,
  onClose,
  onSave,
}: Props) => {
  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<TTransactionItemInput, any, TTransactionItem>({
    resolver: zodResolver(transactionItemSchema),
    defaultValues: {
      productId: "",
      quantity: 1,
      discount: 0,
    },
  });

  const productId = watch("productId");
  const quantity = Number(watch("quantity") || 0);
  const discount = Number(watch("discount") || 0);

  const selectedProduct = products?.find(
    (p: Product) => p.id === productId
  );

  const price = selectedProduct?.price || 0;
  const unit = selectedProduct?.unit || "-";

  const subtotal = price * quantity;
  const total = subtotal - discount;

  const resetForm = () => {
    reset({
      productId: "",
      quantity: 1,
      discount: 0,
    });
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSave = (data: TTransactionItem) => {
    onSave(data);
    resetForm();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        className="flex-1 bg-black/40 px-6"
        behavior="padding"
        keyboardVerticalOffset={0}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
            paddingVertical: 24,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="w-full bg-white rounded-2xl p-5 gap-4 max-w-[420px] self-center">
            <Text className="text-xl font-bold">Tambah Produk</Text>

            <FormSelectModal
              control={control}
              name="productId"
              label="Produk"
              options={
                products?.map((p: Product) => ({
                  value: p.id,
                  name: `${p.name}`,
                })) || []
              }
              getLabel={(item: { name: string }) => item.name}
              errors={errors}
            />

            <FormInput
              control={control}
              name="quantity"
              label={isTitip ? `Jumlah dititip (${unit})` : `Kuantitas (${unit})`}
              keyboardType="numeric"
            />

            {!isTitip && (
              <FormInput
                control={control}
                name="discount"
                label="Diskon"
                keyboardType="numeric"
              />
            )}

            <View>
              <Text className="mb-2">Satuan Unit</Text>
              <View className="border border-gray-300 p-3 rounded-lg bg-gray-100">
                <Text>{unit}</Text>
              </View>
            </View>

            <View>
              <Text className="mb-2">Harga / {unit}</Text>
              <View className="border border-gray-300 p-3 rounded-lg bg-gray-100">
                <Text>{price || "-"}</Text>
              </View>
            </View>

            <View>
              <Text className="mb-2">Total</Text>
              <View className="border border-gray-300 p-3 rounded-lg bg-gray-100">
                <Text>{total || "-"}</Text>
              </View>
            </View>

            <View className="flex-row gap-3 mt-2">
              <Pressable
                onPress={handleClose}
                className="flex-1 bg-gray-300 p-3 rounded-lg"
              >
                <Text className="text-center font-semibold">Cancel</Text>
              </Pressable>

              <Pressable
                onPress={handleSubmit(handleSave)}
                className="flex-1 bg-blue-600 p-3 rounded-lg"
              >
                <Text className="text-white text-center font-semibold">
                  Save
                </Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
};