import * as ImagePicker from "expo-image-picker";

export const takePhoto = async (): Promise<string | null> => {
  // Request camera permission
  const permission = await ImagePicker.requestCameraPermissionsAsync();

  if (!permission.granted) {
    alert("Camera permission is required");
    return null;
  }

  // Launch camera (NOT gallery)
  const result = await ImagePicker.launchCameraAsync({
    mediaTypes: ["images"],
    quality: 0.7,
    allowsEditing: false, // optional
  });

  if (!result.canceled) {
    return result.assets[0].uri;
  }

  return null;
};