import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import Navbar from "../components/Navbar";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthStore } from "../stores/authStore";
import { useRouter } from "expo-router";

const Home = () => {
  const user = useAuthStore((state) => state.user);
  const router = useRouter();

  const logout = useAuthStore((state) => state.logout)

  const handleLogout =  () => {
    logout()
    router.replace("/login");
  };

  const menuItems = [
    { name: "Salesmen Staff", route: "/salesmen", roles: ["owner"] },
    { name: "Products", route: "/products", roles: ["owner"] },
    { name: "Areas", route: "/areas", roles: ["owner", "salesman"] },
    { name: "Customers", route: "/customers", roles: ["owner", "salesman"] },
  ];

  const filteredMenu = menuItems.filter((item) =>
    item.roles.includes(user?.role || "")
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Navbar onLogout={handleLogout} />

      <View className="p-4">
        {filteredMenu.map((item) => (
           <TouchableOpacity
            key={item.name}
            onPress={() => router.push(item.route)}
            className="flex-row items-center p-3 border-b border-gray-300 rounded-md mb-2 justify-between"
          >
            {/* Left: icon/letter */}
            <View className="flex-row items-center">
              <View className="w-14 h-14 bg-black rounded-full justify-center items-center mr-4">
                <Text className="text-white font-bold text-lg">
                  {item.name[0]}
                </Text>
              </View>

              {/* Menu text */}
              <Text className="font-semibold text-lg">{item.name}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
};

export default Home;