import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Product } from "../../types/product";

type Props = {
  fields: any[];
  items: any[];
  products?: Product[];
  isTitip: boolean;
  onRemove: (index: number) => void;
};

export const CheckoutProductList = ({
  fields,
  items,
  products,
  isTitip,
  onRemove,
}: Props) => {
  return (
    <View className="gap-3">
      {fields.map((field, index) => {
        const item = items[index];
        if (!item) return null;

        const selectedProduct = products?.find((p) => p.id === item.productId);

        const price = selectedProduct?.price || 0;
        const unit = selectedProduct?.unit || "-";
        const quantity = Number(item.quantity || 0);
        const discount = Number(item.discount || 0);
        const total = isTitip ? price * quantity : price * quantity - discount;

        return (
          <View key={field.id} className="border border-gray-300 rounded-lg p-3 bg-gray-50">
            <View className="flex-row justify-between">
              <View className="flex-1">
                <Text className="font-semibold text-base">
                  {selectedProduct?.name || "Unknown Product"}
                </Text>

                <Text className="text-gray-600 mt-1">
                  {isTitip ? "Jumlah dititip" : "Kuantitas"}: {quantity} {unit}
                </Text>

                <Text className="text-gray-600">Harga / {unit}: {price}</Text>

                {!isTitip && (
                  <Text className="text-gray-600">Diskon: {discount}</Text>
                )}

                <Text className="font-semibold mt-1">
                  {isTitip ? "Total Nilai Titipan" : "Total"}: {total}
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