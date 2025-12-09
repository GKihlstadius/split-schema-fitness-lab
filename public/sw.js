const CACHE_VERSION = 'v1-2024-12-09';

self.addEventListener('install', (event) => {
  // Skippa väntan så den nya SW:en kan aktiveras direkt efter skipWaiting-meddelande
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  // Ta kontroll så snabbt som möjligt
  event.waitUntil(self.clients.claim());
});

// Enkel pass-through; ingen asset-caching för att undvika stale content.
self.addEventListener('fetch', () => {
  // Låt nätverket hantera fetchen.
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Exponera version för felsökning
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0]?.postMessage({ version: CACHE_VERSION });
  }
});

