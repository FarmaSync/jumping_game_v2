const CACHE_NAME = 'pastel-jumping-game-v1';
const URLsToCache = [
    './',
    './index.html',
    './css/styles.css',
    './js/main.js',
    './images/icons/icon-192x192.png',
    './images/icons/icon-512x512.png'
    // Add any other assets you want to cache
];

// Install event - caching assets
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                return cache.addAll(URLsToCache);
            })
    );
});

// Activate event - cleaning up old caches
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.filter(cacheName => {
                    // Return true if you want to remove this cache
                    return cacheName !== CACHE_NAME;
                }).map(cacheName => caches.delete(cacheName))
            );
        })
    );
});

// Fetch event - serving cached content when offline
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Cache hit - return the response
                if (response) {
                    return response;
                }
                return fetch(event.request);
            })
    );
});
