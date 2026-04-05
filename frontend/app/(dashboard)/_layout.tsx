import { Tabs } from "expo-router";
import { Image } from "react-native";
import home from '../assets/menuIcons/home.png'

export default function DashboardLayout() {
    return (
      <>
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                  height: 100
                }
            }}
        >
          <Tabs.Screen 
            name='home'
            options={{title: 'Home', tabBarIcon: ({focused}) => (
              <Image
                source={home}
                style={{
                  width: 24,
                  height: 24,
                  tintColor: focused ? "#0096ff" : "gray", // optional
                }}
                resizeMode="contain"
              />
          )}}
        />
        </Tabs>
      </>
    )
}