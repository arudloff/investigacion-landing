// journey.js v2 — Turbina de Convicción
// Acumula energía con cada comportamiento del visitante hasta que
// tomar acción se vuelve inminente. No manipula — acompaña.

// ==========================================
// CONFIGURACIÓN DE SEÑALES
// ==========================================
// Cada comportamiento suma puntos de momentum
const SIGNAL_WEIGHTS = {
  pageVisit:      5,    // visitar una página nueva
  revisit:        8,    // volver a una página ya visitada (reflexión)
  timeOnPage:     1,    // por cada 15 segundos en una página
  scrollDepth:    3,    // al llegar al 70% de scroll
  interaction:    4,    // click en contenido interactivo (tabs, expand, etc)
  like:          10,    // marcar un párrafo como destacado
};

// Niveles de la turbina
const LEVELS = [
  { min: 0,   label: 'Curiosidad',    verb: 'Algo llamó tu atención',            color: 'rgba(255,255,255,0.4)' },
  { min: 15,  label: 'Exploración',   verb: 'Estás descubriendo algo',           color: 'rgba(46,109,164,0.8)' },
  { min: 35,  label: 'Reflexión',     verb: 'Esto te está haciendo pensar',      color: 'rgba(74,35,90,0.8)' },
  { min: 55,  label: 'Conexión',      verb: 'Algo resonó contigo',               color: 'rgba(31,107,59,0.8)' },
  { min: 75,  label: 'Convicción',    verb: 'Una idea se está formando',         color: 'rgba(245,166,35,0.8)' },
  { min: 90,  label: 'Despegue',      verb: 'Estás listo para actuar',           color: 'rgba(245,166,35,1)' },
];

// CTAs por nivel (lo que el botón invita a hacer)
const LEVEL_CTAS = [
  { min: 0,  text: 'Sigue explorando', href: null },
  { min: 35, text: 'Hay más por descubrir', href: null },
  { min: 55, text: 'Haz el autodiagnóstico', href: 'autodiagnostico.html' },
  { min: 75, text: '¿Quién necesita saber esto?', href: null, action: 'share' },
  { min: 90, text: 'Da el paso →', href: 'visita.html' },
];

// Frases espejo por nivel
const MIRROR = [
  { min: 0,  text: '' },
  { min: 15, text: 'Ya diste el primer paso. La mayoría nunca llega hasta aquí.' },
  { min: 35, text: 'Estás invirtiendo tiempo en algo que importa. Eso dice mucho de ti.' },
  { min: 55, text: 'Pocas personas reflexionan con esta profundidad sobre la educación.' },
  { min: 75, text: 'Algo cambió desde que empezaste a explorar. ¿Lo sientes?' },
  { min: 90, text: 'Ya tienes la información. Ya tienes la convicción. Solo falta la acción.' },
];

// ==========================================
// STATE
// ==========================================
const STORE_KEY = 'cch_turbine';

function getState() {
  try { return JSON.parse(localStorage.getItem(STORE_KEY)) || initState(); }
  catch(e) { return initState(); }
}

function initState() {
  return { momentum: 0, pages: {}, likes: [], totalTime: 0, interactions: 0, firstVisit: Date.now() };
}

function saveState(s) {
  localStorage.setItem(STORE_KEY, JSON.stringify(s));
}

function addMomentum(points) {
  const s = getState();
  s.momentum = Math.min(100, s.momentum + points);
  saveState(s);
  updateUI();
}

function getLevel() {
  const m = getState().momentum;
  let level = LEVELS[0];
  for (const l of LEVELS) { if (m >= l.min) level = l; }
  return level;
}

function getCTA() {
  const m = getState().momentum;
  let cta = LEVEL_CTAS[0];
  for (const c of LEVEL_CTAS) { if (m >= c.min) cta = c; }
  return cta;
}

function getMirror() {
  const m = getState().momentum;
  let mirror = MIRROR[0];
  for (const mi of MIRROR) { if (m >= mi.min) mirror = mi; }
  return mirror;
}

// ==========================================
// SIGNAL TRACKING
// ==========================================
function trackPageVisit() {
  const page = getCurrentPage();
  const s = getState();
  if (!s.pages[page]) {
    s.pages[page] = { visits: 1, time: 0 };
    s.momentum = Math.min(100, s.momentum + SIGNAL_WEIGHTS.pageVisit);
  } else {
    s.pages[page].visits++;
    s.momentum = Math.min(100, s.momentum + SIGNAL_WEIGHTS.revisit);
  }
  saveState(s);
}

function trackTime() {
  setInterval(function() {
    const s = getState();
    const page = getCurrentPage();
    if (s.pages[page]) s.pages[page].time += 15;
    s.totalTime += 15;
    s.momentum = Math.min(100, s.momentum + SIGNAL_WEIGHTS.timeOnPage);
    saveState(s);
    updateUI();
  }, 15000); // cada 15 segundos
}

