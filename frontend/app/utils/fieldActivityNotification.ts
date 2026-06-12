// // utils/fieldActivityNotification.ts
// import { Platform } from "react-native";
// import * as Notifications from "expo-notifications";

// const FIELD_ACTIVITY_CHANNEL_ID = "field_activity";
// let activeNotificationId: string | null = null;

// export const setupFieldActivityNotification = async () => {
//   if (Platform.OS === "android") {
//     await Notifications.setNotificationChannelAsync(
//       FIELD_ACTIVITY_CHANNEL_ID,
//       {
//         name: "Field Activity",
//         importance: Notifications.AndroidImportance.HIGH,
//         lockscreenVisibility:
//           Notifications.AndroidNotificationVisibility.PUBLIC,
//       }
//     );
//   }

//   const permission = await Notifications.getPermissionsAsync();

//   if (!permission.granted) {
//     await Notifications.requestPermissionsAsync();
//   }
// };

// export const showFieldActivityNotification = async (customerName?: string) => {
//   await setupFieldActivityNotification();

//   if (activeNotificationId) {
//     await Notifications.dismissNotificationAsync(activeNotificationId);
//     activeNotificationId = null;
//   }

//   activeNotificationId = await Notifications.scheduleNotificationAsync({
//     content: {
//       title: "Sales Team Tracker is running",
//       body: customerName
//         ? `Checked in at ${customerName}. Field activity is visible to the company owner.`
//         : "Field activity is visible to the company owner.",
//       data: {
//         screen: "visit",
//       },

//       // Android only: makes notification persistent / not dismissible by swipe.
//       sticky: true,
//     },
//     trigger: {
//       type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
//       seconds: 1,
//       channelId: FIELD_ACTIVITY_CHANNEL_ID,
//     },
//   });
// };

// export const clearFieldActivityNotification = async () => {
//   if (!activeNotificationId) return;

//   await Notifications.dismissNotificationAsync(activeNotificationId);
//   activeNotificationId = null;
// };