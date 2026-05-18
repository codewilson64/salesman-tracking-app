import { Tabs } from "expo-router";
import { Image, View } from "react-native";
import home from '../assets/menuIcons/home.png'
import collections from '../assets/menuIcons/collections.png'
import profile from '../assets/menuIcons/profile.png'
import AuthUserOnly from "../components/auth/AuthUserOnly";
import { useGetUnreadVisitsCount } from "../hooks/notification/reports-tab/useGetUnreadVisitsCount";

export default function DashboardLayout() {
  const { data } = useGetUnreadVisitsCount();

  const hasUnreadReports =  Boolean(data?.count);

    return (
      <AuthUserOnly>
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
                  tintColor: focused ? "#0096ff" : "gray", 
                }}
                resizeMode="contain"
              />
          )}}
        />
          <Tabs.Screen
            name='reports'
            options={{
              title: 'Reports',
              tabBarIcon: ({ focused }) => (
                <View style={{ position: "relative" }}>
                  <Image
                    source={collections}
                    style={{
                      width: 24,
                      height: 24,
                      tintColor: focused ? "#0096ff" : "gray",
                    }}
                    resizeMode="contain"
                />

                {/* Red notification dot */}
                {hasUnreadReports && (
                  <View
                    style={{
                      position: "absolute",
                      top: -3,
                      right: -2,

                      padding: 1,
                      backgroundColor: "white",
                      borderRadius: 999,

                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <View
                      style={{
                        width: 7,
                        height: 7,
                        borderRadius: 999,
                        backgroundColor: "red",
                      }}
                    />
                  </View>
                )}
              </View>
            ),
          }}
        />

          <Tabs.Screen 
            name='profile'
            options={{
            title: 'Me',
            tabBarIcon: ({ focused }) => (
              <Image
                source={profile}
                style={{
                  width: 24,
                  height: 24,
                  tintColor: focused ? "#0096ff" : "gray",
                }}
                resizeMode="contain"
              />
            ),
          }}
        />
          </Tabs>
      </AuthUserOnly>
    )
}