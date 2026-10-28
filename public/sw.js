// NagrikSeva AI Service Worker (Enables 1-Click Native PWA Install on Chrome/Android/Desktop)
const CACHE_NAME = 'nagrikseva-v2.5.1';
const STATIC_ASSETS = [
  '/manifest.json',
  '/icon.svg',
  '/icon-192.png',
  '/icon-512.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch(() => {});
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  let url;
  try {
    url = new URL(event.request.url);
  } catch {
    return;
  }

  // 1. NEVER intercept cross-origin requests (e.g. translate.google.com, fonts, external APIs)
  if (url.origin !== self.location.origin) {
    return;
  }

  // 2. Never intercept Next.js HMR/chunks or API routes
  if (url.pathname.startsWith('/_next/') || url.pathname.startsWith('/api/')) {
    return;
  }

  // 3. On localhost, pass straight through to network and guarantee a valid Response fallback
  if (url.hostname === 'localhost' || url.hostname === '127.0.0.1') {
    event.respondWith(
      fetch(event.request).catch(async () => {
        const cached = await caches.match(event.request);
        return cached || new Response('', { status: 204 });
      })
    );
    return;
  }

  // 4. Production same-origin static assets with guaranteed Response fallback
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const clone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone)).catch(() => {});
        }
        return networkResponse;
      })
      .catch(async () => {
        const cachedResponse = await caches.match(event.request);
        if (cachedResponse) return cachedResponse;
        if (event.request.mode === 'navigate') {
          const rootMatch = await caches.match('/');
          if (rootMatch) return rootMatch;
        }
        return new Response('', { status: 204 });
      })
  );
});
