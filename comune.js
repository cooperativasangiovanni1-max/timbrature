/* ==========================================================================
   COOPERATIVA SAN GIOVANNI — pezzi in comune a tutte le pagine dell'app
   (versione 16)

   - i codici della persona: si leggono dal link e il telefono li ricorda
   - api(): le domande al foglio Gestione ore
   - l'icona sulla schermata Home, con i codici dentro
   Non c'e' niente da configurare qui: gli indirizzi stanno in config.js.
   ========================================================================== */

/* Indirizzo della cartella principale dell'app (dove sta questo file). */
var RADICE = (function () {
  var s = document.currentScript && document.currentScript.src;
  return s ? s.replace(/comune\.js(\?.*)?$/, '') : location.href.replace(/[^\/]*$/, '');
})();


/* ---------------- i codici ----------------
   d = timbrature   (lo stesso nome di prima: i telefoni che timbravano gia' lo hanno)
   o = ore del mese / interventi
   m = deposito
   k = link master                                                            */

var MEMORIA = { d: 'tb.token', o: 'go.ore', m: 'go.dep', k: 'go.master' };

function leggiCodice(q) {
  try { return localStorage.getItem(MEMORIA[q]) || ''; } catch (e) { return ''; }
}
function salvaCodice(q, v) {
  try { if (v) localStorage.setItem(MEMORIA[q], v); else localStorage.removeItem(MEMORIA[q]); } catch (e) {}
}

/* Prende i codici dall'indirizzo (?o=...&d=...&m=...) e li ricorda.
   Accetta anche ?id= dei vecchi link delle ore. */
function codiciDaIndirizzo() {
  var u = new URLSearchParams(location.search), trovati = {};
  ['d', 'o', 'm', 'k'].forEach(function (q) {
    var v = (u.get(q) || '').trim();
    if (v) { salvaCodice(q, v); trovati[q] = v; }
  });
  var id = (u.get('id') || '').trim();
  if (id && !trovati.o) { salvaCodice('o', id); trovati.o = id; }
  return trovati;
}

function codici() { return { o: leggiCodice('o'), d: leggiCodice('d'), m: leggiCodice('m') }; }

/* Il link personale ricostruito dai codici ricordati. */
function linkPersonale() {
  var c = codici(), q = [];
  ['o', 'd', 'm'].forEach(function (k) { if (c[k]) q.push(k + '=' + encodeURIComponent(c[k])); });
  return RADICE + (q.length ? '?' + q.join('&') : '');
}

/* Il manifest scritto nel file non puo' contenere i codici di ognuno:
   lo riscrivo al volo, cosi' l'icona sulla Home apre l'app gia' riconosciuta.
   (Su iPhone conta invece l'indirizzo della pagina: per questo i codici
   restano anche nella barra dell'indirizzo.) */
function manifestPersonale() {
  try {
    var ass = function (f) { return new URL(f, RADICE).href; };
    var m = {
      name: 'Coop San Giovanni', short_name: 'Coop SG',
      start_url: linkPersonale(), scope: RADICE, display: 'standalone', orientation: 'portrait',
      background_color: '#ECE840', theme_color: '#ECE840', lang: 'it',
      icons: [
        { src: ass('icona-192.png'), sizes: '192x192', type: 'image/png', purpose: 'any' },
        { src: ass('icona-512.png'), sizes: '512x512', type: 'image/png', purpose: 'any' },
        { src: ass('icona-maskable-512.png'), sizes: '512x512', type: 'image/png', purpose: 'maskable' }
      ]
    };
    var blob = new Blob([JSON.stringify(m)], { type: 'application/manifest+json' });
    var link = document.querySelector('link[rel="manifest"]');
    if (!link) { link = document.createElement('link'); link.rel = 'manifest'; document.head.appendChild(link); }
    link.href = URL.createObjectURL(blob);
  } catch (e) {}
}

function registraSW() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register(RADICE + 'sw.js', { scope: RADICE }).catch(function () {});
  }
}

function inStandalone() {
  return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
}
function eIphone() { return /iphone|ipad|ipod/i.test(navigator.userAgent); }


/* ---------------- domande al foglio Gestione ore ----------------
   api('ore.carica', { o: ..., mese: ... }).then(function (dati) { ... })
   Se il foglio risponde con un errore, la promessa fallisce con il suo testo. */

