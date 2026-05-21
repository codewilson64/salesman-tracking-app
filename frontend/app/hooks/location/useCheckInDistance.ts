import { useEffect, useState } from "react";
import * as Location from "expo-location";

type Props = {
  latitude?: number | null;
  longitude?: number | null;
};

export const useCheckInDistance = ({
  latitude,
  longitude,
}: Props) => {
  const [distance, setDistance] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const calculateDistance = async () => {
      setDistance(null);

      if (latitude == null || longitude == null) {
        return;
      }

      try {
        setIsLoading(true);

        const permission = await Location.requestForegroundPermissionsAsync();

        if (!permission.granted) return;

        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });

        const toRad = (value: number) => (value * Math.PI) / 180;

        const lat1 = location.coords.latitude;
        const lon1 = location.coords.longitude;

        const lat2 = Number(latitude);
        const lon2 = Number(longitude);

        const R = 6371000;

        const dLat = toRad(lat2 - lat1);
        const dLon = toRad(lon2 - lon1);

        const a =
          Math.sin(dLat / 2) ** 2 +
          Math.cos(toRad(lat1)) *
            Math.cos(toRad(lat2)) *
            Math.sin(dLon / 2) ** 2;

        const c =
          2 *
          Math.atan2(
            Math.sqrt(a),
            Math.sqrt(1 - a)
          );

        setDistance(Math.round(R * c));

      } catch (err) {
        console.log(err);

      } finally {
        setIsLoading(false);
      }
    };

    calculateDistance();

  }, [latitude, longitude]);

  return {
    distance,
    isLoading,
  };
};