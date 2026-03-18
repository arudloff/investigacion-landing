// journey.js v3 — Turbina de Convicción (puntos abiertos + reacciones)
// Sin tope. Cada señal suma puntos. Las reacciones en párrafos
// aportan al puntaje y revelan qué contenido conecta emocionalmente.

// ==========================================
// PUNTOS POR SEÑAL
// ==========================================
const PTS = {
  pageNew:      5,     // página nueva
  pageRevisit:  8,     // revisita (reflexión)
  time15s:      1,     // cada 15 segundos en una página
  scroll70:     3,     // scroll al 70%
  interact:     4,     // click en contenido interactivo
  reaction:    12,     // reaccionar a un párrafo
};

// Reacciones disponibles
const REACTIONS = [
  { emoji: '💡', label: 'Me inspira', pts: 12 },
  { emoji: '🔥', label: 'Me moviliza', pts: 15 },
  { emoji: '🤔', label: 'Me hace pensar', pts: 10 },
  { emoji: '✊', label: 'Me compromete', pts: 18 },
];

// Niveles (umbrales crecientes, sin tope)
const LEVELS = [
  { min: 0,    name: 'Curiosidad',    verb: 'Algo llamó tu atención' },
  { min: 15,   name: 'Exploración',   verb: 'Estás descubriendo algo importante' },
  { min: 40,   name: 'Reflexión',     verb: 'Esto te está haciendo pensar' },
  { min: 80,   name: 'Conexión',      verb: 'Algo resonó profundamente contigo' },
  { min: 140,  name: 'Convicción',    verb: 'Una idea se está formando en ti' },
  { min: 220,  name: 'Impulso',       verb: 'La urgencia de actuar crece' },
  { min: 350,  name: 'Despegue',      verb: 'Estás listo para transformar algo' },
  { min: 500,  name: 'Órbita',        verb: 'Ya eres parte de este movimiento' },
];

// CTAs que evolucionan
const CTAS = [
  { min: 0,   text: 'Sigue explorando', href: null },
  { min: 40,  text: 'Hay más por descubrir', href: null },
  { min: 80,  text: 'Haz el autodiagnóstico →', href: 'autodiagnostico.html' },
  { min: 140, text: '¿Quién necesita saber esto?', action: 'share' },
  { min: 220, text: 'Da el paso →', href: 'visita.html' },
  { min: 350, text: 'Únete al movimiento →', href: 'visita.html' },
];

// Frases espejo
const MIRRORS = [
  { min: 15,  text: 'Ya diste el primer paso. La mayoría nunca llega hasta aquí.' },
  { min: 40,  text: 'Estás invirtiendo tiempo en algo que importa. Eso dice mucho de ti.' },
  { min: 80,  text: 'Pocas personas reflexionan con esta profundidad sobre la educación.' },
  { min: 140, text: 'Algo cambió desde que empezaste a explorar. ¿Lo sientes?' },
  { min: 220, text: 'Ya tienes la información. Ya tienes la convicción. Solo falta la acción.' },
  { min: 350, text: 'No eres un visitante más. Eres alguien que decidió entender antes de actuar.' },
  { min: 500, text: 'Este sitio fue diseñado para personas como tú. Gracias por llegar hasta aquí.' },
];

// ==========================================
// STATE
// ==========================================
const STORE = 'cch_turbine3';

function getS() {
  try { return JSON.parse(localStorage.getItem(STORE)) || freshState(); }
  catch(e) { return freshState(); }
}
function freshState() {
  return { pts: 0, pages: {}, reactions: [], totalTime: 0, interactions: 0 };
}
function saveS(s) { localStorage.setItem(STORE, JSON.stringify(s)); }

function addPts(n) {
  var s = getS();
  s.pts += n;
  saveS(s);
  updateTurbine();
}

