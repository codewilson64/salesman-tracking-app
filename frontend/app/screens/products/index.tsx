import { View, Text, FlatList, ActivityIndicator, Image, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import back from '../../assets/globalIcons/back.png'

import { useGetAllProduct } from "../../hooks/product/useGetAllProduct";


const ProductScreen = () => {
  const router = useRouter()
  const { data: products = [], isLoading, isError } = useGetAllProduct()

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (isError) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-red-500 text-lg">Error occurred while fetching products.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 p-4 bg-gray-100">
      <View className="flex-row items-center mb-4">
      <Pressable
        onPress={() => router.back()}
        className="mr-3 p-2"
      >
        <Image source={back} className="w-6 h-6" resizeMode="contain" />
      </Pressable>

      <Text className="text-2xl font-bold">Daftar Produk</Text>
    </View>

      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        renderItem={({ item }) => (
          <View className="mb-3 bg-white rounded-xl shadow-sm overflow-hidden">
            <Pressable
              onPress={() => router.push(`screens/products/${item.id}`)}
              className="flex-row items-center p-4"
            >
              {/* Product Image */}
              <Image
                source={{
                  uri: item.productImage
                    ? item.productImage
                    : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        item.name
                      )}&background=random&size=64`,
                }}
                className="w-14 h-14 rounded-full mr-4"   // Changed to rounded-xl for consistency
              />

              {/* Product Info */}
              <View className="flex-1 pr-2">
                <Text className="font-bold text-lg capitalize">
                  {item.name}
                </Text>
                {item.description && (
                  <Text 
                    className="text-gray-500 text-sm" 
                    numberOfLines={2}
                  >
                    {item.description}
                  </Text>
                )}
              </View>
            </Pressable>
          </View>
        )}
      />

       {/* CREATE BUTTON */}
      <Pressable
        onPress={() => router.push("screens/products/create")}
        className="bg-black rounded-lg p-4 mb-4"
      >
        <Text className="text-white text-center font-semibold">
          + Tambah Produk
        </Text>
      </Pressable>

    </SafeAreaView>
  );
};

export default ProductScreen;