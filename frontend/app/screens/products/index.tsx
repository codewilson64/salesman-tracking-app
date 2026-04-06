import { View, Text, FlatList, ActivityIndicator, Image, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
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
    <SafeAreaView className="flex-1 p-4">
      <View className="flex-row items-center mb-4">
      <Pressable
        onPress={() => router.back()}
        className="mr-3 p-2"
      >
        <Image
          source={back}
          className="w-6 h-6"
          resizeMode="contain"
        />
      </Pressable>

      <Text className="text-2xl font-bold">List of products</Text>
    </View>

      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => router.push(`screens/products/${item.id}`)}
            className="flex-row items-center py-4 border-b border-gray-300"
          >
            <Image
              source={{
                uri: item.productImage
                  ? item.productImage
                  : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      item.name
                    )}&background=random&size=64`,
              }}
              className="w-14 h-14 rounded-full mr-4"
            />

            {/* Salesman info */}
            <View className="flex-1">
              <Text className="font-bold text-lg">{item.name}</Text>
              <Text className="text-gray-700">{item.price}</Text>
              <Text className="text-gray-500">{item.description}</Text>
            </View>
            
            <Pressable
              onPress={(e) => {
                e.stopPropagation();
                router.push(`screens/products/edit/${item.id}`);
              }}
              className="absolute bottom-3 right-3 bg-gray-200 p-2 rounded-full"
            >
              <FontAwesome6 name="edit" size={16} color="black" />
            </Pressable>
          </Pressable>
        )}
      />

       {/* CREATE BUTTON */}
      <Pressable
        onPress={() => router.push("screens/products/create")}
        className="bg-black rounded-lg p-4 mb-4"
      >
        <Text className="text-white text-center font-semibold">
          + Add Product
        </Text>
      </Pressable>

    </SafeAreaView>
  );
};

export default ProductScreen;