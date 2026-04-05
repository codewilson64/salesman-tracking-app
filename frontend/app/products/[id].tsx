import { View, Text, ActivityIndicator, Image, Pressable, Alert } from "react-native";
import { useLocalSearchParams, useRouter} from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useGetProductById } from "../hooks/product/useGetProductById";
import { useDeleteProduct } from "../hooks/product/useDeleteProduct";
import back from '../assets/globalIcons/back.png'

const ProductDetail = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter()
  const { data: product, isLoading, isError } = useGetProductById(id);
  const { mutateAsync: deleteProduct, isPending } = useDeleteProduct();

  const handleDelete = () => {
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
      {/* Avatar */}
      <View className="mb-6">
        <Pressable
          onPress={() => router.back()}
          className="absolute left-0 top-0 p-2 z-10"
        >
          <Image
            source={back}
            className="w-6 h-6"
            resizeMode="contain"
          />
        </Pressable>

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
            <Text className="text-gray-500 text-sm">Name</Text>
            <Text className="text-lg font-medium">{product.name}</Text>
            </View>
        </View>

        {/* Price */}
        <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
            <View>
            <Text className="text-gray-500 text-sm">Price</Text>
            <Text className="text-lg font-medium">{product.price}</Text>
            </View>
        </View>

        {/* Desc */}
        <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
            <View>
            <Text className="text-gray-500 text-sm">Description</Text>
            <Text className="text-lg font-medium">{product.description}</Text>
            </View>
        </View>
        </View>
        
        {/* Button */}
        <View className="flex-1 justify-end mt-6">
          <Pressable
            onPress={handleDelete}
            disabled={isPending}
            className="bg-red-600 rounded-lg p-4"
          >
            <Text className="text-white text-center font-semibold">
              Delete Product
            </Text>
          </Pressable>
        </View>
    </SafeAreaView>
  );
};

export default ProductDetail;