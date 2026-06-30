import { View, Text } from "react-native";
import { CustomerConsignmentStock } from "../types/consignment";

type Props = {
  stocks: CustomerConsignmentStock[];
};

export const ActiveConsignmentStockSection = ({ stocks }: Props) => {
  const totalProducts = stocks.length;

  const lastUpdated =
    stocks.length > 0
      ? stocks
          .map((item) => new Date(item.lastUpdated))
          .sort((a, b) => b.getTime() - a.getTime())[0]
      : null;

  return (
    <View className="border-gray-200">

      {stocks.length ? (
        <View className="bg-gray-50 overflow-hidden">
          <View className="flex-row justify-between px-3 py-2 bg-gray-100">
            <Text className="flex-1 text-xs font-semibold text-gray-500">
              Produk
            </Text>

            <Text className="w-24 text-xs font-semibold text-gray-500 text-right">
              Stok
            </Text>
          </View>

          {stocks.map((item) => (
            <View
              key={item.productId}
              className="px-3 py-3 border-t border-gray-200"
            >
              <View className="flex-row justify-between">
                <Text className="flex-1 text-sm font-medium text-gray-800">
                  {item.productName}
                </Text>

                <Text className="w-24 text-sm text-right text-gray-700">
                  {item.currentStock} {item.unit || "-"}
                </Text>
              </View>
            </View>
          ))}

          <View className="px-3 py-3 border-t border-gray-300 bg-gray-50">
            <View className="flex-row justify-between mb-1">
              <Text className="text-sm text-gray-500">Total Produk</Text>
              <Text className="text-sm text-gray-700">{totalProducts}</Text>
            </View>

            <View className="flex-row justify-between">
              <Text className="text-sm text-gray-500">Terakhir diperbarui</Text>
              <Text className="text-sm text-gray-700">
                {lastUpdated
                  ? lastUpdated.toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })
                  : "-"}
              </Text>
            </View>
          </View>
        </View>
      ) : (
        <Text className="text-gray-400 text-sm">
          Tidak ada titipan aktif
        </Text>
      )}
    </View>
  );
};