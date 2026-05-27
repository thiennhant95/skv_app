self.addEventListener("push", (event) => {
  let data = { title: "SKV CTV", body: "", icon: "/icons/icon-192x192.png" };
  try {
    if (event.data) {
      const json = event.data.json();
      data = {
        title: json.notification?.title || json.data?.title || json.title || data.title,
        body: json.notification?.body || json.data?.body || json.data?.message || json.body || "",
        icon: json.notification?.icon || json.data?.icon || data.icon,
      };
    }
  } catch {}

  const options = {
    body: data.body,
    icon: data.icon,
    badge: "/icons/icon-72x72.png",
    vibrate: [200, 100, 200],
    requireInteraction: true,
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
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
