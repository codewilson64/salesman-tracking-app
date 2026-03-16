import { View, Text, Pressable } from "react-native";
import React from "react";

type NavbarProps = {
  onLogout: () => void;
};

const Navbar = ({ onLogout }: NavbarProps) => {
  return (
    <View className="h-14 bg-white flex-row items-center justify-between px-4">
      <Text className="text-lg font-bold">Home</Text>

      <Pressable
        onPress={onLogout}
        className="bg-red-500 px-3 py-1 rounded"
      >
        <Text className="text-white font-semibold">Logout</Text>
      </Pressable>
    </View>
  );
};

export default Navbar;