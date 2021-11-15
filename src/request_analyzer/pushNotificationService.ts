import {
  Expo,
  ExpoPushMessage,
  ExpoPushTicket,
  ExpoPushToken,
} from "expo-server-sdk";

export const sendNotification = () => {
  const expo = new Expo();
  const pushToken: ExpoPushToken = "ExponentPushToken[bT1ALEIq-Gj59dltWPG557]";

  const notif: ExpoPushMessage = {
    to: pushToken,
    sound: "default",
    title: "test notificaiton",
  };

  const notifs: ExpoPushMessage[] = [];
  notifs.push(notif);

  if (Expo.isExpoPushToken(pushToken)) {
    expo.sendPushNotificationsAsync(notifs);
  } else {
    console.log("nah b");
  }
};

export const sendChunkNotifications = () => {};
