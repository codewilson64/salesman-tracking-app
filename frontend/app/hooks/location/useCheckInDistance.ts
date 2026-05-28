import { useEffect, useState, useCallback } from "react";
import * as Location from "expo-location";

type Props = {
  latitude?: number | null;
  longitude?: number | null;
};

export const useCheckInDistance = ({ latitude, longitude }: Props) => {
  const [distance, setDistance] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculateDistance = useCallback(async (retryCount = 0) => {
    if (latitude == null || longitude == null) {
      setDistance(null);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const permission = await Location.requestForegroundPermissionsAsync();
      if (!permission.granted) {
        setError("Location permission denied");
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const toRad = (value: number) => (value * Math.PI) / 180;

      const lat1 = location.coords.latitude;
      const lon1 = location.coords.longitude;
      const lat2 = Number(latitude);
      const lon2 = Number(longitude);

      const R = 6371000; // meters

      const dLat = toRad(lat2 - lat1);
      const dLon = toRad(lon2 - lon1);

      const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;

      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

      const calculatedDistance = Math.round(R * c);
    
      setDistance(calculatedDistance);
      setError(null);
      return calculatedDistance;
    } 
    catch (err: unknown) {
      console.error("Distance calculation error:", err);

      let errorMessage = "Failed to get current location. Please try again.";

      if (err instanceof Error && retryCount === 0) {
        console.log("Retrying location fetch...");
        await new Promise((resolve) => setTimeout(resolve, 2000));
        return calculateDistance(1);
      }

      setError(errorMessage);
      setDistance(null);
      return null;
    } 
    finally {
      setIsLoading(false);
    }
  }, [latitude, longitude]);

  useEffect(() => {
    calculateDistance();
  }, [calculateDistance]);

  return { distance, isLoading, error, calculateDistance };
};