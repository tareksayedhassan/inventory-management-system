// public/sw.js
self.addEventListener("push", (event) => {
  if (!event.data) return;

  const payload = event.data.json();
  const { title, body, icon, data } = payload;

  event.waitUntil(
    self.registration
      .showNotification(title, {
        body,
        icon,
        data,
      })
      .then(() => {
        console.log("Web push delivered.");
      })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(clients.openWindow(event.notification.data.url || "/"));
});
