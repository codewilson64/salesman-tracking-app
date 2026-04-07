import { View, Text, FlatList, ActivityIndicator, Image, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import back from '../../assets/globalIcons/back.png'
import { useGetAllSalesmen } from "../../hooks/salesman/useGetAllSalesmen";


const SalesmanScreen = () => {
  const router = useRouter()
  const { data: salesmen = [], isLoading, isError } = useGetAllSalesmen()

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
        <Text className="text-red-500 text-lg">Error occurred while fetching salesmen.</Text>
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

        <Text className="text-2xl font-bold">List of salesmen</Text>
      </View>

      <FlatList
        data={salesmen}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        renderItem={({ item }) => (
          <View className="mb-3 bg-white rounded-xl shadow-sm overflow-hidden">
            <Pressable
              onPress={() => router.push(`screens/salesmen/${item.id}`)}
              className="flex-row items-center p-4"
            >
              {/* Salesman Image */}
              <Image
                source={{
                  uri: item.profileImage
                    ? item.profileImage
                    : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        item.name
                      )}&background=random&size=64`,
                }}
                className="w-14 h-14 rounded-full mr-4"   // Consistent rounded-xl
              />

              {/* Salesman Info */}
              <View className="flex-1 pr-2">
                <Text className="font-bold text-lg capitalize">
                  {item.name}
                </Text>
              </View>

              {/* Edit Button */}
              <Pressable
                onPress={(e) => {
                  e.stopPropagation();
                  router.push(`screens/salesmen/edit/${item.id}`);
                }}
                className="self-end"
              >
                <FontAwesome6 name="edit" size={16} color="black" />
              </Pressable>
            </Pressable>
          </View>
        )}
      />

       {/* CREATE BUTTON */}
      <Pressable
        onPress={() => router.push("screens/salesmen/create")}
        className="bg-black rounded-lg p-4 mb-4"
      >
        <Text className="text-white text-center font-semibold">
          + Add Salesman
        </Text>
      </Pressable>

    </SafeAreaView>
  );
};

export default SalesmanScreen;