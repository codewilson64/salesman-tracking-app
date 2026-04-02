import * as ImagePicker from "expo-image-picker";

export const pickImageFromLibrary = async (): Promise<string | null> => {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ["images"],
    quality: 0.7,
  });

  if (!result.canceled) {
    return result.assets[0].uri;
  }

  return null;
};

