import { Text, FlatList, Pressable, View, ActivityIndicator, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Visit } from "../../types/visit";
import { useGetAllVisits } from "../../hooks/visit/useGetAllVisits";
import { useMemo } from "react";
import { groupVisitsByDate } from "../../utils/visitDateFilter";

import back from '../../assets/globalIcons/back.png'
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const DateListScreen = () => {
  const router = useRouter();

  const { data: visits = [], isLoading, isError } = useGetAllVisits({});

  const { visitCountByDate, dateList } = useMemo(() => {
    return groupVisitsByDate(visits as Visit[]);
  }, [visits]);

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
        <Text className="text-red-500">
          Failed to load visits
        </Text>
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
          <Image
            source={back}
            className="w-6 h-6"
            resizeMode="contain"
          />
        </Pressable>

        <Text className="text-2xl font-bold">Sales visits overview</Text>
      </View>

      <FlatList
        data={dateList}
        keyExtractor={(item) => item}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const formatted = new Date(item).toLocaleDateString("id-ID");

          return (
            <Pressable
              onPress={() =>
                router.push({
                  pathname: "screens/sales-visits/list",
                  params: { date: item },
                })
              }
              className="bg-white p-4 mb-2 rounded-xl flex-row justify-between items-center"
            >
              <View>
                <Text className="text-lg font-bold">{formatted}</Text>
                <Text className="text-gray-500">
                  {visitCountByDate[item]} visit
                  {visitCountByDate[item] !== 1 ? "s" : ""}
                </Text>
              </View>

              <Text>
                <MaterialIcons 
                  name="keyboard-arrow-right" 
                  size={24} 
                  color="black" 
                />
              </Text>
            </Pressable>
          );
        }}
      />
    </SafeAreaView>
  );
};

export default DateListScreen;