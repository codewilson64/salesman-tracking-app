import { Text, FlatList, Pressable, View, ActivityIndicator, Image, Alert } from "react-native";
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

  const hasActiveVisit = visits?.some((v: Visit) => v.checkOutAt === null);

  const handleCreateVisit = () => {
      if (hasActiveVisit) {
        Alert.alert(
          "Finish Visit First",
          "Please checkout your current visit before adding a new one."
        );
        return;
      }
  
      router.push("screens/visits/create");
    };

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
        renderItem={({ item }) => {
          const formatted = new Date(item).toLocaleDateString("id-ID");

          return (
            <Pressable
              onPress={() =>
                router.push({
                  pathname: "screens/visits/list",
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

      {/* CREATE BUTTON */}
      <Pressable
        onPress={handleCreateVisit}
        className="bg-black rounded-lg p-4 mb-4"
      >
        <Text className="text-white text-center font-semibold">
          + Add Visit
        </Text>
      </Pressable>
    </SafeAreaView>
  );
};

export default DateListScreen;