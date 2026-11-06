# Cooperativa San Giovanni — l'app unica

Una sola app per tutti, con il logo della cooperativa. Dentro ognuno trova solo quello che lo riguarda:

| Parte | Cosa fa | Chi la vede |
|---|---|---|
| **Timbra** | entrata e uscita dal cantiere, con QR e posizione | tutti (tranne chi ha `NO` nella colonna Timbra) |
| **Ore del mese** | le ore timbrate sono già proposte: le controlla, le corregge e le invia | tutti |
| **Interventi** | al posto di Ore del mese, per chi lavora a chiamata | chi ha `interventi` nella colonna Pagina; Enzo Durante anche con la casella vuota |
| **Deposito** | segna il materiale preso, e per quale lavoro | tutti |
| **Link master** | per te e il titolare: vede e corregge tutto | solo chi ha il link master |

In busta vanno **le ore confermate dal dipendente**. Se sono diverse da quelle timbrate, nel link master le vedi segnate in arancione e le puoi correggere.

---

## Come è fatta

Tre pezzi, come prima:

1. **Il foglio Gestione ore** con il suo programma (`Codice.gs`, `App.gs`, `Deposito.gs`). È l'archivio di ore, paghe e deposito, e c'è **l'unica lista dei dipendenti**.
2. **Il foglio Timbrature** con il suo programma (`Codice.gs`). Il suo foglio DIPENDENTI adesso è una copia: lo aggiorna da solo Gestione ore.
3. **Le pagine su GitHub**, in questo stesso repository `timbrature`. L'indirizzo non cambia, quindi **i QR già attaccati nei cantieri continuano a funzionare**.

```
timbrature/            (questo repository)
  index.html           la home con il logo
  config.js            I DUE LINK /exec: l'unico file da modificare
  comune.js, comune.css, sw.js, manifest.json, logo e icone
  timbra/              la timbratura (la pagina di prima)
  ore/                 ore del mese e interventi
  deposito/            il deposito
  master/              il link master
```

Ogni persona ha **tre codici**, uno per parte, tutti nel foglio Dipendenti di Gestione ore: `Codice` (ore), `Codice timbrature`, `Codice deposito`. Il link personale li contiene tutti e tre: per il dipendente è un link solo.

---

## Installazione (una volta sola, circa 40 minuti)

### 1. Gestione ore: il codice

1. Apri il foglio Gestione ore, **Estensioni ▸ Apps Script**.
2. In `Codice.gs` cancella tutto e incolla il nuovo `Codice.gs`.
3. **+** accanto a *File* ▸ **Script** ▸ chiamalo `App` ▸ incolla `App.gs`.
4. **+** ▸ **Script** ▸ chiamalo `Deposito` ▸ incolla `Deposito.gs`.
5. Le pagine HTML che ci sono già (`Pagina`, `Interventi`, `Cruscotto`) **lasciale**: servono ai link vecchi finché non mandi quelli nuovi.
6. Salva. **Deploy ▸ Gestisci deployment ▸ matita ▸ Versione: Nuova versione ▸ Esegui il deployment**. Se Google chiede di autorizzare di nuovo, accetta come la prima volta.
7. Copia l'**URL dell'app web** (finisce con `/exec`): ti serve al passo 3.
8. Torna al foglio e **ricaricalo (F5)**. Compaiono i fogli *Deposito prodotti* e *Deposito movimenti*, e in Dipendenti le colonne *Timbra*, *Codice timbrature*, *Codice deposito*.

### 2. Timbrature: il codice

