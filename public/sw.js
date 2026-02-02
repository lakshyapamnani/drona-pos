// Custom service worker for offline support
self.addEventListener('install', (event) => {
  console.log('Service Worker installing.');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker activating.');
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Let workbox handle the caching
});
