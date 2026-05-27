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

messaging.onBackgroundMessage((payload) => {
  const d = payload.data || {};
  const title = d.title || "SKV CTV";
  const body = d.body || d.message || "";
  const icon = d.icon || "/icons/icon-192x192.png";
  const options = {
    body,
    icon,
    badge: "/icons/icon-72x72.png",
    vibrate: [200, 100, 200],
    requireInteraction: true,
  };
  self.registration.showNotification(title, options);
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const urlToOpen = new URL("/home", self.location.origin).href;
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((windowClients) => {
      const existingClient = windowClients.find((c) => c.url === urlToOpen);
      if (existingClient) {
        existingClient.focus();
      } else {
        clients.openWindow(urlToOpen);
      }
    })
  );
});
