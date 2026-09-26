// NagrikSeva AI Service Worker
const CACHE_NAME = 'nagrikseva-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Stale-while-revalidate or network-first for seamless user experience
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
