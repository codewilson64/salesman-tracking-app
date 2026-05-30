import { Text, FlatList, Pressable, View, ActivityIndicator, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Visit } from "../../types/visit";
import { useGetAllVisits } from "../../hooks/visit/useGetAllVisits";
import { useDateFilteredVisits } from "../../hooks/visit/useDateFilteredVisits";  // ← New

import back from '../../assets/globalIcons/back.png';
import filterIcon from '../../assets/globalIcons/filter.png';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useState } from "react";
import DateFilterModal from "../../components/DateFilterModal";

const DateListScreen = () => {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);

  const { data: visits = [], isLoading, isError } = useGetAllVisits({});

  const {
    dateList,
    visitCountByDate,
    filter,
    setDateRange,
    resetFilter,
    hasActiveFilter,
  } = useDateFilteredVisits(visits as Visit[]);

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
        <Text className="text-red-500">Failed to load visits</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 p-4 bg-gray-100">
      <View className="flex-row items-center justify-between mb-4">
        <View className="flex-row items-center">
          <Pressable onPress={() => router.back()} className="mr-3 p-2">
            <Image source={back} className="w-6 h-6" resizeMode="contain" />
          </Pressable>
          <Text className="text-2xl font-bold">Sales visits overview</Text>
        </View>

        <Pressable
          onPress={() => setModalVisible(true)}
          className="p-2 relative"
        >
          <Image source={filterIcon} className="w-6 h-6" resizeMode="contain" />
            {hasActiveFilter && (
              <View className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
            )}
        </Pressable>

        <DateFilterModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onApply={setDateRange}
          initialFilter={filter}
        />
      </View>

      {/* Active Filter Indicator */}
      {hasActiveFilter && (
        <View className="bg-blue-50 p-3 rounded-xl mb-4 flex-row justify-between items-center">
          <Text className="text-blue-700 text-sm">
            {filter.startDate?.toLocaleDateString("id-ID")} —{" "}
            {filter.endDate?.toLocaleDateString("id-ID")}
          </Text>
          <Pressable onPress={resetFilter}>
            <Text className="text-blue-600 font-semibold">Reset</Text>
          </Pressable>
        </View>
      )}

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
                  {visitCountByDate[item]} visit{visitCountByDate[item] !== 1 ? "s" : ""}
                </Text>
              </View>

              <MaterialIcons name="keyboard-arrow-right" size={24} color="black" />
            </Pressable>
          );
        }}
      />
    </SafeAreaView>
  );
};

export default DateListScreen;