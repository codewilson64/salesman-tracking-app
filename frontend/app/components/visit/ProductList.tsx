import { View, Text } from "react-native";
import { Product } from "../../types/product";

type Props = {
  items: any[];
  products?: Product[];
  isOrder: boolean;
  isTitip: boolean;
  subtotal: number;
  totalDiscount: number;
  finalAmount: number;
};

export const VisitProductList = ({
  items,
  products,
  isOrder,
  isTitip,
  subtotal,
  totalDiscount,
  finalAmount,
}: Props) => {
  return (
    <View className="p-4 border-b border-gray-200">
      <Text className="text-gray-500 text-sm mb-3">Produk</Text>

      {items.length ? (
        <View className="bg-gray-50 overflow-hidden">
          <View className="flex-row justify-between px-3 py-2 bg-gray-100">
            <Text className="flex-1 text-xs font-semibold text-gray-500">
              Produk
            </Text>
            <Text className="w-12 text-xs font-semibold text-gray-500 text-right">
              Qty
            </Text>
            <Text className="w-20 text-xs font-semibold text-gray-500 text-right">
              Harga
            </Text>
            <Text className="w-24 text-xs font-semibold text-gray-500 text-right">
              Total
            </Text>
          </View>

          {items.map((item, index) => {
            const product = products?.find((p) => p.id === item.productId);
            const productName = item.productName || product?.name || "Unknown Product";
            const unit = item.unit || "-";

            return (
              <View key={index} className="px-3 py-3 border-t border-gray-200">
                <View className="flex-row justify-between">
                  <Text className="flex-1 text-sm font-medium text-gray-800">
                    {productName}
                  </Text>

                  <Text className="w-12 text-sm text-right text-gray-700">
                    {item.quantity} {unit}
                  </Text>

                  <View className="w-20 items-end">
                    <Text className="text-sm text-gray-700">
                      Rp {Number(item.price || 0).toLocaleString()}
                    </Text>

                    {isOrder && (
                      <Text className="text-xs text-red-500">
                        - Rp {Number(item.discount || 0).toLocaleString()}
                      </Text>
                    )}
                  </View>

                  <Text className="w-24 text-sm text-right font-semibold text-gray-900">
                    Rp{" "}
                    {Number(
                      item.totalAfterDiscount ?? item.totalAmount ?? 0
                    ).toLocaleString()}
                  </Text>
                </View>
              </View>
            );
          })}

          <View className="px-3 py-3 border-t border-gray-300 bg-white">
            <View className="flex-row justify-between mb-1">
              <Text className="text-sm text-gray-500">
                {isTitip ? "Total Nilai Titipan" : "Subtotal"}
              </Text>
              <Text className="text-sm text-gray-700">
                Rp {Number(subtotal).toLocaleString()}
              </Text>
            </View>

            {isOrder && (
              <View className="flex-row justify-between mb-1">
                <Text className="text-sm text-gray-500">Diskon</Text>
                <Text className="text-sm text-red-500">
                  - Rp {Number(totalDiscount).toLocaleString()}
                </Text>
              </View>
            )}

            <View className="flex-row justify-between mt-2">
              <Text className="text-base font-semibold text-gray-800">
                Total
              </Text>
              <Text className="text-base font-bold text-gray-900">
                Rp {Number(finalAmount).toLocaleString()}
              </Text>
            </View>
          </View>
        </View>
      ) : (
        <Text className="text-gray-400 text-sm">No products</Text>
      )}
    </View>
  );
};