function api(azione, dati) {
  var url = (window.CONFIG && CONFIG.GESTIONE) || '';
  if (url.indexOf('https://') !== 0) {
    return Promise.reject(new Error('App non configurata: manca il link di Gestione ore in config.js.'));
  }
  var corpo = JSON.stringify(Object.assign({ azione: azione }, dati || {}));

  var tentativo = new Promise(function (ok, ko) {
    var finito = false;
    var t = setTimeout(function () { if (!finito) { finito = true; ko(errRete('Il foglio non risponde. Riprova.')); } }, 45000);
    fetch(url, { method: 'POST', body: corpo, redirect: 'follow' })
      .then(function (r) { return r.json(); })
      .then(function (r) { if (!finito) { finito = true; clearTimeout(t); ok(r); } })
      .catch(function (e) { if (!finito) { finito = true; clearTimeout(t); ko(errRete('Connessione non riuscita.')); } });
  }).catch(function (e) {
    /* riserva: la stessa domanda dentro l'indirizzo, se non e' troppo lunga.
       Non per le domande che, ripetute, scriverebbero due volte la stessa cosa. */
    if (SENZA_RISERVA[azione]) throw e;
    var q = url + '?azione=' + encodeURIComponent(azione) + '&q=' + encodeURIComponent(JSON.stringify(dati || {}));
    if (q.length > 7000) throw e;
    return jsonp(q);
  });

  return tentativo.then(function (r) {
    if (!r || !r.ok) throw new Error((r && r.errore) || 'Errore sconosciuto.');
    return r.dati;
  });
}

var SENZA_RISERVA = { 'interventi.salva': true, 'master.timbra': true };

/* Codice unico di un salvataggio: se la stessa richiesta arriva due volte,
   il foglio la riconosce e non la scrive di nuovo. */
function codiceUnico() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 8); }

function errRete(testo) { var e = new Error(testo); e.rete = true; return e; }

function jsonp(indirizzo) {
  return new Promise(function (ok, ko) {
    var cb = 'cb' + Math.random().toString(36).slice(2, 10);
    var s = document.createElement('script');
    var chiuso = false;
    function pulisci() { chiuso = true; clearTimeout(t); delete window[cb]; if (s.parentNode) s.remove(); }
    var t = setTimeout(function () { if (!chiuso) { pulisci(); ko(errRete('Il foglio non risponde. Riprova.')); } }, 45000);
    window[cb] = function (d) { if (!chiuso) { pulisci(); ok(d); } };
    s.onerror = function () { if (!chiuso) { pulisci(); ko(errRete('Connessione non riuscita.')); } };
    s.src = indirizzo + '&callback=' + cb + '&_=' + Date.now();
    document.body.appendChild(s);
  });
}


/* ---------------- piccole utilita' ---------------- */

function esc(s) {
  return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
/* 1234.5 -> "1.234,50 €" */
function eur(n) {
  return (Number(n) || 0).toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';
}
/* 12.5 -> "12,5" */
function num(n) {
  return (Number(n) || 0).toLocaleString('it-IT', { maximumFractionDigits: 2 });
}
function plurale(n, uno, tanti) { return n + ' ' + (n === 1 ? uno : tanti); }

/* Plurale delle unita' del deposito: pezzo -> pezzi, flacone -> flaconi, tanica -> taniche */
function plur(u) {
  u = String(u || 'pezzo').trim();
  if (/ca$/.test(u)) return u.slice(0, -1) + 'he';
  if (/[oe]$/.test(u)) return u.slice(0, -1) + 'i';
  if (/a$/.test(u)) return u.slice(0, -1) + 'e';
  return u;
}
/* "1 tanica", "2,5 taniche" */
function quante(n, unita) { return num(n) + ' ' + (Number(n) === 1 ? unita : plur(unita)); }

/* Messaggio in alto che sparisce da solo. Serve un <div id="messaggio">. */
function avvisa(testo, buono) {
  var box = document.getElementById('messaggio');
  if (!box) { alert(testo); return; }
  box.innerHTML = '<div class="avviso' + (buono ? ' ok' : '') + '" role="status">' + esc(testo) + '</div>';
  window.scrollTo(0, 0);
  clearTimeout(avvisa.t);
  avvisa.t = setTimeout(function () { box.innerHTML = ''; }, buono ? 5000 : 9000);
}
