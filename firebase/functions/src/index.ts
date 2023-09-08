/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import {HttpsError, onRequest} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import {
  AuthBlockingEvent,
  beforeUserCreated} from "firebase-functions/v2/identity";
import {initializeApp} from "firebase-admin/app";
import axios from "axios";

// The Firebase Admin SDK to access Firestore.
// import axios from "axios";

initializeApp();

exports.createUserInLocalDB =
    beforeUserCreated(async (user: AuthBlockingEvent) => {
      try {
        const userData = user.data;
        const providerId = user.additionalUserInfo?.providerId || "";
        logger.log("User", user);
        logger.log("userData", userData);
        logger.log("providerId", providerId);

        const {data} =
            await axios.post(`${process.env.BACKEND_URL}/signup`, {
          displayName: userData.displayName || "",
          email: userData.email,
          firebaseUID: userData.uid,
          providerId: providerId,
            }
        );
        logger.log("Data", data);
        return;
      } catch (error) {
        logger.log("ERROR", error);
        throw new HttpsError("unknown",
          "Unknown error occurred please try again later");
      }
    });

exports.addmessage = onRequest(async (req, res) => {
  // Grab the text parameter.
  const text = req.query.text;
  // Send back a message that we've successfully written the message
  res.json(
    {result: `Message with text query: ${text}, ${process.env.NODE_ENV}.`});
});
