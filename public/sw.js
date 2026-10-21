// DivyaJyoti Kalia Panjika 2050 Service Worker
const CACHE_NAME = 'kalia-panjika-v2050-1';
self.addEventListener('install', (e) => {
  self.skipWaiting();
});
self.addEventListener('activate', (e) => {
  e.waitUntil(clients.claim());
});
self.addEventListener('fetch', (e) => {
  // Cache-first or network-first strategy
  e.respondWith(
    caches.match(e.request).then((res) => res || fetch(e.request).catch(() => caches.match('/')))
  );
});
