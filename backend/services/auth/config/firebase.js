import admin from "firebase-admin";
import { cert } from "firebase-admin/app";

if (!process.env.FIREBASE_SERVICE_ACCOUNT) {
  throw new Error("FIREBASE_SERVICE_ACCOUNT is not set");
}

const serviceAccount = JSON.parse(
  process.env.FIREBASE_SERVICE_ACCOUNT
);

export const app = admin.initializeApp({
  credential: cert(serviceAccount),
});