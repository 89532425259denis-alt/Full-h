const CACHE_NAME = 'devo-v2'; // Новая версия для обновления кэша

const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  'https://cdn.tailwindcss.com',
  'https://telegram.org/js/telegram-web-app.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Кэшируем по очереди для надежности
      return Promise.allSettled(
        ASSETS.map(url => cache.add(url).catch(err => console.log('Ошибка:', url)))
      );
    })
  );
});

self.addEventListener('fetch', (event) => {
  // Выключаем кэширование для аналитики и Firebase
  if (event.request.url.includes('firebase') || event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      return cached || fetch(event.request);
    })
  );
});