function trackScroll() {
  let scrollTracked = false;
  window.addEventListener('scroll', function() {
    if (scrollTracked) return;
    const scrollPct = (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight;
    if (scrollPct > 0.7) {
      scrollTracked = true;
      addMomentum(SIGNAL_WEIGHTS.scrollDepth);
    }
  });
}

function trackInteractions() {
  document.addEventListener('click', function(e) {
    const interactive = e.target.closest('.stat-card, .mg-eje, .ig-quiz__prompt, .infog-card, .ig-list li, .tab, .ig-item');
    if (interactive) {
      const s = getState();
      s.interactions++;
      s.momentum = Math.min(100, s.momentum + SIGNAL_WEIGHTS.interaction);
      saveState(s);
      updateUI();
    }
  });
}

// ==========================================
// LIKE SYSTEM (double-tap or long-press on paragraphs)
// ==========================================
function initLikes() {
  document.querySelectorAll('main p, main .card__text, main .est-barrier__text, main .prof-reality__card p, main .col-card__text').forEach(function(p) {
    if (p.textContent.trim().length < 30) return; // skip short paragraphs

    let tapCount = 0;
    let tapTimer = null;

    p.style.cursor = 'default';
    p.style.transition = 'background 0.3s';
    p.style.borderRadius = '4px';

    p.addEventListener('click', function() {
      tapCount++;
      if (tapCount === 1) {
        tapTimer = setTimeout(function() { tapCount = 0; }, 400);
      } else if (tapCount === 2) {
        clearTimeout(tapTimer);
        tapCount = 0;
        toggleLike(p);
      }
    });
  });
}

function toggleLike(el) {
  if (el.dataset.liked === 'true') {
    el.dataset.liked = 'false';
    el.style.background = '';
    el.style.padding = '';
  } else {
    el.dataset.liked = 'true';
    el.style.background = 'rgba(245,166,35,0.08)';
    el.style.padding = '4px 8px';
    addMomentum(SIGNAL_WEIGHTS.like);
    // Brief flash
    el.style.background = 'rgba(245,166,35,0.2)';
    setTimeout(function() { el.style.background = 'rgba(245,166,35,0.08)'; }, 300);
  }
}

// ==========================================
// UI — Turbina flotante
// ==========================================
function buildTurbine() {
  const s = getState();
  const level = getLevel();
  const m = s.momentum;

  // Botón flotante
  const btn = document.createElement('button');
  btn.className = 'tb-btn';
  btn.id = 'tb-btn';
  btn.onclick = toggleTurbinePanel;

  // Panel
  const panel = document.createElement('div');
  panel.className = 'tb-panel';
  panel.id = 'tb-panel';

  document.body.appendChild(btn);
  document.body.appendChild(panel);

  updateUI();
}

function updateUI() {
  const s = getState();
  const m = s.momentum;
  const level = getLevel();
  const cta = getCTA();
  const mirror = getMirror();
  const pageCount = Object.keys(s.pages).length;

  // Button
  const btn = document.getElementById('tb-btn');
  if (!btn) return;

  // Pulse animation intensity based on momentum
  const pulseIntensity = m > 75 ? 'tb-btn--pulse-strong' : m > 40 ? 'tb-btn--pulse' : '';
  btn.className = `tb-btn ${pulseIntensity}`;

  // Ring arc
  const circumference = 2 * Math.PI * 22;
  const dashArray = (m / 100) * circumference;

  btn.innerHTML = `
    <svg viewBox="0 0 52 52" class="tb-btn__ring">
      <circle cx="26" cy="26" r="22" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="3"/>
      <circle cx="26" cy="26" r="22" fill="none" stroke="${level.color}" stroke-width="3"
        stroke-dasharray="${dashArray} ${circumference}" stroke-linecap="round" transform="rotate(-90 26 26)"
        style="transition:stroke-dasharray 1s ease,stroke 0.5s"/>
    </svg>
    <span class="tb-btn__pct">${m}%</span>
  `;

  // Panel content
  const panel = document.getElementById('tb-panel');
  if (!panel) return;

  let ctaHTML = '';
  if (cta.href) {
    ctaHTML = `<a href="${cta.href}" class="tb-cta">${cta.text}</a>`;
  } else if (cta.action === 'share') {
    ctaHTML = `<button onclick="shareTurbine()" class="tb-cta">${cta.text}</button>`;
  } else {
    ctaHTML = `<div class="tb-cta tb-cta--muted">${cta.text}</div>`;
  }

  panel.innerHTML = `
    <div class="tb-panel__header">
      <button class="tb-panel__close" onclick="toggleTurbinePanel()">×</button>
    </div>
    <div class="tb-panel__level" style="color:${level.color}">${level.label}</div>
    <div class="tb-panel__verb">${level.verb}</div>
    <div class="tb-panel__meter">
      <div class="tb-panel__meter-fill" style="width:${m}%;background:${level.color}"></div>
    </div>
    <div class="tb-panel__stats">
      <div class="tb-stat"><span class="tb-stat__val">${pageCount}</span><span class="tb-stat__label">páginas</span></div>
      <div class="tb-stat"><span class="tb-stat__val">${Math.round(s.totalTime/60)}m</span><span class="tb-stat__label">explorando</span></div>
      <div class="tb-stat"><span class="tb-stat__val">${s.interactions}</span><span class="tb-stat__label">interacciones</span></div>
    </div>
    ${mirror.text ? `<div class="tb-mirror">${mirror.text}</div>` : ''}
    ${ctaHTML}
    <div class="tb-tip">Doble click en cualquier párrafo = destacar</div>
  `;
}

function toggleTurbinePanel() {
  document.getElementById('tb-panel').classList.toggle('tb-panel--open');
}

function shareTurbine() {
  const url = encodeURIComponent(window.location.origin + window.location.pathname);
  const text = encodeURIComponent('Descubrí algo sobre educación que necesitas ver. Haz el autodiagnóstico de habilidades del siglo XXI.');
  window.open('https://wa.me/?text=' + text + '%20' + url, '_blank');
}

function getCurrentPage() {
  return window.location.pathname.split('/').pop() || 'index.html';
}

// ==========================================
// INIT
// ==========================================
(function() {
  function run() {
    trackPageVisit();
    buildTurbine();
    trackTime();
    trackScroll();
    trackInteractions();
    initLikes();
  }

  if (document.querySelector('main')) {
    setTimeout(run, 200);
  } else {
    document.addEventListener('DOMContentLoaded', function() {
      setTimeout(run, 600);
    });
  }
})();