1. Apri il foglio Timbrature, **Estensioni ▸ Apps Script**.
2. In `Codice.gs` cancella tutto e incolla il nuovo `Codice.gs` (cambia poco: ignora le timbrature annullate dall'ufficio).
3. Salva e **Gestisci deployment ▸ matita ▸ Nuova versione**. Il link `/exec` resta lo stesso di prima.

### 3. GitHub: le pagine

1. Apri `config.js` con il Blocco note e incolla i due link `/exec`:
   - `TIMBRATURE`: quello che prima stava in `index.html`, riga `API_URL`;
   - `GESTIONE`: quello del passo 1.
2. Nel repository `timbrature` su GitHub: **Add file ▸ Upload files** e trascina **tutto il contenuto** della cartella `github` (file e cartelle insieme). I file con lo stesso nome vengono sostituiti. **Commit changes**.
3. Dopo un paio di minuti la nuova home è online allo stesso indirizzo di prima.

### 4. Collega le timbrature

Nel foglio Gestione ore: **menu Gestione ore ▸ Collega le timbrature (una volta sola)**. Incolla l'indirizzo del foglio Timbrature (dalla barra del browser). I due fogli devono essere dello stesso account Google, oppure il file Timbrature condiviso con te come editor.

Fallo **prima** di *Crea i link personali*.

Il comando abbina le persone (anche se scritte un po' diverse, come *Samatha* e *Samantha*) e i cantieri (il codice del QR finisce in Commesse, colonna *Codice timbrature*). Quello che non riesce ad abbinare lo trovi nel foglio **Collegamento timbrature**, con scritto cosa fare. Si può rilanciare quando vuoi: non tocca quello che è già collegato.

### 5. Porta il deposito

**Menu Gestione ore ▸ Importa il vecchio inventario (una volta sola)** e incolla l'indirizzo del vecchio file Inventario. Porta qui i prelievi del Google Form (con i nomi riconosciuti anche se scritti al contrario), gli ordini arrivati e la giacenza di oggi.

Poi **fai un conteggio vero dello scaffale** dal link master (Deposito ▸ Fai un conteggio) e **chiudi il Google Form** (nel Form: Risposte ▸ togli *Accetta risposte*).

### 6. Link personali e link master

1. **Menu ▸ Crea i link personali**: incolla l'indirizzo GitHub, per esempio `https://nome.github.io/timbrature/`. Crea i codici che mancano, scrive i link nuovi e aggiorna il file Timbrature.
2. **Menu ▸ Crea il link master**: è uno solo, per te e per il titolare. Aprilo dal telefono e aggiungilo alla schermata Home.
3. Prova tu per primo: apri il link personale di qualcuno da un telefono, controlla le tre parti, poi mandalo.
4. I link si mandano comodamente dal link master, scheda **Link**: c'è il pulsante WhatsApp con il messaggio già scritto.

---

## Ogni giorno, ogni mese

| Cosa | Dove |
|---|---|
| Un dipendente nuovo | Gestione ore ▸ *Aggiungi un dipendente*. È già anche nelle timbrature, con i tre codici. Poi i suoi lavori in Assegnazioni |
| Qualcuno che non deve timbrare | Dipendenti, colonna *Timbra* = NO, poi *Crea i link personali* |
| Uscita dimenticata, turno da aggiungere | Link master ▸ Timbrature ▸ *Correggi* o *Aggiungi un turno* |
| Ore o prezzi da correggere | Link master ▸ Dipendenti ▸ apri le persone ▸ cambia tutte le caselle che vuoi (restano in giallo) ▸ **Salva tutto** nella barra in basso (o la Scheda, come prima) |
| Il dipendente vede le tue correzioni? | Sì: nella sua pagina compaiono con il tuo valore e la scritta *corretto dall'ufficio*, e lui non le può più cambiare |
| Compensi fissi del mese | Si scrivono da soli all'inizio del mese per tutti i dipendenti attivi, anche per chi non apre mai l'app. Per togliere un fisso in un mese mettilo a **0** dal master. Se aggiungi un fisso in Assegnazioni a mese iniziato: menu *Prepara il mese* |
| Busta pagata | Link master ▸ Dipendenti ▸ la spunta a sinistra del nome. Si salva subito nel foglio *Pagamenti*, con l'importo di quel momento: se poi il netto cambia, il master scrive "pagati X, ora Y". *Solo da pagare* mostra chi manca |
| Bonifici dai cedolini | Link master ▸ Dipendenti ▸ *Bonifici dal PDF dei cedolini*: scegli prima il mese giusto, poi il PDF del consulente. La pagina trova persona e netto, tu controlli la tabella e premi *Scrivi*. Il PDF resta sul tuo dispositivo: al foglio vanno solo nomi e importi |
| Bonifico già fatto | Link master ▸ Dipendenti ▸ *Da togliere dalla busta* (o il foglio Paghe, come prima) |
| Arriva un ordine | Link master ▸ Deposito ▸ *Registra un arrivo* (quantità come le compri: taniche, cartoni...) |
| Hai contato lo scaffale | Link master ▸ Deposito ▸ *Fai un conteggio* |
| Prodotto nuovo | Link master ▸ Deposito ▸ *Aggiungi un prodotto*, o una riga in *Deposito prodotti* |
| Quando ordinare | Link master ▸ Deposito: *da ordinare* quando mancano meno di 3 settimane, o sotto la scorta minima |

Le timbrature corrette dall'ufficio non si cancellano mai: quelle sbagliate restano nel foglio Timbrature con `TIPO = ANNULLATA`, quelle aggiunte hanno `ESITO = UFFICIO`.

---

## Se modifichi il codice

- **Apps Script**: dopo aver salvato, *Gestisci deployment ▸ matita ▸ Nuova versione*. Mai *Nuovo deployment*: cambierebbe il link `/exec`.
- **GitHub**: carica il file cambiato; il telefono lo vede al primo avvio con la linea.

---

# Timbrature in dettaglio

## Le coordinate non le scrivi tu: le impara il sistema

Inserire a mano 107 coppie di coordinate sarebbe mezza giornata di lavoro, e per molti condomini non sapresti nemmeno dove sta esattamente l'ingresso. Non serve.

**Dal primo giorno**, anche con le coordinate vuote, ogni timbratura registra comunque la posizione del telefono. Due menu lavorano su quei dati:

**⏱ Timbrature ▸ Aggiungi le vie alle timbrature**
Trasforma le coordinate in indirizzi leggibili e li scrive nella colonna `VIA` del foglio `TIMBRATURE`: *Via Bellaria 4, Baronissi*. È esattamente quello che chiedevi — tu leggi la via e capisci dove stavano. Lanciala quando vuoi, anche una volta al mese. Elabora 300 righe per volta per non esaurire la quota gratuita di Google (1.000 indirizzi al giorno; se hai Workspace, 10.000).

**⏱ Timbrature ▸ Impara le posizioni dalle timbrature**
Questa è la parte interessante. Dopo che su un cantiere si è timbrato almeno **4 volte**, il sistema calcola da solo dov'è e scrive `LAT`, `LNG` e un raggio adatto nel foglio `LAVORI`.

Usa la **mediana** delle posizioni, non la media: se una timbratura è stata presa da casa, la media si sposterebbe di chilometri, la mediana no. Nel collaudo, su sei timbrature corrette più una presa a 12 km di distanza, la posizione dedotta è risultata esatta al metro.

Scrive solo dove le coordinate mancano. Dove ci sono già, non tocca niente e ti segnala nel foglio `POSIZIONI_IMPARATE` se le timbrature raccontano una storia diversa — utile per scoprire un indirizzo sbagliato.

Il risultato è che il controllo fuori zona **si accende da solo**, cantiere per cantiere, man mano che i dati si accumulano. Rilanciala ogni tanto: più timbrature ci sono, più le posizioni diventano precise.

---

## Attenzione: 56 cantieri su 107 sono a fisso mensile

È la cosa più importante emersa dal tuo file assegnazioni, e cambia a cosa serve questo sistema.

| Come viene pagato | Cantieri | Cosa significano le ore timbrate |
|---|---|---|
| `FISSO` — fisso mensile | 56 | Il compenso **non dipende** dalle ore. Servono a dimostrare che il lavoro è stato fatto. |
| `ORE` — a ore | 43 | Sono **le ore da conteggiare**: queste sì finiscono nei calcoli delle paghe. |
| `INTERVENTI` — a intervento | 3 | Conta **quante volte** si è andati, non quanto si è stati. |
| *(vuoto)* | 5 | I cinque senza assegnazione, da decidere. |

Se sommassi tutte le ore del mese otterresti un numero che per metà non c'entra niente con le buste paga. Per questo il **report mensile è diviso in blocchi**: il primo è "A ORE — queste sono le ore da conteggiare", e sotto vengono le altre, etichettate per quello che sono.

Sulle righe a fisso mensile le ore restano comunque utili per due cose: dimostrare al condominio che il servizio è stato svolto, e capire se un contratto a prezzo fisso ti sta rendendo o ti sta costando.

**Un caso da chiarire: Banca Montepruno.** Nel tuo file risulta *a ore* per Marianna Nicodemo e *a fisso mensile* per Michela Della Monica. L'ho messo come `ORE`. Se è sbagliato, correggi la colonna `COMPENSO` nel foglio: una modifica fatta a mano lì non viene più sovrascritta dalle importazioni successive.

---

## Eva Coda e Antonietta De Luca lavorano insieme

Hanno gli stessi **otto** cantieri, identici: Anas Scala A/B, Capacchione, Magnolia A e B, Parco Madrilena, Torre Chiara, De Rosa, Parco Bellaria, Studio Soglia.

Le ho attivate entrambe, perché l'assegnazione è solo un filtro di visibilità e non costa nulla. Ma vale la pena decidere come volete procedere:

- **Timbrano tutte e due**, ognuna dal proprio telefono. Tre secondi a testa, e ciascuna ha le sue ore registrate a suo nome. È quello che consiglio: se un giorno una delle due non c'è, i dati restano giusti da soli.
- **Timbra una sola per entrambe.** Più comodo, ma il registro dice che ha lavorato una persona sola. Se serve, posso aggiungere una modalità "squadra" in cui una timbratura ne scrive due — dimmelo e la faccio. L'avvertenza è che il giorno in cui non sono insieme e nessuno se ne ricorda, le ore dell'altra risultano lavorate lo stesso.

---

## Ogni fine mese

1. **⏱ Timbrature ▸ 3. Ricalcola ore e sessioni** — accoppia entrate e uscite nella scheda `SESSIONI`. Guarda la colonna `NOTE`: ci trovi *USCITA MANCANTE*, *ANCORA APERTA*, *durata anomala*, *fuori zona*, *registrata offline*. Sono le cose da chiarire prima di pagare.
2. **⏱ Timbrature ▸ 4. Report mensile** — scrivi il mese (es. `10/2026`) e ottieni le ore per dipendente e per cantiere, in decimali e in ore/minuti, **divise per tipo di compenso**. Il primo blocco, *A ORE*, è quello che serve per le paghe: da lì i numeri passano al file Gestione Ore. I blocchi sotto sono ore di controllo.

---

## Le impostazioni (scheda CONFIG)

| Chiave | Cosa fa | Consiglio |
|---|---|---|
| `RAGGIO_DEFAULT_M` | Tolleranza in metri se non specificata sul cantiere | 150 |
| `PRECISIONE_MAX_M` | Oltre questa imprecisione la timbratura è marcata "GPS IMPRECISO" | 250 |
| `BLOCCA_FUORI_ZONA` | `SI` rifiuta la timbratura fuori raggio | **`NO` per i primi mesi** |
| `BLOCCA_SENZA_GPS` | `SI` rifiuta se il telefono non dà la posizione | `NO` all'inizio |
| `MINUTI_MIN_TRA_TIMBRATURE` | Evita i doppi tocchi | 2 |
| `RICHIEDI_PIN` | `SI` aggiunge il PIN oltre al link | vedi sotto |
| `PERMETTI_LAVORI_EXTRA` | `SI` consente lavori non in elenco | `SI` |
| `PERMETTI_TIMBRATURE_OFFLINE` | `SI` tiene in coda le timbrature prese senza campo | `SI` |

Il controllo fuori zona funziona solo sui cantieri che hanno le coordinate. Finché un cantiere non le ha, le sue timbrature vengono registrate senza verifica della distanza — un motivo in più per lanciare ogni tanto *Impara le posizioni*.

**Perché tenere `BLOCCA_FUORI_ZONA` su `NO` all'inizio.** Per i primi mesi registra tutto e limitati a segnalare. Poi guarda la colonna `DISTANZA_M` nella scheda `TIMBRATURE` e vedi i numeri veri dei tuoi cantieri: scoprirai che in certi punti il GPS sbaglia sistematicamente. A quel punto tari i raggi uno per uno e solo dopo, se serve, attivi il blocco. Se lo accendi il primo giorno rischi di lasciare fuori chi sta davvero lavorando, e il sistema perde credibilità subito.

---

## Quando qualcosa non va

**L'app non chiede mai la posizione.** Il permesso è stato negato una volta e il browser se lo ricorda. Android: Chrome ▸ tre puntini ▸ Impostazioni ▸ Impostazioni sito ▸ Posizione ▸ trova l'indirizzo e metti Consenti. iPhone: Impostazioni ▸ Safari ▸ Posizione ▸ Chiedi, e controlla che Impostazioni ▸ Privacy ▸ Localizzazione ▸ Safari sia attivo.

**Dice "Link non riconosciuto".** Il telefono ha perso la memoria: dati del browser cancellati, oppure ha usato la navigazione anonima. Rimanda il link personale (dal link master, scheda Link).

**Su iPhone l'app installata chiede il link ogni volta.** È stata aggiunta alla Home prima di aprire il link personale. Si apre il link in Safari, si rimuove l'icona e si rifà *Aggiungi a Home*.

**Il dipendente cambia telefono.** Rimandagli lo stesso link personale. Non serve rigenerare niente.

**"QR non riconosciuto".** Il codice non esiste più nella scheda `LAVORI`, oppure hai cambiato `URL_APP` dopo aver stampato i QR. Nel secondo caso vanno ristampati.

**La pagina resta bianca o dice "App non configurata".** Quasi sempre in `config.js` manca uno dei due link `/exec`, oppure hai fatto un *Nuovo deployment* invece di una *Nuova versione*, e il link è cambiato.

**Una voce del menu ⏱ Timbrature non c'è.** Il menu si ricostruisce solo quando apri il foglio: salva in Apps Script, torna al foglio e premi **F5**. Il deploy non serve a questo. Se manca solo *Importa dipendenti e lavori*, controlla di aver salvato la versione aggiornata di `Codice.gs`.

**Clicco "Importa dipendenti e lavori" e dice che manca il file.** Hai incollato `Codice.gs` ma non `Dati-iniziali.gs`. Sono due file distinti nello stesso progetto Apps Script: premi **+** accanto a *File ▸ Script*, chiamalo `Dati-iniziali`, incolla, salva e ricarica il foglio.

**Ho modificato il codice e la pagina dei dipendenti non cambia.** Lì sì che serve il deployment con **Nuova versione** (nota al passo 2). Vale solo per la pagina, mai per i menu del foglio.

**Ho aggiornato le pagine su GitHub ma il telefono mostra la versione vecchia.** È la copia salvata per l'uso offline. Si risolve chiudendo e riaprendo l'app con la linea attiva; se insiste, dal browser si svuota la cache del sito.

**Le ore non tornano.** Lancia *Ricalcola ore e sessioni* e leggi la colonna `NOTE`: quasi sempre c'è un'uscita mancante.

---

## Perché il QR serve davvero, e la posizione da sola non basta

Nel tuo elenco **Parco Bellaria** compare quattro volte: il condominio, la spazzatura di 1 e 2, il garage di 1, il garage di 2. **Anas** due volte (Scala A/B e Scala C). **Aufiero** quattro. **Montepruno** due, banca e bancomat. **Excursus** e **Hce** due ciascuno.

Sono lavori diversi, con ore diverse, **nello stesso punto esatto**. Il GPS in città sbaglia di 20-80 metri: non distinguerà mai il garage 1 dal garage 2 dello stesso palazzo. Nemmeno la via li distingue — è la stessa, e infatti nel collaudo entrambi i garage risultano in *Via Bellaria 4*.

Per questo i due mezzi fanno due lavori diversi:

- **il QR dice *quale* lavoro** — lo sa perché è attaccato a quella porta e a nessun'altra;
- **il GPS dice *se ci sei*** — conferma che il telefono è lì davvero.

Un riconoscimento automatico basato solo sulla posizione, nel tuo caso, sbaglierebbe su una ventina di lavori su 107. Non è un dettaglio da sistemare dopo: è il motivo per cui il QR resta.

---

## Quello che questo sistema non può fare

Meglio saperlo prima che scoprirlo dopo.

- **Il GPS si può falsificare.** Su Android esistono app che simulano la posizione. Richiedono di attivare le opzioni sviluppatore: non è alla portata di tutti, ma non è impossibile. Nessuna pagina web può accorgersene — solo un'app installata dallo store potrebbe, ed è l'unico motivo serio per cui varrebbe la pena farne una.
- **Il QR si può fotografare** e mandare a un collega. Per questo GPS e QR vanno tenuti insieme: aggirarli entrambi richiede due trucchi diversi nello stesso momento.
- **Il link personale si può prestare.** Se la cosa ti preoccupa, metti `RICHIEDI_PIN` su `SI` con un PIN diverso per ciascuno: chi presta il telefono deve anche dire il PIN. Aiuta, non risolve.
- **Le timbrature prese senza campo si fidano dell'orologio del telefono.** È il prezzo di non perderle nei seminterrati. Il sistema rifiuta quelle datate nel futuro e quelle più vecchie di tre giorni, e marca tutte le altre come `DIFFERITA` con l'ora in cui sono davvero arrivate: in `SESSIONI` le riconosci dalla nota "registrata offline". Se preferisci la regola rigida, metti `PERMETTI_TIMBRATURE_OFFLINE` su `NO`: senza linea non si timbra.
- **L'orario online non si può manomettere.** Quello lo scrive il server Google. Cambiare l'orologio del telefono non serve a niente.
- **Le timbrature non si registrano due volte.** Ognuna porta un codice unico: se la risposta del server si perde e il telefono rimanda la stessa riga, viene riconosciuta e scartata.

Il senso non è incastrare qualcuno: è avere un registro ordinato e un paio di segnali automatici quando qualcosa non torna.

---

## Prima di accendere: la parte legale

In Italia la geolocalizzazione dei dipendenti ricade sotto l'**art. 4 dello Statuto dei Lavoratori** e sotto il GDPR. In sintesi:

- Serve un'**informativa privacy specifica**, consegnata a ogni dipendente, che spieghi cosa si raccoglie (posizione al solo momento della timbratura), perché, per quanto tempo si conserva e chi può vederlo.
- Di norma serve un **accordo sindacale** con le RSA/RSU oppure, in mancanza, l'**autorizzazione dell'Ispettorato Territoriale del Lavoro**. Il consenso del singolo dipendente **non** sostituisce questo passaggio.
- La raccolta deve restare **puntuale**: solo l'istante della timbratura, mai tracciamento continuo. Questo sistema è costruito così apposta.
- I dati vanno conservati per il tempo necessario e non usati per finalità diverse dal conteggio delle ore.

Non sono un avvocato e questa non è consulenza legale. **Falla validare dal consulente del lavoro della cooperativa prima di attivarla**: una timbratura geolocalizzata senza le carte in ordine è contestabile, e in caso di controversia rischia di valere meno di un foglio firmato a mano.