function getLevel(pts) {
  var lv = LEVELS[0];
  for (var i = 0; i < LEVELS.length; i++) { if (pts >= LEVELS[i].min) lv = LEVELS[i]; }
  return lv;
}
function getNextLevel(pts) {
  for (var i = 0; i < LEVELS.length; i++) { if (pts < LEVELS[i].min) return LEVELS[i]; }
  return null;
}
function getCTA(pts) {
  var c = CTAS[0];
  for (var i = 0; i < CTAS.length; i++) { if (pts >= CTAS[i].min) c = CTAS[i]; }
  return c;
}
function getMirror(pts) {
  var m = null;
  for (var i = 0; i < MIRRORS.length; i++) { if (pts >= MIRRORS[i].min) m = MIRRORS[i]; }
  return m;
}

// Color por nivel
function getLevelColor(pts) {
  if (pts >= 350) return '#F5A623';
  if (pts >= 220) return '#F5A623';
  if (pts >= 140) return 'rgba(245,166,35,0.8)';
  if (pts >= 80)  return 'rgba(31,107,59,0.8)';
  if (pts >= 40)  return 'rgba(74,35,90,0.8)';
  if (pts >= 15)  return 'rgba(46,109,164,0.8)';
  return 'rgba(255,255,255,0.3)';
}

// ==========================================
// SIGNAL TRACKING
// ==========================================
function trackPage() {
  var page = currentPage();
  var s = getS();
  if (!s.pages[page]) {
    s.pages[page] = { visits: 1, time: 0 };
    s.pts += PTS.pageNew;
  } else {
    s.pages[page].visits++;
    s.pts += PTS.pageRevisit;
  }
  saveS(s);
}

function trackTime() {
  setInterval(function() {
    var s = getS();
    var page = currentPage();
    if (s.pages[page]) s.pages[page].time += 15;
    s.totalTime += 15;
    s.pts += PTS.time15s;
    saveS(s);
    updateTurbine();
  }, 15000);
}

function trackScroll() {
  var done = false;
  window.addEventListener('scroll', function() {
    if (done) return;
    if ((window.scrollY + window.innerHeight) / document.documentElement.scrollHeight > 0.7) {
      done = true;
      addPts(PTS.scroll70);
    }
  });
}

function trackInteractions() {
  document.addEventListener('click', function(e) {
    if (e.target.closest('.stat-card, .mg-eje, .ig-quiz__prompt, .infog-card, .ig-list li, .tab, .ig-item, .refresh-btn, .dyk-btn')) {
      var s = getS();
      s.interactions++;
      s.pts += PTS.interact;
      saveS(s);
      updateTurbine();
    }
  });
}

// ==========================================
// REACTION SYSTEM — botón visible + etiquetas + persistencia
// ==========================================
function getParaKey(el) {
  // ID única por párrafo: primeros 60 chars del texto
  return currentPage() + '::' + el.textContent.trim().substring(0, 60);
}

function initReactions() {
  var targets = document.querySelectorAll('main p, main .card__text, main .est-barrier__text, main .prof-reality__card p, main .col-card__text, main .est-agentic__text, main .est-agentic__phrase, main .prof-identity__phrase, main .prof-identity__text');

  var s = getS();
  var saved = s.paraReactions || {};

  targets.forEach(function(el) {
    if (el.textContent.trim().length < 40) return;
    if (el.closest('.tb-panel, footer, nav, .rx-picker')) return;

    var key = getParaKey(el);

    // Si ya tiene reacción guardada, restaurar el estilo
    if (saved[key]) {
      applyReactionStyle(el, saved[key]);
      return; // no agregar botón de nuevo
    }

    // Crear botón de reacción visible
    el.style.position = 'relative';
    var trigger = document.createElement('button');
    trigger.className = 'rx-trigger';
    trigger.innerHTML = '+';
    trigger.setAttribute('aria-label', 'Reaccionar a este párrafo');
    trigger.addEventListener('click', function(evt) {
      evt.stopPropagation();
      showReactionPicker(el, trigger);
    });
    el.appendChild(trigger);
  });
}

