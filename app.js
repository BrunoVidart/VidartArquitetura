/* =========================================================================
   VA. ATELIER DIGITAL — BRIEFING DE INTERIORES v2.1
   Motor Editorial, Swipe Capture 2-Eixos, Modo Casal, Dossie & Painel
   Zero emojis, zero WebAudio, zero alert(), zero listeners em window (drag)
   ========================================================================= */

(function () {
  'use strict';

  const DATA = window.VA_DATA;
  if (!DATA) return;

  const STORAGE_DRAFT_KEY = 'va_atelier_draft_v2';
  const STORAGE_DOSSIERS_KEY = 'va_atelier_dossiers_v2';

  const RATING_KEYS = {
    ESSENCIAL: 'essencial',
    AFINIDADE: 'afinidade',
    NEUTRO: 'neutro',
    EVITAR: 'evitar'
  };

  const RATING_LABELS = {
    essencial: 'Essencial',
    afinidade: 'Afinidade',
    neutro: 'Neutro',
    evitar: 'Evitar'
  };

  const RATING_TO_CHAR = {
    essencial: 'L',
    afinidade: 'A',
    neutro: 'N',
    evitar: 'X'
  };

  const CHAR_TO_RATING = {
    L: 'essencial',
    A: 'afinidade',
    N: 'neutro',
    X: 'evitar'
  };

  const ACT_TITLES = [
    'Escopo',
    'Curadoria',
    'Rituais',
    'Matéria',
    'Diretrizes',
    'Dossiê'
  ];

  /* =========================================================================
     1. DICIONARIO DE ICONES SVG MONOLINE (stroke-width="1.25")
     ========================================================================= */

  function svgWrap(paths, size = 18) {
    return (
      '<svg xmlns="http://www.w3.org/2000/svg" width="' +
      size +
      '" height="' +
      size +
      '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.25" stroke-linecap="square" stroke-linejoin="miter" aria-hidden="true">' +
      paths +
      '</svg>'
    );
  }

  const SVG_ICONS = {
    // --- 12 Rituais Cotidianos ---
    dinner: svgWrap(
      '<path d="M7 3h10l-1 6a4 4 0 0 1-8 0L7 3z"/><path d="M12 13v8"/><path d="M8 21h8"/>'
    ),
    cooking: svgWrap(
      '<path d="M4 11h16v6a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3v-6z"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/><path d="M2 11h20"/>'
    ),
    work: svgWrap(
      '<rect x="3" y="4" width="18" height="12" rx="1"/><path d="M8 20h8"/><path d="M12 16v4"/>'
    ),
    reading: svgWrap(
      '<path d="M2 5h7a3 3 0 0 1 3 3v12a2 2 0 0 0-2-2H2V5z"/><path d="M22 5h-7a3 3 0 0 0-3 3v12a2 2 0 0 1 2-2h8V5z"/>'
    ),
    cinema: svgWrap(
      '<rect x="2" y="5" width="20" height="13" rx="1"/><path d="M10 9.5l5 2.5-5 2.5V9.5z"/><path d="M7 21h10"/>'
    ),
    pets: svgWrap(
      '<circle cx="7" cy="9" r="1.5"/><circle cx="12" cy="6.5" r="1.5"/><circle cx="17" cy="9" r="1.5"/><path d="M7.5 16.5c0-2.5 2-4.5 4.5-4.5s4.5 2 4.5 4.5c0 1.5-1.2 2.5-2.7 2.5h-3.6c-1.5 0-2.7-1-2.7-2.5z"/>'
    ),
    plants: svgWrap(
      '<path d="M12 21V9"/><path d="M12 13c-4 0-6-3-6-6 3 0 6 2 6 6z"/><path d="M12 11c4 0 6-3 6-6-3 0-6 2-6 6z"/><path d="M7 21h10"/>'
    ),
    coffee: svgWrap(
      '<path d="M4 9h12v6a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V9z"/><path d="M16 10h2.5a2.5 2.5 0 0 1 0 5H16"/><path d="M3 21h14"/><path d="M8 4v2"/><path d="M12 3v3"/>'
    ),
    bath: svgWrap(
      '<path d="M3 12h18v3a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4v-3z"/><path d="M6 12V6a2 2 0 0 1 4 0"/><path d="M6 19v2"/><path d="M18 19v2"/>'
    ),
    adega: svgWrap(
      '<path d="M9 3h4v4l2 3v11H7V10l2-3V3z"/><path d="M7 14h8"/><path d="M18 11h3v4a1.5 1.5 0 0 1-3 0v-4z"/><path d="M19.5 16.5V21"/>'
    ),
    wellness: svgWrap(
      '<circle cx="12" cy="5.5" r="2"/><path d="M6 11l6-2 6 2"/><path d="M12 9v6"/><path d="M8 21l4-6 4 6"/>'
    ),
    kids: svgWrap(
      '<rect x="3" y="12" width="8" height="8"/><rect x="13" y="12" width="8" height="8"/><rect x="8" y="4" width="8" height="8"/>'
    ),

    // --- 6 Prioridades de Investimento ---
    millwork: svgWrap(
      '<path d="M4 20V4h16"/><path d="M9 20V9h11"/><path d="M4 9h5"/><path d="M9 4v5"/>'
    ),
    stone: svgWrap(
      '<polygon points="6,4 18,4 21,10 17,20 7,20 3,10"/><path d="M3 10h18"/><path d="M9 4l-2 6 5 10 5-10-2-6"/>'
    ),
    lighting: svgWrap(
      '<path d="M12 2v4"/><path d="M7 11a5 5 0 0 1 10 0H7z"/><path d="M5 15l-1 3"/><path d="M12 15v4"/><path d="M19 15l1 3"/>'
    ),
    furniture: svgWrap(
      '<path d="M6 11V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v5"/><path d="M4 11h16v4H4v-4z"/><path d="M6 15v5"/><path d="M18 15v5"/>'
    ),
    acoustics: svgWrap(
      '<path d="M4 6v12"/><path d="M8 4v16"/><path d="M12 7v10"/><path d="M16 4v16"/><path d="M20 6v12"/>'
    ),
    art: svgWrap(
      '<rect x="4" y="3" width="16" height="18"/><rect x="8" y="7" width="8" height="10"/><path d="M8 14l2.5-2.5 2 2 3.5-3.5"/>'
    ),

    // --- UI Controls ---
    close: svgWrap('<path d="M6 6l12 12"/><path d="M18 6L6 18"/>'),
    arrowLeft: svgWrap('<path d="M19 12H5"/><path d="M11 6l-6 6 6 6"/>'),
    arrowRight: svgWrap('<path d="M5 12h14"/><path d="M13 6l6 6-6 6"/>'),
    arrowUp: svgWrap('<path d="M12 19V5"/><path d="M6 11l6-6 6 6"/>'),
    arrowDown: svgWrap('<path d="M12 5v14"/><path d="M6 13l6 6 6-6"/>'),
    undo: svgWrap('<path d="M9 14L4 9l5-5"/><path d="M4 9h10a6 6 0 1 1 0 12h-3"/>'),
    zoom: svgWrap('<circle cx="11" cy="11" r="6"/><path d="M20 20l-4.5-4.5"/><path d="M11 8v6"/><path d="M8 11h6"/>'),
    check: svgWrap('<path d="M5 12.5l4.5 4.5L19 7"/>'),
    copy: svgWrap('<rect x="9" y="9" width="11" height="11"/><path d="M5 15H4V4h11v1"/>'),
    print: svgWrap('<path d="M6 9V3h12v6"/><rect x="3" y="9" width="18" height="8"/><rect x="6" y="14" width="12" height="7"/>'),
    download: svgWrap('<path d="M12 4v12"/><path d="M7 11l5 5 5-5"/><path d="M4 20h16"/>'),
    trash: svgWrap('<path d="M4 6h16"/><path d="M9 6V3h6v3"/><path d="M6 6l1 15h10l1-15"/>'),
    couple: svgWrap('<circle cx="9" cy="8" r="3"/><circle cx="15" cy="8" r="3"/><path d="M3 20c0-3.5 2.5-5.5 6-5.5"/><path d="M21 20c0-3.5-2.5-5.5-6-5.5"/><path d="M12 15.5c1.5 0 3 .8 3.5 4.5h-7c.5-3.7 2-4.5 3.5-4.5z"/>'),
    fallback: svgWrap('<rect x="3" y="4" width="18" height="16"/><path d="M3 16l5-5 4 4 3-3 6 4"/><circle cx="8.5" cy="8.5" r="1.25"/>', 24)
  };

  const ICON_KEY_ALIASES = {
    // Rituals Portuguese & English variants (all 12 data.js iconKeys)
    wine: 'dinner',
    receber: 'dinner',
    jantares: 'dinner',
    receber_jantares: 'dinner',
    receber_amigos: 'dinner',
    hosting: 'dinner',
    utensils: 'cooking',
    culinaria: 'cooking',
    culinaria_diaria: 'cooking',
    cozinha_gourmet: 'cooking',
    kitchen: 'cooking',
    chef: 'cooking',
    laptop: 'work',
    home_office: 'work',
    trabalho_remoto: 'work',
    office: 'work',
    remote: 'work',
    leitura: 'reading',
    leitura_silencio: 'reading',
    relax_zen: 'reading',
    book: 'reading',
    silence: 'reading',
    cinema_casa: 'cinema',
    cinema_em_casa: 'cinema',
    film: 'cinema',
    tv: 'cinema',
    paw: 'pets',
    pet: 'pets',
    pets_livres: 'pets',
    convivencia_pets: 'pets',
    biofilia: 'plants',
    biofilia_plantas: 'plants',
    muitas_plantas: 'plants',
    botanic: 'plants',
    leaf: 'plants',
    cafe: 'coffee',
    tea: 'coffee',
    cantinho_cafe: 'coffee',
    ritual_cafe: 'coffee',
    banho: 'bath',
    banho_spa: 'bath',
    banho_terapeutico: 'bath',
    spa: 'bath',
    bottle: 'adega',
    adega_vinhos: 'adega',
    adega_degustacao: 'adega',
    cellar: 'adega',
    activity: 'wellness',
    movimento: 'wellness',
    pratica_movimento: 'wellness',
    fitness: 'wellness',
    fitness_casa: 'wellness',
    yoga: 'wellness',
    movement: 'wellness',
    blocks: 'kids',
    infantil: 'kids',
    convivencia_infantil: 'kids',
    criancas_brincar: 'kids',
    children: 'kids',
    play: 'kids',

    // Priorities Portuguese & English variants (all 6 data.js iconKeys)
    layers: 'millwork',
    marcenaria: 'millwork',
    prio_marcenaria: 'millwork',
    woodwork: 'millwork',
    gem: 'stone',
    pedras: 'stone',
    marmores: 'stone',
    marble: 'stone',
    prio_pedras: 'stone',
    sun: 'lighting',
    luminotecnica: 'lighting',
    iluminacao: 'lighting',
    light: 'lighting',
    prio_iluminacao: 'lighting',
    armchair: 'furniture',
    mobiliario: 'furniture',
    designers: 'furniture',
    chair: 'furniture',
    prio_mobiliario: 'furniture',
    sliders: 'acoustics',
    acustica: 'acoustics',
    climatizacao: 'acoustics',
    hvac: 'acoustics',
    prio_acustica: 'acoustics',
    frame: 'art',
    arte: 'art',
    curadoria: 'art',
    gallery: 'art',
    prio_arte: 'art'
  };

  function getSvgIcon(key) {
    if (SVG_ICONS[key]) return SVG_ICONS[key];
    const mapped = ICON_KEY_ALIASES[key];
    if (mapped && SVG_ICONS[mapped]) return SVG_ICONS[mapped];
    return SVG_ICONS.art;
  }

  /* =========================================================================
     2. UTILITARIOS GERAIS, ESCAPE HTML & FALLBACK DE IMAGEM ARQUITETONICA
     ========================================================================= */

  function escapeHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function buildArchitecturalFallbackSvg(title, env) {
    const safeTitle = escapeHtml(title || 'Referência Arquitetônica');
    const safeEnv = escapeHtml(env || 'VA. ESTÚDIO');
    return (
      '<div class="arch-fallback-inner">' +
      '<svg class="arch-fallback-svg" viewBox="0 0 320 200" fill="none" stroke="currentColor" stroke-width="1.1" aria-hidden="true">' +
      '<rect x="24" y="24" width="272" height="152"/>' +
      '<line x1="24" y1="142" x2="296" y2="142"/>' +
      '<line x1="112" y1="24" x2="112" y2="142"/>' +
      '<rect x="136" y="48" width="128" height="72"/>' +
      '<line x1="136" y1="84" x2="264" y2="84"/>' +
      '<rect x="44" y="64" width="48" height="78"/>' +
      '<circle cx="176" cy="142" r="14"/>' +
      '</svg>' +
      '<div class="arch-fallback-meta">' +
      safeEnv +
      '</div>' +
      '<div class="arch-fallback-title">' +
      safeTitle +
      '</div>' +
      '</div>'
    );
  }

  function attachImageLifecycle(imgEl, wrapperEl, title, env) {
    if (!imgEl || !wrapperEl) return;

    const existingFallback = wrapperEl.querySelector('.arch-fallback-box');
    if (existingFallback) existingFallback.remove();

    wrapperEl.classList.add('img-skeleton');
    wrapperEl.classList.remove('img-loaded', 'img-fallback');
    imgEl.style.display = '';

    imgEl.onload = function () {
      wrapperEl.classList.remove('img-skeleton', 'img-fallback');
      wrapperEl.classList.add('img-loaded');
    };

    imgEl.onerror = function () {
      wrapperEl.classList.remove('img-skeleton', 'img-loaded');
      wrapperEl.classList.add('img-fallback');
      imgEl.style.display = 'none';
      if (!wrapperEl.querySelector('.arch-fallback-box')) {
        const box = document.createElement('div');
        box.className = 'arch-fallback-box';
        box.innerHTML = buildArchitecturalFallbackSvg(title, env);
        wrapperEl.appendChild(box);
      }
    };
  }

  function clamp(num, min, max) {
    return Math.max(min, Math.min(max, num));
  }

  function pad2(n) {
    return String(n).padStart(2, '0');
  }

  /* =========================================================================
     3. SHA-256 (Web Crypto + Fallback Pure-JS para file://)
     ========================================================================= */

  function sha256PureJs(bytes) {
    const K = [
      0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
      0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
      0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
      0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
      0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
      0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
      0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
      0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
    ];
    const H = [
      0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
      0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19
    ];

    const bitLen = bytes.length * 8;
    const paddedLen = Math.ceil((bytes.length + 9) / 64) * 64;
    const msg = new Uint8Array(paddedLen);
    msg.set(bytes);
    msg[bytes.length] = 0x80;

    const view = new DataView(msg.buffer);
    view.setUint32(paddedLen - 8, Math.floor(bitLen / 0x100000000), false);
    view.setUint32(paddedLen - 4, bitLen >>> 0, false);

    const w = new Uint32Array(64);
    const rotr = function (x, n) {
      return (x >>> n) | (x << (32 - n));
    };

    for (let offset = 0; offset < paddedLen; offset += 64) {
      for (let i = 0; i < 16; i++) {
        w[i] = view.getUint32(offset + i * 4, false);
      }
      for (let i = 16; i < 64; i++) {
        const s0 = rotr(w[i - 15], 7) ^ rotr(w[i - 15], 18) ^ (w[i - 15] >>> 3);
        const s1 = rotr(w[i - 2], 17) ^ rotr(w[i - 2], 19) ^ (w[i - 2] >>> 10);
        w[i] = (w[i - 16] + s0 + w[i - 7] + s1) >>> 0;
      }

      let a = H[0], b = H[1], c = H[2], d = H[3];
      let e = H[4], f = H[5], g = H[6], h = H[7];

      for (let i = 0; i < 64; i++) {
        const S1 = rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25);
        const ch = (e & f) ^ (~e & g);
        const temp1 = (h + S1 + ch + K[i] + w[i]) >>> 0;
        const S0 = rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22);
        const maj = (a & b) ^ (a & c) ^ (b & c);
        const temp2 = (S0 + maj) >>> 0;

        h = g;
        g = f;
        f = e;
        e = (d + temp1) >>> 0;
        d = c;
        c = b;
        b = a;
        a = (temp1 + temp2) >>> 0;
      }

      H[0] = (H[0] + a) >>> 0;
      H[1] = (H[1] + b) >>> 0;
      H[2] = (H[2] + c) >>> 0;
      H[3] = (H[3] + d) >>> 0;
      H[4] = (H[4] + e) >>> 0;
      H[5] = (H[5] + f) >>> 0;
      H[6] = (H[6] + g) >>> 0;
      H[7] = (H[7] + h) >>> 0;
    }

    let hex = '';
    for (let i = 0; i < 8; i++) {
      hex += H[i].toString(16).padStart(8, '0');
    }
    return hex;
  }

  async function sha256Hex(text) {
    const bytes = new TextEncoder().encode(String(text || ''));
    if (window.crypto && window.crypto.subtle && typeof window.crypto.subtle.digest === 'function') {
      try {
        const digest = await window.crypto.subtle.digest('SHA-256', bytes);
        const arr = Array.from(new Uint8Array(digest));
        return arr.map((b) => b.toString(16).padStart(2, '0')).join('');
      } catch (_) {
        return sha256PureJs(bytes);
      }
    }
    return sha256PureJs(bytes);
  }

  /* =========================================================================
     4. ESTADO LIMPO INICIAL & PERSISTENCIA (RASCUNHO + DOSSIES)
     ========================================================================= */

  function createEmptyProfile() {
    return {
      cardIndex: 0,
      ratings: {},
      ratingHistory: [],
      rituals: [],
      tradeoffs: {},
      ergonomics: {
        bed: '',
        basin: '',
        shower: ''
      },
      palettePrimary: '',
      paletteSecondary: '',
      patina: 3,
      specTier: '',
      priorities: [],
      timeline: '',
      vetos: []
    };
  }

  function createCleanDraft() {
    return {
      scope: {
        clientName: '',
        projectName: '',
        typology: '',
        stage: '',
        area: '',
        rooms: [],
        household: [],
        hasHeirloom: false,
        heirloomNote: '',
        coupleMode: false,
        residentAName: '',
        residentBName: ''
      },
      activeResident: 'A',
      highestAct: 0,
      currentScreen: 'screen-act-0',
      profiles: {
        A: createEmptyProfile(),
        B: createEmptyProfile()
      }
    };
  }

  const appState = {
    draft: createCleanDraft(),
    activeDossier: null,
    isAdminLoggedIn: false,
    selectedAdminCode: null,
    toastTimer: null,
    deckAnimating: false,
    deckSlots: [],
    lightboxCard: null
  };

  function getActiveProfile() {
    return appState.draft.profiles[appState.draft.activeResident] || appState.draft.profiles.A;
  }

  function getResidentLabel(who) {
    const sc = appState.draft.scope;
    if (who === 'B') {
      return (sc.residentBName || '').trim() || 'Morador B';
    }
    return (sc.residentAName || '').trim() || 'Morador A';
  }

  function getDossierResidentLabel(dossier, who) {
    const sc = (dossier && dossier.scope) || {};
    if (who === 'B') {
      return (sc.residentBName || '').trim() || 'Morador B';
    }
    return (sc.residentAName || '').trim() || 'Morador A';
  }

  function hasMeaningfulDraft(draft) {
    if (!draft || !draft.scope) return false;
    const sc = draft.scope;
    const pA = draft.profiles && draft.profiles.A ? draft.profiles.A : {};
    const pB = draft.profiles && draft.profiles.B ? draft.profiles.B : {};
    return Boolean(
      (sc.clientName && sc.clientName.trim()) ||
      (sc.projectName && sc.projectName.trim()) ||
      sc.typology ||
      sc.stage ||
      sc.area ||
      (sc.rooms && sc.rooms.length > 0) ||
      (sc.household && sc.household.length > 0) ||
      sc.hasHeirloom ||
      sc.coupleMode ||
      Object.keys(pA.ratings || {}).length > 0 ||
      (pA.rituals && pA.rituals.length > 0) ||
      pA.palettePrimary ||
      pA.specTier ||
      Object.keys(pB.ratings || {}).length > 0
    );
  }

  function saveDraft() {
    try {
      if (hasMeaningfulDraft(appState.draft)) {
        localStorage.setItem(STORAGE_DRAFT_KEY, JSON.stringify(appState.draft));
      } else {
        localStorage.removeItem(STORAGE_DRAFT_KEY);
      }
    } catch (_) {}
  }

  function loadDraftFromStorage() {
    try {
      const raw = localStorage.getItem(STORAGE_DRAFT_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (!parsed || !parsed.scope || !parsed.profiles || !parsed.profiles.A) return null;
      return normalizeDraft(parsed);
    } catch (_) {
      return null;
    }
  }

  function normalizeProfile(raw) {
    const clean = createEmptyProfile();
    if (!raw || typeof raw !== 'object') return clean;
    clean.cardIndex = clamp(Number(raw.cardIndex) || 0, 0, DATA.cards.length);
    clean.ratings = raw.ratings && typeof raw.ratings === 'object' ? { ...raw.ratings } : {};
    clean.ratingHistory = Array.isArray(raw.ratingHistory) ? raw.ratingHistory.slice() : [];
    clean.rituals = Array.isArray(raw.rituals) ? raw.rituals.slice() : [];
    clean.tradeoffs = raw.tradeoffs && typeof raw.tradeoffs === 'object' ? { ...raw.tradeoffs } : {};
    clean.ergonomics = {
      bed: raw.ergonomics && raw.ergonomics.bed ? String(raw.ergonomics.bed) : '',
      basin: raw.ergonomics && raw.ergonomics.basin ? String(raw.ergonomics.basin) : '',
      shower: raw.ergonomics && raw.ergonomics.shower ? String(raw.ergonomics.shower) : ''
    };
    clean.palettePrimary = raw.palettePrimary ? String(raw.palettePrimary) : '';
    clean.paletteSecondary = raw.paletteSecondary ? String(raw.paletteSecondary) : '';
    clean.patina = clamp(Number(raw.patina) || 3, 1, 5);
    clean.specTier = raw.specTier ? String(raw.specTier) : '';
    clean.priorities = Array.isArray(raw.priorities) ? raw.priorities.slice(0, 3) : [];
    clean.timeline = raw.timeline ? String(raw.timeline) : '';
    clean.vetos = Array.isArray(raw.vetos) ? raw.vetos.slice() : [];
    return clean;
  }

  function normalizeDraft(raw) {
    const clean = createCleanDraft();
    const sc = raw.scope || {};
    clean.scope = {
      clientName: String(sc.clientName || ''),
      projectName: String(sc.projectName || ''),
      typology: String(sc.typology || ''),
      stage: String(sc.stage || ''),
      area: String(sc.area || ''),
      rooms: Array.isArray(sc.rooms) ? sc.rooms.slice() : [],
      household: Array.isArray(sc.household) ? sc.household.slice() : [],
      hasHeirloom: Boolean(sc.hasHeirloom),
      heirloomNote: String(sc.heirloomNote || ''),
      coupleMode: Boolean(sc.coupleMode),
      residentAName: String(sc.residentAName || ''),
      residentBName: String(sc.residentBName || '')
    };
    clean.activeResident = raw.activeResident === 'B' ? 'B' : 'A';
    clean.highestAct = clamp(Number(raw.highestAct) || 0, 0, 5);
    clean.currentScreen = typeof raw.currentScreen === 'string' ? raw.currentScreen : 'screen-act-0';
    clean.profiles = {
      A: normalizeProfile(raw.profiles && raw.profiles.A),
      B: normalizeProfile(raw.profiles && raw.profiles.B)
    };
    return clean;
  }

  function clearDraftStorage() {
    try {
      localStorage.removeItem(STORAGE_DRAFT_KEY);
    } catch (_) {}
  }

  function loadStoredDossiers() {
    try {
      const raw = localStorage.getItem(STORAGE_DOSSIERS_KEY);
      if (!raw) return [];
      const arr = JSON.parse(raw);
      return Array.isArray(arr) ? arr : [];
    } catch (_) {
      return [];
    }
  }

  function saveStoredDossiers(list) {
    try {
      localStorage.setItem(STORAGE_DOSSIERS_KEY, JSON.stringify(list));
    } catch (_) {}
  }

  function upsertDossier(dossier) {
    if (!dossier || !dossier.code) return;
    const list = loadStoredDossiers();
    const idx = list.findIndex((item) => item.code === dossier.code);
    if (idx >= 0) {
      list[idx] = dossier;
    } else {
      list.unshift(dossier);
    }
    saveStoredDossiers(list);
  }

  function generateUniqueDossierCode() {
    const existing = new Set(loadStoredDossiers().map((d) => d.code));
    for (let attempt = 0; attempt < 100; attempt++) {
      const num = Math.floor(100 + Math.random() * 900);
      const code = 'VA-2026-' + num;
      if (!existing.has(code)) return code;
    }
    return 'VA-2026-' + String(Date.now()).slice(-3);
  }

  /* =========================================================================
     5. CODIFICACAO COMPACTA #dossier= (UTF-8 Base64URL < 600 chars)
     ========================================================================= */

  function toBase64Url(str) {
    const bytes = new TextEncoder().encode(str);
    let bin = '';
    for (let i = 0; i < bytes.length; i++) {
      bin += String.fromCharCode(bytes[i]);
    }
    return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }

  function fromBase64Url(token) {
    const clean = String(token || '').trim().replace(/-/g, '+').replace(/_/g, '/');
    if (!clean) throw new Error('Empty token');
    const padded = clean + '==='.slice((clean.length + 3) % 4);
    const bin = atob(padded);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) {
      bytes[i] = bin.charCodeAt(i);
    }
    return new TextDecoder().decode(bytes);
  }

  function idxOfOption(list, id) {
    if (!id || !Array.isArray(list)) return -1;
    return list.findIndex((item) => item.id === id);
  }

  function idAtIndex(list, idx) {
    if (!Array.isArray(list) || idx < 0 || idx >= list.length) return '';
    return list[idx].id;
  }

  function encodeCompactProfile(profile) {
    const ratingsStr = DATA.cards
      .map((card) => RATING_TO_CHAR[profile.ratings[card.id]] || '-')
      .join('');

    const lf = (profile.rituals || [])
      .map((id) => idxOfOption(DATA.rituals, id))
      .filter((i) => i >= 0);

    const tr = DATA.tradeoffs.map((t) => {
      const val = profile.tradeoffs[t.id];
      return val === 'B' ? 1 : val === 'A' ? 0 : -1;
    });

    const er = [
      idxOfOption(DATA.ergonomics.bedSizes, profile.ergonomics.bed),
      idxOfOption(DATA.ergonomics.bathBasins, profile.ergonomics.basin),
      idxOfOption(DATA.ergonomics.bathShowers, profile.ergonomics.shower)
    ];

    const pl = [
      idxOfOption(DATA.palettes, profile.palettePrimary),
      idxOfOption(DATA.palettes, profile.paletteSecondary)
    ];

    const pr = (profile.priorities || [])
      .map((id) => idxOfOption(DATA.priorities, id))
      .filter((i) => i >= 0);

    const vt = (profile.vetos || [])
      .map((id) => idxOfOption(DATA.vetos, id))
      .filter((i) => i >= 0);

    return {
      r: ratingsStr,
      lf: lf,
      tr: tr,
      er: er,
      pl: pl,
      pt: clamp(Number(profile.patina) || 3, 1, 5),
      sp: idxOfOption(DATA.scopeOptions.specTiers, profile.specTier),
      tl: idxOfOption(DATA.scopeOptions.timelines, profile.timeline),
      pr: pr,
      vt: vt
    };
  }

  function decodeCompactProfile(comp) {
    const prof = createEmptyProfile();
    if (!comp || typeof comp !== 'object') return prof;

    const rStr = String(comp.r || '');
    DATA.cards.forEach((card, i) => {
      const ch = rStr[i];
      if (ch && CHAR_TO_RATING[ch]) {
        prof.ratings[card.id] = CHAR_TO_RATING[ch];
      }
    });
    prof.cardIndex = DATA.cards.length;

    if (Array.isArray(comp.lf)) {
      prof.rituals = comp.lf.map((i) => idAtIndex(DATA.rituals, i)).filter(Boolean);
    }

    if (Array.isArray(comp.tr)) {
      DATA.tradeoffs.forEach((t, i) => {
        if (comp.tr[i] === 0) prof.tradeoffs[t.id] = 'A';
        else if (comp.tr[i] === 1) prof.tradeoffs[t.id] = 'B';
      });
    }

    if (Array.isArray(comp.er)) {
      prof.ergonomics.bed = idAtIndex(DATA.ergonomics.bedSizes, comp.er[0]);
      prof.ergonomics.basin = idAtIndex(DATA.ergonomics.bathBasins, comp.er[1]);
      prof.ergonomics.shower = idAtIndex(DATA.ergonomics.bathShowers, comp.er[2]);
    }

    if (Array.isArray(comp.pl)) {
      prof.palettePrimary = idAtIndex(DATA.palettes, comp.pl[0]);
      prof.paletteSecondary = idAtIndex(DATA.palettes, comp.pl[1]);
    }

    prof.patina = clamp(Number(comp.pt) || 3, 1, 5);
    prof.specTier = idAtIndex(DATA.scopeOptions.specTiers, comp.sp);
    prof.timeline = idAtIndex(DATA.scopeOptions.timelines, comp.tl);

    if (Array.isArray(comp.pr)) {
      prof.priorities = comp.pr.map((i) => idAtIndex(DATA.priorities, i)).filter(Boolean).slice(0, 3);
    }

    if (Array.isArray(comp.vt)) {
      prof.vetos = comp.vt.map((i) => idAtIndex(DATA.vetos, i)).filter(Boolean);
    }

    return prof;
  }

  function encodeDossier(dossier) {
    const sc = dossier.scope || {};
    const pA = dossier.profiles && dossier.profiles.A ? dossier.profiles.A : createEmptyProfile();

    const payload = {
      v: 2,
      id: dossier.code,
      n: [
        String(sc.clientName || '').slice(0, 48),
        String(sc.projectName || '').slice(0, 48)
      ],
      d: dossier.createdAt ? String(dossier.createdAt).slice(0, 10) : new Date().toISOString().slice(0, 10),
      sc: [
        idxOfOption(DATA.scopeOptions.typologies, sc.typology),
        idxOfOption(DATA.scopeOptions.stages, sc.stage),
        idxOfOption(DATA.scopeOptions.areas, sc.area),
        idxOfOption(DATA.scopeOptions.specTiers, pA.specTier),
        idxOfOption(DATA.scopeOptions.timelines, pA.timeline),
        sc.hasHeirloom ? 1 : 0
      ],
      rm: (sc.rooms || []).map((id) => idxOfOption(DATA.scopeOptions.rooms, id)).filter((i) => i >= 0),
      hh: (sc.household || []).map((id) => idxOfOption(DATA.scopeOptions.household, id)).filter((i) => i >= 0),
      c: sc.coupleMode ? 1 : 0,
      a: encodeCompactProfile(pA)
    };

    if (sc.hasHeirloom && sc.heirloomNote) {
      payload.hn = String(sc.heirloomNote).slice(0, 72);
    }

    if (sc.coupleMode) {
      if (sc.residentAName || sc.residentBName) {
        payload.rn = [
          String(sc.residentAName || '').slice(0, 24),
          String(sc.residentBName || '').slice(0, 24)
        ];
      }
      payload.b = encodeCompactProfile(dossier.profiles.B || createEmptyProfile());
    }

    return toBase64Url(JSON.stringify(payload));
  }

  function decodeDossier(token) {
    try {
      let cleanToken = String(token || '').trim();
      const hashPos = cleanToken.indexOf('#dossier=');
      if (hashPos >= 0) {
        cleanToken = cleanToken.slice(hashPos + 9);
      } else if (cleanToken.startsWith('dossier=')) {
        cleanToken = cleanToken.slice(8);
      }
      if (!cleanToken) return null;

      const jsonStr = fromBase64Url(cleanToken);
      const p = JSON.parse(jsonStr);
      if (!p || p.v !== 2 || !p.id || !p.a) return null;

      const scArr = Array.isArray(p.sc) ? p.sc : [];
      const namesArr = Array.isArray(p.n) ? p.n : [];
      const resNames = Array.isArray(p.rn) ? p.rn : [];

      const profA = decodeCompactProfile(p.a);
      if (!profA.specTier && scArr[3] >= 0) {
        profA.specTier = idAtIndex(DATA.scopeOptions.specTiers, scArr[3]);
      }
      if (!profA.timeline && scArr[4] >= 0) {
        profA.timeline = idAtIndex(DATA.scopeOptions.timelines, scArr[4]);
      }

      const coupleMode = p.c === 1;
      const profB = coupleMode && p.b ? decodeCompactProfile(p.b) : createEmptyProfile();

      return {
        version: 2,
        code: String(p.id),
        createdAt: String(p.d || new Date().toISOString().slice(0, 10)),
        scope: {
          clientName: String(namesArr[0] || ''),
          projectName: String(namesArr[1] || ''),
          typology: idAtIndex(DATA.scopeOptions.typologies, scArr[0]),
          stage: idAtIndex(DATA.scopeOptions.stages, scArr[1]),
          area: idAtIndex(DATA.scopeOptions.areas, scArr[2]),
          rooms: Array.isArray(p.rm) ? p.rm.map((i) => idAtIndex(DATA.scopeOptions.rooms, i)).filter(Boolean) : [],
          household: Array.isArray(p.hh) ? p.hh.map((i) => idAtIndex(DATA.scopeOptions.household, i)).filter(Boolean) : [],
          hasHeirloom: scArr[5] === 1,
          heirloomNote: String(p.hn || ''),
          coupleMode: coupleMode,
          residentAName: String(resNames[0] || ''),
          residentBName: String(resNames[1] || '')
        },
        profiles: {
          A: profA,
          B: profB
        }
      };
    } catch (_) {
      return null;
    }
  }

  function buildDossierShareUrl(dossier) {
    const base = window.location.href.split('#')[0];
    return base + '#dossier=' + encodeDossier(dossier);
  }

  /* =========================================================================
     6. REFERENCIAS DOM (INTERFACE CONTRACT)
     ========================================================================= */

  const dom = {
    brandHome: document.getElementById('brand-home'),
    headerActNav: document.getElementById('header-act-nav'),
    btnOpenAdmin: document.getElementById('btn-open-admin'),
    progressHairline: document.getElementById('progress-hairline'),

    // Screens
    screens: {
      'screen-act-0': document.getElementById('screen-act-0'),
      'screen-act-1': document.getElementById('screen-act-1'),
      'screen-act-2': document.getElementById('screen-act-2'),
      'screen-act-3': document.getElementById('screen-act-3'),
      'screen-act-4': document.getElementById('screen-act-4'),
      'screen-couple-handoff': document.getElementById('screen-couple-handoff'),
      'screen-act-5': document.getElementById('screen-act-5'),
      'screen-admin': document.getElementById('screen-admin')
    },

    // Act 0
    draftBanner: document.getElementById('draft-banner'),
    btnResumeDraft: document.getElementById('btn-resume-draft'),
    btnDiscardDraft: document.getElementById('btn-discard-draft'),
    inputClientName: document.getElementById('input-client-name'),
    inputProjectName: document.getElementById('input-project-name'),
    scopeTypology: document.getElementById('scope-typology'),
    scopeStage: document.getElementById('scope-stage'),
    scopeArea: document.getElementById('scope-area'),
    scopeRooms: document.getElementById('scope-rooms'),
    scopeHousehold: document.getElementById('scope-household'),
    toggleHeirloom: document.getElementById('toggle-heirloom'),
    heirloomNoteWrap: document.getElementById('heirloom-note-wrap'),
    inputHeirloomNote: document.getElementById('input-heirloom-note'),
    toggleCoupleMode: document.getElementById('toggle-couple-mode'),
    coupleNamesWrap: document.getElementById('couple-names-wrap'),
    inputResidentA: document.getElementById('input-resident-a'),
    inputResidentB: document.getElementById('input-resident-b'),
    btnStartBriefing: document.getElementById('btn-start-briefing'),

    // Act 1
    activeResidentBanner: document.getElementById('active-resident-banner'),
    deckEnvLabel: document.getElementById('deck-env-label'),
    deckCounter: document.getElementById('deck-counter'),
    deckStage: document.getElementById('deck-stage'),
    btnRateEvitar: document.getElementById('btn-rate-evitar'),
    btnRateNeutro: document.getElementById('btn-rate-neutro'),
    btnRateAfinidade: document.getElementById('btn-rate-afinidade'),
    btnRateEssencial: document.getElementById('btn-rate-essencial'),
    btnDeckUndo: document.getElementById('btn-deck-undo'),
    btnDeckZoom: document.getElementById('btn-deck-zoom'),
    btnAct1Back: document.getElementById('btn-act1-back'),

    // Act 2
    ritualsGrid: document.getElementById('rituals-grid'),
    tradeoffsList: document.getElementById('tradeoffs-list'),
    ergoBed: document.getElementById('ergo-bed'),
    ergoBasin: document.getElementById('ergo-basin'),
    ergoShower: document.getElementById('ergo-shower'),
    btnAct2Back: document.getElementById('btn-act2-back'),
    btnAct2Next: document.getElementById('btn-act2-next'),

    // Act 3
    palettesGrid: document.getElementById('palettes-grid'),
    patinaSlider: document.getElementById('patina-slider'),
    patinaLabel: document.getElementById('patina-label'),
    patinaDesc: document.getElementById('patina-desc'),
    btnAct3Back: document.getElementById('btn-act3-back'),
    btnAct3Next: document.getElementById('btn-act3-next'),

    // Act 4
    specTiersGrid: document.getElementById('spec-tiers-grid'),
    prioritiesGrid: document.getElementById('priorities-grid'),
    timelinesGrid: document.getElementById('timelines-grid'),
    vetosGrid: document.getElementById('vetos-grid'),
    btnAct4Back: document.getElementById('btn-act4-back'),
    btnAct4Next: document.getElementById('btn-act4-next'),

    // Couple Handoff
    handoffNextName: document.getElementById('handoff-next-name'),
    btnStartResidentB: document.getElementById('btn-start-resident-b'),

    // Act 5
    dossierCode: document.getElementById('dossier-code'),
    dossierDate: document.getElementById('dossier-date'),
    dossierClientTitle: document.getElementById('dossier-client-title'),
    dossierScopeStrip: document.getElementById('dossier-scope-strip'),
    dossierDiagnosticText: document.getElementById('dossier-diagnostic-text'),
    dossierDirectivesGrid: document.getElementById('dossier-directives-grid'),
    dossierCoupleSection: document.getElementById('dossier-couple-section'),
    dossierCoupleScore: document.getElementById('dossier-couple-score'),
    dossierCoupleMatrix: document.getElementById('dossier-couple-matrix'),
    dossierPaletteBoard: document.getElementById('dossier-palette-board'),
    dossierMoodboardGrid: document.getElementById('dossier-moodboard-grid'),
    dossierVetosList: document.getElementById('dossier-vetos-list'),
    btnCopyDossierLink: document.getElementById('btn-copy-dossier-link'),
    btnSendWhatsapp: document.getElementById('btn-send-whatsapp'),
    btnPrintPdf: document.getElementById('btn-print-pdf'),
    btnExportJson: document.getElementById('btn-export-json'),
    btnNewBriefing: document.getElementById('btn-new-briefing'),
    dossierToast: document.getElementById('dossier-toast'),

    // Lightbox
    editorialLightbox: document.getElementById('editorial-lightbox'),
    lightboxImg: document.getElementById('lightbox-img'),
    lightboxEnv: document.getElementById('lightbox-env'),
    lightboxTitle: document.getElementById('lightbox-title'),
    lightboxVariable: document.getElementById('lightbox-variable'),
    lightboxDesc: document.getElementById('lightbox-desc'),
    btnCloseLightbox: document.getElementById('btn-close-lightbox'),

    // Admin
    btnAdminBackPortal: document.getElementById('btn-admin-back-portal'),
    adminAuthBox: document.getElementById('admin-auth-box'),
    adminPinInput: document.getElementById('admin-pin-input'),
    adminAuthError: document.getElementById('admin-auth-error'),
    btnAdminLogin: document.getElementById('btn-admin-login'),
    adminWorkspace: document.getElementById('admin-workspace'),
    adminDossiersTbody: document.getElementById('admin-dossiers-tbody'),
    adminDossierDetail: document.getElementById('admin-dossier-detail'),
    adminImportLinkInput: document.getElementById('admin-import-link-input'),
    btnAdminImportLink: document.getElementById('btn-admin-import-link'),
    adminImportJsonInput: document.getElementById('admin-import-json-input'),
    btnAdminExportAll: document.getElementById('btn-admin-export-all')
  };

  /* =========================================================================
     7. FEEDBACK DISCRETO (TOAST — ZERO ALERT())
     ========================================================================= */

  function ensureInlineToastFallback() {
    let el = document.getElementById('va-global-toast-fallback');
    if (!el) {
      el = document.createElement('div');
      el.id = 'va-global-toast-fallback';
      el.className = 'dossier-toast';
      el.setAttribute('role', 'status');
      el.setAttribute('aria-live', 'polite');
      document.body.appendChild(el);
    }
    return el;
  }

  function showToast(message) {
    const text = String(message || '');
    if (!text) return;

    let target = dom.dossierToast;
    const parentScreen = target ? target.closest('.view-screen') : null;
    if (!target || (parentScreen && !parentScreen.classList.contains('is-active'))) {
      target = ensureInlineToastFallback();
    }

    target.textContent = text;
    target.hidden = false;
    target.classList.add('is-visible');

    if (appState.toastTimer) {
      clearTimeout(appState.toastTimer);
    }
    appState.toastTimer = setTimeout(() => {
      if (dom.dossierToast) {
        dom.dossierToast.classList.remove('is-visible');
      }
      const fb = document.getElementById('va-global-toast-fallback');
      if (fb) fb.classList.remove('is-visible');
    }, 3200);
  }

  /* =========================================================================
     8. NAVEGACAO DE TELAS (requestAnimationFrame) & HEADER PROGRESS
     ========================================================================= */

  function screenToActNumber(screenId) {
    if (screenId === 'screen-act-0') return 0;
    if (screenId === 'screen-act-1') return 1;
    if (screenId === 'screen-act-2') return 2;
    if (screenId === 'screen-act-3') return 3;
    if (screenId === 'screen-act-4' || screenId === 'screen-couple-handoff') return 4;
    if (screenId === 'screen-act-5') return 5;
    return -1;
  }

  function updateProgressHairline(screenId) {
    if (!dom.progressHairline) return;
    const act = screenToActNumber(screenId);
    if (act < 0) {
      dom.progressHairline.style.width = '100%';
      return;
    }
    if (act === 1) {
      const prof = getActiveProfile();
      const ratio = DATA.cards.length ? prof.cardIndex / DATA.cards.length : 0;
      const pct = 16.66 + ratio * 16.66;
      dom.progressHairline.style.width = pct.toFixed(1) + '%';
      return;
    }
    const pct = ((act + 1) / 6) * 100;
    dom.progressHairline.style.width = pct.toFixed(1) + '%';
  }

  function renderHeaderActNav(screenId) {
    if (!dom.headerActNav) return;
    const currentAct = screenToActNumber(screenId);
    const highest = appState.draft.highestAct;

    if (screenId === 'screen-admin') {
      dom.headerActNav.innerHTML = '<span class="act-counter-label">PAINEL VA</span>';
      return;
    }

    const displayAct = currentAct >= 0 ? currentAct + 1 : 1;
    let html = '<span class="act-counter-label">ATO ' + pad2(displayAct) + ' / 06</span>';
    html += '<div class="act-pills-group" role="list">';

    for (let i = 0; i < 6; i++) {
      const isCurrent = i === currentAct;
      const isReachable = i <= highest && i < 5;
      const isCompleted = i < highest || (i === 5 && Boolean(appState.activeDossier) && currentAct === 5);
      const cls = [
        'act-nav-pill',
        isCurrent ? 'is-current' : '',
        isCompleted ? 'is-completed' : ''
      ]
        .filter(Boolean)
        .join(' ');

      html +=
        '<button type="button" class="' +
        cls +
        '" data-act-step="' +
        i +
        '" title="Ato ' +
        pad2(i + 1) +
        ' — ' +
        escapeHtml(ACT_TITLES[i]) +
        '"' +
        (isCurrent ? ' aria-current="step"' : '') +
        (!isReachable && !isCurrent ? ' disabled' : '') +
        '>' +
        pad2(i + 1) +
        '</button>';
    }
    html += '</div>';
    dom.headerActNav.innerHTML = html;

    dom.headerActNav.querySelectorAll('.act-nav-pill[data-act-step]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const step = Number(btn.getAttribute('data-act-step'));
        if (step <= appState.draft.highestAct && step < 5) {
          goToAct(step);
        }
      });
    });
  }

  function navigateTo(screenId, opts) {
    const target = dom.screens[screenId];
    if (!target) return;

    const options = opts || {};

    Object.keys(dom.screens).forEach((key) => {
      const scr = dom.screens[key];
      if (!scr || key === screenId) return;
      scr.classList.remove('is-visible', 'is-active');
    });

    if (screenId !== 'screen-admin' && screenId !== 'screen-act-5') {
      appState.draft.currentScreen = screenId;
      const actNum = screenToActNumber(screenId);
      if (actNum > appState.draft.highestAct) {
        appState.draft.highestAct = actNum;
      }
      if (!options.skipSave) {
        saveDraft();
      }
    }

    target.classList.add('is-active');
    target.classList.remove('is-visible');

    window.scrollTo({ top: 0, behavior: 'auto' });

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        target.classList.add('is-visible');
      });
    });

    renderHeaderActNav(screenId);
    updateProgressHairline(screenId);
  }

  function goToAct(actIndex) {
    if (actIndex === 0) {
      renderAct0();
      navigateTo('screen-act-0');
    } else if (actIndex === 1) {
      const prof = getActiveProfile();
      if (prof.cardIndex >= DATA.cards.length) {
        prof.cardIndex = Math.max(0, DATA.cards.length - 1);
      }
      renderAct1();
      navigateTo('screen-act-1');
    } else if (actIndex === 2) {
      renderAct2();
      navigateTo('screen-act-2');
    } else if (actIndex === 3) {
      renderAct3();
      navigateTo('screen-act-3');
    } else if (actIndex === 4) {
      renderAct4();
      navigateTo('screen-act-4');
    } else if (actIndex === 5 && appState.activeDossier) {
      renderAct5(appState.activeDossier);
      navigateTo('screen-act-5');
    }
  }

  /* =========================================================================
     9. ATO 0 — ESCOPO DO PROJETO & RASCUNHO
     ========================================================================= */

  function renderSingleChoiceGroup(container, options, selectedId, onSelect) {
    if (!container) return;
    container.innerHTML = options
      .map((opt) => {
        const isSel = opt.id === selectedId;
        return (
          '<button type="button" class="choice-chip' +
          (isSel ? ' is-selected' : '') +
          '" data-id="' +
          escapeHtml(opt.id) +
          '" aria-pressed="' +
          String(isSel) +
          '">' +
          escapeHtml(opt.label) +
          '</button>'
        );
      })
      .join('');

    container.querySelectorAll('.choice-chip').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        onSelect(id);
      });
    });
  }

  function renderMultiChoiceGroup(container, options, selectedIds, onToggle) {
    if (!container) return;
    const set = new Set(selectedIds || []);
    container.innerHTML = options
      .map((opt) => {
        const isSel = set.has(opt.id);
        return (
          '<button type="button" class="choice-chip' +
          (isSel ? ' is-selected' : '') +
          '" data-id="' +
          escapeHtml(opt.id) +
          '" aria-pressed="' +
          String(isSel) +
          '">' +
          escapeHtml(opt.label) +
          '</button>'
        );
      })
      .join('');

    container.querySelectorAll('.choice-chip').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        onToggle(id);
      });
    });
  }

  function syncToggleControl(el, active) {
    if (!el) return;
    if (el.tagName === 'INPUT' && el.type === 'checkbox') {
      el.checked = Boolean(active);
    } else {
      el.setAttribute('aria-pressed', String(Boolean(active)));
      el.classList.toggle('is-selected', Boolean(active));
      el.classList.toggle('is-active', Boolean(active));
    }
  }

  function syncConditionalVisibility(el, visible) {
    if (!el) return;
    el.hidden = !visible;
    el.classList.toggle('is-visible', Boolean(visible));
  }

  function renderAct0() {
    const sc = appState.draft.scope;

    if (dom.inputClientName && dom.inputClientName.value !== sc.clientName) {
      dom.inputClientName.value = sc.clientName;
    }
    if (dom.inputProjectName && dom.inputProjectName.value !== sc.projectName) {
      dom.inputProjectName.value = sc.projectName;
    }
    if (dom.inputHeirloomNote && dom.inputHeirloomNote.value !== sc.heirloomNote) {
      dom.inputHeirloomNote.value = sc.heirloomNote;
    }
    if (dom.inputResidentA && dom.inputResidentA.value !== sc.residentAName) {
      dom.inputResidentA.value = sc.residentAName;
    }
    if (dom.inputResidentB && dom.inputResidentB.value !== sc.residentBName) {
      dom.inputResidentB.value = sc.residentBName;
    }

    renderSingleChoiceGroup(dom.scopeTypology, DATA.scopeOptions.typologies, sc.typology, (id) => {
      sc.typology = sc.typology === id ? '' : id;
      saveDraft();
      renderAct0();
    });

    renderSingleChoiceGroup(dom.scopeStage, DATA.scopeOptions.stages, sc.stage, (id) => {
      sc.stage = sc.stage === id ? '' : id;
      saveDraft();
      renderAct0();
    });

    renderSingleChoiceGroup(dom.scopeArea, DATA.scopeOptions.areas, sc.area, (id) => {
      sc.area = sc.area === id ? '' : id;
      saveDraft();
      renderAct0();
    });

    renderMultiChoiceGroup(dom.scopeRooms, DATA.scopeOptions.rooms, sc.rooms, (id) => {
      const idx = sc.rooms.indexOf(id);
      if (idx >= 0) sc.rooms.splice(idx, 1);
      else sc.rooms.push(id);
      saveDraft();
      renderAct0();
    });

    renderMultiChoiceGroup(dom.scopeHousehold, DATA.scopeOptions.household, sc.household, (id) => {
      const idx = sc.household.indexOf(id);
      if (idx >= 0) sc.household.splice(idx, 1);
      else sc.household.push(id);
      saveDraft();
      renderAct0();
    });

    syncToggleControl(dom.toggleHeirloom, sc.hasHeirloom);
    syncConditionalVisibility(dom.heirloomNoteWrap, sc.hasHeirloom);

    syncToggleControl(dom.toggleCoupleMode, sc.coupleMode);
    syncConditionalVisibility(dom.coupleNamesWrap, sc.coupleMode);
  }

  function bindAct0Events() {
    if (dom.inputClientName) {
      dom.inputClientName.addEventListener('input', (e) => {
        appState.draft.scope.clientName = e.target.value;
        saveDraft();
      });
    }
    if (dom.inputProjectName) {
      dom.inputProjectName.addEventListener('input', (e) => {
        appState.draft.scope.projectName = e.target.value;
        saveDraft();
      });
    }
    if (dom.inputHeirloomNote) {
      dom.inputHeirloomNote.addEventListener('input', (e) => {
        appState.draft.scope.heirloomNote = e.target.value;
        saveDraft();
      });
    }
    if (dom.inputResidentA) {
      dom.inputResidentA.addEventListener('input', (e) => {
        appState.draft.scope.residentAName = e.target.value;
        saveDraft();
      });
    }
    if (dom.inputResidentB) {
      dom.inputResidentB.addEventListener('input', (e) => {
        appState.draft.scope.residentBName = e.target.value;
        saveDraft();
      });
    }

    if (dom.toggleHeirloom) {
      const isCheckbox = dom.toggleHeirloom.tagName === 'INPUT' && dom.toggleHeirloom.type === 'checkbox';
      dom.toggleHeirloom.addEventListener(isCheckbox ? 'change' : 'click', () => {
        appState.draft.scope.hasHeirloom = isCheckbox
          ? dom.toggleHeirloom.checked
          : !appState.draft.scope.hasHeirloom;
        saveDraft();
        renderAct0();
      });
    }

    if (dom.toggleCoupleMode) {
      const isCheckbox = dom.toggleCoupleMode.tagName === 'INPUT' && dom.toggleCoupleMode.type === 'checkbox';
      dom.toggleCoupleMode.addEventListener(isCheckbox ? 'change' : 'click', () => {
        appState.draft.scope.coupleMode = isCheckbox
          ? dom.toggleCoupleMode.checked
          : !appState.draft.scope.coupleMode;
        if (!appState.draft.scope.coupleMode) {
          appState.draft.activeResident = 'A';
        }
        saveDraft();
        renderAct0();
      });
    }

    if (dom.btnStartBriefing) {
      dom.btnStartBriefing.addEventListener('click', () => {
        appState.draft.activeResident = 'A';
        if (appState.draft.highestAct < 1) {
          appState.draft.highestAct = 1;
        }
        saveDraft();
        goToAct(1);
      });
    }

    if (dom.btnResumeDraft) {
      dom.btnResumeDraft.addEventListener('click', () => {
        const saved = loadDraftFromStorage();
        if (saved) {
          appState.draft = saved;
        }
        syncConditionalVisibility(dom.draftBanner, false);
        const act = screenToActNumber(appState.draft.currentScreen);
        goToAct(act >= 0 && act <= 4 ? act : 0);
      });
    }

    if (dom.btnDiscardDraft) {
      dom.btnDiscardDraft.addEventListener('click', () => {
        clearDraftStorage();
        appState.draft = createCleanDraft();
        appState.activeDossier = null;
        syncConditionalVisibility(dom.draftBanner, false);
        renderAct0();
        renderHeaderActNav('screen-act-0');
        updateProgressHairline('screen-act-0');
        showToast('Novo levantamento iniciado.');
      });
    }
  }

  /* =========================================================================
     10. ATO 1 — CURADORIA ESPACIAL (SWIPE 2-EIXOS + POINTER CAPTURE)
     ========================================================================= */

  function createSwipeCardElement() {
    const card = document.createElement('article');
    card.className = 'swipe-card';
    card.innerHTML =
      '<div class="swipe-card-media img-skeleton">' +
      '  <img class="swipe-card-img" alt="" decoding="async" draggable="false">' +
      '  <div class="drag-tag" aria-hidden="true"></div>' +
      '</div>' +
      '<div class="swipe-card-body">' +
      '  <div class="swipe-card-meta">' +
      '    <span class="swipe-card-index"></span>' +
      '    <span class="swipe-card-env"></span>' +
      '  </div>' +
      '  <h3 class="swipe-card-title"></h3>' +
      '  <div class="swipe-card-variable"></div>' +
      '  <p class="swipe-card-desc"></p>' +
      '</div>';

    bindCardPointerEvents(card);
    return card;
  }

  function populateSwipeCardElement(cardEl, cardData) {
    if (!cardEl) return;
    if (!cardData) {
      cardEl.hidden = true;
      cardEl.removeAttribute('data-card-id');
      return;
    }

    cardEl.hidden = false;
    const prevId = cardEl.getAttribute('data-card-id');
    cardEl.setAttribute('data-card-id', cardData.id);

    const mediaEl = cardEl.querySelector('.swipe-card-media');
    const imgEl = cardEl.querySelector('.swipe-card-img');
    const tagEl = cardEl.querySelector('.drag-tag');

    if (tagEl) {
      tagEl.className = 'drag-tag';
      tagEl.textContent = '';
      tagEl.style.opacity = '0';
    }

    if (prevId !== cardData.id && imgEl && mediaEl) {
      attachImageLifecycle(imgEl, mediaEl, cardData.title, cardData.env);
      imgEl.alt = cardData.title;
      imgEl.src = cardData.image;
      if (imgEl.complete && imgEl.naturalWidth > 0) {
        mediaEl.classList.remove('img-skeleton', 'img-fallback');
        mediaEl.classList.add('img-loaded');
      }
    }

    const idxEl = cardEl.querySelector('.swipe-card-index');
    const envEl = cardEl.querySelector('.swipe-card-env');
    const titleEl = cardEl.querySelector('.swipe-card-title');
    const varEl = cardEl.querySelector('.swipe-card-variable');
    const descEl = cardEl.querySelector('.swipe-card-desc');

    if (idxEl) idxEl.textContent = cardData.index;
    if (envEl) envEl.textContent = cardData.env;
    if (titleEl) titleEl.textContent = cardData.title;
    if (varEl) varEl.textContent = cardData.variable;
    if (descEl) descEl.textContent = cardData.desc;
  }

  function setLayerClass(cardEl, layerIndex) {
    if (!cardEl) return;
    cardEl.classList.remove('layer-0', 'layer-1', 'layer-2', 'is-dragging', 'is-exiting');
    cardEl.style.transform = '';
    cardEl.style.opacity = '';
    cardEl.style.transition = '';
    cardEl.style.pointerEvents = layerIndex === 0 ? 'auto' : 'none';
    if (layerIndex === 0 || layerIndex === 1 || layerIndex === 2) {
      cardEl.classList.add('layer-' + layerIndex);
    }
  }

  function ensureDeckPoolInitialized() {
    if (!dom.deckStage) return;
    if (appState.deckSlots.length === 3 && dom.deckStage.contains(appState.deckSlots[0])) {
      return;
    }
    dom.deckStage.innerHTML = '';
    appState.deckSlots = [
      createSwipeCardElement(),
      createSwipeCardElement(),
      createSwipeCardElement()
    ];
    // Inserir da camada 2 -> 0 ou usar z-index via CSS
    dom.deckStage.appendChild(appState.deckSlots[2]);
    dom.deckStage.appendChild(appState.deckSlots[1]);
    dom.deckStage.appendChild(appState.deckSlots[0]);
  }

  function updateDeckHeaderAndControls() {
    const prof = getActiveProfile();
    const total = DATA.cards.length;
    const clampedIdx = clamp(prof.cardIndex, 0, total - 1);
    const currentCard = DATA.cards[clampedIdx];

    if (dom.activeResidentBanner) {
      if (appState.draft.scope.coupleMode) {
        dom.activeResidentBanner.hidden = false;
        dom.activeResidentBanner.classList.add('is-visible');
        dom.activeResidentBanner.textContent =
          'Perfil Ativo: ' + getResidentLabel(appState.draft.activeResident);
      } else {
        dom.activeResidentBanner.hidden = true;
        dom.activeResidentBanner.classList.remove('is-visible');
        dom.activeResidentBanner.textContent = '';
      }
    }

    if (dom.deckEnvLabel && currentCard) {
      dom.deckEnvLabel.textContent = currentCard.env;
    }
    if (dom.deckCounter) {
      const displayIdx = Math.min(prof.cardIndex + 1, total);
      dom.deckCounter.textContent = pad2(displayIdx) + ' / ' + pad2(total);
    }
    if (dom.btnDeckUndo) {
      dom.btnDeckUndo.disabled = prof.ratingHistory.length === 0;
    }

    // Highlight previous rating if user navigated back to re-rate
    const existingRating = currentCard ? prof.ratings[currentCard.id] : '';
    const mapBtns = [
      [dom.btnRateEvitar, RATING_KEYS.EVITAR],
      [dom.btnRateNeutro, RATING_KEYS.NEUTRO],
      [dom.btnRateAfinidade, RATING_KEYS.AFINIDADE],
      [dom.btnRateEssencial, RATING_KEYS.ESSENCIAL]
    ];
    mapBtns.forEach(([btn, key]) => {
      if (btn) btn.classList.toggle('is-active-rating', existingRating === key);
    });

    updateProgressHairline('screen-act-1');
  }

  function renderAct1() {
    ensureDeckPoolInitialized();
    const prof = getActiveProfile();
    const idx = clamp(prof.cardIndex, 0, DATA.cards.length - 1);

    for (let layer = 0; layer < 3; layer++) {
      const slot = appState.deckSlots[layer];
      setLayerClass(slot, layer);
      populateSwipeCardElement(slot, DATA.cards[idx + layer] || null);
    }

    updateDeckHeaderAndControls();
  }

  function getExitVector(rating) {
    if (rating === RATING_KEYS.ESSENCIAL) return { x: 440, y: 24, rot: 4 };
    if (rating === RATING_KEYS.EVITAR) return { x: -440, y: 24, rot: -4 };
    if (rating === RATING_KEYS.AFINIDADE) return { x: 0, y: -360, rot: 0 };
    return { x: 0, y: 360, rot: 0 };
  }

  function updateDragTagVisual(cardEl, rating, progress) {
    const tagEl = cardEl ? cardEl.querySelector('.drag-tag') : null;
    if (!tagEl) return;

    if (!rating || progress <= 0.05) {
      tagEl.className = 'drag-tag';
      tagEl.textContent = '';
      tagEl.style.opacity = '0';
      return;
    }

    const classMap = {
      essencial: 'drag-tag drag-tag-essencial',
      evitar: 'drag-tag drag-tag-evitar',
      afinidade: 'drag-tag drag-tag-afinidade',
      neutro: 'drag-tag drag-tag-neutro'
    };

    tagEl.className = classMap[rating] || 'drag-tag';
    tagEl.textContent = (RATING_LABELS[rating] || '').toUpperCase();
    tagEl.style.opacity = String(clamp(progress, 0, 1));
  }

  function commitCardRating(rating) {
    if (appState.deckAnimating) return;

    const prof = getActiveProfile();
    if (prof.cardIndex >= DATA.cards.length) {
      goToAct(2);
      return;
    }

    const currentCard = DATA.cards[prof.cardIndex];
    if (!currentCard) return;

    appState.deckAnimating = true;

    const prevRating = prof.ratings[currentCard.id] || null;
    prof.ratings[currentCard.id] = rating;
    prof.ratingHistory.push({
      cardId: currentCard.id,
      cardIndex: prof.cardIndex,
      rating: rating,
      prevRating: prevRating
    });

    const exitingCard = appState.deckSlots[0];
    const nextLayer0 = appState.deckSlots[1];
    const nextLayer1 = appState.deckSlots[2];

    const vec = getExitVector(rating);
    updateDragTagVisual(exitingCard, rating, 1);

    if (exitingCard) {
      exitingCard.classList.remove('is-dragging', 'layer-0');
      exitingCard.classList.add('is-exiting');
      exitingCard.style.pointerEvents = 'none';
      exitingCard.style.transition =
        'transform 260ms cubic-bezier(0.22, 1, 0.36, 1), opacity 240ms ease';
      exitingCard.style.transform =
        'translate3d(' + vec.x + 'px, ' + vec.y + 'px, 0) rotate(' + vec.rot + 'deg)';
      exitingCard.style.opacity = '0';
    }

    prof.cardIndex += 1;
    if (prof.cardIndex >= DATA.cards.length && appState.draft.highestAct < 2) {
      appState.draft.highestAct = 2;
    }
    saveDraft();

    // Promocao imediata sem flicker de layer-1 -> layer-0 e layer-2 -> layer-1
    if (prof.cardIndex < DATA.cards.length) {
      setLayerClass(nextLayer0, 0);
      setLayerClass(nextLayer1, 1);
      updateDeckHeaderAndControls();
    }

    setTimeout(() => {
      if (exitingCard) {
        exitingCard.style.transition = 'none';
        exitingCard.style.transform = '';
        exitingCard.style.opacity = '';
        exitingCard.classList.remove('is-exiting');
      }

      if (prof.cardIndex >= DATA.cards.length) {
        appState.deckSlots = [nextLayer0, nextLayer1, exitingCard];
        appState.deckAnimating = false;
        goToAct(2);
        return;
      }

      // Recicla o no que saiu para a camada de fundo layer-2
      appState.deckSlots = [nextLayer0, nextLayer1, exitingCard];
      setLayerClass(exitingCard, 2);
      populateSwipeCardElement(exitingCard, DATA.cards[prof.cardIndex + 2] || null);

      // Reordena DOM no stack sem remontar layer-0 e layer-1
      if (dom.deckStage && exitingCard) {
        dom.deckStage.insertBefore(exitingCard, dom.deckStage.firstChild);
      }

      appState.deckAnimating = false;
    }, 270);
  }

  function undoLastCardRating() {
    if (appState.deckAnimating) return;

    const prof = getActiveProfile();
    if (prof.ratingHistory.length === 0) return;

    appState.deckAnimating = true;
    const last = prof.ratingHistory.pop();

    if (last.prevRating) {
      prof.ratings[last.cardId] = last.prevRating;
    } else {
      delete prof.ratings[last.cardId];
    }

    prof.cardIndex = clamp(last.cardIndex, 0, DATA.cards.length - 1);
    saveDraft();

    ensureDeckPoolInitialized();

    const cur0 = appState.deckSlots[0];
    const cur1 = appState.deckSlots[1];
    const recycled = appState.deckSlots[2];

    // Recua camadas atuais sem remontar imagens existentes
    setLayerClass(cur0, 1);
    setLayerClass(cur1, 2);
    if (cur1 && prof.cardIndex + 2 >= DATA.cards.length) {
      cur1.hidden = true;
    }

    const cardData = DATA.cards[prof.cardIndex];
    const vec = getExitVector(last.rating);

    populateSwipeCardElement(recycled, cardData);
    if (recycled) {
      recycled.classList.remove('layer-1', 'layer-2', 'is-dragging', 'is-exiting');
      recycled.classList.add('layer-0');
      recycled.style.transition = 'none';
      recycled.style.opacity = '0';
      recycled.style.transform =
        'translate3d(' + vec.x + 'px, ' + vec.y + 'px, 0) rotate(' + vec.rot + 'deg)';
      recycled.style.pointerEvents = 'auto';

      if (dom.deckStage) {
        dom.deckStage.appendChild(recycled);
      }

      void recycled.offsetWidth;

      recycled.style.transition =
        'transform 320ms cubic-bezier(0.22, 1, 0.36, 1), opacity 320ms ease';
      recycled.style.opacity = '1';
      recycled.style.transform = 'translate3d(0, 0, 0) rotate(0deg)';
    }

    appState.deckSlots = [recycled, cur0, cur1];
    updateDeckHeaderAndControls();

    setTimeout(() => {
      if (recycled) {
        recycled.style.transition = '';
        recycled.style.transform = '';
        recycled.style.opacity = '';
      }
      appState.deckAnimating = false;
    }, 330);
  }

  function bindCardPointerEvents(cardEl) {
    let activePointerId = null;
    let startX = 0;
    let startY = 0;
    let lastX = 0;
    let lastY = 0;
    let lastTime = 0;
    let vx = 0;
    let vy = 0;
    let moved = false;

    cardEl.addEventListener('pointerdown', (e) => {
      if (appState.deckAnimating) return;
      if (!cardEl.classList.contains('layer-0')) return;
      if (e.pointerType === 'mouse' && e.button !== 0) return;

      activePointerId = e.pointerId;
      startX = e.clientX;
      startY = e.clientY;
      lastX = e.clientX;
      lastY = e.clientY;
      lastTime = performance.now();
      vx = 0;
      vy = 0;
      moved = false;

      cardEl.classList.add('is-dragging');
      cardEl.style.transition = 'none';

      try {
        cardEl.setPointerCapture(e.pointerId);
      } catch (_) {}
    });

    cardEl.addEventListener('pointermove', (e) => {
      if (activePointerId === null || e.pointerId !== activePointerId) return;

      const now = performance.now();
      const dt = Math.max(8, now - lastTime);
      vx = (e.clientX - lastX) / dt;
      vy = (e.clientY - lastY) / dt;
      lastX = e.clientX;
      lastY = e.clientY;
      lastTime = now;

      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      if (Math.hypot(dx, dy) > 6) moved = true;

      const rot = clamp(dx * 0.015, -4, 4);
      cardEl.style.transform =
        'translate3d(' + dx + 'px, ' + dy + 'px, 0) rotate(' + rot + 'deg)';

      if (Math.hypot(dx, dy) > 12) {
        if (Math.abs(dx) >= Math.abs(dy)) {
          const rating = dx > 0 ? RATING_KEYS.ESSENCIAL : RATING_KEYS.EVITAR;
          updateDragTagVisual(cardEl, rating, Math.abs(dx) / 85);
        } else {
          const rating = dy < 0 ? RATING_KEYS.AFINIDADE : RATING_KEYS.NEUTRO;
          updateDragTagVisual(cardEl, rating, Math.abs(dy) / 80);
        }
      } else {
        updateDragTagVisual(cardEl, '', 0);
      }
    });

    function finishPointer(e, isCancel) {
      if (activePointerId === null || e.pointerId !== activePointerId) return;

      try {
        cardEl.releasePointerCapture(e.pointerId);
      } catch (_) {}

      const now = performance.now();
      const stale = now - lastTime > 85;
      const curVx = stale ? 0 : vx;
      const curVy = stale ? 0 : vy;

      const dx = e.clientX - startX;
      const dy = e.clientY - startY;

      activePointerId = null;
      cardEl.classList.remove('is-dragging');

      if (!isCancel) {
        const horizDominant = Math.abs(dx) >= Math.abs(dy);
        if (horizDominant) {
          if (dx > 85 || curVx > 0.45) {
            commitCardRating(RATING_KEYS.ESSENCIAL);
            return;
          }
          if (dx < -85 || curVx < -0.45) {
            commitCardRating(RATING_KEYS.EVITAR);
            return;
          }
        } else {
          if (dy < -80 || curVy < -0.45) {
            commitCardRating(RATING_KEYS.AFINIDADE);
            return;
          }
          if (dy > 80 || curVy > 0.45) {
            commitCardRating(RATING_KEYS.NEUTRO);
            return;
          }
        }
      }

      // Retorno suave ao centro se abaixo do limiar
      updateDragTagVisual(cardEl, '', 0);
      cardEl.style.transition = 'transform 280ms cubic-bezier(0.22, 1, 0.36, 1)';
      cardEl.style.transform = 'translate3d(0, 0, 0) rotate(0deg)';
      if (!moved) {
        // Sem acao no tap simples sobre o card
      }
    }

    cardEl.addEventListener('pointerup', (e) => finishPointer(e, false));
    cardEl.addEventListener('pointercancel', (e) => finishPointer(e, true));
  }

  function bindAct1Events() {
    if (dom.btnRateEvitar) {
      dom.btnRateEvitar.addEventListener('click', () => commitCardRating(RATING_KEYS.EVITAR));
    }
    if (dom.btnRateNeutro) {
      dom.btnRateNeutro.addEventListener('click', () => commitCardRating(RATING_KEYS.NEUTRO));
    }
    if (dom.btnRateAfinidade) {
      dom.btnRateAfinidade.addEventListener('click', () => commitCardRating(RATING_KEYS.AFINIDADE));
    }
    if (dom.btnRateEssencial) {
      dom.btnRateEssencial.addEventListener('click', () => commitCardRating(RATING_KEYS.ESSENCIAL));
    }
    if (dom.btnDeckUndo) {
      dom.btnDeckUndo.addEventListener('click', undoLastCardRating);
    }
    if (dom.btnDeckZoom) {
      dom.btnDeckZoom.addEventListener('click', () => {
        const prof = getActiveProfile();
        const card = DATA.cards[clamp(prof.cardIndex, 0, DATA.cards.length - 1)];
        if (card) openLightbox(card);
      });
    }
    if (dom.btnAct1Back) {
      dom.btnAct1Back.addEventListener('click', () => {
        if (appState.draft.activeResident === 'B') {
          navigateTo('screen-couple-handoff');
        } else {
          goToAct(0);
        }
      });
    }
  }

  /* =========================================================================
     11. LIGHTBOX EDITORIAL
     ========================================================================= */

  function openLightbox(card) {
    if (!dom.editorialLightbox || !card) return;
    appState.lightboxCard = card;

    if (dom.lightboxImg) {
      const mediaWrap = dom.lightboxImg.parentElement;
      if (mediaWrap) {
        attachImageLifecycle(dom.lightboxImg, mediaWrap, card.title, card.env);
      }
      dom.lightboxImg.alt = card.title;
      dom.lightboxImg.src = card.image;
    }
    if (dom.lightboxEnv) dom.lightboxEnv.textContent = card.env;
    if (dom.lightboxTitle) dom.lightboxTitle.textContent = card.title;
    if (dom.lightboxVariable) dom.lightboxVariable.textContent = card.variable || '';
    if (dom.lightboxDesc) dom.lightboxDesc.textContent = card.desc || '';

    dom.editorialLightbox.removeAttribute('hidden');
    dom.editorialLightbox.setAttribute('aria-hidden', 'false');
    dom.editorialLightbox.classList.add('is-open');
  }

  function closeLightbox() {
    if (!dom.editorialLightbox) return;
    dom.editorialLightbox.classList.remove('is-open');
    dom.editorialLightbox.setAttribute('aria-hidden', 'true');
    appState.lightboxCard = null;
  }

  function isLightboxOpen() {
    return Boolean(
      dom.editorialLightbox && dom.editorialLightbox.classList.contains('is-open')
    );
  }

  /* =========================================================================
     12. ATO 2 — RITUAIS, TRADE-OFFS TECNICOS & ERGONOMIA
     ========================================================================= */

  function renderAct2() {
    const prof = getActiveProfile();

    // 12 Rituais com icones SVG monoline
    if (dom.ritualsGrid) {
      const set = new Set(prof.rituals);
      dom.ritualsGrid.innerHTML = DATA.rituals
        .map((r) => {
          const isSel = set.has(r.id);
          return (
            '<button type="button" class="choice-chip choice-chip-icon' +
            (isSel ? ' is-selected' : '') +
            '" data-ritual-id="' +
            escapeHtml(r.id) +
            '" aria-pressed="' +
            String(isSel) +
            '">' +
            '<span class="chip-svg-icon">' +
            getSvgIcon(r.iconKey) +
            '</span>' +
            '<span class="chip-label">' +
            escapeHtml(r.label) +
            '</span>' +
            '</button>'
          );
        })
        .join('');

      dom.ritualsGrid.querySelectorAll('[data-ritual-id]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const id = btn.getAttribute('data-ritual-id');
          const idx = prof.rituals.indexOf(id);
          if (idx >= 0) prof.rituals.splice(idx, 1);
          else prof.rituals.push(id);
          saveDraft();
          renderAct2();
        });
      });
    }

    // 6 Trade-offs tecnicos binarios
    if (dom.tradeoffsList) {
      dom.tradeoffsList.innerHTML = DATA.tradeoffs
        .map((t) => {
          const sel = prof.tradeoffs[t.id] || '';
          return (
            '<div class="tradeoff-row" data-tradeoff-id="' +
            escapeHtml(t.id) +
            '">' +
            '  <div class="tradeoff-label">' +
            escapeHtml(t.label) +
            '</div>' +
            '  <div class="tradeoff-options">' +
            '    <button type="button" class="tradeoff-opt' +
            (sel === 'A' ? ' is-selected' : '') +
            '" data-opt="A" aria-pressed="' +
            String(sel === 'A') +
            '">' +
            '      <span class="tradeoff-opt-title">' +
            escapeHtml(t.optionA.title) +
            '</span>' +
            '      <span class="tradeoff-opt-spec">' +
            escapeHtml(t.optionA.spec) +
            '</span>' +
            '    </button>' +
            '    <button type="button" class="tradeoff-opt' +
            (sel === 'B' ? ' is-selected' : '') +
            '" data-opt="B" aria-pressed="' +
            String(sel === 'B') +
            '">' +
            '      <span class="tradeoff-opt-title">' +
            escapeHtml(t.optionB.title) +
            '</span>' +
            '      <span class="tradeoff-opt-spec">' +
            escapeHtml(t.optionB.spec) +
            '</span>' +
            '    </button>' +
            '  </div>' +
            '</div>'
          );
        })
        .join('');

      dom.tradeoffsList.querySelectorAll('.tradeoff-row').forEach((row) => {
        const tId = row.getAttribute('data-tradeoff-id');
        row.querySelectorAll('.tradeoff-opt').forEach((btn) => {
          btn.addEventListener('click', () => {
            const opt = btn.getAttribute('data-opt');
            prof.tradeoffs[tId] = prof.tradeoffs[tId] === opt ? '' : opt;
            if (!prof.tradeoffs[tId]) delete prof.tradeoffs[tId];
            saveDraft();
            renderAct2();
          });
        });
      });
    }

    // Ergonomia Essencial
    renderSingleChoiceGroup(dom.ergoBed, DATA.ergonomics.bedSizes, prof.ergonomics.bed, (id) => {
      prof.ergonomics.bed = prof.ergonomics.bed === id ? '' : id;
      saveDraft();
      renderAct2();
    });

    renderSingleChoiceGroup(dom.ergoBasin, DATA.ergonomics.bathBasins, prof.ergonomics.basin, (id) => {
      prof.ergonomics.basin = prof.ergonomics.basin === id ? '' : id;
      saveDraft();
      renderAct2();
    });

    renderSingleChoiceGroup(dom.ergoShower, DATA.ergonomics.bathShowers, prof.ergonomics.shower, (id) => {
      prof.ergonomics.shower = prof.ergonomics.shower === id ? '' : id;
      saveDraft();
      renderAct2();
    });
  }

  function bindAct2Events() {
    if (dom.btnAct2Back) {
      dom.btnAct2Back.addEventListener('click', () => goToAct(1));
    }
    if (dom.btnAct2Next) {
      dom.btnAct2Next.addEventListener('click', () => {
        if (appState.draft.highestAct < 3) appState.draft.highestAct = 3;
        saveDraft();
        goToAct(3);
      });
    }
  }

  /* =========================================================================
     13. ATO 3 — MATERIALIDADE, PALETA & ESCALA DE PATINA
     ========================================================================= */

  function updatePatinaReadout(value) {
    const level = DATA.patinaScale.find((p) => Number(p.value) === Number(value)) || DATA.patinaScale[2];
    if (dom.patinaSlider) dom.patinaSlider.value = String(value);
    if (dom.patinaLabel && level) {
      dom.patinaLabel.textContent = level.value + ' — ' + level.title;
    }
    if (dom.patinaDesc && level) {
      dom.patinaDesc.textContent = level.desc;
    }
  }

  function renderAct3() {
    const prof = getActiveProfile();

    if (dom.palettesGrid) {
      dom.palettesGrid.innerHTML = DATA.palettes
        .map((pal) => {
          const isPrimary = prof.palettePrimary === pal.id;
          const isSecondary = prof.paletteSecondary === pal.id;
          const cls = [
            'palette-board',
            isPrimary ? 'is-primary' : '',
            isSecondary ? 'is-secondary' : ''
          ]
            .filter(Boolean)
            .join(' ');

          const roleText = isPrimary
            ? 'Direção Principal'
            : isSecondary
            ? 'Direção Complementar'
            : 'Selecionar';

          const swatchesHtml = (pal.colors || [])
            .map(
              (hex) =>
                '<span class="palette-swatch" style="background-color:' +
                escapeHtml(hex) +
                '" title="' +
                escapeHtml(hex) +
                '"></span>'
            )
            .join('');

          const mats = pal.materials || {};
          return (
            '<article class="' +
            cls +
            '" data-palette-id="' +
            escapeHtml(pal.id) +
            '" tabindex="0" role="button" aria-pressed="' +
            String(isPrimary || isSecondary) +
            '">' +
            '  <div class="palette-board-media img-skeleton">' +
            '    <img class="palette-board-img" src="' +
            escapeHtml(pal.image) +
            '" alt="' +
            escapeHtml(pal.title) +
            '" decoding="async">' +
            '  </div>' +
            '  <div class="palette-board-body">' +
            '    <div class="palette-board-head">' +
            '      <span class="palette-role-label">' +
            roleText +
            '</span>' +
            '    </div>' +
            '    <h3 class="palette-board-title">' +
            escapeHtml(pal.title) +
            '</h3>' +
            '    <p class="palette-board-desc">' +
            escapeHtml(pal.desc) +
            '</p>' +
            '    <div class="palette-swatches-row">' +
            swatchesHtml +
            '    </div>' +
            '    <dl class="palette-materials-list">' +
            '      <div><dt>Pedra</dt><dd>' +
            escapeHtml(mats.stone || '') +
            '</dd></div>' +
            '      <div><dt>Madeira</dt><dd>' +
            escapeHtml(mats.wood || '') +
            '</dd></div>' +
            '      <div><dt>Tecido</dt><dd>' +
            escapeHtml(mats.fabric || '') +
            '</dd></div>' +
            '      <div><dt>Metal</dt><dd>' +
            escapeHtml(mats.metal || '') +
            '</dd></div>' +
            '    </dl>' +
            '  </div>' +
            '</article>'
          );
        })
        .join('');

      dom.palettesGrid.querySelectorAll('.palette-board').forEach((board) => {
        const img = board.querySelector('.palette-board-img');
        const wrap = board.querySelector('.palette-board-media');
        const palId = board.getAttribute('data-palette-id');
        const palObj = DATA.palettes.find((p) => p.id === palId);
        if (img && wrap && palObj) {
          attachImageLifecycle(img, wrap, palObj.title, 'PALETA DE MATERIAIS');
          if (img.complete && img.naturalWidth > 0) {
            wrap.classList.remove('img-skeleton', 'img-fallback');
            wrap.classList.add('img-loaded');
          }
        }

        const handleSelect = () => {
          if (!prof.palettePrimary) {
            prof.palettePrimary = palId;
          } else if (prof.palettePrimary === palId) {
            prof.palettePrimary = prof.paletteSecondary || '';
            prof.paletteSecondary = '';
          } else if (prof.paletteSecondary === palId) {
            prof.paletteSecondary = '';
          } else {
            prof.paletteSecondary = palId;
          }
          saveDraft();
          renderAct3();
        };

        board.addEventListener('click', handleSelect);
        board.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleSelect();
          }
        });
      });
    }

    updatePatinaReadout(prof.patina || 3);
  }

  function bindAct3Events() {
    if (dom.patinaSlider) {
      dom.patinaSlider.addEventListener('input', (e) => {
        const prof = getActiveProfile();
        prof.patina = clamp(Number(e.target.value) || 3, 1, 5);
        updatePatinaReadout(prof.patina);
        saveDraft();
      });
    }

    if (dom.btnAct3Back) {
      dom.btnAct3Back.addEventListener('click', () => goToAct(2));
    }

    if (dom.btnAct3Next) {
      dom.btnAct3Next.addEventListener('click', () => {
        if (appState.draft.highestAct < 4) appState.draft.highestAct = 4;
        saveDraft();
        goToAct(4);
      });
    }
  }

  /* =========================================================================
     14. ATO 4 — ESPECIFICACAO, PRIORIDADES RANQUEADAS (1o/2o/3o), PRAZO & VETOS
     ========================================================================= */

  function renderAct4() {
    const prof = getActiveProfile();

    // Padrao de Especificacao
    if (dom.specTiersGrid) {
      dom.specTiersGrid.innerHTML = DATA.scopeOptions.specTiers
        .map((tier) => {
          const isSel = prof.specTier === tier.id;
          return (
            '<button type="button" class="choice-chip choice-chip-tier' +
            (isSel ? ' is-selected' : '') +
            '" data-tier-id="' +
            escapeHtml(tier.id) +
            '" aria-pressed="' +
            String(isSel) +
            '">' +
            '<span class="tier-title">' +
            escapeHtml(tier.label) +
            '</span>' +
            (tier.desc
              ? '<span class="tier-desc">' + escapeHtml(tier.desc) + '</span>'
              : '') +
            '</button>'
          );
        })
        .join('');

      dom.specTiersGrid.querySelectorAll('[data-tier-id]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const id = btn.getAttribute('data-tier-id');
          prof.specTier = prof.specTier === id ? '' : id;
          saveDraft();
          renderAct4();
        });
      });
    }

    // Alocacao de Investimento (ate 3 ranqueadas 1o / 2o / 3o)
    if (dom.prioritiesGrid) {
      dom.prioritiesGrid.innerHTML = DATA.priorities
        .map((p) => {
          const rankIdx = prof.priorities.indexOf(p.id);
          const isSel = rankIdx >= 0;
          const badge = isSel
            ? '<span class="rank-badge">' + (rankIdx + 1) + 'º</span>'
            : '';
          return (
            '<button type="button" class="choice-chip choice-chip-priority' +
            (isSel ? ' is-selected' : '') +
            '" data-priority-id="' +
            escapeHtml(p.id) +
            '" aria-pressed="' +
            String(isSel) +
            '">' +
            '<span class="chip-svg-icon">' +
            getSvgIcon(p.iconKey) +
            '</span>' +
            '<span class="chip-label">' +
            escapeHtml(p.label) +
            '</span>' +
            badge +
            '</button>'
          );
        })
        .join('');

      dom.prioritiesGrid.querySelectorAll('[data-priority-id]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const id = btn.getAttribute('data-priority-id');
          const idx = prof.priorities.indexOf(id);
          if (idx >= 0) {
            prof.priorities.splice(idx, 1);
          } else if (prof.priorities.length < 3) {
            prof.priorities.push(id);
          } else {
            showToast('Máximo de 3 prioridades. Toque em uma selecionada para remover.');
            return;
          }
          saveDraft();
          renderAct4();
        });
      });
    }

    // Horizonte da Obra
    renderSingleChoiceGroup(dom.timelinesGrid, DATA.scopeOptions.timelines, prof.timeline, (id) => {
      prof.timeline = prof.timeline === id ? '' : id;
      saveDraft();
      renderAct4();
    });

    // Anti-Briefing — Lista de Vetos
    renderMultiChoiceGroup(dom.vetosGrid, DATA.vetos, prof.vetos, (id) => {
      const idx = prof.vetos.indexOf(id);
      if (idx >= 0) prof.vetos.splice(idx, 1);
      else prof.vetos.push(id);
      saveDraft();
      renderAct4();
    });
  }

  function finalizeBriefing() {
    const dossier = {
      version: 2,
      code: generateUniqueDossierCode(),
      createdAt: new Date().toISOString().slice(0, 10),
      scope: JSON.parse(JSON.stringify(appState.draft.scope)),
      profiles: {
        A: JSON.parse(JSON.stringify(appState.draft.profiles.A)),
        B: JSON.parse(JSON.stringify(appState.draft.profiles.B))
      }
    };

    appState.activeDossier = dossier;
    appState.draft.highestAct = 5;
    upsertDossier(dossier);
    clearDraftStorage();

    renderAct5(dossier);
    navigateTo('screen-act-5', { skipSave: true });
  }

  function bindAct4Events() {
    if (dom.btnAct4Back) {
      dom.btnAct4Back.addEventListener('click', () => goToAct(3));
    }

    if (dom.btnAct4Next) {
      dom.btnAct4Next.addEventListener('click', () => {
        if (appState.draft.scope.coupleMode && appState.draft.activeResident === 'A') {
          if (dom.handoffNextName) {
            dom.handoffNextName.textContent = getResidentLabel('B');
          }
          saveDraft();
          navigateTo('screen-couple-handoff');
          return;
        }
        finalizeBriefing();
      });
    }

    if (dom.btnStartResidentB) {
      dom.btnStartResidentB.addEventListener('click', () => {
        appState.draft.activeResident = 'B';
        appState.draft.profiles.B.cardIndex = 0;
        saveDraft();
        goToAct(1);
      });
    }
  }

  /* =========================================================================
     15. MATRIZ DE SINTONIA DO CASAL & DIAGNOSTICO TECNICO
     ========================================================================= */

  function findLabel(list, id, fallback = '') {
    if (!id || !Array.isArray(list)) return fallback;
    const found = list.find((item) => item.id === id);
    return found ? found.label : fallback;
  }

  function formatDateBr(iso) {
    if (!iso) return new Date().toLocaleDateString('pt-BR');
    const parts = String(iso).slice(0, 10).split('-');
    if (parts.length === 3) return parts[2] + '/' + parts[1] + '/' + parts[0];
    return iso;
  }

  function computeCoupleHarmony(dossier) {
    const pA = dossier.profiles.A;
    const pB = dossier.profiles.B;
    const nameA = getDossierResidentLabel(dossier, 'A');
    const nameB = getDossierResidentLabel(dossier, 'B');

    const weights = {
      essencial: 3,
      afinidade: 2,
      neutro: 1,
      evitar: 0
    };

    let cardScoreSum = 0;
    let cardCount = 0;

    const sharedEssentials = [];
    const technicalConsensos = [];
    const divergences = [];

    DATA.cards.forEach((card) => {
      const rA = pA.ratings[card.id];
      const rB = pB.ratings[card.id];
      if (!rA || !rB) return;

      cardCount += 1;
      const wA = weights[rA];
      const wB = weights[rB];
      cardScoreSum += 1 - Math.abs(wA - wB) / 3;

      if (rA === RATING_KEYS.ESSENCIAL && rB === RATING_KEYS.ESSENCIAL) {
        sharedEssentials.push({ card: card, level: 'Consenso Essencial' });
      } else if (
        (rA === RATING_KEYS.ESSENCIAL && rB === RATING_KEYS.AFINIDADE) ||
        (rB === RATING_KEYS.ESSENCIAL && rA === RATING_KEYS.AFINIDADE)
      ) {
        sharedEssentials.push({ card: card, level: 'Alta Convergência' });
      } else if (
        ((rA === RATING_KEYS.ESSENCIAL || rA === RATING_KEYS.AFINIDADE) && rB === RATING_KEYS.EVITAR) ||
        ((rB === RATING_KEYS.ESSENCIAL || rB === RATING_KEYS.AFINIDADE) && rA === RATING_KEYS.EVITAR)
      ) {
        divergences.push({
          topic: card.env + ' — ' + card.title,
          detailA: nameA + ': ' + RATING_LABELS[rA],
          detailB: nameB + ': ' + RATING_LABELS[rB]
        });
      }
    });

    // Tradeoffs divergentes
    let trMatched = 0;
    let trTotal = 0;
    DATA.tradeoffs.forEach((t) => {
      const a = pA.tradeoffs[t.id];
      const b = pB.tradeoffs[t.id];
      if (!a || !b) return;
      trTotal += 1;
      if (a === b) {
        trMatched += 1;
      } else {
        const labelA = a === 'A' ? t.optionA.title : t.optionB.title;
        const labelB = b === 'A' ? t.optionA.title : t.optionB.title;
        divergences.push({
          topic: 'Decisão Técnica: ' + t.label,
          detailA: nameA + ': ' + labelA,
          detailB: nameB + ': ' + labelB
        });
      }
    });

    // Ergonomia Suite (Cama, Cuba, Chuveiro)
    let ergoMatched = 0;
    let ergoTotal = 0;
    const ergoFields = [
      { key: 'bed', label: 'Ergonomia — Cama', shortLabel: 'Cama', list: DATA.ergonomics.bedSizes },
      { key: 'basin', label: 'Ergonomia — Cuba', shortLabel: 'Cuba', list: DATA.ergonomics.bathBasins },
      { key: 'shower', label: 'Ergonomia — Chuveiro', shortLabel: 'Chuveiro', list: DATA.ergonomics.bathShowers }
    ];
    ergoFields.forEach((f) => {
      const vA = pA.ergonomics && pA.ergonomics[f.key];
      const vB = pB.ergonomics && pB.ergonomics[f.key];
      if (!vA || !vB) return;
      ergoTotal += 1;
      if (vA === vB) {
        ergoMatched += 1;
        technicalConsensos.push({
          tag: 'Ergonomia',
          title: f.shortLabel + ': ' + findLabel(f.list, vA)
        });
      } else {
        divergences.push({
          topic: f.label,
          detailA: nameA + ': ' + findLabel(f.list, vA),
          detailB: nameB + ': ' + findLabel(f.list, vB)
        });
      }
    });

    // Paleta divergente / consensual
    let palScore = 0.5;
    if (pA.palettePrimary && pB.palettePrimary) {
      const palObjA = DATA.palettes.find((p) => p.id === pA.palettePrimary);
      const palObjB = DATA.palettes.find((p) => p.id === pB.palettePrimary);
      if (pA.palettePrimary === pB.palettePrimary) {
        palScore = 1;
        if (palObjA) {
          technicalConsensos.push({
            tag: 'Direção Cromática',
            title: palObjA.title
          });
        }
      } else if (
        pA.palettePrimary === pB.paletteSecondary ||
        pB.palettePrimary === pA.paletteSecondary
      ) {
        palScore = 0.7;
      } else {
        palScore = 0.25;
        if (palObjA && palObjB) {
          divergences.push({
            topic: 'Direção Cromática Principal',
            detailA: nameA + ': ' + palObjA.title,
            detailB: nameB + ': ' + palObjB.title
          });
        }
      }
    }

    // Patina
    const patDiff = Math.abs((pA.patina || 3) - (pB.patina || 3));
    const patScore = 1 - patDiff / 4;
    if (patDiff >= 2) {
      divergences.push({
        topic: 'Escala de Pátina vs. Praticidade',
        detailA: nameA + ': Nível ' + (pA.patina || 3) + '/5',
        detailB: nameB + ': Nível ' + (pB.patina || 3) + '/5'
      });
    }

    // Rituais compartilhados
    const setRitB = new Set(pB.rituals || []);
    const sharedRituals = (pA.rituals || []).filter((id) => setRitB.has(id));
    const unionRituals = new Set([...(pA.rituals || []), ...(pB.rituals || [])]);
    const ritScore = unionRituals.size > 0 ? sharedRituals.length / unionRituals.size : 1;

    // Ato 4: Especificacao, Horizonte & Prioridades
    let act4ScoreSum = 0;
    let act4Count = 0;

    if (pA.specTier && pB.specTier) {
      act4Count += 1;
      if (pA.specTier === pB.specTier) {
        act4ScoreSum += 1;
        technicalConsensos.push({
          tag: 'Especificação',
          title: findLabel(DATA.scopeOptions.specTiers, pA.specTier)
        });
      } else {
        divergences.push({
          topic: 'Padrão de Especificação',
          detailA: nameA + ': ' + findLabel(DATA.scopeOptions.specTiers, pA.specTier),
          detailB: nameB + ': ' + findLabel(DATA.scopeOptions.specTiers, pB.specTier)
        });
      }
    }

    if (pA.timeline && pB.timeline) {
      act4Count += 1;
      if (pA.timeline === pB.timeline) {
        act4ScoreSum += 1;
        technicalConsensos.push({
          tag: 'Horizonte',
          title: findLabel(DATA.scopeOptions.timelines, pA.timeline)
        });
      } else {
        divergences.push({
          topic: 'Horizonte da Obra',
          detailA: nameA + ': ' + findLabel(DATA.scopeOptions.timelines, pA.timeline),
          detailB: nameB + ': ' + findLabel(DATA.scopeOptions.timelines, pB.timeline)
        });
      }
    }

    const priosA = pA.priorities || [];
    const priosB = pB.priorities || [];
    if (priosA.length && priosB.length) {
      const setPrioB = new Set(priosB);
      const sharedPrios = priosA.filter((id) => setPrioB.has(id));
      const unionPrios = new Set([...priosA, ...priosB]);
      const prioOverlap = unionPrios.size > 0 ? sharedPrios.length / unionPrios.size : 1;
      act4ScoreSum += prioOverlap;
      act4Count += 1;

      const fmtPrios = (arr) =>
        arr
          .map((id, i) => (i + 1) + 'º ' + findLabel(DATA.priorities, id))
          .filter(Boolean)
          .join(', ');

      const exactPrioMatch =
        priosA.length === priosB.length && priosA.every((id, idx) => id === priosB[idx]);

      if (exactPrioMatch) {
        technicalConsensos.push({
          tag: 'Prioridades',
          title: fmtPrios(priosA)
        });
      } else {
        if (sharedPrios.length > 0) {
          technicalConsensos.push({
            tag: 'Prioridade Comum',
            title: sharedPrios.map((id) => findLabel(DATA.priorities, id)).filter(Boolean).join(', ')
          });
        }
        divergences.push({
          topic: 'Prioridades de Investimento',
          detailA: nameA + ': ' + fmtPrios(priosA),
          detailB: nameB + ': ' + fmtPrios(priosB)
        });
      }
    }

    const deckRatio = cardCount > 0 ? cardScoreSum / cardCount : 0.75;
    const trRatio = trTotal > 0 ? trMatched / trTotal : 0.75;
    const ergoRatio = ergoTotal > 0 ? ergoMatched / ergoTotal : 0.75;
    const act4Ratio = act4Count > 0 ? act4ScoreSum / act4Count : 0.75;

    const totalPct = Math.round(
      (deckRatio * 0.45 +
        trRatio * 0.15 +
        ergoRatio * 0.1 +
        palScore * 0.1 +
        patScore * 0.05 +
        ritScore * 0.05 +
        act4Ratio * 0.1) *
        100
    );

    return {
      affinityPercent: clamp(totalPct, 0, 100),
      sharedEssentials: sharedEssentials,
      technicalConsensos: technicalConsensos,
      divergences: divergences,
      sharedRituals: sharedRituals
    };
  }

  function buildTechnicalDiagnostic(dossier) {
    const sc = dossier.scope;
    const pA = dossier.profiles.A;
    const pB = sc.coupleMode ? dossier.profiles.B : null;

    const estagio = findLabel(DATA.scopeOptions.stages, sc.stage, 'Interiores');
    const tipologia = findLabel(DATA.scopeOptions.typologies, sc.typology, 'Imóvel Residencial');
    const metragem = findLabel(DATA.scopeOptions.areas, sc.area, 'Metragem a confirmar');

    const palA = DATA.palettes.find((p) => p.id === pA.palettePrimary);
    const palB = pB ? DATA.palettes.find((p) => p.id === pB.palettePrimary) : null;
    let paletaTexto = palA ? palA.title : 'Materialidade Natural';
    if (palA && palB && palA.id !== palB.id) {
      paletaTexto = palA.title + ' (e acentos de ' + palB.title + ')';
    }

    const specA = findLabel(DATA.scopeOptions.specTiers, pA.specTier, '');
    const specB = pB ? findLabel(DATA.scopeOptions.specTiers, pB.specTier, '') : '';
    const especificacao =
      specA && specB && specA !== specB
        ? specA + ' / ' + specB
        : specA || specB || 'Sob Medida';

    // Tradeoffs
    const getTradeoffVal = (idx, fallbackA, fallbackB) => {
      const tr = DATA.tradeoffs[idx];
      if (!tr) return fallbackA;
      const choice = pA.tradeoffs[tr.id] || (pB && pB.tradeoffs[tr.id]);
      if (choice === 'B') return fallbackB;
      return fallbackA;
    };

    // 0: Cozinha, 2: Iluminacao, 4: Climatizacao
    const cozinhaTexto = getTradeoffVal(0, 'Integrada ao Living', 'Com Painéis de Correr');
    const luzTexto = getTradeoffVal(2, '2700K — Quente e Indireta', '3000K — Equilibrada e Funcional');
    const climaTexto = getTradeoffVal(4, 'Dutada / Grelha Linear Invisível', 'Split Discreta');

    const patinaAvg = pB ? Math.round(((pA.patina || 3) + (pB.patina || 3)) / 2) : pA.patina || 3;
    const patinaTexto =
      patinaAvg <= 2
        ? 'Pátina Viva e Matéria Natural'
        : patinaAvg === 3
        ? 'Equilibrado entre Pátina e Praticidade'
        : 'Alta Praticidade e Baixa Manutenção';

    return (
      'Projeto de ' +
      estagio +
      ' para ' +
      tipologia +
      ' (' +
      metragem +
      '), com linguagem orientada à direção ' +
      paletaTexto +
      ' e padrão ' +
      especificacao +
      '. A infraestrutura prioriza iluminação ' +
      luzTexto +
      ', cozinha ' +
      cozinhaTexto +
      ', climatização ' +
      climaTexto +
      ' e perfil de manutenção ' +
      patinaTexto +
      '.'
    );
  }

  /* =========================================================================
     16. ATO 5 — DOSSIE EDITORIAL & MOODBOARD
     ========================================================================= */

  function collectMoodboardItems(dossier) {
    const pA = dossier.profiles.A;
    const pB = dossier.scope.coupleMode ? dossier.profiles.B : null;
    const nameA = getDossierResidentLabel(dossier, 'A');
    const nameB = getDossierResidentLabel(dossier, 'B');

    const items = [];

    DATA.cards.forEach((card) => {
      const rA = pA.ratings[card.id];
      const rB = pB ? pB.ratings[card.id] : null;

      if (!pB) {
        if (rA === RATING_KEYS.ESSENCIAL || rA === RATING_KEYS.AFINIDADE) {
          items.push({
            card: card,
            tier: rA,
            badgeText: RATING_LABELS[rA].toUpperCase(),
            note: ''
          });
        }
        return;
      }

      // Modo Casal: nunca exibe cards rejeitados por ambos; prioriza consensos positivos
      if (rA === RATING_KEYS.EVITAR && rB === RATING_KEYS.EVITAR) return;

      const isPosA = rA === RATING_KEYS.ESSENCIAL || rA === RATING_KEYS.AFINIDADE;
      const isPosB = rB === RATING_KEYS.ESSENCIAL || rB === RATING_KEYS.AFINIDADE;
      if (!isPosA && !isPosB) return;

      if (rA === RATING_KEYS.EVITAR || rB === RATING_KEYS.EVITAR) {
        // Divergencia direta fica na Matriz de Sintonia, nao no moodboard aprovado
        return;
      }

      const bothEssential = rA === RATING_KEYS.ESSENCIAL && rB === RATING_KEYS.ESSENCIAL;
      const anyEssential = rA === RATING_KEYS.ESSENCIAL || rB === RATING_KEYS.ESSENCIAL;
      const tier = anyEssential ? RATING_KEYS.ESSENCIAL : RATING_KEYS.AFINIDADE;

      let badgeText = bothEssential ? 'CONSENSO ESSENCIAL' : RATING_LABELS[tier].toUpperCase();
      let note = '';
      if (rA && rB && rA !== rB) {
        note = nameA + ': ' + RATING_LABELS[rA] + ' | ' + nameB + ': ' + RATING_LABELS[rB];
      } else if (isPosA && !isPosB) {
        note = nameA + ': ' + RATING_LABELS[rA];
      } else if (isPosB && !isPosA) {
        note = nameB + ': ' + RATING_LABELS[rB];
      }

      items.push({ card: card, tier: tier, badgeText: badgeText, note: note });
    });

    items.sort((a, b) => {
      if (a.tier === b.tier) return 0;
      return a.tier === RATING_KEYS.ESSENCIAL ? -1 : 1;
    });

    return items;
  }

  function renderAct5(dossier) {
    if (!dossier) return;
    const sc = dossier.scope;
    const pA = dossier.profiles.A;
    const pB = sc.coupleMode ? dossier.profiles.B : null;

    if (dom.dossierCode) dom.dossierCode.textContent = dossier.code;
    if (dom.dossierDate) dom.dossierDate.textContent = formatDateBr(dossier.createdAt);

    if (dom.dossierClientTitle) {
      const mainName = (sc.clientName || '').trim() ||
        (sc.coupleMode ? getDossierResidentLabel(dossier, 'A') + ' & ' + getDossierResidentLabel(dossier, 'B') : 'Estudo Preliminar');
      const proj = (sc.projectName || '').trim();
      dom.dossierClientTitle.textContent = proj ? mainName + ' — ' + proj : mainName;
    }

    if (dom.dossierScopeStrip) {
      const stripItems = [
        findLabel(DATA.scopeOptions.typologies, sc.typology),
        findLabel(DATA.scopeOptions.stages, sc.stage),
        findLabel(DATA.scopeOptions.areas, sc.area),
        sc.coupleMode ? 'Modo Casal (2 Perfis)' : 'Perfil Único'
      ].filter(Boolean);

      dom.dossierScopeStrip.innerHTML = stripItems
        .map((txt) => '<span class="scope-strip-item">' + escapeHtml(txt) + '</span>')
        .join('');
    }

    if (dom.dossierDiagnosticText) {
      dom.dossierDiagnosticText.textContent = buildTechnicalDiagnostic(dossier);
    }

    // Diretrizes Grid
    if (dom.dossierDirectivesGrid) {
      const roomLabels = (sc.rooms || []).map((id) => findLabel(DATA.scopeOptions.rooms, id)).filter(Boolean);
      const hhLabels = (sc.household || []).map((id) => findLabel(DATA.scopeOptions.household, id)).filter(Boolean);

      const ritualIds = Array.from(new Set([...(pA.rituals || []), ...(pB ? pB.rituals || [] : [])]));
      const ritualItems = ritualIds
        .map((id) => DATA.rituals.find((r) => r.id === id))
        .filter(Boolean);

      const ritualsHtml = ritualItems.length
        ? '<ul class="directive-icon-list">' +
          ritualItems
            .map(
              (r) =>
                '<li><span class="chip-svg-icon">' +
                getSvgIcon(r.iconKey) +
                '</span><span>' +
                escapeHtml(r.label) +
                '</span></li>'
            )
            .join('') +
          '</ul>'
        : '<p class="directive-empty">Sem rituais específicos assinalados.</p>';

      const tradeoffsHtml = DATA.tradeoffs
        .map((t) => {
          const cA = pA.tradeoffs[t.id];
          const cB = pB ? pB.tradeoffs[t.id] : null;
          let valText = 'A definir';
          if (cA && cB && cA !== cB) {
            valText =
              getDossierResidentLabel(dossier, 'A') +
              ': ' +
              (cA === 'A' ? t.optionA.title : t.optionB.title) +
              ' / ' +
              getDossierResidentLabel(dossier, 'B') +
              ': ' +
              (cB === 'A' ? t.optionA.title : t.optionB.title);
          } else {
            const pick = cA || cB;
            if (pick === 'A') valText = t.optionA.title;
            else if (pick === 'B') valText = t.optionB.title;
          }
          return (
            '<div class="directive-kv"><span class="dk-label">' +
            escapeHtml(t.label) +
            '</span><span class="dk-val">' +
            escapeHtml(valText) +
            '</span></div>'
          );
        })
        .join('');

      const nameA = getDossierResidentLabel(dossier, 'A');
      const nameB = getDossierResidentLabel(dossier, 'B');

      const resolveCoupleLabel = (list, valA, valB, fallback = 'A definir') => {
        const lA = findLabel(list, valA, '');
        const lB = pB ? findLabel(list, valB, '') : '';
        if (pB && lA && lB && lA !== lB) {
          return nameA + ': ' + lA + ' / ' + nameB + ': ' + lB;
        }
        return lA || lB || fallback;
      };

      const bedLabel = resolveCoupleLabel(
        DATA.ergonomics.bedSizes,
        pA.ergonomics && pA.ergonomics.bed,
        pB && pB.ergonomics && pB.ergonomics.bed
      );
      const basinLabel = resolveCoupleLabel(
        DATA.ergonomics.bathBasins,
        pA.ergonomics && pA.ergonomics.basin,
        pB && pB.ergonomics && pB.ergonomics.basin
      );
      const showerLabel = resolveCoupleLabel(
        DATA.ergonomics.bathShowers,
        pA.ergonomics && pA.ergonomics.shower,
        pB && pB.ergonomics && pB.ergonomics.shower
      );

      const renderPrioListHtml = (prioArr, ownerPrefix) => {
        const itemsHtml = (prioArr || [])
          .map((id, idx) => {
            const p = DATA.priorities.find((item) => item.id === id);
            if (!p) return '';
            return (
              '<li><span class="rank-badge">' +
              (idx + 1) +
              'º</span><span class="chip-svg-icon">' +
              getSvgIcon(p.iconKey) +
              '</span><span>' +
              escapeHtml(p.label) +
              '</span></li>'
            );
          })
          .filter(Boolean)
          .join('');
        if (!itemsHtml) return '';
        return (
          (ownerPrefix
            ? '<div class="directive-kv"><span class="dk-label">' +
              escapeHtml(ownerPrefix) +
              '</span></div>'
            : '') +
          '<ul class="directive-icon-list">' +
          itemsHtml +
          '</ul>'
        );
      };

      const priosA = pA.priorities || [];
      const priosB = pB ? pB.priorities || [] : [];
      const samePrios =
        !pB ||
        (priosA.length === priosB.length && priosA.every((id, idx) => id === priosB[idx]));

      let priosBlockHtml = '';
      if (!pB || samePrios || !priosB.length) {
        priosBlockHtml = renderPrioListHtml(priosA.length ? priosA : priosB, '');
      } else if (!priosA.length) {
        priosBlockHtml = renderPrioListHtml(priosB, nameB);
      } else {
        priosBlockHtml =
          renderPrioListHtml(priosA, nameA) + renderPrioListHtml(priosB, nameB);
      }

      const tierLabel = resolveCoupleLabel(
        DATA.scopeOptions.specTiers,
        pA.specTier,
        pB && pB.specTier
      );
      const timelineLabel = resolveCoupleLabel(
        DATA.scopeOptions.timelines,
        pA.timeline,
        pB && pB.timeline
      );

      dom.dossierDirectivesGrid.innerHTML =
        '<div class="directive-card">' +
        '  <h4 class="directive-title">Programa & Composição</h4>' +
        '  <div class="directive-kv"><span class="dk-label">Ambientes</span><span class="dk-val">' +
        escapeHtml(roomLabels.length ? roomLabels.join(', ') : 'A definir') +
        '</span></div>' +
        '  <div class="directive-kv"><span class="dk-label">Moradores</span><span class="dk-val">' +
        escapeHtml(hhLabels.length ? hhLabels.join(', ') : 'A definir') +
        '</span></div>' +
        '  <div class="directive-kv"><span class="dk-label">Acervo Afetivo</span><span class="dk-val">' +
        escapeHtml(sc.hasHeirloom ? (sc.heirloomNote || 'Integrar peças existentes') : 'Partida do zero') +
        '</span></div>' +
        '  <div class="directive-kv"><span class="dk-label">Ergonomia Suíte</span><span class="dk-val">' +
        escapeHtml('Cama: ' + bedLabel + ' | Cuba: ' + basinLabel + ' | Chuveiro: ' + showerLabel) +
        '</span></div>' +
        '</div>' +
        '<div class="directive-card">' +
        '  <h4 class="directive-title">Rituais Cotidianos</h4>' +
        ritualsHtml +
        '</div>' +
        '<div class="directive-card">' +
        '  <h4 class="directive-title">Infraestrutura & Trade-offs</h4>' +
        tradeoffsHtml +
        '</div>' +
        '<div class="directive-card">' +
        '  <h4 class="directive-title">Investimento & Prazo</h4>' +
        '  <div class="directive-kv"><span class="dk-label">Especificação</span><span class="dk-val">' +
        escapeHtml(tierLabel) +
        '</span></div>' +
        '  <div class="directive-kv"><span class="dk-label">Horizonte</span><span class="dk-val">' +
        escapeHtml(timelineLabel) +
        '</span></div>' +
        (priosBlockHtml || '<p class="directive-empty">Prioridades de investimento não ranqueadas.</p>') +
        '</div>';
    }

    // Matriz de Sintonia do Casal
    if (dom.dossierCoupleSection) {
      if (sc.coupleMode) {
        dom.dossierCoupleSection.hidden = false;
        dom.dossierCoupleSection.classList.add('is-visible');
        const harmony = computeCoupleHarmony(dossier);

        if (dom.dossierCoupleScore) {
          dom.dossierCoupleScore.textContent = harmony.affinityPercent + '%';
        }

        if (dom.dossierCoupleMatrix) {
          const allConsensos = [
            ...harmony.sharedEssentials.map((item) => ({
              tag: item.level,
              title: item.card.env + ' — ' + item.card.title
            })),
            ...(harmony.technicalConsensos || []).map((c) => ({
              tag: c.tag,
              title: c.title
            }))
          ];

          const consHtml = allConsensos.length
            ? allConsensos
                .map(
                  (item) =>
                    '<div class="matrix-row is-consensus">' +
                    '<span class="matrix-tag">' +
                    escapeHtml(item.tag) +
                    '</span>' +
                    '<span class="matrix-title">' +
                    escapeHtml(item.title) +
                    '</span>' +
                    '</div>'
                )
                .join('')
            : '<p class="directive-empty">Nenhum consenso simultâneo registrado entre os perfis.</p>';

          const divHtml = harmony.divergences.length
            ? harmony.divergences
                .map(
                  (d) =>
                    '<div class="matrix-row is-divergence">' +
                    '<div class="matrix-title">' +
                    escapeHtml(d.topic) +
                    '</div>' +
                    '<div class="matrix-split"><span>' +
                    escapeHtml(d.detailA) +
                    '</span><span>' +
                    escapeHtml(d.detailB) +
                    '</span></div>' +
                    '</div>'
                )
                .join('')
            : '<p class="directive-empty">Nenhuma divergência crítica mapeada entre os perfis.</p>';

          dom.dossierCoupleMatrix.innerHTML =
            '<div class="matrix-col"><h4>Consensos & Alinhamentos</h4>' +
            consHtml +
            '</div>' +
            '<div class="matrix-col"><h4>Divergências Mapeadas</h4>' +
            divHtml +
            '</div>';
        }
      } else {
        dom.dossierCoupleSection.hidden = true;
        dom.dossierCoupleSection.classList.remove('is-visible');
      }
    }

    // Paleta & Pátina Board
    if (dom.dossierPaletteBoard) {
      const selectedPalIds = Array.from(
        new Set(
          [
            pA.palettePrimary,
            pA.paletteSecondary,
            pB ? pB.palettePrimary : '',
            pB ? pB.paletteSecondary : ''
          ].filter(Boolean)
        )
      );
      const selectedPalettes = selectedPalIds
        .map((id) => DATA.palettes.find((p) => p.id === id))
        .filter(Boolean);

      const patinaLevel = DATA.patinaScale.find((pt) => Number(pt.value) === Number(pA.patina || 3));

      if (selectedPalettes.length) {
        dom.dossierPaletteBoard.innerHTML =
          selectedPalettes
            .map((pal, idx) => {
              const role = idx === 0 ? 'Direção Principal' : 'Direção Complementar';
              const swatches = (pal.colors || [])
                .map(
                  (hex) =>
                    '<div class="dossier-swatch-item">' +
                    '<span class="dossier-swatch-box" style="background-color:' +
                    escapeHtml(hex) +
                    '"></span>' +
                    '<span class="dossier-swatch-hex">' +
                    escapeHtml(hex) +
                    '</span>' +
                    '</div>'
                )
                .join('');
              const mats = pal.materials || {};
              return (
                '<div class="dossier-palette-card">' +
                '  <div class="dossier-palette-meta">' +
                role +
                '</div>' +
                '  <h4 class="dossier-palette-title">' +
                escapeHtml(pal.title) +
                '</h4>' +
                '  <div class="dossier-swatches-grid">' +
                swatches +
                '</div>' +
                '  <div class="dossier-materials-strip">' +
                escapeHtml(
                  [mats.stone, mats.wood, mats.fabric, mats.metal].filter(Boolean).join(' • ')
                ) +
                '</div>' +
                '</div>'
              );
            })
            .join('') +
          (patinaLevel
            ? '<div class="dossier-patina-summary"><span class="dk-label">Escala Tátil (Pátina):</span> <span class="dk-val">' +
              patinaLevel.value +
              '/5 — ' +
              escapeHtml(patinaLevel.title) +
              ' (' +
              escapeHtml(patinaLevel.desc) +
              ')</span></div>'
            : '');
      } else {
        dom.dossierPaletteBoard.innerHTML =
          '<p class="directive-empty">Nenhuma paleta selecionada; definição aberta para Estudo Preliminar.</p>';
      }
    }

    // Moodboard Grid (first Essencial gets .is-lead; NEVER shows rejected cards)
    if (dom.dossierMoodboardGrid) {
      const plates = collectMoodboardItems(dossier);
      if (plates.length === 0) {
        dom.dossierMoodboardGrid.innerHTML =
          '<div class="moodboard-empty-editorial">' +
          '<h4>Nenhuma referência visual marcada como Essencial ou Afinidade</h4>' +
          '<p>O Estudo Preliminar partirá diretamente das diretrizes técnicas, escala de pátina, paleta de materiais e lista de vetos registrados neste dossiê.</p>' +
          '</div>';
      } else {
        let leadAssigned = false;
        dom.dossierMoodboardGrid.innerHTML = plates
          .map((item) => {
            const isLead = !leadAssigned && item.tier === RATING_KEYS.ESSENCIAL;
            if (isLead) leadAssigned = true;
            return (
              '<figure class="moodboard-plate' +
              (isLead ? ' is-lead' : '') +
              '" data-card-id="' +
              escapeHtml(item.card.id) +
              '" tabindex="0">' +
              '  <div class="moodboard-plate-media img-skeleton">' +
              '    <img class="moodboard-plate-img" src="' +
              escapeHtml(item.card.image) +
              '" alt="' +
              escapeHtml(item.card.title) +
              '" decoding="async">' +
              '  </div>' +
              '  <figcaption class="moodboard-plate-caption">' +
              '    <div class="plate-caption-top">' +
              '      <span class="plate-index">' +
              escapeHtml(item.card.index + ' · ' + item.card.env) +
              '</span>' +
              '      <span class="plate-state is-' +
              escapeHtml(item.tier) +
              '">' +
              escapeHtml(item.badgeText) +
              '</span>' +
              '    </div>' +
              '    <div class="plate-title">' +
              escapeHtml(item.card.title) +
              '</div>' +
              '    <div class="plate-variable">' +
              escapeHtml(item.card.variable) +
              (item.note ? ' — ' + escapeHtml(item.note) : '') +
              '</div>' +
              '  </figcaption>' +
              '</figure>'
            );
          })
          .join('');

        dom.dossierMoodboardGrid.querySelectorAll('.moodboard-plate').forEach((fig) => {
          const cardId = fig.getAttribute('data-card-id');
          const cardObj = DATA.cards.find((c) => c.id === cardId);
          const img = fig.querySelector('.moodboard-plate-img');
          const media = fig.querySelector('.moodboard-plate-media');
          if (img && media && cardObj) {
            attachImageLifecycle(img, media, cardObj.title, cardObj.env);
            if (img.complete && img.naturalWidth > 0) {
              media.classList.remove('img-skeleton', 'img-fallback');
              media.classList.add('img-loaded');
            }
          }
          if (cardObj) {
            fig.addEventListener('click', () => openLightbox(cardObj));
            fig.addEventListener('keydown', (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openLightbox(cardObj);
              }
            });
          }
        });
      }
    }

    // Vetos
    if (dom.dossierVetosList) {
      const vetoIds = Array.from(new Set([...(pA.vetos || []), ...(pB ? pB.vetos || [] : [])]));
      const vetoLabels = vetoIds.map((id) => findLabel(DATA.vetos, id)).filter(Boolean);
      if (vetoLabels.length) {
        dom.dossierVetosList.innerHTML = vetoLabels
          .map((lbl) => '<span class="veto-chip">' + escapeHtml(lbl) + '</span>')
          .join('');
      } else {
        dom.dossierVetosList.innerHTML =
          '<span class="directive-empty">Nenhum veto específico registrado.</span>';
      }
    }
  }

  function buildWhatsappMessage(dossier) {
    const sc = dossier.scope;
    const pA = dossier.profiles.A;
    const pB = sc.coupleMode ? dossier.profiles.B : null;

    const clientName =
      (sc.clientName || '').trim() ||
      (sc.coupleMode
        ? getDossierResidentLabel(dossier, 'A') + ' e ' + getDossierResidentLabel(dossier, 'B')
        : 'Cliente VA');

    const tip = findLabel(DATA.scopeOptions.typologies, sc.typology, 'A definir');
    const est = findLabel(DATA.scopeOptions.stages, sc.stage, 'A definir');
    const met = findLabel(DATA.scopeOptions.areas, sc.area, 'A definir');

    const pal = DATA.palettes.find((p) => p.id === pA.palettePrimary);
    const palTitle = pal ? pal.title : 'A definir';

    const prios = (pA.priorities || []).map((id) => findLabel(DATA.priorities, id)).filter(Boolean);
    const p1 = prios[0] || 'A definir';
    const p2 = prios[1] || 'A definir';
    const p3 = prios[2] || 'A definir';

    const vetoIds = Array.from(new Set([...(pA.vetos || []), ...(pB ? pB.vetos || [] : [])]));
    const vetosText =
      vetoIds
        .map((id) => findLabel(DATA.vetos, id))
        .filter(Boolean)
        .join(', ') || 'Nenhum';

    const shareUrl = buildDossierShareUrl(dossier);

    return (
      'VA ARQUITETURA & INTERIORES — DOSSIÊ DE BRIEFING ' +
      dossier.code +
      '\n' +
      'Cliente: ' +
      clientName +
      '\n' +
      'Escopo: ' +
      tip +
      ' | Estágio: ' +
      est +
      ' | ' +
      met +
      '\n' +
      'Direção Cromática: ' +
      palTitle +
      '\n' +
      'Prioridades: 1. ' +
      p1 +
      ' | 2. ' +
      p2 +
      ' | 3. ' +
      p3 +
      '\n' +
      'Vetos: ' +
      vetosText +
      '\n\n' +
      'Acesse o dossiê completo no Painel VA:\n' +
      shareUrl
    );
  }

  async function copyTextToClipboard(text) {
    if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch (_) {}
    }
    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.left = '-9999px';
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand('copy');
      ta.remove();
      return ok;
    } catch (_) {
      return false;
    }
  }

  function downloadJsonFile(filename, dataObj) {
    const json = JSON.stringify(dataObj, null, 2);
    const blob = new Blob([json], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function bindAct5Events() {
    if (dom.btnCopyDossierLink) {
      dom.btnCopyDossierLink.addEventListener('click', async () => {
        if (!appState.activeDossier) return;
        const url = buildDossierShareUrl(appState.activeDossier);
        const ok = await copyTextToClipboard(url);
        showToast(ok ? 'Link do dossiê copiado.' : 'Não foi possível copiar o link.');
      });
    }

    if (dom.btnSendWhatsapp) {
      dom.btnSendWhatsapp.addEventListener('click', () => {
        if (!appState.activeDossier) return;
        const msg = buildWhatsappMessage(appState.activeDossier);
        const digits = String((DATA.brand && DATA.brand.studioWhatsapp) || '').replace(/\D/g, '');
        const waUrl = digits
          ? 'https://wa.me/' + digits + '?text=' + encodeURIComponent(msg)
          : 'https://wa.me/?text=' + encodeURIComponent(msg);
        window.open(waUrl, '_blank', 'noopener,noreferrer');
      });
    }

    if (dom.btnPrintPdf) {
      dom.btnPrintPdf.addEventListener('click', () => {
        window.print();
      });
    }

    if (dom.btnExportJson) {
      dom.btnExportJson.addEventListener('click', () => {
        if (!appState.activeDossier) return;
        downloadJsonFile('VA-Briefing-' + appState.activeDossier.code + '.json', appState.activeDossier);
        showToast('Arquivo JSON exportado.');
      });
    }

    if (dom.btnNewBriefing) {
      dom.btnNewBriefing.addEventListener('click', () => {
        clearDraftStorage();
        appState.draft = createCleanDraft();
        appState.activeDossier = null;
        if (window.location.hash && window.location.hash.includes('dossier=')) {
          try {
            history.replaceState(null, '', window.location.pathname + window.location.search);
          } catch (_) {
            window.location.hash = '';
          }
        }
        syncConditionalVisibility(dom.draftBanner, false);
        goToAct(0);
        showToast('Pronto para um novo levantamento.');
      });
    }
  }

  /* =========================================================================
     17. PAINEL DA ARQUITETA (ADMIN SHA-256 + IMPORT/EXPORT + DETALHE)
     ========================================================================= */

  function renderAdminDossierDetail(code) {
    if (!dom.adminDossierDetail) return;
    const dossiers = loadStoredDossiers();
    const dossier = dossiers.find((d) => d.code === code);

    if (!dossier) {
      dom.adminDossierDetail.innerHTML =
        '<div class="admin-detail-empty">Selecione um briefing na lista para visualizar o dossiê completo.</div>';
      return;
    }

    const sc = dossier.scope || {};
    const pA = dossier.profiles && dossier.profiles.A ? dossier.profiles.A : createEmptyProfile();
    const clientTitle =
      (sc.clientName || '').trim() ||
      (sc.coupleMode
        ? getDossierResidentLabel(dossier, 'A') + ' & ' + getDossierResidentLabel(dossier, 'B')
        : 'Cliente sem identificação');

    const diagnostic = buildTechnicalDiagnostic(dossier);
    const pal = DATA.palettes.find((p) => p.id === pA.palettePrimary);
    const plates = collectMoodboardItems(dossier);
    const coupleSectionHtml = sc.coupleMode
      ? (() => {
          const h = computeCoupleHarmony(dossier);
          return (
            '<div class="admin-detail-block">' +
            '  <h5>Matriz de Sintonia do Casal — ' +
            h.affinityPercent +
            '%</h5>' +
            '  <p class="admin-detail-sub">' +
            h.sharedEssentials.length +
            ' consensos essenciais | ' +
            h.divergences.length +
            ' divergências mapeadas</p>' +
            (h.divergences.length
              ? '<ul class="admin-diff-list">' +
                h.divergences
                  .map(
                    (d) =>
                      '<li><strong>' +
                      escapeHtml(d.topic) +
                      ':</strong> ' +
                      escapeHtml(d.detailA) +
                      ' × ' +
                      escapeHtml(d.detailB) +
                      '</li>'
                  )
                  .join('') +
                '</ul>'
              : '') +
            '</div>'
          );
        })()
      : '';

    const prios = (pA.priorities || [])
      .map((id, idx) => (idx + 1) + 'º ' + findLabel(DATA.priorities, id))
      .filter(Boolean)
      .join(' · ');

    const vetos = Array.from(
      new Set([...(pA.vetos || []), ...(sc.coupleMode && dossier.profiles.B ? dossier.profiles.B.vetos || [] : [])])
    )
      .map((id) => findLabel(DATA.vetos, id))
      .filter(Boolean)
      .join(', ');

    dom.adminDossierDetail.innerHTML =
      '<div class="admin-detail-card">' +
      '  <div class="admin-detail-head">' +
      '    <div>' +
      '      <span class="admin-code-pill">' +
      escapeHtml(dossier.code) +
      '</span>' +
      '      <span class="admin-date-meta">' +
      escapeHtml(formatDateBr(dossier.createdAt)) +
      '</span>' +
      '      <h3 class="admin-detail-title">' +
      escapeHtml(clientTitle) +
      (sc.projectName ? ' — ' + escapeHtml(sc.projectName) : '') +
      '</h3>' +
      '    </div>' +
      '    <div class="admin-detail-actions">' +
      '      <button type="button" class="btn-secondary" id="btn-adm-open-dossier">Abrir Dossiê Completo</button>' +
      '      <button type="button" class="btn-ghost" id="btn-adm-copy-link">Copiar Link</button>' +
      '      <button type="button" class="btn-ghost" id="btn-adm-print-one">Imprimir PDF</button>' +
      '      <button type="button" class="btn-ghost" id="btn-adm-delete-one">Excluir</button>' +
      '    </div>' +
      '  </div>' +
      '  <div class="admin-detail-block">' +
      '    <h5>Diagnóstico Técnico</h5>' +
      '    <p>' +
      escapeHtml(diagnostic) +
      '</p>' +
      '  </div>' +
      '  <div class="admin-detail-grid">' +
      '    <div class="admin-detail-block"><h5>Paleta Principal</h5><p>' +
      escapeHtml(pal ? pal.title : 'Não definida') +
      '</p></div>' +
      '    <div class="admin-detail-block"><h5>Prioridades de Investimento</h5><p>' +
      escapeHtml(prios || 'Não definidas') +
      '</p></div>' +
      '    <div class="admin-detail-block"><h5>Referências Aprovadas</h5><p>' +
      plates.length +
      ' pranchas selecionadas</p></div>' +
      '    <div class="admin-detail-block"><h5>Vetos (Anti-Briefing)</h5><p>' +
      escapeHtml(vetos || 'Nenhum veto registrado') +
      '</p></div>' +
      '  </div>' +
      coupleSectionHtml +
      '</div>';

    const btnOpen = document.getElementById('btn-adm-open-dossier');
    if (btnOpen) {
      btnOpen.addEventListener('click', () => {
        appState.activeDossier = dossier;
        renderAct5(dossier);
        navigateTo('screen-act-5', { skipSave: true });
      });
    }

    const btnCopy = document.getElementById('btn-adm-copy-link');
    if (btnCopy) {
      btnCopy.addEventListener('click', async () => {
        const ok = await copyTextToClipboard(buildDossierShareUrl(dossier));
        showToast(ok ? 'Link do dossiê copiado.' : 'Falha ao copiar link.');
      });
    }

    const btnPrint = document.getElementById('btn-adm-print-one');
    if (btnPrint) {
      btnPrint.addEventListener('click', () => {
        appState.activeDossier = dossier;
        renderAct5(dossier);
        navigateTo('screen-act-5', { skipSave: true });
        requestAnimationFrame(() => window.print());
      });
    }

    const btnDelete = document.getElementById('btn-adm-delete-one');
    if (btnDelete) {
      let armed = false;
      btnDelete.addEventListener('click', () => {
        if (!armed) {
          armed = true;
          btnDelete.textContent = 'Confirmar Exclusão';
          btnDelete.classList.add('is-danger');
          return;
        }
        const remaining = loadStoredDossiers().filter((item) => item.code !== dossier.code);
        saveStoredDossiers(remaining);
        appState.selectedAdminCode = remaining.length ? remaining[0].code : null;
        renderAdminWorkspace();
        showToast('Briefing removido do painel.');
      });
    }
  }

  function renderAdminWorkspace() {
    if (!dom.adminWorkspace || !dom.adminAuthBox) return;

    if (!appState.isAdminLoggedIn) {
      dom.adminAuthBox.hidden = false;
      dom.adminWorkspace.hidden = true;
      return;
    }

    dom.adminAuthBox.hidden = true;
    dom.adminWorkspace.hidden = false;

    const dossiers = loadStoredDossiers();
    if (!appState.selectedAdminCode && dossiers.length) {
      appState.selectedAdminCode = dossiers[0].code;
    }

    if (dom.adminDossiersTbody) {
      if (!dossiers.length) {
        dom.adminDossiersTbody.innerHTML =
          '<tr><td colspan="5" class="admin-empty-cell">Nenhum briefing registrado neste navegador ainda. Use "Importar Link" ou "Importar JSON" acima.</td></tr>';
      } else {
        dom.adminDossiersTbody.innerHTML = dossiers
          .map((d) => {
            const sc = d.scope || {};
            const pA = d.profiles && d.profiles.A ? d.profiles.A : createEmptyProfile();
            const isSel = d.code === appState.selectedAdminCode;
            const name =
              (sc.clientName || '').trim() ||
              (sc.coupleMode
                ? getDossierResidentLabel(d, 'A') + ' & ' + getDossierResidentLabel(d, 'B')
                : 'Cliente sem nome');
            const tip = findLabel(DATA.scopeOptions.typologies, sc.typology, '—');
            const pal = DATA.palettes.find((p) => p.id === pA.palettePrimary);
            return (
              '<tr class="admin-dossier-row' +
              (isSel ? ' is-selected' : '') +
              '" data-code="' +
              escapeHtml(d.code) +
              '" tabindex="0">' +
              '  <td><span class="mono-code">' +
              escapeHtml(d.code) +
              '</span></td>' +
              '  <td>' +
              escapeHtml(name) +
              (sc.coupleMode ? ' <span class="badge-couple">Casal</span>' : '') +
              '</td>' +
              '  <td>' +
              escapeHtml(tip) +
              '</td>' +
              '  <td>' +
              escapeHtml(pal ? pal.title : '—') +
              '</td>' +
              '  <td>' +
              escapeHtml(formatDateBr(d.createdAt)) +
              '</td>' +
              '</tr>'
            );
          })
          .join('');

        dom.adminDossiersTbody.querySelectorAll('.admin-dossier-row').forEach((row) => {
          const selectRow = () => {
            appState.selectedAdminCode = row.getAttribute('data-code');
            renderAdminWorkspace();
          };
          row.addEventListener('click', selectRow);
          row.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              selectRow();
            }
          });
        });
      }
    }

    renderAdminDossierDetail(appState.selectedAdminCode);
  }

  async function handleAdminLogin() {
    if (!dom.adminPinInput) return;
    const raw = dom.adminPinInput.value.trim();

    if (dom.adminAuthError) {
      dom.adminAuthError.textContent = '';
      dom.adminAuthError.hidden = true;
    }

    if (!raw) {
      if (dom.adminAuthError) {
        dom.adminAuthError.textContent = 'Informe o código de acesso.';
        dom.adminAuthError.hidden = false;
      }
      return;
    }

    const digest = await sha256Hex(raw);
    const expected = String((DATA.brand && DATA.brand.adminPinHash) || '').toLowerCase();

    if (digest === expected) {
      appState.isAdminLoggedIn = true;
      dom.adminPinInput.value = '';
      renderAdminWorkspace();
    } else {
      if (dom.adminAuthError) {
        dom.adminAuthError.textContent = 'Código de acesso inválido.';
        dom.adminAuthError.hidden = false;
      }
    }
  }

  function bindAdminEvents() {
    if (dom.btnOpenAdmin) {
      dom.btnOpenAdmin.addEventListener('click', () => {
        renderAdminWorkspace();
        navigateTo('screen-admin', { skipSave: true });
      });
    }

    if (dom.btnAdminBackPortal) {
      dom.btnAdminBackPortal.addEventListener('click', () => {
        const backScreen = appState.draft.currentScreen || 'screen-act-0';
        const act = screenToActNumber(backScreen);
        if (act >= 0 && act <= 4) {
          goToAct(act);
        } else if (appState.activeDossier) {
          renderAct5(appState.activeDossier);
          navigateTo('screen-act-5', { skipSave: true });
        } else {
          goToAct(0);
        }
      });
    }

    if (dom.btnAdminLogin) {
      dom.btnAdminLogin.addEventListener('click', handleAdminLogin);
    }

    if (dom.adminPinInput) {
      dom.adminPinInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          handleAdminLogin();
        }
      });
    }

    if (dom.btnAdminImportLink) {
      dom.btnAdminImportLink.addEventListener('click', () => {
        if (!dom.adminImportLinkInput) return;
        const val = dom.adminImportLinkInput.value.trim();
        const decoded = decodeDossier(val);
        if (!decoded) {
          showToast('Link ou código #dossier= inválido.');
          return;
        }
        upsertDossier(decoded);
        appState.selectedAdminCode = decoded.code;
        dom.adminImportLinkInput.value = '';
        renderAdminWorkspace();
        showToast('Dossiê ' + decoded.code + ' importado.');
      });
    }

    if (dom.adminImportJsonInput) {
      dom.adminImportJsonInput.addEventListener('change', (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
          try {
            const parsed = JSON.parse(String(reader.result || ''));
            const arr = Array.isArray(parsed) ? parsed : [parsed];
            let count = 0;
            arr.forEach((item) => {
              if (item && item.code && item.scope && item.profiles && item.profiles.A) {
                upsertDossier(item);
                appState.selectedAdminCode = item.code;
                count += 1;
              }
            });
            renderAdminWorkspace();
            showToast(
              count > 0
                ? count + ' briefing(s) importado(s) para o painel.'
                : 'Arquivo JSON não contém briefings válidos.'
            );
          } catch (_) {
            showToast('Não foi possível ler o arquivo JSON.');
          }
          dom.adminImportJsonInput.value = '';
        };
        reader.readAsText(file);
      });
    }

    if (dom.btnAdminExportAll) {
      dom.btnAdminExportAll.addEventListener('click', () => {
        const dossiers = loadStoredDossiers();
        if (!dossiers.length) {
          showToast('Não há briefings salvos para exportar.');
          return;
        }
        const dateTag = new Date().toISOString().slice(0, 10);
        downloadJsonFile('VA-Atelier-Dossiers-' + dateTag + '.json', dossiers);
        showToast('Backup completo exportado.');
      });
    }
  }

  /* =========================================================================
     18. CABECALHO, ATALHOS DE TECLADO & INICIALIZACAO (#dossier= hash)
     ========================================================================= */

  function bindGlobalEvents() {
    if (dom.brandHome) {
      dom.brandHome.addEventListener('click', () => goToAct(0));
    }

    if (dom.btnCloseLightbox) {
      dom.btnCloseLightbox.addEventListener('click', closeLightbox);
    }

    if (dom.editorialLightbox) {
      dom.editorialLightbox.addEventListener('click', (e) => {
        if (e.target === dom.editorialLightbox || e.target.classList.contains('lightbox-backdrop')) {
          closeLightbox();
        }
      });
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isLightboxOpen()) {
        e.preventDefault();
        closeLightbox();
        return;
      }

      const tag = document.activeElement ? document.activeElement.tagName : '';
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

      const act1Active =
        dom.screens['screen-act-1'] && dom.screens['screen-act-1'].classList.contains('is-active');
      if (!act1Active) return;

      if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        if (isLightboxOpen()) {
          closeLightbox();
        } else {
          const prof = getActiveProfile();
          const card = DATA.cards[clamp(prof.cardIndex, 0, DATA.cards.length - 1)];
          if (card) openLightbox(card);
        }
        return;
      }

      if (isLightboxOpen()) return;

      if (e.key === 'ArrowRight') {
        e.preventDefault();
        commitCardRating(RATING_KEYS.ESSENCIAL);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        commitCardRating(RATING_KEYS.EVITAR);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        commitCardRating(RATING_KEYS.AFINIDADE);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        commitCardRating(RATING_KEYS.NEUTRO);
      } else if (e.key === 'z' || e.key === 'Z') {
        e.preventDefault();
        undoLastCardRating();
      }
    });
  }

  function tryOpenHashDossier() {
    const hash = window.location.hash || '';
    const idx = hash.indexOf('#dossier=');
    if (idx < 0) return false;

    const token = hash.slice(idx + 9);
    if (!token) return false;

    const decoded = decodeDossier(token);
    if (!decoded) {
      showToast('Link de dossiê inválido ou incompleto.');
      return false;
    }

    upsertDossier(decoded);
    appState.activeDossier = decoded;
    appState.draft.highestAct = 5;
    renderAct5(decoded);
    navigateTo('screen-act-5', { skipSave: true });
    return true;
  }

  function init() {
    bindAct0Events();
    bindAct1Events();
    bindAct2Events();
    bindAct3Events();
    bindAct4Events();
    bindAct5Events();
    bindAdminEvents();
    bindGlobalEvents();

    // Verifica hash #dossier= ao carregar
    if (tryOpenHashDossier()) {
      return;
    }

    // Estado inicial limpo; verifica rascunho salvo para faixa discreta no Ato 0
    renderAct0();
    const existingDraft = loadDraftFromStorage();
    syncConditionalVisibility(dom.draftBanner, Boolean(existingDraft && hasMeaningfulDraft(existingDraft)));
    navigateTo('screen-act-0', { skipSave: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
