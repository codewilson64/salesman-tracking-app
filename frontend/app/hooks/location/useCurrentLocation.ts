import * as Location from "expo-location";

export const useCurrentLocation = () => {
  const getCurrentLocation = async () => {
    const permission = await Location.requestForegroundPermissionsAsync();

    if (!permission.granted) {
      throw new Error("Location permission required");
    }

    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });

    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      gpsAccuracy: location.coords.accuracy ?? undefined,
    };
  };

  return { getCurrentLocation };
};