function showReactionPicker(el, trigger) {
  // Cerrar picker anterior
  var old = document.querySelector('.rx-picker');
  if (old) old.remove();

  var picker = document.createElement('div');
  picker.className = 'rx-picker';
  picker.innerHTML = REACTIONS.map(function(r) {
    return '<button class="rx-pick" onclick="doReaction(this,\'' + r.emoji + '\',\'' + r.label + '\',' + r.pts + ')">' +
      '<span class="rx-pick__emoji">' + r.emoji + '</span>' +
      '<span class="rx-pick__label">' + r.label + '</span>' +
      '</button>';
  }).join('');

  el.appendChild(picker);

  // Auto-cerrar en 5 segundos
  setTimeout(function() { if (picker.parentNode) picker.remove(); }, 5000);

  // Cerrar al click fuera
  setTimeout(function() {
    document.addEventListener('click', function closer(e) {
      if (!e.target.closest('.rx-picker') && !e.target.closest('.rx-trigger')) {
        if (picker.parentNode) picker.remove();
        document.removeEventListener('click', closer);
      }
    });
  }, 100);
}

function doReaction(btn, emoji, label, pts) {
  var el = btn.closest('.rx-picker').parentNode;
  var picker = btn.closest('.rx-picker');
  picker.remove();

  // Quitar el botón trigger
  var trigger = el.querySelector('.rx-trigger');
  if (trigger) trigger.remove();

  // Aplicar estilo visual
  applyReactionStyle(el, emoji);

  // Guardar en state
  var key = getParaKey(el);
  var s = getS();
  if (!s.paraReactions) s.paraReactions = {};
  s.paraReactions[key] = emoji;
  s.reactions.push({ emoji: emoji, label: label, page: currentPage(), time: Date.now() });
  s.pts += pts;
  saveS(s);
  updateTurbine();

  // Flash en el botón de la turbina
  var tbBtn = document.getElementById('tb-btn');
  if (tbBtn) {
    tbBtn.style.transform = 'scale(1.2)';
    setTimeout(function() { tbBtn.style.transform = ''; }, 300);
  }
}

function applyReactionStyle(el, emoji) {
  el.style.transition = 'background 0.3s, padding 0.3s';
  el.style.background = 'rgba(245,166,35,0.08)';
  el.style.padding = '8px 12px';
  el.style.borderRadius = '6px';
  el.style.borderLeft = '3px solid rgba(245,166,35,0.35)';
  el.style.position = 'relative';

  // Quitar badge anterior si existe
  var oldBadge = el.querySelector('.rx-badge');
  if (oldBadge) oldBadge.remove();

  // Agregar badge emoji
  var badge = document.createElement('span');
  badge.className = 'rx-badge';
  badge.textContent = emoji;
  el.appendChild(badge);
}

// ==========================================
// TURBINE UI
// ==========================================
function buildTurbine() {
  var btn = document.createElement('button');
  btn.className = 'tb-btn';
  btn.id = 'tb-btn';
  btn.onclick = togglePanel;

  var panel = document.createElement('div');
  panel.className = 'tb-panel';
  panel.id = 'tb-panel';

  document.body.appendChild(btn);
  document.body.appendChild(panel);
  updateTurbine();
}

