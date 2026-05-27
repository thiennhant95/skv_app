import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getMessaging, getToken, onMessage, type Messaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyAdZDw7vSlaobnzXO8IeEFQ0FhTM80OoRY",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "life-12909.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "life-12909",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "life-12909.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "460605377609",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:460605377609:web:7f7349d38fdd49b1930398",
};

const VAPID_KEY = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY || "BE8G2Ve4fyOoe1Ve0zuHyHfmrNsDY9fO0tfJqqJtyhFyk0Y5sCTIM-15mIVWgghedOuaqyh4l5KxlGSKDgsWyVw";

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

async function registerAndWaitForFirebaseSw(timeoutMs = 8000): Promise<ServiceWorkerRegistration | undefined> {
  if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) return undefined;

  try {
    const reg = await navigator.serviceWorker.register("/firebase-messaging-sw.js");
    const started = Date.now();

    // Poll until firebase SW becomes active, or timeout
    while (Date.now() - started < timeoutMs) {
      if (reg.active?.scriptURL?.includes("firebase-messaging-sw")) return reg;
      await new Promise((r) => setTimeout(r, 200));
    }

    return undefined;
  } catch {
    return undefined;
  }
}

export async function getFcmToken(): Promise<string | null> {
  if (!messaging) return null;
  if (!VAPID_KEY) return null;

  // Cách 1: Register firebase-messaging-sw.js + đợi nó active, rồi dùng nó
  const fbSw = await registerAndWaitForFirebaseSw();
  if (fbSw) {
    try {
      const token = await getToken(messaging, { vapidKey: VAPID_KEY, serviceWorkerRegistration: fbSw });
      if (token) return token;
    } catch { /* fallback */ }
  }

  // Cách 2: Không truyền SW – để Firebase tự detect
  try {
    const token = await getToken(messaging, { vapidKey: VAPID_KEY });
    if (token) return token;
  } catch { /* fallback */ }

  return null;
}

export function onForegroundMessage(callback: (payload: any) => void): () => void {
  if (!messaging) return () => {};
  const unsubscribe = onMessage(messaging, (payload) => {
    callback(payload);
  });
  return unsubscribe;
}
