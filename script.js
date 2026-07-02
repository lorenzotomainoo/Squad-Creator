(function(){
  "use strict";

  const FORMATIONS = {
    '433': { layout: [ {pos: 'AD', x: 150, y: 10}, {pos: 'ATT', x: 100, y: 5}, {pos: 'AS', x: 50, y: 10}, {pos: 'CC1', x: 140, y: 35}, {pos: 'CC2', x: 100, y: 40}, {pos: 'CC3', x: 60, y: 35}, {pos: 'TD', x: 180, y: 62}, {pos: 'DC1', x: 135, y: 65}, {pos: 'DC2', x: 65, y: 65}, {pos: 'TS', x: 20, y: 62}, {pos: 'POR', x: 100, y: 90} ], compat: { 'POR': ['POR'], 'TD': ['TD'], 'DC1': ['DC'], 'DC2': ['DC'], 'TS': ['TS'], 'CC1': ['CC','TRQ'], 'CC2': ['CC','TRQ'], 'CC3': ['CC','TRQ'], 'AD': ['ATT','AD','ED'], 'ATT': ['ATT','AD','AS','ED','ES'], 'AS': ['ATT','AS','ES'] } },
    '442': { layout: [ {pos: 'ATT1', x: 130, y: 8}, {pos: 'ATT2', x: 70, y: 8}, {pos: 'TS1', x: 175, y: 38}, {pos: 'CC1', x: 130, y: 42}, {pos: 'CC2', x: 70, y: 42}, {pos: 'TD1', x: 25, y: 38}, {pos: 'DC1', x: 175, y: 68}, {pos: 'DC2', x: 125, y: 70}, {pos: 'DC3', x: 75, y: 70}, {pos: 'DC4', x: 25, y: 68}, {pos: 'POR', x: 100, y: 90} ], compat: { 'POR': ['POR'], 'DC1': ['DC'], 'DC2': ['DC'], 'DC3': ['DC'], 'DC4': ['DC'], 'TS1': ['TS','TD'], 'TD1': ['TD','TS'], 'CC1': ['CC','TRQ'], 'CC2': ['CC','TRQ'], 'ATT1': ['ATT','AD','AS','ED','ES'], 'ATT2': ['ATT','AD','AS','ED','ES'] } },
    '352': { layout: [ {pos: 'ATT1', x: 130, y: 8}, {pos: 'ATT2', x: 70, y: 8}, {pos: 'TS', x: 185, y: 38}, {pos: 'CC1', x: 130, y: 45}, {pos: 'CC2', x: 70, y: 45}, {pos: 'TD', x: 15, y: 38}, {pos: 'TRQ', x: 100, y: 25}, {pos: 'DC1', x: 150, y: 72}, {pos: 'DC2', x: 100, y: 75}, {pos: 'DC3', x: 50, y: 72}, {pos: 'POR', x: 100, y: 90} ], compat: { 'POR': ['POR'], 'DC1': ['DC'], 'DC2': ['DC'], 'DC3': ['DC'], 'TS': ['TS','TD'], 'TD': ['TD','TS'], 'CC1': ['CC','TRQ'], 'CC2': ['CC','TRQ'], 'TRQ': ['TRQ','CC'], 'ATT1': ['ATT','AD','AS','ED','ES'], 'ATT2': ['ATT','AD','AS','ED','ES'] } },
    '4231': { layout: [ {pos: 'ATT', x: 100, y: 5}, {pos: 'AD', x: 160, y: 22}, {pos: 'TRQ', x: 100, y: 25}, {pos: 'AS', x: 40, y: 22}, {pos: 'MC1', x: 130, y: 45}, {pos: 'MC2', x: 70, y: 45}, {pos: 'TD', x: 180, y: 68}, {pos: 'DC1', x: 135, y: 70}, {pos: 'DC2', x: 65, y: 70}, {pos: 'TS', x: 20, y: 68}, {pos: 'POR', x: 100, y: 90} ], compat: { 'POR': ['POR'], 'TD': ['TD'], 'DC1': ['DC'], 'DC2': ['DC'], 'TS': ['TS'], 'MC1': ['CC'], 'MC2': ['CC'], 'TRQ': ['TRQ','CC'], 'AD': ['ATT','AD','ED'], 'AS': ['ATT','AS','ES'], 'ATT': ['ATT','AD','AS','ED','ES'] } }
  };

  let currentFormation = '433';
  let LAYOUT = FORMATIONS[currentFormation].layout;
  let COMPATIBILITA = FORMATIONS[currentFormation].compat;

  let database = {};
  let miaRosa = {};
  let nomeSquadra = "Squadra";
  let userTeamRating = 75;
  let isEspertoMode = false;
  let isMultiplayer = false;
  let rerollsLeft = 3;

  let turnoCorrente = null;
  let giocatoreScelto = null;
  let posizioniDisponibili = [];
  let tournament = null; 

  const homeOverlay = document.getElementById('homeOverlay');
  const setupOverlay = document.getElementById('setupOverlay');
  const mpSetupOverlay = document.getElementById('mpSetupOverlay');
  const mpLobbyOverlay = document.getElementById('mpLobbyOverlay');
  
  const teamNameInput = document.getElementById('teamNameInput');
  const setupFormations = document.getElementById('setupFormations');
  const btnStart = document.getElementById('btnStart');

  const settingsToggle = document.getElementById('settingsToggle');
  const settingsDropdown = document.getElementById('settingsDropdown');
  const themeBtns = document.querySelectorAll('.theme-btn');
  const fileInput = document.getElementById('fileInput');
  const statusLine = document.getElementById('statusLine');
  
  const btnPesca = document.getElementById('btnPesca');
  const btnReroll = document.getElementById('btnReroll');
  const extractionLabel = document.getElementById('extractionLabel');
  const emptyState = document.getElementById('emptyState');
  const playerList = document.getElementById('playerList');
  const pitchRows = document.getElementById('pitchRows');
  const pitchCard = document.getElementById('pitchCard');
  const draftHeader = document.querySelector('.draft-header');
  const pitchProgress = document.getElementById('pitchProgress');
  const pitchRatingLive = document.getElementById('pitchRatingLive');
  const draftTimer = document.getElementById('draftTimer');
  
  const toast = document.getElementById('toast');
  const modalOverlay = document.getElementById('modalOverlay');
  const modalEyebrow = document.getElementById('modalEyebrow');
  const modalTitle = document.getElementById('modalTitle');
  const modalContent = document.getElementById('modalContent');
  const modalList = document.getElementById('modalList');
  const modalAvg = document.getElementById('modalAvg');
  const btnPlayTournament = document.getElementById('btnPlayTournament');
  const btnNewDraft = document.getElementById('btnNewDraft');
  
  const builderView = document.getElementById('builderView');
  const tournamentView = document.getElementById('tournamentView');
  const tournTitle = document.getElementById('tournTitle');
  const roundsContainer = document.getElementById('roundsContainer');
  
  const matchSimOverlay = document.getElementById('matchSimOverlay');
  const sbTeam1 = document.getElementById('sbTeam1');
  const sbTeam2 = document.getElementById('sbTeam2');
  const sbScore = document.getElementById('sbScore');
  const sbMinute = document.getElementById('sbMinute');
  const sbPhase = document.getElementById('sbPhase');
  const sbEvents = document.getElementById('sbEvents');
  const penaltiesBox = document.getElementById('penaltiesBox');
  const penTeam1 = document.getElementById('penTeam1');
  const penTeam2 = document.getElementById('penTeam2');
  
  let selectedSetupFormation = '433';
  let selectedTournSize = 4;

  let peer = null;
  let connections = []; 
  let hostConnection = null; 
  let mpState = { code: null, host: false, teams: 4, time: 15, mode: 'classica', players: [] };
  let myMpId = Math.random().toString(36).substr(2, 9);

  let pickTimerInterval = null;
  let pickTimeLeft = 0;

  let pendingMatchResult = null;
  let pendingMatchInterval = null;

  function initRosa() { 
    miaRosa = {}; 
    Object.keys(COMPATIBILITA).forEach(p => miaRosa[p] = null); 
    rerollsLeft = 3;
    if (btnReroll) btnReroll.style.display = 'none';
  }
  initRosa(); 

  function populateFormations(containerId) {
    const c = document.getElementById(containerId);
    c.innerHTML = '';
    Object.keys(FORMATIONS).forEach(f => {
      const btn = document.createElement('button');
      btn.className = 'form-btn' + (f === '433' ? ' active' : '');
      btn.textContent = f.split('').join('-');
      btn.dataset.form = f;
      btn.addEventListener('click', () => {
        c.querySelectorAll('button').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
      c.appendChild(btn);
    });
  }

  document.getElementById('btnWorldCup').addEventListener('click', () => {
    isMultiplayer = false;
    homeOverlay.classList.add('overlay-hidden');
    setupOverlay.classList.remove('overlay-hidden');
  });

  document.getElementById('btnFriends').addEventListener('click', () => {
    isMultiplayer = true;
    homeOverlay.classList.add('overlay-hidden');
    mpSetupOverlay.classList.remove('overlay-hidden');
  });

  document.querySelectorAll('.mp-opt').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll(`.mp-opt[data-group="${btn.dataset.group}"]`).forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  document.querySelectorAll('.tourn-size-btn').forEach(btn => { 
    btn.addEventListener('click', () => { 
      document.querySelectorAll('.tourn-size-btn').forEach(b => b.classList.remove('active')); 
      btn.classList.add('active'); 
      selectedTournSize = parseInt(btn.dataset.size); 
    }); 
  });

  document.getElementById('btnCreateRoom').addEventListener('click', () => {
    const hostName = document.getElementById('hostNameInput').value.trim() || "Host";
    const hostForm = document.querySelector('#hostFormations .active').dataset.form;
    const teams = parseInt(document.querySelector('.mp-opt[data-group="teams"].active').dataset.val);
    const time = parseInt(document.querySelector('.mp-opt[data-group="time"].active').dataset.val);
    const mode = document.querySelector('.mp-opt[data-group="mode"].active').dataset.val;
    createRoom(hostName, hostForm, teams, time, mode);
  });

  function createRoom(hostName, hostForm, teams, time, mode) {
    if (peer) peer.destroy();
    
    mpState.host = true;
    mpState.teams = teams;
    mpState.time = time;
    mpState.mode = mode;
    mpState.code = Math.random().toString(36).substr(2, 4).toUpperCase();
    mpState.players = [{ id: myMpId, name: hostName, formation: hostForm, isBot: false, ready: true }];
    for(let i=1; i<mpState.teams; i++) mpState.players.push({ id: 'bot'+i, name: `Bot ${i}`, isBot: true, ready: true, formation: '433' });

    showToast('Creazione stanza in corso...');
    peer = new Peer('squadbuilder_' + mpState.code);
    
    peer.on('open', () => {
      showToast('Stanza creata! Condividi il codice.');
      showLobby();
    });
    peer.on('connection', (conn) => {
      connections.push(conn);
      conn.on('data', (msg) => handleHostMessage(msg));
      conn.on('close', () => { connections = connections.filter(c => c !== conn); });
    });
    peer.on('error', (err) => {
      showToast('Errore Host: ' + err.type);
    });
  }

  document.getElementById('btnJoinRoom').addEventListener('click', () => {
    const code = document.getElementById('joinCodeInput').value.trim().toUpperCase();
    const joinName = document.getElementById('joinNameInput').value.trim() || "Giocatore";
    const joinForm = document.querySelector('#joinFormations .active').dataset.form;
    
    if (code.length !== 4) { showToast('Inserisci un codice di 4 lettere'); return; }
    
    if (peer) peer.destroy();
    
    mpState.host = false;
    mpState.code = code;
    
    showToast('Connessione alla stanza...');
    peer = new Peer();
    peer.on('open', () => {
      hostConnection = peer.connect('squadbuilder_' + mpState.code, {reliable: true});
      let timeout = setTimeout(() => {
        if (!hostConnection.open) { showToast('Nessuna stanza trovata. Controlla il codice.'); if(peer) peer.destroy(); }
      }, 5000);

      hostConnection.on('open', () => {
        clearTimeout(timeout);
        hostConnection.send({ type: 'request_state', from: myMpId });
        hostConnection.send({ type: 'player_join', id: myMpId, name: joinName, formation: joinForm });
      });
      hostConnection.on('data', (msg) => handleClientMessage(msg));
    });
    
    peer.on('error', (err) => {
      if (err.type === 'peer-unavailable') {
        showToast('Stanza non trovata. L\'host è offline?');
      } else {
        showToast('Errore Client: ' + err.type);
      }
    });
  });

  function broadcastToClients(msg) { connections.forEach(conn => conn.send(msg)); }

  function handleHostMessage(msg) {
    if (msg.type === 'request_state') {
      broadcastToClients({ type: 'state_sync', state: mpState });
    } else if (msg.type === 'player_join') {
      const botIdx = mpState.players.findIndex(p => p.isBot);
      if (botIdx !== -1) {
        mpState.players[botIdx] = { id: msg.id, name: msg.name, formation: msg.formation, isBot: false, ready: false };
        renderLobbyList(); 
        showLobby(); 
        broadcastToClients({ type: 'state_sync', state: mpState });
      }
    } else if (msg.type === 'player_ready') {
      const p = mpState.players.find(p => p.id === msg.id);
      if (p) { 
        p.ready = true; 
        renderLobbyList(); 
        showLobby(); 
        broadcastToClients({ type: 'state_sync', state: mpState }); 
      }
    } else if (msg.type === 'team_submitted') {
      const p = mpState.players.find(p => p.id === msg.id);
      if (p) { p.team = msg.team; p.rating = msg.rating; checkAllTeamsSubmitted(); }
    } else if (msg.type === 'match_result') {
      const match = tournament.rounds[msg.rIdx].matches[msg.mIdx];
      if (!match || match.played) return; 
      
      let winner;
      if (msg.score1 > msg.score2) winner = match.team1;
      else if (msg.score2 > msg.score1) winner = match.team2;
      else winner = (msg.pens1 > msg.pens2) ? match.team1 : match.team2;

      match.score1 = msg.score1; match.score2 = msg.score2;
      match.pens1 = msg.pens1; match.pens2 = msg.pens2;
      match.winner = winner; match.played = true;

      advanceTournament(msg.rIdx, msg.mIdx, winner);
      simulateAllAIMatches();
      renderBracket();
      broadcastTournament();
      if (checkTournamentEnd()) return;
    }
  }

  function handleClientMessage(msg) {
    if (msg.type === 'state_sync' || msg.type === 'start_draft') {
      const myHostStatus = mpState.host; 
      mpState = msg.state;
      mpState.host = myHostStatus; 
      if (msg.type === 'state_sync') showLobby();
      else if (msg.type === 'start_draft') startMpDraft();
    } else if (msg.type === 'start_tournament') {
      modalOverlay.classList.remove('show');
      startTournament(msg.teams.length, msg.teams);
    } else if (msg.type === 'tournament_update') {
      applyTournamentState(msg.tournament);
    }
  }

  function showLobby() {
    mpSetupOverlay.classList.add('overlay-hidden');
    mpLobbyOverlay.classList.remove('overlay-hidden');
    document.getElementById('roomCodeDisplay').textContent = mpState.code;

    const btnReadyMP = document.getElementById('btnReadyMP');
    const btnStartMP = document.getElementById('btnStartMP');
    const lobbyStatusText = document.getElementById('lobbyStatusText');
    const me = mpState.players.find(p => p.id === myMpId);

    if (mpState.host) {
      btnReadyMP.style.display = 'none';
      btnStartMP.style.display = 'block';
      lobbyStatusText.style.display = 'none';

      btnStartMP.onclick = () => {
        const allReady = mpState.players.every(p => p.ready);
        if (!allReady) { showToast('Non tutti i giocatori sono pronti!'); return; }
        broadcastToClients({ type: 'start_draft', state: mpState });
        startMpDraft();
      };
    } else {
      btnReadyMP.style.display = 'block';
      btnStartMP.style.display = 'none';
      lobbyStatusText.style.display = 'block';
      if (me && me.ready) {
        btnReadyMP.textContent = 'In Attesa Host...';
        btnReadyMP.disabled = true;
      } else {
        btnReadyMP.textContent = 'Sono Pronto';
        btnReadyMP.disabled = false;
      }

      btnReadyMP.onclick = () => {
        hostConnection.send({ type: 'player_ready', id: myMpId });
        btnReadyMP.textContent = 'In Attesa Host...';
        btnReadyMP.disabled = true;
      };
    }

    renderLobbyList();
  }

  function renderLobbyList() {
    const list = document.getElementById('lobbyList');
    list.innerHTML = '';
    mpState.players.forEach(p => {
      const item = document.createElement('div');
      item.className = 'lobby-item' + (p.ready ? ' ready' : '');
      item.innerHTML = `
        <div>
          <div class="lobby-name">${escapeHTML(p.name)}</div>
          <div class="lobby-form">${p.formation.split('').join('-')}</div>
        </div>
        <div class="lobby-status ${p.ready ? 'pronto' : ''}">${p.isBot ? 'Bot' : (p.ready ? 'Pronto' : 'In Attesa')}</div>
      `;
      list.appendChild(item);
    });
  }

  function startMpDraft() {
    isEspertoMode = (mpState.mode === 'esperto');
    const me = mpState.players.find(p => p.id === myMpId) || { name: 'Bot', formation: '433' };
    nomeSquadra = me.name;
    currentFormation = me.formation;
    LAYOUT = FORMATIONS[currentFormation].layout;
    COMPATIBILITA = FORMATIONS[currentFormation].compat;
    initRosa(); renderPitch();
    mpLobbyOverlay.classList.add('overlay-hidden');
  }

  function startPickTimer() {
    clearInterval(pickTimerInterval);
    pickTimeLeft = mpState.time;
    draftTimer.style.display = 'block';
    draftTimer.textContent = pickTimeLeft + 's';
    draftTimer.classList.remove('urgent');
    pickTimerInterval = setInterval(() => {
      pickTimeLeft--;
      draftTimer.textContent = pickTimeLeft + 's';
      if (pickTimeLeft <= 5) draftTimer.classList.add('urgent');
      if (pickTimeLeft <= 0) {
        clearInterval(pickTimerInterval);
        draftTimer.style.display = 'none';
        autoPickPlayer();
      }
    }, 1000);
  }

  function autoPickPlayer() {
    if (Object.values(miaRosa).every(v => v !== null)) return; 
    if (!turnoCorrente) { btnPesca.click(); setTimeout(autoPickPlayer, 500); return; }
    const availablePlayers = turnoCorrente.giocatori.filter(g => 
      Object.keys(COMPATIBILITA).some(pos => miaRosa[pos] === null && COMPATIBILITA[pos].includes(g.ruolo))
    );
    if (availablePlayers.length > 0) {
      const randomPlayer = availablePlayers[Math.floor(Math.random() * availablePlayers.length)];
      const idx = turnoCorrente.giocatori.indexOf(randomPlayer);
      selezionaGiocatore(idx, null); 
      if (posizioniDisponibili.length > 0) {
        const randomPos = posizioniDisponibili[Math.floor(Math.random() * posizioniDisponibili.length)];
        confermaInserimento(randomPos);
      }
    } else {
      turnoCorrente = null;
      btnPesca.disabled = false;
      setTimeout(autoPickPlayer, 100);
    }
  }

  function initSetupScreen() {
    populateFormations('setupFormations');
    populateFormations('hostFormations');
    populateFormations('joinFormations');
    setupFormations.querySelectorAll('button').forEach(b => b.addEventListener('click', () => {
      setupFormations.querySelectorAll('button').forEach(btn => btn.classList.remove('active'));
      b.classList.add('active');
      selectedSetupFormation = b.dataset.form;
    }));
  }

  btnStart.addEventListener('click', () => {
    nomeSquadra = teamNameInput.value.trim() || "Squadra";
    document.title = `${nomeSquadra} - Squad Builder`;
    currentFormation = selectedSetupFormation;
    LAYOUT = FORMATIONS[currentFormation].layout;
    COMPATIBILITA = FORMATIONS[currentFormation].compat;
    initRosa(); renderPitch();
    setupOverlay.classList.add('overlay-hidden');
  });

  settingsToggle.addEventListener('click', (e) => { e.stopPropagation(); settingsDropdown.classList.toggle('show'); settingsToggle.classList.toggle('active'); });
  document.addEventListener('click', (e) => { if (!settingsDropdown.contains(e.target) && !settingsToggle.contains(e.target)) { settingsDropdown.classList.remove('show'); settingsToggle.classList.remove('active'); } });
  themeBtns.forEach(btn => { btn.addEventListener('click', () => { const theme = btn.dataset.theme; document.body.setAttribute('data-theme', theme); themeBtns.forEach(b => b.classList.remove('active')); btn.classList.add('active'); }); });

  async function autoLoadData() {
    try {
      setStatus('Tentativo di caricamento automatico...', '');
      const res = await fetch('./data/manifest.json');
      if (!res.ok) { setStatus('Nessun database trovato. Carica manualmente.', 'err'); return; }
      const files = await res.json(); database = {};
      for (const file of files) {
        const anno = file.replace(/\.csv$/i, ''); const resCsv = await fetch(`./data/${file}`);
        if (!resCsv.ok) continue; const text = await resCsv.text(); const rows = parseCSV(text); database[anno] = {};
        rows.forEach(r => { const squadra = r['SQUADRA']; if (!squadra) return; if (!database[anno][squadra]) database[anno][squadra] = []; database[anno][squadra].push({ nome: r['GIOCATORE'], ruolo: r['RUOLO'], rating: parseInt(r['RATING'], 10) || 0 }); });
      }
      const nAnni = Object.keys(database).length;
      if (nAnni > 0) { setStatus(`Database caricato: ${nAnni} mondiali.`, 'ok'); btnPesca.disabled = false; extractionLabel.textContent = 'Pronto: premi "Pesca turno"'; } 
      else { setStatus('Database vuoto. Carica manualmente.', 'err'); }
    } catch (err) { setStatus('Errore caricamento automatico.', 'err'); }
  }

  function splitCSVLine(line){ const out = []; let cur = ''; let inQ = false; for (let i=0;i<line.length;i++){ const ch = line[i]; if (ch === '"'){ if (inQ && line[i+1] === '"'){ cur += '"'; i++; } else inQ = !inQ; } else if (ch === ',' && !inQ){ out.push(cur); cur = ''; } else { cur += ch; } } out.push(cur); return out.map(s => s.trim()); }
  
  function parseCSV(text){
    const lines = text.split(/\r\n|\n|\r/).filter(l => l.trim().length > 0);
    if (lines.length === 0) return [];
    const headers = splitCSVLine(lines[0]).map(h => h.toUpperCase());
    const rows = [];
    for (let i = 1; i < lines.length; i++) {
      const cols = splitCSVLine(lines[i]);
      const obj = {};
      headers.forEach((h, idx) => {
        obj[h] = cols[idx] !== undefined ? cols[idx] : '';
      });
      rows.push(obj);
    }
    return rows;
  }

  fileInput.addEventListener('change', async (e) => {
    const files = Array.from(e.target.files || []).filter(f => f.name.toLowerCase().endsWith('.csv'));
    if (files.length === 0){ setStatus('Nessun file .csv trovato.', 'err'); return; }
    setStatus('Caricamento manuale in corso...', ''); database = {};
    try {
      for (const file of files){ const anno = file.name.replace(/\.csv$/i, ''); const text = await file.text(); const rows = parseCSV(text); database[anno] = {}; rows.forEach(r => { const squadra = r['SQUADRA']; if (!squadra) return; if (!database[anno][squadra]) database[anno][squadra] = []; database[anno][squadra].push({ nome: r['GIOCATORE'], ruolo: r['RUOLO'], rating: parseInt(r['RATING'], 10) || 0 }); }); }
      const nAnni = Object.keys(database).length; setStatus(`${nAnni} mondiali caricati manualmente.`, 'ok'); btnPesca.disabled = false; extractionLabel.textContent = 'Pronto: premi "Pesca turno"';
    } catch (err){ setStatus('Errore durante il caricamento.', 'err'); }
  });

  function setStatus(msg, kind){ statusLine.textContent = msg; statusLine.className = 'status-line' + (kind ? ' ' + kind : ''); }
  function escapeHTML(str){ const d = document.createElement('div'); d.textContent = str == null ? '' : str; return d.innerHTML; }

  function renderPitch(){
    pitchRows.innerHTML = '';
    LAYOUT.forEach(item => {
      const pos = item.pos, x = item.x, y = item.y; const g = miaRosa[pos]; const slot = document.createElement('div');
      let isAvailable = posizioniDisponibili.includes(pos);
      let stateClass = g ? 'filled' : (isAvailable ? 'available' : '');
      slot.className = 'slot ' + stateClass; slot.dataset.pos = pos; slot.style.left = (x / 2) + '%'; slot.style.top = y + '%';
      const ratingText = isEspertoMode ? '?' : (g ? g.rating : '—');
      if (g) { slot.innerHTML = `<div class="pos-tag">${pos}</div><div class="pos-name">${escapeHTML(g.nome)}</div><div class="pos-rating">${ratingText}</div>`; } 
      else if (isAvailable) { slot.innerHTML = `<div class="pos-tag">${pos}</div><div class="pos-name">Inserisci</div><div class="pos-rating">—</div>`; slot.addEventListener('click', () => confermaInserimento(pos)); } 
      else { slot.innerHTML = `<div class="pos-tag">${pos}</div><div class="pos-name">—</div><div class="pos-rating"></div>`; }
      pitchRows.appendChild(slot);
    });
    const filled = Object.values(miaRosa).filter(Boolean).length;
    pitchProgress.textContent = `${filled} / 11 ruoli`;
    if (filled > 0){ const somma = Object.values(miaRosa).filter(Boolean).reduce((a,g) => a + g.rating, 0); userTeamRating = Math.floor(somma / 11); pitchRatingLive.textContent = `Media: ${isEspertoMode ? '?' : userTeamRating}`; } 
    else { pitchRatingLive.textContent = ''; userTeamRating = 40; }
  }

  function pescaTurno() {
    if (Object.values(miaRosa).every(v => v !== null)){ showToast('La rosa è già completa!'); return; }
    const anni = Object.keys(database); if (anni.length === 0) return;
    
    let squadraValida = false;
    let tentativi = 0;
    let anno, squadre, squadra, giocatori;

    while (!squadraValida && tentativi < 100) {
      anno = anni[Math.floor(Math.random() * anni.length)]; 
      squadre = Object.keys(database[anno]);
      squadra = squadre[Math.floor(Math.random() * squadre.length)]; 
      giocatori = database[anno][squadra];
      
      const hasValidPlayer = giocatori.some(g => 
        Object.keys(COMPATIBILITA).some(pos => miaRosa[pos] === null && COMPATIBILITA[pos].includes(g.ruolo))
      );
      
      if (hasValidPlayer) {
        squadraValida = true;
      } else {
        tentativi++;
      }
    }

    turnoCorrente = { anno, squadra, giocatori }; giocatoreScelto = null; posizioniDisponibili = [];
    extractionLabel.innerHTML = `${escapeHTML(squadra)} <span class="year">· ${escapeHTML(anno)}</span>`;
    renderPlayerList(giocatori); btnPesca.disabled = true; renderPitch();
    
    if (isMultiplayer) startPickTimer();

    if (rerollsLeft > 0) {
      btnReroll.style.display = 'inline-block';
      btnReroll.textContent = `Re-roll (${rerollsLeft})`;
      btnReroll.disabled = false;
    } else {
      btnReroll.style.display = 'none';
    }
  }

  btnPesca.addEventListener('click', pescaTurno);

  btnReroll.addEventListener('click', () => {
    if (rerollsLeft <= 0) return;
    rerollsLeft--;
    pescaTurno();
  });

  function renderPlayerList(giocatori){
    emptyState.style.display = 'none'; playerList.style.display = 'flex'; playerList.innerHTML = '';
    giocatori.forEach((g, idx) => {
      const row = document.createElement('div'); row.className = 'player-row';
      const canPlace = Object.keys(COMPATIBILITA).some(pos => miaRosa[pos] === null && COMPATIBILITA[pos].includes(g.ruolo));
      const ratingText = isEspertoMode ? '?' : g.rating;
      if (!canPlace) { row.classList.add('disabled'); row.innerHTML = `<span class="player-name">${escapeHTML(g.nome)}<span class="player-role">${escapeHTML(g.ruolo)}</span></span><span class="player-rating">${ratingText}</span>`; } 
      else { row.tabIndex = 0; row.setAttribute('role','button'); row.innerHTML = `<span class="player-name">${escapeHTML(g.nome)}<span class="player-role">${escapeHTML(g.ruolo)}</span></span><span class="player-rating">${ratingText}</span>`; row.addEventListener('click', () => selezionaGiocatore(idx, row)); }
      playerList.appendChild(row);
    });
  }

  function selezionaGiocatore(idx, rowEl){
    if (!turnoCorrente) return;
    if (giocatoreScelto === turnoCorrente.giocatori[idx]) { annullaSelezione(); return; }
    if (rowEl) {
      Array.from(playerList.children).forEach(r => r.classList.remove('selected')); 
      rowEl.classList.add('selected');
    }
    const giocatore = turnoCorrente.giocatori[idx];
    posizioniDisponibili = Object.keys(COMPATIBILITA).filter(pos => miaRosa[pos] === null && COMPATIBILITA[pos].includes(giocatore.ruolo));
    if (posizioniDisponibili.length === 0){ showToast(`Nessuna posizione compatibile.`); return; }
    giocatoreScelto = giocatore;
    extractionLabel.innerHTML = `${escapeHTML(giocatore.nome)} <span class="hint">Tocca un ruolo verde!</span>`;
    renderPitch();

    if (window.innerWidth < 880) {
      setTimeout(() => {
        pitchCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 300);
    }
  }

  function annullaSelezione() { giocatoreScelto = null; posizioniDisponibili = []; Array.from(playerList.children).forEach(r => r.classList.remove('selected')); if (turnoCorrente) extractionLabel.innerHTML = `${escapeHTML(turnoCorrente.squadra)} <span class="year">· ${escapeHTML(turnoCorrente.anno)}</span>`; renderPitch(); }

  function confermaInserimento(pos) {
    if (!giocatoreScelto) return;
    clearInterval(pickTimerInterval);
    draftTimer.style.display = 'none';
    draftTimer.classList.remove('urgent');
    btnReroll.style.display = 'none';
    
    miaRosa[pos] = giocatoreScelto; giocatoreScelto = null; posizioniDisponibili = []; turnoCorrente = null;
    playerList.innerHTML = ''; playerList.style.display = 'none'; emptyState.style.display = 'block';
    extractionLabel.textContent = 'Pronto: premi "Pesca turno"'; renderPitch();
    
    if (window.innerWidth < 880) {
      setTimeout(() => {
        draftHeader.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 300);
    }

    if (Object.values(miaRosa).every(v => v !== null)) mostraRisultatoFinale();
    else btnPesca.disabled = false;
  }

  function mostraRisultatoFinale(){
    if (isMultiplayer) {
      const me = mpState.players.find(p => p.id === myMpId);
      if (me) { me.team = miaRosa; me.rating = userTeamRating; }
      
      let allDone = false;
      if (mpState.host) {
        allDone = mpState.players.every(p => p.isBot || (p.team && p.rating));
        if (allDone) {
          checkAllTeamsSubmitted(); 
          return; 
        }
      } else {
        hostConnection.send({ type: 'team_submitted', id: myMpId, team: miaRosa, rating: userTeamRating });
      }

      modalEyebrow.textContent = "In Attesa"; 
      modalTitle.textContent = "Rosa Completa!";
      modalContent.style.display = 'none'; 
      btnPlayTournament.style.display = 'none'; 
      btnNewDraft.textContent = 'Esci';
      modalOverlay.classList.add('show'); 
      btnPesca.disabled = true;
      return;
    }

    modalEyebrow.textContent = "Fine Draft"; modalTitle.textContent = "Rosa Completa!"; modalTitle.classList.remove('champion');
    modalContent.style.display = 'block'; modalList.innerHTML = '';
    LAYOUT.forEach(item => { const g = miaRosa[item.pos]; const li = document.createElement('li'); li.innerHTML = `<span class="mp-pos">${item.pos}</span><span class="mp-name">${escapeHTML(g.nome)}</span><span class="mp-rating">${isEspertoMode ? '?' : g.rating}</span>`; modalList.appendChild(li); });
    modalAvg.textContent = isEspertoMode ? '?' : userTeamRating; 
    btnPlayTournament.style.display = 'block'; btnNewDraft.textContent = 'Crea Nuova Rosa';
    modalOverlay.classList.add('show'); btnPesca.disabled = true;
  }

  function checkAllTeamsSubmitted() {
    if (!mpState.host) return;
    const allDone = mpState.players.every(p => p.isBot || (p.team && p.rating));
    if (allDone) {
      const teams = mpState.players.map(p => {
        if (p.isBot) {
          const anni = Object.keys(database);
          const anno = anni[Math.floor(Math.random() * anni.length)];
          const squadreAnno = Object.keys(database[anno]); 
          const squadraNome = squadreAnno[Math.floor(Math.random() * squadreAnno.length)];
          const giocatori = database[anno][squadraNome]; 
          const top11 = giocatori.slice(0, 11);
          const rating = Math.floor(top11.reduce((a, g) => a + g.rating, 0) / Math.max(1, top11.length));
          return { name: p.name, rating: rating, isUser: false, id: p.id };
        } else {
          return { name: p.name, rating: p.rating, isUser: (p.id === myMpId), id: p.id };
        }
      });
      modalOverlay.classList.remove('show'); 
      broadcastToClients({ type: 'start_tournament', teams: teams });
      startTournament(teams.length, teams);
    }
  }

  btnNewDraft.addEventListener('click', () => {
    modalOverlay.classList.remove('show');
    const oldTrophy = document.getElementById('trophyDiv'); if (oldTrophy) oldTrophy.remove();
    initRosa(); renderPitch(); extractionLabel.textContent = 'Pronto: premi "Pesca turno"';
    btnPesca.disabled = Object.keys(database).length === 0;
    builderView.classList.remove('hidden'); tournamentView.classList.remove('active'); tournament = null;
    if (peer) peer.destroy(); peer = null; connections = []; hostConnection = null;
    isMultiplayer = false; isEspertoMode = false; draftTimer.style.display = 'none';
    homeOverlay.classList.remove('overlay-hidden');
  });

  btnPlayTournament.addEventListener('click', () => { 
    modalOverlay.classList.remove('show'); 
    if (isMultiplayer && mpState.host) {
      checkAllTeamsSubmitted(); 
    } else if (!isMultiplayer) {
      const teams = [{ name: nomeSquadra, rating: userTeamRating, isUser: true, id: myMpId }];
      const anni = Object.keys(database);
      for (let i = 1; i < selectedTournSize; i++) {
        const anno = anni[Math.floor(Math.random() * anni.length)]; 
        const squadreAnno = Object.keys(database[anno]);
        const squadraNome = squadreAnno[Math.floor(Math.random() * squadreAnno.length)]; 
        const giocatori = database[anno][squadraNome];
        const top11 = giocatori.slice(0, 11); 
        const rating = Math.floor(top11.reduce((a, g) => a + g.rating, 0) / Math.max(1, top11.length));
        teams.push({ name: `${squadraNome} (${anno})`, rating: rating, isUser: false, id: 'bot'+i });
      }
      startTournament(selectedTournSize, teams); 
    }
  });

  function startTournament(size, teamsList) {
    builderView.classList.add('hidden'); tournamentView.classList.add('active'); 
    tournTitle.textContent = isMultiplayer ? `Mondiali Multiplayer (${size})` : `Mondiali a ${size} Squadre`;
    const teams = teamsList || [];
    
    teams.forEach(t => {
      t.isUser = (t.id === myMpId);
    });

    teams.sort(() => Math.random() - 0.5);
    tournament = { size: size, rounds: [], userEliminated: false, userStats: { gf: 0, gs: 0, wins: 0, losses: 0 } };

    let round1Matches = [];
    for (let i = 0; i < teams.length; i += 2) { round1Matches.push({ team1: teams[i], team2: teams[i+1], score1: null, score2: null, pens1: null, pens2: null, winner: null, played: false }); }
    function getRoundName(t) { if (t == 2) return "Finale"; if (t == 4) return "Semifinali"; if (t == 8) return "Quarti di Finale"; if (t == 16) return "Ottavi di Finale"; return "Turno"; }
    tournament.rounds.push({ name: getRoundName(teams.length), matches: round1Matches });
    let prevMatches = round1Matches;
    while (prevMatches.length > 1) {
      let nextMatches = [];
      for (let i = 0; i < prevMatches.length; i += 2) { nextMatches.push({ team1: null, team2: null, score1: null, score2: null, pens1: null, pens2: null, winner: null, played: false }); }
      tournament.rounds.push({ name: getRoundName(nextMatches.length * 2), matches: nextMatches });
      prevMatches = nextMatches;
    }
    
    if (!isMultiplayer || mpState.host) {
      simulateAllAIMatches();
    }
    renderBracket();
  }

  function renderBracket() {
    roundsContainer.innerHTML = '';
    tournament.rounds.forEach((round, rIdx) => {
      const roundDiv = document.createElement('div'); roundDiv.className = 'round'; roundDiv.innerHTML = `<div class="round-title">${round.name}</div>`;
      round.matches.forEach((match, mIdx) => {
        const matchDiv = document.createElement('div'); matchDiv.className = 'match-card';
        const t1Name = match.team1 ? escapeHTML(match.team1.name) : 'TBD'; const t2Name = match.team2 ? escapeHTML(match.team2.name) : 'TBD';
        const t1Class = match.team1 && match.team1.isUser ? 'user-team' : ''; const t2Class = match.team2 && match.team2.isUser ? 'user-team' : '';
        if (match.played) {
          matchDiv.innerHTML = `
            <div class="match-team ${match.winner === match.team1 ? 'winner' : 'loser'} ${t1Class}"><span>${t1Name}</span><span class="match-score">${match.score1}${match.pens1 !== null ? `<span class="match-pens">(${match.pens1})</span>` : ''}</span></div>
            <div class="match-team ${match.winner === match.team2 ? 'winner' : 'loser'} ${t2Class}"><span>${t2Name}</span><span class="match-score">${match.score2}${match.pens2 !== null ? `<span class="match-pens">(${match.pens2})</span>` : ''}</span></div>`;
        } else {
          const isUserMatch = (match.team1 && match.team1.isUser) || (match.team2 && match.team2.isUser);
          if (isUserMatch && !tournament.userEliminated) {
            
            // FIX CRITICO: Se è multiplayer, non sono l'host, e la partita è tra due umani, non posso giocarla.
            let canPlay = true;
            if (isMultiplayer && !mpState.host) {
              const isHumanVsHuman = match.team1 && !match.team1.id.startsWith('bot') && match.team2 && !match.team2.id.startsWith('bot');
              if (isHumanVsHuman) {
                canPlay = false;
              }
            }

            if (canPlay) {
              matchDiv.classList.add('playable');
              matchDiv.innerHTML = `<div class="match-team ${t1Class}"><span>${t1Name}</span><span class="match-score">-</span></div><div class="match-team ${t2Class}"><span>${t2Name}</span><span class="match-score">-</span></div><div class="play-match-btn">Gioca Partita</div>`;
              matchDiv.addEventListener('click', () => startMatchSimulation(match, rIdx, mIdx));
            } else {
              matchDiv.innerHTML = `<div class="match-team ${t1Class}"><span>${t1Name}</span><span class="match-score">-</span></div><div class="match-team ${t2Class}"><span>${t2Name}</span><span class="match-score">-</span></div><div class="play-match-btn" style="background:var(--muted-2);">In attesa dell'Host...</div>`;
            }
          } else {
            matchDiv.innerHTML = `<div class="match-team"><span>${t1Name}</span><span class="match-score">-</span></div><div class="match-team"><span>${t2Name}</span><span class="match-score">-</span></div>`;
          }
        }
        roundDiv.appendChild(matchDiv);
      });
      roundsContainer.appendChild(roundDiv);
    });
  }

  let matchInterval = null; let currentMatchData = null;

  function startMatchSimulation(match, rIdx, mIdx) {
    currentMatchData = { match, rIdx, mIdx }; matchSimOverlay.classList.add('show');
    sbTeam1.textContent = match.team1.name; sbTeam1.classList.toggle('user', match.team1.isUser);
    sbTeam2.textContent = match.team2.name; sbTeam2.classList.toggle('user', match.team2.isUser);
    let score1 = 0, score2 = 0;
    updateScoreboard(score1, score2);
    sbMinute.textContent = "1'"; sbPhase.textContent = "Primo Tempo"; sbEvents.innerHTML = '';
    penaltiesBox.classList.remove('show');
    const r1 = match.team1.rating, r2 = match.team2.rating;
    const prob1 = (r1 / (r1 + r2)) * 0.035; const prob2 = (r2 / (r1 + r2)) * 0.035;
    let minute = 0;
    matchInterval = setInterval(() => {
      minute++; sbMinute.textContent = minute + "'";
      if (minute === 46) sbPhase.textContent = "Secondo Tempo";
      if (Math.random() < prob1) { score1++; updateScoreboard(score1, score2); addGoalEvent(match.team1.name, minute); if (match.team1.isUser || match.team2.isUser) tournament.userStats.gf += (match.team1.isUser ? 1 : 0), tournament.userStats.gs += (match.team2.isUser ? 1 : 0); }
      if (Math.random() < prob2) { score2++; updateScoreboard(score1, score2); addGoalEvent(match.team2.name, minute); if (match.team1.isUser || match.team2.isUser) tournament.userStats.gf += (match.team2.isUser ? 1 : 0), tournament.userStats.gs += (match.team1.isUser ? 1 : 0); }
      if (minute >= 90) {
        clearInterval(matchInterval);
        if (score1 === score2) { sbPhase.textContent = "Ai Rigori!"; setTimeout(() => startPenalties(match, score1, score2), 1000); } 
        else { finishMatch(match, score1, score2, null, null); }
      }
    }, 100);
  }

  function updateScoreboard(s1, s2) { sbScore.textContent = `${s1} - ${s2}`; sbScore.classList.add('goal-anim'); setTimeout(() => sbScore.classList.remove('goal-anim'), 500); }
  function addGoalEvent(teamName, minute) { const evt = document.createElement('div'); evt.className = 'sb-event'; evt.innerHTML = `<span class="min">${minute}'</span> <span class="goal">GOL!</span> ${escapeHTML(teamName)}`; sbEvents.prepend(evt); }

  function startPenalties(match, score1, score2) {
    penaltiesBox.classList.add('show');
    let p1 = 0, p2 = 0; let t1Shots = [], t2Shots = []; let turn = 0; 
    const penInterval = setInterval(() => {
      if (turn === 0) {
        const made = Math.random() < (match.team1.rating / (match.team1.rating + 80));
        t1Shots.push(made); if (made) p1++; renderPenalties(penTeam1, match.team1.name, t1Shots); turn = 1;
      } else {
        const made = Math.random() < (match.team2.rating / (match.team2.rating + 80));
        t2Shots.push(made); if (made) p2++; renderPenalties(penTeam2, match.team2.name, t2Shots); turn = 0;
        let isOver = false;
        if (t1Shots.length >= 5 && t2Shots.length >= 5 && p1 !== p2) isOver = true;
        else {
          const rem1 = 5 - t1Shots.length; const rem2 = 5 - t2Shots.length;
          if (p1 > p2 + rem2) isOver = true; if (p2 > p1 + rem1) isOver = true;
          if (t1Shots.length > 5 && p1 !== p2) isOver = true;
        }
        if (isOver) { clearInterval(penInterval); finishMatch(match, score1, score2, p1, p2); }
      }
    }, 700);
  }

  function renderPenalties(container, teamName, shots) {
    container.innerHTML = `<div style="font-size:12px; color:var(--muted); margin-bottom:5px;">${escapeHTML(teamName)}</div>`;
    shots.forEach(made => { const div = document.createElement('div'); div.className = 'pen-shot ' + (made ? 'made' : 'missed'); div.textContent = made ? '✓' : '✗'; container.appendChild(div); });
  }

  function advanceTournament(rIdx, mIdx, winner) {
    if (rIdx + 1 < tournament.rounds.length) {
      const nextMatchIdx = Math.floor(mIdx / 2); const isTeam1 = mIdx % 2 === 0;
      if (isTeam1) tournament.rounds[rIdx + 1].matches[nextMatchIdx].team1 = winner;
      else tournament.rounds[rIdx + 1].matches[nextMatchIdx].team2 = winner;
    }
  }

  function simulateAllAIMatches() {
    let changed = true;
    while (changed) {
      changed = false;
      tournament.rounds.forEach((round, rIdx) => {
        round.matches.forEach((m, mIdx) => {
          if (!m.played && m.team1 && m.team2) {
            const isAIvAI = m.team1.id.startsWith('bot') && m.team2.id.startsWith('bot');
            if (isAIvAI) {
              let s1 = Math.floor(Math.random() * 4 * (m.team1.rating / (m.team1.rating + m.team2.rating + 1)) * 2);
              let s2 = Math.floor(Math.random() * 4 * (m.team2.rating / (m.team1.rating + m.team2.rating + 1)) * 2);
              let p1 = null, p2 = null;
              if (s1 === s2) { p1 = Math.floor(Math.random() * 3) + 3; p2 = p1; while(p1 === p2) p2 = Math.floor(Math.random() * 3) + 3; }
              m.score1 = s1; m.score2 = s2; m.pens1 = p1; m.pens2 = p2;
              m.winner = (s1 > s2) ? m.team1 : (s2 > s1) ? m.team2 : (p1 > p2) ? m.team1 : m.team2;
              m.played = true;
              advanceTournament(rIdx, mIdx, m.winner);
              changed = true;
            }
          }
        });
      });
    }
  }

  function broadcastTournament() {
    if (mpState.host) {
      const cleanTournament = JSON.parse(JSON.stringify(tournament));
      delete cleanTournament.userStats;
      delete cleanTournament.userEliminated;
      broadcastToClients({ type: 'tournament_update', tournament: cleanTournament });
    }
  }

  function applyTournamentState(t) {
    const myStats = tournament ? (tournament.userStats || { gf: 0, gs: 0, wins: 0, losses: 0 }) : { gf: 0, gs: 0, wins: 0, losses: 0 };
    const myEliminated = tournament ? (tournament.userEliminated || false) : false;
    
    // FIX CRITICO: Salviamo i match che abbiamo giocato localmente per non farceli resettare dall'host
    const locallyPlayedMatches = {};
    if (tournament) {
      tournament.rounds.forEach((round, rIdx) => {
        round.matches.forEach((match, mIdx) => {
          if (match.played) {
            locallyPlayedMatches[`${rIdx}-${mIdx}`] = {
              score1: match.score1, score2: match.score2, pens1: match.pens1, pens2: match.pens2, winner: match.winner
            };
          }
        });
      });
    }

    tournament = t;
    tournament.userStats = myStats;
    tournament.userEliminated = myEliminated;
    
    tournament.rounds.forEach((round, rIdx) => {
      round.matches.forEach((match, mIdx) => {
        if (match.team1) match.team1.isUser = (match.team1.id === myMpId);
        if (match.team2) match.team2.isUser = (match.team2.id === myMpId);
        
        // Se l'host non ha ancora registrato il risultato, ma io l'ho giocato, mantengo il mio risultato
        if (!match.played && locallyPlayedMatches[`${rIdx}-${mIdx}`]) {
          const local = locallyPlayedMatches[`${rIdx}-${mIdx}`];
          match.played = true;
          match.score1 = local.score1;
          match.score2 = local.score2;
          match.pens1 = local.pens1;
          match.pens2 = local.pens2;
          match.winner = local.winner;
        }
      });
    });

    // Se ho un risultato in attesa di conferma, e l'host l'ha registrato, fermo il retry
    if (pendingMatchResult) {
      const match = tournament.rounds[pendingMatchResult.rIdx].matches[pendingMatchResult.mIdx];
      if (match && match.played) {
        clearInterval(pendingMatchInterval);
        pendingMatchResult = null;
      }
    }

    renderBracket();
    if (checkTournamentEnd()) return;
  }

  function checkTournamentEnd() {
    const finalMatch = tournament.rounds[tournament.rounds.length - 1].matches[0];
    if (finalMatch.played) {
      showChampion(finalMatch.winner);
      return true;
    }
    return false;
  }

  function finishMatch(match, s1, s2, p1, p2) {
    let winner;
    if (s1 > s2) winner = match.team1;
    else if (s2 > s1) winner = match.team2;
    else winner = (p1 > p2) ? match.team1 : match.team2;

    match.score1 = s1; match.score2 = s2; match.pens1 = p1; match.pens2 = p2; match.winner = winner; match.played = true;

    const userWasPlaying = match.team1.isUser || match.team2.isUser;
    if (userWasPlaying) {
      if (winner.isUser) tournament.userStats.wins++;
      else { tournament.userStats.losses++; tournament.userEliminated = true; }
    }

    const { rIdx, mIdx } = currentMatchData;

    setTimeout(() => {
      matchSimOverlay.classList.remove('show');

      if (isMultiplayer) {
        if (mpState.host) {
          advanceTournament(rIdx, mIdx, winner);
          simulateAllAIMatches();
          renderBracket();
          broadcastTournament();
          if (checkTournamentEnd()) return;
        } else {
          // Il client invia il risultato e si mette in attesa di conferma dall'host
          pendingMatchResult = { rIdx, mIdx, score1: s1, score2: s2, pens1: p1, pens2: p2 };
          hostConnection.send({ type: 'match_result', rIdx, mIdx, score1: s1, score2: s2, pens1: p1, pens2: p2 });
          
          // Se l'host non aggiorna il tabellone entro 3 secondi, reinvia il risultato
          pendingMatchInterval = setInterval(() => {
            hostConnection.send({ type: 'match_result', rIdx, mIdx, score1: s1, score2: s2, pens1: p1, pens2: p2 });
          }, 3000);
        }
      } else {
        advanceTournament(rIdx, mIdx, winner);
        simulateAllAIMatches();
        renderBracket();
        if (checkTournamentEnd()) return;
      }
    }, 2000);
  }

  function showChampion(winner) {
    const oldTrophy = document.getElementById('trophyDiv'); if (oldTrophy) oldTrophy.remove();
    modalEyebrow.textContent = "Fine Mondiale"; modalTitle.textContent = "Campione del Mondo!"; modalTitle.classList.add('champion');
    modalContent.style.display = 'none'; btnPlayTournament.style.display = 'none'; btnNewDraft.textContent = 'Torna alla Home';
    let summaryHTML = `<div style="font-size:60px; margin-bottom:20px;">🏆</div><h2 class="champion" style="margin-bottom: 20px;">${escapeHTML(winner.name)}</h2>`;
    if (tournament.userStats) {
      const isUserWinner = winner.isUser;
      summaryHTML += `
        <div class="summary-stats">
          <div class="stat-item"><div class="stat-value">${tournament.userStats.gf}</div><div class="stat-label">Gol Fatti</div></div>
          <div class="stat-item"><div class="stat-value">${tournament.userStats.gs}</div><div class="stat-label">Gol Subiti</div></div>
          <div class="stat-item"><div class="stat-value" style="color:${isUserWinner ? 'var(--gold)' : 'var(--pink)'}">${isUserWinner ? 'VITTORIA' : 'SCONFITTA'}</div><div class="stat-label">Risultato</div></div>
        </div>`;
    }
    const trofeoDiv = document.createElement('div'); trofeoDiv.id = 'trophyDiv';
    trofeoDiv.innerHTML = summaryHTML;
    modalContent.parentNode.insertBefore(trofeoDiv, modalContent);
    modalOverlay.classList.add('show');
  }

  let toastTimer = null;
  function showToast(msg){ toast.textContent = msg; toast.classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.classList.remove('show'), 3200); }

  initSetupScreen(); renderPitch(); autoLoadData(); 
})();