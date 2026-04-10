import { Platform, Linking } from "react-native";

export const openMap = (lat?: number | null, lng?: number | null) => {
  if (lat == null || lng == null) return;

  const url = Platform.select({
    ios: `maps:0,0?q=${lat},${lng}`,
    android: `geo:0,0?q=${lat},${lng}`,
    default: `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`,
  });

  if (url) {
    Linking.openURL(url);
  }
};