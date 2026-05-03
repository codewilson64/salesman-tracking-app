import { Platform, Linking } from "react-native";

// No need Google API Key
export const openMap = (lat: number | null, lng: number | null) => {
  const latitude = Number(lat);
  const longitude = Number(lng);

  if (isNaN(latitude) || isNaN(longitude)) {
    console.log("Invalid coordinates");
    return;
  }

  const url = Platform.select({
    ios: `http://maps.apple.com/?ll=${latitude},${longitude}`,
    android: `geo:${latitude},${longitude}?q=${latitude},${longitude}`,
  });

  if (!url) return;

  Linking.openURL(url).catch((err) =>
    console.error("Error opening map:", err)
  );
};

// Need Google API Key
// export const openMap = (lat?: number | null, lng?: number | null) => {
//   if (lat == null || lng == null) return;

//   const url = Platform.select({
//     ios: `maps:0,0?q=${lat},${lng}`,
//     android: `geo:0,0?q=${lat},${lng}`,
//     default: `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`,
//   });

//   if (url) {
//     Linking.openURL(url);
//   }
// };


