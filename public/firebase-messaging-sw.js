self.skipWaiting();
self.clientsClaim();

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

  const options = {
    body: data.body,
    icon: "/icons/icon-192x192.png",
    badge: "/icons/icon-72x72.png",
    vibrate: [200, 100, 200],
    requireInteraction: true,
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((windowClients) => {
      const existingClient = windowClients.find((c) => c.url.includes("/home"));
      if (existingClient) existingClient.focus();
      else clients.openWindow("/home");
    })
  );
});
