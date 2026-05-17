const CACHE_NAME = 'wavedo-v2';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.svg'
];

self.addEventListener('install', function(event) {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        // Cache the dynamically fetched resources here if needed
        return networkResponse;
      })
      .catch(() => {
        // Fallback to cache
        return caches.match(event.request).then((response) => {
           if (response) {
             return response;
           }
           if (event.request.mode === 'navigate') {
             return caches.match('/');
           }
        });
      })
  );
});

self.addEventListener('push', function(event) {
  const options = {
    body: event.data ? event.data.text() : 'Wavedo Notification',
    icon: '/favicon.svg',
    badge: '/favicon.svg'
  };

  event.waitUntil(
    self.registration.showNotification('Wavedo Updates', options)
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

self.addEventListener('sync', function(event) {
  if (event.tag === 'sync-wavedo') {
    event.waitUntil(
      Promise.resolve() // Add background sync logic when an API exists
    );
  }
});
