import Expo, { ExpoPushMessage, ExpoPushTicket } from "expo-server-sdk";
import ReqModel from "src/buddy/models/request.model";

export const createRequestToFullfillNotificationMessage = (
  recepient: string,
  request: ReqModel
): ExpoPushMessage => {
  const notif: ExpoPushMessage = {
    to: recepient,
    sound: "default",
    title: "Someone could use a Buddy",
    data: { request },
  };

  return notif;
};

export const sendChunkNotifications = async (
  messages: ExpoPushMessage[]
): Promise<ExpoPushTicket[]> => {
  const expo = new Expo();
  const chunks: ExpoPushMessage[][] = expo.chunkPushNotifications(messages);
  let tickets: ExpoPushTicket[] = [];
  for (let i = 0; i < chunks.length; i++) {
    let ticketChunk = await expo.sendPushNotificationsAsync(chunks[i]);
    tickets.push(...ticketChunk);
  }
  return tickets;
};
