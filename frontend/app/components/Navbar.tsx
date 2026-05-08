import { View, Text, Image } from "react-native";
import React from "react";

const Navbar = () => {
  return (
    <View className="h-14 bg-gray-100 flex-row items-center px-4">
    <View className="flex-row items-center">
      <Image
        source={require("../../assets/logo.png")}
        className="w-24 h-24"
        resizeMode="contain"
      />

      <Text className="text-lg font-bold">
        Sales Team Tracker
      </Text>
    </View>
  </View>
  );
};

export default Navbar;