// Service worker del Jardinero del Big Bang.
// Estrategia: stale-while-revalidate — responde de cache al instante y
// actualiza en segundo plano (la nueva versión aplica en la siguiente visita).
'use strict';
const CACHE = 'bbg-20260703180331';
const ASSETS = ['/', '/manifest.webmanifest', '/favicon.svg',
  '/icon-192.png', '/icon-512.png', '/apple-touch-icon.png'];

self.addEventListener('install', e=>{
  e.waitUntil(
    caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())
  );
});

self.addEventListener('activate', e=>{
  e.waitUntil(
    caches.keys()
      .then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))))
      .then(()=>self.clients.claim())
  );
});

self.addEventListener('fetch', e=>{
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  e.respondWith(
    caches.open(CACHE).then(async c=>{
      const cached = await c.match(req);
      const net = fetch(req).then(res=>{
        if (res.ok) c.put(req, res.clone());
        return res;
      }).catch(()=>cached);
      return cached || net;
    })
  );
});
