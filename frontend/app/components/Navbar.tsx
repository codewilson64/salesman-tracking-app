import { View, Text, Pressable } from "react-native";
import React from "react";
import { useAuthStore } from "../stores/authStore";

type NavbarProps = {
  onLogout: () => void;
};

const Navbar = ({ onLogout }: NavbarProps) => {
  const user = useAuthStore((state) => state.user);

  return (
    <View className="h-14 bg-gray-100 flex-row items-center justify-between px-4">
      <Text className="text-lg font-bold">{user?.email} ({user?.role})</Text>

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