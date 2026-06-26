const CACHE_NAME = "aurora-v1";
const IMAGE_CACHE = "aurora-images-v1";
const MAX_IMAGE_CACHE = 100;

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME && key !== IMAGE_CACHE)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (url.hostname === "image.tmdb.org") {
    event.respondWith(
      caches.open(IMAGE_CACHE).then(async (cache) => {
        const cached = await cache.match(request);
        if (cached) return cached;

        try {
          const response = await fetch(request);
          if (response.ok) {
            const keys = await cache.keys();
            if (keys.length >= MAX_IMAGE_CACHE) {
              await cache.delete(keys[0]);
            }
            cache.put(request, response.clone());
          }
          return response;
        } catch {
          return new Response("", { status: 408 });
        }
      })
    );
    return;
  }

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).catch(() =>
        caches.match("/").then((cached) => cached || new Response("Offline", { status: 503 }))
      )
    );
  }
});