function updateTurbine() {
  var s = getS();
  var pts = s.pts;
  var lv = getLevel(pts);
  var next = getNextLevel(pts);
  var cta = getCTA(pts);
  var mirror = getMirror(pts);
  var color = getLevelColor(pts);
  var pageCount = Object.keys(s.pages).length;

  // Progress toward next level (for the ring)
  var ringPct = 100;
  if (next) {
    var prevMin = lv.min;
    ringPct = Math.min(100, Math.round(((pts - prevMin) / (next.min - prevMin)) * 100));
  }
  var circumference = 2 * Math.PI * 22;
  var dashArray = (ringPct / 100) * circumference;

  // Pulse intensity
  var pulse = pts >= 220 ? 'tb-btn--pulse-strong' : pts >= 80 ? 'tb-btn--pulse' : '';

  // Button
  var btn = document.getElementById('tb-btn');
  if (!btn) return;
  btn.className = 'tb-btn ' + pulse;
  btn.innerHTML = '<svg viewBox="0 0 52 52" class="tb-btn__ring"><circle cx="26" cy="26" r="22" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="3"/><circle cx="26" cy="26" r="22" fill="none" stroke="' + color + '" stroke-width="3" stroke-dasharray="' + dashArray + ' ' + circumference + '" stroke-linecap="round" transform="rotate(-90 26 26)" style="transition:stroke-dasharray 1s ease,stroke 0.5s"/></svg><span class="tb-btn__pct">' + pts + '</span>';

  // Panel
  var panel = document.getElementById('tb-panel');
  if (!panel) return;

  var ctaHTML = '';
  if (cta.href) {
    ctaHTML = '<a href="' + cta.href + '" class="tb-cta">' + cta.text + '</a>';
  } else if (cta.action === 'share') {
    ctaHTML = '<button onclick="shareTB()" class="tb-cta">' + cta.text + '</button>';
  } else {
    ctaHTML = '<div class="tb-cta tb-cta--muted">' + cta.text + '</div>';
  }

  var nextHTML = next ? '<div class="tb-next">Siguiente nivel: <strong>' + next.name + '</strong> (' + next.min + ' pts)</div>' : '<div class="tb-next" style="color:var(--color-amber)">Has alcanzado el nivel máximo</div>';

  // Recent reactions
  var recentRx = s.reactions.slice(-5).reverse();
  var rxHTML = recentRx.length ? '<div class="tb-rx-title">Tus reacciones recientes</div><div class="tb-rx-list">' + recentRx.map(function(r) { return '<span class="tb-rx">' + r.emoji + '</span>'; }).join('') + '</div>' : '';

  panel.innerHTML =
    '<div class="tb-panel__header"><button class="tb-panel__close" onclick="togglePanel()">×</button></div>' +
    '<div class="tb-panel__pts" style="color:' + color + '">' + pts + ' <span>puntos</span></div>' +
    '<div class="tb-panel__level" style="color:' + color + '">' + lv.name + '</div>' +
    '<div class="tb-panel__verb">' + lv.verb + '</div>' +
    '<div class="tb-panel__meter"><div class="tb-panel__meter-fill" style="width:' + ringPct + '%;background:' + color + '"></div></div>' +
    nextHTML +
    '<div class="tb-panel__stats"><div class="tb-stat"><span class="tb-stat__val">' + pageCount + '</span><span class="tb-stat__label">páginas</span></div><div class="tb-stat"><span class="tb-stat__val">' + Math.round(s.totalTime / 60) + 'm</span><span class="tb-stat__label">explorando</span></div><div class="tb-stat"><span class="tb-stat__val">' + s.reactions.length + '</span><span class="tb-stat__label">reacciones</span></div></div>' +
    rxHTML +
    (mirror ? '<div class="tb-mirror">' + mirror.text + '</div>' : '') +
    ctaHTML +
    '<div class="tb-tip">Toca el + junto a un párrafo para reaccionar</div>';
}

function togglePanel() {
  document.getElementById('tb-panel').classList.toggle('tb-panel--open');
}

function shareTB() {
  var url = encodeURIComponent(window.location.href);
  var text = encodeURIComponent('Descubrí algo sobre educación que cambia la perspectiva. Llevo ' + getS().pts + ' puntos explorando.');
  window.open('https://wa.me/?text=' + text + '%20' + url, '_blank');
}

function currentPage() {
  return window.location.pathname.split('/').pop() || 'index.html';
}

// ==========================================
// INIT
// ==========================================
(function() {
  function run() {
    trackPage();
    buildTurbine();
    trackTime();
    trackScroll();
    trackInteractions();
    setTimeout(initReactions, 300);
  }
  if (document.querySelector('main')) {
    setTimeout(run, 200);
  } else {
    document.addEventListener('DOMContentLoaded', function() { setTimeout(run, 600); });
  }
})();
