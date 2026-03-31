import * as Location from "expo-location";
import { useState } from "react";

export const useGetLocation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getLocation = async (): Promise<string | null> => {
    try {
      setLoading(true);
      setError(null);

      // Request permission
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        setError("Permission denied");
        return null;
      }

      // Get location
      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const coordinate = `${currentLocation.coords.latitude.toFixed(6)}, ${currentLocation.coords.longitude.toFixed(6)}`;

      return coordinate;
    } 
    catch (err) {
      setError("Failed to get location");
      return null;
    } 
    finally {
      setLoading(false);
    }
  };

  return { getLocation, loading, error };
};