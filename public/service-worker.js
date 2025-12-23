const CACHE_NAME = 'smart-school-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/manifest.json',
    '/offline.html'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(urlsToCache);
        })
    );
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

    // Skip non-GET requests
    if (request.method !== 'GET') return;

    // Skip chrome extensions
    if (request.url.includes('chrome-extension')) return;

    event.respondWith(
        caches.match(request).then((response) => {
            // Return cached version if available
            if (response) {
                return response;
            }

            // Fetch from network
            return fetch(request)
                .then((response) => {
                    // Cache successful responses
                    if (!response || response.status !== 200 || response.type === 'basic') {
                        return response;
                    }

                    const responseToCache = response.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(request, responseToCache);
                    });

                    return response;
                })
                .catch(() => {
                    // Return offline page for navigation requests
                    if (request.mode === 'navigate') {
                        return caches.match('/offline.html');
                    }

                    return new Response('Offline', { status: 503 });
                });
        })
    );
});
