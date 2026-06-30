import { View, Text } from "react-native";
import { Product } from "../../types/product";

type Props = {
  items: any[];
  products?: Product[];
};

export const UpdateTitipanList = ({ items, products }: Props) => {
  return (
    <View className="p-4 border-b border-gray-200">
      <Text className="text-gray-500 text-sm mb-3">Update Titipan</Text>

      {items.length ? (
        <View className="gap-3">
          {items.map((item, index) => {
            const product = products?.find((p) => p.id === item.productId);
            const productName = item.productName || product?.name || "Unknown Product";
            const unit = product?.unit || "-";

            const currentStock = Number(item.currentStock || 0);
            const remainingStock = Number(item.remainingStock || 0);
            const addedStock = Number(item.addedStock || 0);
            const returnedStock = Number(item.returnedStock || 0);

            const soldQuantity =
              item.soldQuantity != null
                ? Number(item.soldQuantity)
                : Math.max(currentStock - remainingStock - returnedStock, 0);

            const newStock =
              item.newStock != null
                ? Number(item.newStock)
                : remainingStock + addedStock;

            return (
              <View
                key={index}
                className="border border-gray-200 rounded-xl p-4 bg-gray-50"
              >
                <Text className="text-base font-semibold text-gray-900 mb-3">
                  {productName}
                </Text>

                <View className="gap-2">
                  <Row label="Stok Saat Ini" value={`${currentStock} ${unit}`} />
                  <Row label="Sisa Stok" value={`${remainingStock} ${unit}`} />
                  <Row label="Stok Tambahan" value={`${addedStock} ${unit}`} />
                  <Row label="Stok Retur" value={`${returnedStock} ${unit}`} />

                  <View className="h-px bg-gray-200 my-1" />

                  <Row
                    label="Jumlah Terjual"
                    value={`${soldQuantity} ${unit}`}
                    valueClassName="text-red-600"
                  />

                  <Row
                    label="Stok Tambahan"
                    value={`${newStock} ${unit}`}
                    valueClassName="text-green-600"
                  />
                </View>
              </View>
            );
          })}
        </View>
      ) : (
        <Text className="text-gray-400 text-sm">No update titipan items</Text>
      )}
    </View>
  );
};

const Row = ({
  label,
  value,
  valueClassName = "text-gray-900",
}: {
  label: string;
  value: string;
  valueClassName?: string;
}) => (
  <View className="flex-row justify-between">
    <Text className="text-gray-500">{label}</Text>
    <Text className={`font-medium ${valueClassName}`}>{value}</Text>
  </View>
);