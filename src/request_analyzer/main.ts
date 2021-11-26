import environmentConfig from "../common/config/environment.config";
import { Pool } from "pg";
import ReqModel from "../buddy/models/request.model";
import { Mutex } from "async-mutex";
import {
  BuddyWithExpoToken,
  cancelRequest,
  getBuddiesWithExpoTokens,
  getUnfulfilledRequests,
} from "./dbClient";
import Expo, {
  ExpoPushMessage,
  ExpoPushTicket,
  ExpoPushSuccessTicket,
} from "expo-server-sdk";
import {
  createRequestToFullfillNotificationMessage,
  sendChunkNotifications,
} from "./pushNotificationService";

const START_UP_TIME = new Date().getTime();

const log = (message: string) => {
  const time = (new Date().getTime() - START_UP_TIME) / 1000;
  console.log(`[${time}s] ${message}`);
};

(async () => {
  log("Setting up DB.");
  const db: Pool = new Pool(environmentConfig.dbconfig);

  const mutex = new Mutex();

  // BACKGROUND REFRESH OF BUDDIES
  log("Getting initial list of buddies");
  let buddiesWithExpoToken: BuddyWithExpoToken[] =
    await getBuddiesWithExpoTokens(db);
  setInterval(() => {
    getBuddiesWithExpoTokens(db).then((buddies: BuddyWithExpoToken[]) => {
      log("Refreshing buddy list.");
      buddiesWithExpoToken = buddies;
    });
    // Runs every 20 seconds.
  }, 1000 * 20);

  // BACKGROUND REFRESH OF UNFULLFILLED REQUESTS
  log("Getting initial list of requests");
  let unfullfilledRequests: ReqModel[] = await getUnfulfilledRequests(db);
  let requestsSentInNotifications: ReqModel[] = [];
  setInterval(() => {
    log("Refreshing unfullfilled requests list.");
    getUnfulfilledRequests(db).then((requests: ReqModel[]) => {
      unfullfilledRequests = requests;
    });
    // Runs every 1 second.
  }, 1000 * 1);

  // ANALYZE REQUEST LIST
  setInterval(() => {
    let waitingForNotification = unfullfilledRequests.filter(
      (req: ReqModel) =>
        requestsSentInNotifications.find((req2) => req.rq_id === req2.rq_id) ===
        undefined
    );

    log(
      `Analyzing requests. ${waitingForNotification.length} waiting to be pushed.`
    );

    // Store the messages to send. Each of these equals one push notification per buddy per request.
    let messages: ExpoPushMessage[] = [];

    for (let i = 0; i < waitingForNotification.length; i++) {
      const request = waitingForNotification[i];

      for (let j = 0; j < buddiesWithExpoToken.length; j++) {
        const buddy = buddiesWithExpoToken[j];
        // Skip sending notification to buddy who requested help
        if (buddy.r_id === request.r_id) continue;

        // Check if ExpoPushToken is valid
        const pushToken = buddy.expo_push_token;
        if (!Expo.isExpoPushToken(pushToken)) {
          console.error(
            `Push token ${pushToken} is not a valid Expo push token`
          );
          continue;
        }

        log(
          "Creating Push Notification for " +
            pushToken +
            " on request " +
            request.rq_id
        );

        // Add to list of push notifications to send
        messages.push(
          createRequestToFullfillNotificationMessage(pushToken, request)
        );
      }
      mutex.runExclusive(() => {
        log("Got mutex key for request notifications sent!");
        requestsSentInNotifications.push(request);
      });
    }

    // Send push notifications
    if (messages.length > 0) {
      sendChunkNotifications(messages).then((tickets: ExpoPushTicket[]) =>
        tickets.forEach((ticket: ExpoPushTicket) => {
          let t = ticket as ExpoPushSuccessTicket;
          if (t.id && t.status) {
            log(`Got ticket ID: ${t.id} with status ${t.status}`);
          }
        })
      );
    }
    // Runs every 2 seconds.
  }, 1000 * 2);

  // cancel all unfullfilled requests if the threshold time has passed
  // setInterval(() => {
  //   log("Cancelling unfullfilled requests exceeding 1h of wait time");
  //   for (let i = 0; i < unfullfilledRequests.length; i++) {
  //     const timeWaiting =
  //       new Date().getTime() -
  //       new Date(unfullfilledRequests[i].request_date).getTime();

  //     console.log(new Date(unfullfilledRequests[i].request_date).getTime());
  //     console.log("TimeWaiting: " + timeWaiting);
  //     console.log("THRESHOLD = " + 10 * 1000 * 30);

  //     // Need to change this later to an hour (or any other interval)
  //     if (timeWaiting >= 10 * 1000 * 30) {
  //       log("Cancelling " + unfullfilledRequests[i].rq_id!);
  //       // update request to cancel
  //       cancelRequest(db, unfullfilledRequests[i].rq_id!).then(
  //         (success) => {
  //           mutex.runExclusive(() => {
  //             log("Got mutex key for deleting cancelled requests from list!");
  //             log(`Cancelling request ${unfullfilledRequests[i].rq_id}`);
  //             // delete request in notif sent array
  //             const index = requestsSentInNotifications.indexOf(
  //               unfullfilledRequests[i]
  //             );
  //             if (index > -1) {
  //               requestsSentInNotifications.splice(index, 1);
  //             }
  //           });

  //           // TODO send notif to requester
  //         },
  //         (err) => log(err)
  //       );
  //     }
  //   }
  //   // Runs every 10 seconds.
  // }, 1000 * 10);
})();
