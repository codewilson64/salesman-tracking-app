import { Alert, GestureResponderEvent, Pressable, Text, View } from "react-native";
import { formatTime } from "../../helper/formatTime";
import { getResultStyle } from "../../helper/resultStyle";
import { FontAwesome6, MaterialCommunityIcons } from "@expo/vector-icons";
import { useCheckInDistance } from "../../hooks/location/useCheckInDistance";
import { useRouter } from "expo-router";
import { Visit } from "../../types/visit";
import { VisitDraft } from "../../types/visitDraft";

type VisitItemProps = {
  item: Visit;
  index: number;
  drafts: Record<string, VisitDraft>;
  isPending: boolean;
  handleCheckout: (visitId: string) => void;
};

export const VisitItem = ({
  item,
  index,
  drafts,
  isPending,
  handleCheckout,
}: VisitItemProps) => {
  const router = useRouter();

  const { 
    distance: checkOutDistance, 
    isLoading: isCheckoutDistanceLoading, 
    error: checkoutDistanceError, 
    calculateDistance 
  } = useCheckInDistance({
    latitude: item.latitude,
    longitude: item.longitude,
  });

  const MAX_CHECK_OUT_DISTANCE = 100;
  const isCheckoutTooFar = checkOutDistance != null && checkOutDistance > MAX_CHECK_OUT_DISTANCE;

  const handleCheckoutPress = async (e: GestureResponderEvent) => {
    e.stopPropagation();

    const newDistance = await calculateDistance();

    if (newDistance == null || newDistance > MAX_CHECK_OUT_DISTANCE) {
      Alert.alert(
        "Cannot Checkout",
        `You are ${newDistance ?? '?'} meters away.\n\nMaximum allowed: ${MAX_CHECK_OUT_DISTANCE} meters.`
      );
      return;
    }

    handleCheckout(item.id);
  };

  const resultStyle = getResultStyle(item.visitResult);

  return (
    <Pressable 
      onPress={() => router.push(`screens/visits/${item.id}`)}
      className="flex-row items-start p-3 border-b border-gray-300"
    >
      {/* NUMBER */}
      <Text className="w-6 font-bold">
        {index + 1}.
      </Text>

      {/* VISIT INFO */}
      <View className="flex-1">
        <Text className="font-semibold capitalize mb-2">
          {item.shopName}
        </Text>

        <Text className="text-sm">
          In: {formatTime(item.checkInAt)}
        </Text>

        {item.checkOutAt && (
          <Text className="text-sm">
            Out: {formatTime(item.checkOutAt)}
          </Text>
        )}

        {item.notes && (
          <Text className="text-sm mt-2" numberOfLines={2}>
            Notes: {item.notes}
          </Text>
        )}

        {/* Distance Info */}
        {!item.checkOutAt && drafts[item.id]?.result && (
          <Text className={`text-xs mt-2 ${isCheckoutTooFar ? "text-red-500" : "text-green-600"}`}>
            {isCheckoutDistanceLoading 
              ? "Getting GPS..." 
              : checkOutDistance != null 
              ? `Distance: ${checkOutDistance} m` 
              : "Waiting for GPS..."}
          </Text>
        )}

        {checkoutDistanceError && (
          <Text className="text-red-500 text-xs mt-1">{checkoutDistanceError}</Text>
        )}
      </View>

      {/* RESULT BADGE - Top Right */}
      {item.visitResult && (
        <View className="flex-col gap-1">
          <View className={`mt-1 self-end px-2 py-1 rounded ${resultStyle.bg}`}>
            <Text className={`text-xs font-semibold capitalize ${resultStyle.text}`}>
              {item.visitResult}
            </Text>
          </View>
        </View>
      )}

      {/* ACTION BUTTONS - Bottom Right */}
      {!item.checkOutAt && (
        <View className="absolute bottom-3 right-3 flex-row items-center">
          {/* EDIT */}
          <Pressable
            onPress={(e: GestureResponderEvent) => {
              e.stopPropagation();
              router.push(`/screens/visits/edit/${item.id}`);
            }}
            className="bg-gray-200 p-2 rounded-full"
          >
            <FontAwesome6 name="edit" size={16} color="black" />
          </Pressable>

          {/* CHECKOUT */}
          {drafts[item.id]?.result && (
            <Pressable
              onPress={handleCheckoutPress}
              disabled={isCheckoutDistanceLoading || isPending}
              className={`p-2 rounded-full ml-3 ${
                isCheckoutDistanceLoading || isPending ? "bg-gray-300" : "bg-gray-200"
              }`}
            >
              <MaterialCommunityIcons name="logout" size={16} color="black" />
            </Pressable>
          )}
        </View>
      )}
    </Pressable>
  );
};