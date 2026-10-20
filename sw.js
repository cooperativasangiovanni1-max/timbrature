/* Service worker: serve solo a far aprire l'app quando manca la connessione.
   Le chiamate al foglio Google NON passano mai di qui: devono sempre andare
   in rete, altrimenti si leggerebbero dati vecchi. */

const CACHE = 'timbrature-v1';
const GUSCIO = [
  './',
  './index.html',
  './manifest.json',
  './icona-192.png',
  './icona-512.png'
];

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE)
      .then(function (c) { return c.addAll(GUSCIO); })
      .then(function () { return self.skipWaiting(); })
      .catch(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (nomi) {
      return Promise.all(nomi.map(function (n) {
        return n === CACHE ? null : caches.delete(n);
      }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (e) {
  const req = e.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  // Google Apps Script, lettore QR, font: sempre dalla rete, mai dalla cache.
  if (url.hostname.indexOf('script.google') >= 0 ||
      url.hostname.indexOf('googleusercontent') >= 0 ||
      url.hostname.indexOf('unpkg.com') >= 0 ||
      url.hostname.indexOf('fonts.') >= 0) {
    return;
  }

  // Il resto (la pagina e le icone): prima la rete, così gli aggiornamenti
  // arrivano subito; la copia salvata entra in gioco solo se la rete manca.
  e.respondWith(
    fetch(req).then(function (ris) {
      if (ris && ris.status === 200 && ris.type === 'basic') {
        const copia = ris.clone();
        caches.open(CACHE).then(function (c) { c.put(req, copia); }).catch(function () {});
      }
      return ris;
    }).catch(function () {
      return caches.match(req).then(function (hit) {
        return hit || caches.match('./index.html');
      });
    })
  );
});
