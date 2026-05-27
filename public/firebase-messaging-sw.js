importScripts("/sw.js");

self.skipWaiting();

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
