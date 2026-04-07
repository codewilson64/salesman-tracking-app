import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Pressable,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";

import { useGetAllVisits } from "../../hooks/visit/useGetAllVisits";
import { Visit } from "../../types/visit";
import { formatTime } from "../../helper/formatTime";
import { useMemo } from "react";

import { getStartEndOfDay } from "../../utils/date";
import { getResultStyle } from "../../helper/resultStyle";

import { groupVisitsBySalesman } from "../../utils/groupBy/sales";
import { useExpand } from "../../hooks/useExpand";

import back from '../../assets/globalIcons/back.png'
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const OwnerVisitScreen = () => {
  const { date } = useLocalSearchParams();
  const router = useRouter();

  const { expanded, toggle } = useExpand();

  const { startDate, endDate } = useMemo(() => {
    return getStartEndOfDay(date as string);
  }, [date]);

  const { data: visits = [], isLoading, isError } = useGetAllVisits({
    startDate,
    endDate,
  });

  const groupedVisits = useMemo(() => {
    return groupVisitsBySalesman(visits as Visit[]);
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
        <Text className="text-red-500 text-lg">
          Error occurred while fetching visits.
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
        data={groupedVisits}
        keyExtractor={(item) => item.salesmanId}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        renderItem={({ item }) => {
          const isExpanded = expanded[item.salesmanId] ?? false;

          return (
            <View className="p-2 mb-3 bg-white rounded-xl shadow-sm overflow-hidden">
              {/* SALESMAN HEADER - COLLAPSIBLE */}
              <Pressable
                onPress={() => toggle(item.salesmanId)}
                className="flex-row items-center justify-between py-3 px-1 active:opacity-70"
              >
                <View className="flex-row items-center flex-1">
                  <Image
                    source={{
                      uri:
                        item.salesmanImage ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          item.salesmanName
                        )}&background=random&size=64`,
                    }}
                    className="w-12 h-12 rounded-full mr-3"
                  />
                  <View>
                    <Text className="text-xl font-bold capitalize">
                      {item.salesmanName}
                    </Text>
                    <Text className="text-sm text-gray-500">
                      {item.visits.length} visit{item.visits.length !== 1 ? 's' : ''}
                    </Text>
                  </View>
                </View>

                {/* Chevron Icon */}
                <View className="ml-2">
                  <Text className="text-2xl text-gray-400">
                    {isExpanded ? 
                        <MaterialIcons name="keyboard-arrow-down" size={24} color="black" /> 
                      : <MaterialIcons name="keyboard-arrow-right" size={24} color="black" />}
                  </Text>
                </View>
              </Pressable>

              {/* VISIT LIST - Only shown when expanded */}
              {isExpanded && (
                <View className="pl-1">
                  {item.visits.map((visit, index) => (
                    <Pressable
                      key={visit.id}
                      onPress={() => router.push(`screens/sales-visits/${visit.id}`)}
                      className="flex-row items-start py-4 border-b border-gray-200 last:border-b-0"
                    >
                      {/* NUMBER */}
                      <Text className="w-6 font-bold text-black mt-0.5">
                        {index + 1}.
                      </Text>

                      {/* VISIT INFO */}
                      <View className="flex-1 pr-2">
                        <Text className="font-semibold capitalize mb-1">
                          {visit.shopName}
                        </Text>

                        <Text className="text-sm text-gray-600">
                          In: {formatTime(visit.checkInAt ?? "")}
                        </Text>

                        {visit.checkOutAt && (
                          <Text className="text-sm text-gray-600">
                            Out: {formatTime(visit.checkOutAt)}
                          </Text>
                        )}

                        {visit.notes && (
                          <Text className="text-sm mt-2 text-gray-700" numberOfLines={2}>
                            Notes: {visit.notes}
                          </Text>
                        )}
                      </View>

                      {/* RESULT BADGE */}
                      <View
                        className={`mt-1 self-start px-3 py-1 rounded-full ${getResultStyle(
                          visit.visitResult
                        )}`}
                      >
                        <Text className="text-xs font-semibold capitalize">
                          {visit.visitResult || "Checking in..."}
                        </Text>
                      </View>
                    </Pressable>
                  ))}
                </View>
              )}
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
};

export default OwnerVisitScreen;