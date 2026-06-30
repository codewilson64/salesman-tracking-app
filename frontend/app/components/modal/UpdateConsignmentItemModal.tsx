import React, { useEffect, useMemo } from "react";
import {
  Modal,
  View,
  Text,
  Pressable,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Product } from "../../types/product";

import {
  TUpdateConsignmentItem,
  TUpdateConsignmentItemInput,
  updateConsignmentItemSchema,
} from "../../libs/updateConsignmentItem.schema";
import { FormSelectModal } from "../areaInputForm/FormSelectModal";
import { FormInput } from "../areaInputForm/FormInput";
import { useGetCurrentConsignmentStock } from "../../hooks/consignment/useGetCurrentConsignmentStock";

type Props = {
  visible: boolean;
  products: Product[] | undefined;
  customerId?: string;
  onClose: () => void;
  onSave: (data: TUpdateConsignmentItem) => void;
};

export const UpdateConsignmentItemModal = ({
  visible,
  products,
  customerId,
  onClose,
  onSave,
}: Props) => {
  const {
    control,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm<TUpdateConsignmentItemInput, any, TUpdateConsignmentItem>({
    resolver: zodResolver(updateConsignmentItemSchema),
    defaultValues: {
      productId: "",
      currentStock: 0,
      remainingStock: 0,
      addedStock: 0,
      returnedStock: 0,
    },
  });

  const productId = watch("productId");

  const { data: stockData, isLoading: isLoadingStock } =
    useGetCurrentConsignmentStock({
      customerId: customerId || "",
      productId: productId || "",
    });

  useEffect(() => {
    if (stockData) {
      setValue("currentStock", Number(stockData.currentStock || 0), {
        shouldValidate: true,
      });
    }
  }, [stockData, setValue]);

  const currentStock = Number(watch("currentStock") || 0);
  const remainingStock = Number(watch("remainingStock") || 0);
  const addedStock = Number(watch("addedStock") || 0);
  const returnedStock = Number(watch("returnedStock") || 0);

  const selectedProduct = products?.find((p) => p.id === productId);
  const unit = selectedProduct?.unit || "-";

  const soldQuantity = useMemo(() => {
    return Math.max(currentStock - remainingStock - returnedStock, 0);
  }, [currentStock, remainingStock, returnedStock]);

  const newStock = useMemo(() => {
    return remainingStock + addedStock;
  }, [remainingStock, addedStock]);

  const resetForm = () => {
    reset({
      productId: "",
      currentStock: 0,
      remainingStock: 0,
      addedStock: 0,
      returnedStock: 0,
    });
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSave = (data: TUpdateConsignmentItem) => {
    onSave({
      ...data,
      currentStock,
      remainingStock,
      addedStock,
      returnedStock,
    });

    resetForm();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView className="flex-1 bg-black/40 px-6" behavior="padding">
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
            paddingVertical: 24,
          }}
          showsVerticalScrollIndicator={false}
        >
          <View className="bg-white rounded-2xl p-5 gap-4 max-w-[430px] self-center w-full">
            <Text className="text-xl font-bold">Update Titipan</Text>

            <FormSelectModal
              control={control}
              name="productId"
              label="Produk"
              options={
                products?.map((p) => ({
                  value: p.id,
                  name: p.name,
                })) || []
              }
              getLabel={(item: { name: string }) => item.name}
              errors={errors}
            />

            <View>
              <Text className="mb-2">
                Stok Saat Ini ({unit})
              </Text>

              <View className="border border-gray-300 rounded-lg p-3 bg-gray-100">
                <Text>
                  {isLoadingStock ? "Loading..." : `${currentStock} ${unit}`}
                </Text>
              </View>
            </View>

            <FormInput
              control={control}
              name="remainingStock"
              label={`Sisa Stok (${unit})`}
              keyboardType="numeric"
            />

            <FormInput
              control={control}
              name="addedStock"
              label={`Stok Tambahan (${unit})`}
              keyboardType="numeric"
            />

            <FormInput
              control={control}
              name="returnedStock"
              label={`Stok Retur (${unit})`}
              keyboardType="numeric"
            />

            <View>
              <Text className="mb-2">Jumlah Terjual</Text>
              <View className="border border-gray-300 rounded-lg p-3 bg-gray-100">
                <Text>{soldQuantity} {unit}</Text>
              </View>
            </View>

            <View>
              <Text className="mb-2">Stok Baru</Text>
              <View className="border border-gray-300 rounded-lg p-3 bg-gray-100">
                <Text>{newStock} {unit}</Text>
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
                <Text className="text-center text-white font-semibold">
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