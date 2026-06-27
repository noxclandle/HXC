const CACHE_NAME = 'hxc-cache-v2';

const ASSETS_TO_CACHE = [
  '/',
  '/hub',
  '/manifest.json',
  '/logo.png',
  '/globals.css',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // API Caching Strategy: Stale-While-Revalidate
  // Cache /api/profile/ (Public Profiles)
  if (url.pathname.startsWith('/api/profile/')) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.match(request).then((response) => {
          const fetchPromise = fetch(request).then((networkResponse) => {
            if (networkResponse.ok) {
              cache.put(request, networkResponse.clone());
            }
            return networkResponse;
          }).catch(() => {
            // If network fails, the matched response will be returned
          });
          return response || fetchPromise;
        });
      })
    );
    return;
  }

  // Page and Asset Strategy: Network First, Fallback to Cache
  event.respondWith(
    fetch(request).catch(() => {
      return caches.match(request);
    })
  );
});
