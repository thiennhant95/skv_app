importScripts("https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyAdZDw7vSlaobnzXO8IeEFQ0FhTM80OoRY",
  authDomain: "life-12909.firebaseapp.com",
  projectId: "life-12909",
  storageBucket: "life-12909.firebasestorage.app",
  messagingSenderId: "460605377609",
  appId: "1:460605377609:web:7f7349d38fdd49b1930398",
});

const messaging = firebase.messaging();

self.skipWaiting();

messaging.onBackgroundMessage((payload) => {
  const data = payload.data || {};
  const title = data.title || payload.notification?.title || "SKV CTV";
  const body = data.body || data.message || payload.notification?.body || "";
  const icon = data.icon || payload.notification?.icon || "/icons/icon-192x192.png";

  self.registration.showNotification(title, {
    body,
    icon,
    badge: "/icons/icon-72x72.png",
    vibrate: [200, 100, 200],
    requireInteraction: true,
  });
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes("/home") && "focus" in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) return clients.openWindow("/home");
    })
  );
});
