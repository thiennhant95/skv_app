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

async function waitForActive(reg: ServiceWorkerRegistration): Promise<ServiceWorkerRegistration | undefined> {
  if (reg.active) return reg;
  const sw = reg.installing || reg.waiting;
  if (!sw) return undefined;
  if (sw.state === "activated") return reg;
  await new Promise<void>((resolve) => {
    sw.addEventListener("statechange", function handler() {
      if (sw.state === "activated") { sw.removeEventListener("statechange", handler); resolve(); }
    });
  });
  return reg.active ? reg : undefined;
}

async function getSwReg(): Promise<ServiceWorkerRegistration | undefined> {
  if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) return undefined;

  const registrations = await navigator.serviceWorker.getRegistrations();

  // Try to find existing firebase SW
  const existing = registrations.find((r) => r.active?.scriptURL?.includes("firebase-messaging-sw"));
  if (existing?.active) return existing;

  // Try to register firebase SW
  try {
    const reg = await navigator.serviceWorker.register("/firebase-messaging-sw.js");
    const active = await waitForActive(reg);
    if (active) return active;
  } catch {
    // register failed, continue to fallback
  }

  // Fallback: use any active SW (even next-pwa's sw.js)
  const anyActive = registrations.find((r) => r.active);
  return anyActive || undefined;
}

export async function getFcmToken(): Promise<string | null> {
  if (!messaging) return null;
  if (!VAPID_KEY) return null;

  try {
    const swReg = await getSwReg();
    const token = await getToken(messaging, { vapidKey: VAPID_KEY, serviceWorkerRegistration: swReg });
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
