import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getMessaging, getToken, onMessage, type Messaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let app: FirebaseApp | null = null;
let messaging: Messaging | null = null;
let initPromise: Promise<boolean> | null = null;

export async function initFirebase(): Promise<boolean> {
  if (app) return true;
  if (!firebaseConfig.apiKey) return false;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    try {
      app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
      messaging = getMessaging(app);
      return true;
    } catch {
      return false;
    }
  })();

  return initPromise;
}

export async function getFcmToken(): Promise<string | null> {
  if (!messaging) return null;
  const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;
  if (!vapidKey) return null;

  try {
    const token = await getToken(messaging, { vapidKey });
    return token || null;
  } catch {
    return null;
  }
}

export function onForegroundMessage(callback: (payload: any) => void): () => void {
  if (!messaging) return () => {};
  const unsubscribe = onMessage(messaging, (payload) => {
    callback(payload);
  });
  return unsubscribe;
}
