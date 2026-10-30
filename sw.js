/* Service worker dell'app: serve solo a farla aprire anche senza campo
   (per esempio per timbrare in un seminterrato) e a installarla sulla Home.
   Le chiamate ai fogli Google NON passano mai di qui: vanno sempre in rete,
   altrimenti si leggerebbero dati vecchi. */

const CACHE = 'coop-v16';
const GUSCIO = [
  './', './index.html', './config.js', './comune.js', './comune.css', './manifest.json',
  './logo.png', './icona-192.png', './icona-512.png', './icona-maskable-512.png', './apple-touch-icon.png',
  './timbra/', './timbra/index.html',
  './ore/', './ore/index.html', './ore/interventi.html',
  './deposito/', './deposito/index.html'
];

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE)
      .then(function (c) { return c.addAll(GUSCIO); })
      .then(function () { return self.skipWaiting(); })
      .catch(function () { return self.skipWaiting(); })
  );
});

/* cancella le copie vecchie, compresa quella della prima app delle timbrature */
self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (nomi) {
      return Promise.all(nomi.map(function (n) { return n === CACHE ? null : caches.delete(n); }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (e) {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  /* Google Apps Script, lettore QR, font: sempre dalla rete, mai dalla cache */
  if (url.origin !== self.location.origin) return;

  /* le pagine e le icone: prima la rete, cosi' gli aggiornamenti arrivano
     subito; la copia salvata serve solo quando la rete manca */
  e.respondWith(
    fetch(req).then(function (ris) {
      if (ris && ris.status === 200 && ris.type === 'basic') {
        const copia = ris.clone();
        caches.open(CACHE).then(function (c) { c.put(req, copia); }).catch(function () {});
      }
      return ris;
    }).catch(function () {
      return caches.match(req, { ignoreSearch: true }).then(function (hit) {
        return hit || caches.match('./index.html');
      });
    })
  );
});
