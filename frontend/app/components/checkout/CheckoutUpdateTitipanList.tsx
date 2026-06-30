import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Product } from "../../types/product";

type Props = {
  fields: any[];
  items: any[];
  products?: Product[];
  onRemove: (index: number) => void;
};

export const CheckoutUpdateTitipanList = ({
  fields,
  items,
  products,
  onRemove,
}: Props) => {
  return (
    <View className="gap-3">
      {fields.map((field, index) => {
        const item = items[index];
        if (!item) return null;

        const selectedProduct = products?.find((p) => p.id === item.productId);
        const unit = selectedProduct?.unit || "-";

        const currentStock = Number(item.currentStock || 0);
        const remainingStock = Number(item.remainingStock || 0);
        const addedStock = Number(item.addedStock || 0);
        const returnedStock = Number(item.returnedStock || 0);

        const soldQuantity = Math.max(
          currentStock - remainingStock - returnedStock,
          0
        );

        const newStock = remainingStock + addedStock;

        return (
          <View key={field.id} className="border border-gray-300 rounded-lg p-3 bg-gray-50">
            <View className="flex-row justify-between">
              <View className="flex-1">
                <Text className="font-semibold text-base">
                  {selectedProduct?.name || "Unknown Product"}
                </Text>

                <Text className="text-gray-600 mt-1">
                  Stok Saat Ini: {currentStock} {unit}
                </Text>

                <Text className="text-gray-600">
                  Sisa Stok: {remainingStock} {unit}
                </Text>

                <Text className="text-gray-600">
                  Stok Tambahan: {addedStock} {unit}
                </Text>

                <Text className="text-gray-600">
                  Stok Retur: {returnedStock} {unit}
                </Text>

                <Text className="font-semibold mt-1">
                  Jumlah Terjual: {soldQuantity} {unit}
                </Text>

                <Text className="font-semibold">
                  Stok Baru: {newStock} {unit}
                </Text>
              </View>

              <Pressable onPress={() => onRemove(index)} className="self-start">
                <Ionicons name="trash-outline" size={18} color="red" />
              </Pressable>
            </View>
          </View>
        );
      })}
    </View>
  );
};