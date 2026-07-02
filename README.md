Squad Builder Mondiali (1970-2026):

Applicazione web single-page che simula un fantasy draft basato sulle squadre storiche dei Mondiali di Calcio. Crea la tua rosa dei sogni pescando i giocatori dai più grandi mondiali della storia, affronta il tabellone a eliminazione diretta e alza la coppa! Puoi giocare da solo contro i bot o sfidare i tuoi amici in stanza privata.
Funzionalità

    Due Modalità di Gioco
        Cammino del Mondiale: Crea la tua squadra e affronta un torneo a eliminazione diretta contro squadre generate dal computer.
        Gioca con Amici (Multiplayer): Crea o unisciti a stanze private tramite un codice di 4 lettere. Sostituisci i bot con i tuoi amici e giocate un draft simultaneo.
    Sistema di Draft Avanzato:
        Estrazione casuale di squadre mondiali.
        Selezione del modulo tattico (4-3-3, 4-4-2, 3-5-2, 4-2-3-1).
        Timer per le scelte: In multiplayer, ogni scelta ha un limite di tempo. Se scade, il sistema sceglie automaticamente un giocatore a caso per te.
        Modalità Esperto: I rating dei giocatori pescati sono nascosti ("?"), rendendo la scelta basata puramente sulla memoria e sul coraggio!
        Sistema di compatibilità dei ruoli intelligente.
        Interazione "Tap-to-Place": gli slot compatibili si illuminano per l'inserimento rapido.
    Simulazione Torneo:
        Tabelloni a 4, 8 o 16 squadre.
        Match Engine con simulazione live: i minuti scorrono, i gol appaiono in tempo reale e in caso di parità si va ai calci di rigore (uno per volta).
        Resoconto finale dettagliato: Gol fatti, gol subiti e risultato finale (Vittoria/Sconfitta).
    Interfaccia:
        Design moderno e reattivo, ottimizzato per dispositivi mobile e desktop.
        Supporto Dark/Light Mode selezionabile in tempo reale.
        Auto-loading dei dati tramite file JSON per hosting statico.

Struttura del Progetto

Il progetto è suddiviso in tre file principali per garantire ordine e facile manutenzione. Per il corretto funzionamento dell'auto-caricamento su GitHub Pages, la struttura deve rispettare la seguente gerarchia:

repository-root/├── index.html       # Struttura della pagina├── style.css        # Stili, animazioni e temi├── script.js        # Logica di gioco, draft, multiplayer e simulazione├── README.md└── data/    ├── manifest.json    ├── 1970.csv    ├── 1974.csv    └── ...

Formattazione dei Dati

I file devono essere in formato .csv con intestazione e separatore virgola. Le colonne richieste sono:

     SQUADRA (Testo)
     GIOCATORE (Testo)
     RUOLO (Testo - es. POR, DC, TS, CC, TRQ, AD, AS, ATT)
     RATING (Numero)

Il file manifest.json funge da indice per il recupero automatico e deve contenere un array con i nomi esatti dei file CSV:
json
 
  
 
 
[
  "1970.csv",
  "1974.csv",
  "2022.csv"
]
 
 
Deploy su GitHub Pages

    Carica i file index.html, style.css, script.js e la cartella data/ (con i CSV e il manifest.json) nel branch principale.
    Vai nelle impostazioni del repository: Settings > Pages.
    In Build and deployment, imposta Source su Deploy from a branch.
    Seleziona il branch principale e la cartella / (root), poi salva.
    Il gioco sarà raggiungibile all'URL https://<tuo-username>.github.io/<nome-repository>/.

     

    Nota: Aprendo il file index.html localmente, i browser bloccheranno l'auto-caricamento per policy di sicurezza (CORS). In tal caso, è possibile utilizzare il pulsante a forma di ingranaggio in alto a destra per il caricamento manuale della cartella data.

Come Giocare:

    Menu Principale: Scegli se affrontare il "Cammino del Mondiale" (Single Player) o "Gioca con Amici" (Multiplayer).
    Setup (Multiplayer): L'host crea la stanza scegliendo il numero di squadre, il tempo per le scelte e la modalità. Gli amici inseriscono il codice di 4 lettere, il loro nome e la formazione. Quando tutti sono pronti, l'host avvia il draft.
    Draft:
         Clicca su "Pesca turno" per estrarre una squadra.
         Seleziona un giocatore dalla lista.
         Tocca uno degli slot illuminati in verde sul campo per inserirlo nel ruolo compatibile.
         Ripeti fino a completare gli 11 ruoli. (In multiplayer, se finisci prima, attendi che anche gli altri completino la rosa).
    Torneo:
         In Single Player, scegli se fare un mondiale a 4, 8 o 16 squadre.
         Gioca le tue partite nel tabellone: clicca sulla partita illuminata per vederla simulata minuto per minuto.
         Se perdi, il tuo mondiale finisce (ma il torneo continuerà a simulare i risultati senza di te).
         Vince chi supera tutte le eliminatorie fino ad alzare la coppa!
