import { View, Text, Pressable } from "react-native";
import { Product } from "../types/product";
import { FormSelectModal } from "./areaInputForm/FormSelectModal";
import { FormInput } from "./areaInputForm/FormInput";

export const ProductFieldItem = ({
  field,
  index,
  control,
  watch,
  products,
  remove,
  errors,
}: any) => {
  const productId = watch(`products.${index}.productId`);
  const quantity = Number(watch(`products.${index}.quantity`) || 0);

  const selectedProduct = products?.find(
    (p: Product) => p.id === productId
  );

  const price = selectedProduct?.price || 0;
  const discount = Number(watch(`products.${index}.discount`) || 0);

  const subtotal = price * quantity;
  const total = subtotal - discount;

  return (
    <View className="border border-gray-300 p-3 rounded-lg mt-4 gap-3">
      <FormSelectModal
        control={control}
        name={`products.${index}.productId`}
        label="Product"
        options={
          products?.map((p: Product) => ({
            value: p.id,
            name: p.name,
          })) || []
        }
        getLabel={(item: Product) => item.name}
        errors={errors}
      />

      <FormInput
        control={control}
        name={`products.${index}.quantity`}
        label="Quantity"
        keyboardType="numeric"
      />

      <FormInput
        control={control}
        name={`products.${index}.discount`}
        label="Discount"
        keyboardType="numeric"
      />

      <View>
        <Text className="mb-2">Price</Text>
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

      <Pressable
        onPress={() => remove(index)}
        className="bg-red-500 p-2 rounded"
      >
        <Text className="text-white text-center">Remove</Text>
      </Pressable>
    </View>
  );
};