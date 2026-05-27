try {
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
    const title = d.title || payload.notification?.title || "SKV CTV";
    const body = d.body || d.message || payload.notification?.body || "";
    const icon = d.icon || payload.notification?.icon || "/icons/icon-192x192.png";

    self.registration.showNotification(title, {
      body,
      icon,
      badge: "/icons/icon-72x72.png",
      vibrate: [200, 100, 200],
      requireInteraction: true,
    });
  });
} catch (e) {
  // Fallback: native push handler khi Firebase compat SDK không load được (iOS)
  self.addEventListener("push", (event) => {
    let data = { title: "SKV CTV", body: "" };
    try {
      if (event.data) {
        const json = event.data.json();
        data = {
          title: json.notification?.title || json.data?.title || json.title || data.title,
          body: json.notification?.body || json.data?.body || json.data?.message || json.body || "",
        };
      }
    } catch {}

    event.waitUntil(
      self.registration.showNotification(data.title, {
        body: data.body,
        icon: "/icons/icon-192x192.png",
        badge: "/icons/icon-72x72.png",
        vibrate: [200, 100, 200],
        requireInteraction: true,
      })
    );
  });
}

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
      const home = clients.find((c) => c.url.includes("/home"));
      if (home) home.focus();
      else clients.openWindow("/home");
    })
  );
});
