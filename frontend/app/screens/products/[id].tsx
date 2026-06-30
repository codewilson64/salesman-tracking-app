import { View, Text, ActivityIndicator, Image, Pressable, Alert } from "react-native";
import { useLocalSearchParams, useRouter} from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { useDeleteProduct } from "../../hooks/product/useDeleteProduct";
import { useGetProductById } from "../../hooks/product/useGetProductById";
import { useState } from "react";

import back from '../../assets/globalIcons/back.png'
import dots from "../../assets/globalIcons/dots.png";

const ProductDetail = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter()

  const [showMenu, setShowMenu] = useState(false);

  const { data: product, isLoading, isError } = useGetProductById(id);
  const { mutateAsync: deleteProduct, isPending } = useDeleteProduct();

  const handleDelete = () => {
    setShowMenu(false);

    Alert.alert(
      `Delete ${product?.name}?`,
      "Are you sure you want to delete this product? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteProduct({id, imageId: product?.productImageId });
              router.back();
            } catch (err) {
              console.error(err);
            }
          },
        },
      ]
    );
  };

  const handleEdit = () => {
    setShowMenu(false);

    router.push({
      pathname: "/screens/products/edit/[id]",
      params: { id },
    });
  };

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (isError || !product) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-red-500">Error loading product</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 p-4 bg-white">
      {/* Header */}
      <View className="mb-6 relative">

        {/* Back */}
        <Pressable
          onPress={() => router.back()}
          className="absolute left-0 top-0 p-2 z-10"
        >
          <Image source={back} className="w-6 h-6" resizeMode="contain" />
        </Pressable>

        {/* Dots menu */}
        <View className="absolute right-0 top-0 z-20">
          <Pressable
            onPress={() => setShowMenu(!showMenu)}
            className="p-2"
          >
            <Image source={dots} className="w-6 h-6" resizeMode="contain" />
          </Pressable>

          {showMenu && (
            <View className="absolute top-10 right-0 bg-white rounded-xl border border-gray-200 shadow w-36 overflow-hidden">

              <Pressable
                onPress={handleEdit}
                className="px-4 py-3 border-b border-gray-100"
              >
                <Text className="text-gray-800">
                  Edit
                </Text>
              </Pressable>

              <Pressable
                onPress={handleDelete}
                disabled={isPending}
                className="px-4 py-3"
              >
                <Text className="text-red-600">
                  {isPending ? "Deleting..." : "Delete"}
                </Text>
              </Pressable>

            </View>
          )}

        </View>

        {/* Centered content */}
        <View className="items-center">
          <Image
            source={{
              uri: product.productImage
                ? product.productImage
                : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    product.name
                  )}&size=128`,
            }}
            className="w-32 h-32 rounded-full mb-4"
          />
        </View>
      </View>

      {/* Info */}
      <View>
        {/* Name */}
        <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
            <View>
            <Text className="text-gray-500 text-sm">Nama produk</Text>
            <Text className="text-lg font-medium">{product.name}</Text>
            </View>
        </View>

        {/* Price */}
        <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
            <View>
            <Text className="text-gray-500 text-sm">Harga</Text>
            <Text className="text-lg font-medium">{product.price}</Text>
            </View>
        </View>

        {/* Unit */}
        <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
            <View>
            <Text className="text-gray-500 text-sm">Satuan unit</Text>
            <Text className="text-lg font-medium">{product.unit}</Text>
            </View>
        </View>

        {/* Desc */}
        <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
            <View>
            <Text className="text-gray-500 text-sm">Deskripsi produk</Text>
            <Text className="text-lg font-medium">{product.description}</Text>
            </View>
        </View>
        </View>
        
    </SafeAreaView>
  );
};

export default ProductDetail;