self.addEventListener('push', function(event) {
  const options = {
    body: event.data ? event.data.text() : 'Webber.Tasks Notification',
    icon: '/icon.png',
    badge: '/icon.png'
  };

  event.waitUntil(
    self.registration.showNotification('Webber.Tasks Update', options)
  );
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      if (clientList.length > 0) {
        let client = clientList[0];
        for (let i = 0; i < clientList.length; i++) {
          if (clientList[i].focused) {
            client = clientList[i];
          }
        }
        return client.focus();
      }
      return clients.openWindow('/');
    })
  );
});
