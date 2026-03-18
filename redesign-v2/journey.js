// journey.js v4 — Cuaderno Personal
// Sin puntos. Sin niveles. Sin gamificación.
// El visitante reacciona a lo que le resuena.
// El sitio le devuelve un espejo de sus propias elecciones.
// El CTA emerge naturalmente de la reflexión acumulada.

// ==========================================
// REACCIONES DISPONIBLES
// ==========================================
const REACTIONS = [
  { emoji: '💡', label: 'Me inspira' },
  { emoji: '🔥', label: 'Me moviliza' },
  { emoji: '🤔', label: 'Me hace pensar' },
  { emoji: '✊', label: 'Me compromete' },
];

// ==========================================
// STATE (localStorage)
// ==========================================
const STORE = 'cch_cuaderno';

function getS() {
  try { return JSON.parse(localStorage.getItem(STORE)) || { reactions: {} }; }
  catch(e) { return { reactions: {} }; }
}
function saveS(s) { localStorage.setItem(STORE, JSON.stringify(s)); }

function getParaKey(el) {
  return currentPage() + '::' + el.textContent.trim().substring(0, 80);
}

function currentPage() {
  return window.location.pathname.split('/').pop() || 'index.html';
}

function getReactionCount() {
  var s = getS();
  return Object.keys(s.reactions).length;
}

// Nombres legibles de páginas
const PAGE_NAMES = {
  'index.html': 'Inicio',
  'contexto-global.html': 'Contexto',
  'modelo-educativo.html': 'Modelo educativo',
  'para-familias.html': 'Familias',
  'estudiantes.html': 'Estudiantes',
  'profesores.html': 'Profesores',
  'industria.html': 'Industria',
  'colegios.html': 'Colegios',
  'universidades.html': 'Universidades',
  'cepah.html': 'CEPAH',
  'autodiagnostico.html': 'Autodiagnóstico',
  'nosotros.html': 'Quiénes somos',
  'equipo.html': 'Equipo',
  'visita.html': 'Visita guiada',
  'gobiernos.html': 'Gobiernos',
  'por-que-importa.html': 'Por qué importa',
};

// ==========================================
// MARCADO DE PÁRRAFOS — un click, sin picker
// ==========================================
function initReactions() {
  // Selector amplio: todos los párrafos, textos de cards, frases de manifiesto
  var all = document.querySelectorAll('main *');
  var s = getS();

  all.forEach(function(el) {
    // Solo elementos de texto con contenido suficiente
    var tag = el.tagName;
    if (tag !== 'P' && tag !== 'LI' && !el.classList.contains('card__text') &&
        !el.classList.contains('card__title') && tag !== 'H2' && tag !== 'H3') return;
    if (el.textContent.trim().length < 30) return;
    // Excluir elementos del sistema
    if (el.closest('.nb-panel, .nb-cta-banner, footer, nav, .navbar, .mobile-nav, .footer, script, style, .rx-trigger')) return;
    // Excluir si tiene hijos interactivos (botones, links como contenido principal)
    if (el.querySelector('button, .btn, .tab')) return;

    var key = getParaKey(el);

    // Si ya marcado, restaurar estilo
    if (s.reactions[key]) {
      applyMark(el);
      return;
    }

    // Agregar botón "+" al costado
    el.style.position = 'relative';
    var trigger = document.createElement('button');
    trigger.className = 'rx-trigger';
    trigger.textContent = '+';
    trigger.setAttribute('aria-label', 'Destacar esta idea');
    trigger.addEventListener('click', function(evt) {
      evt.stopPropagation();
      markParagraph(el);
    });
    el.appendChild(trigger);
  });
}

function markParagraph(el) {
  // Quitar trigger
  var trigger = el.querySelector('.rx-trigger');
  if (trigger) trigger.remove();

  // Aplicar estilo visual
  applyMark(el);

  // Guardar
  var key = getParaKey(el);
  var s = getS();
  s.reactions[key] = {
    page: currentPage(),
    text: el.textContent.trim().substring(0, 120),
    time: Date.now()
  };
  saveS(s);

  // Actualizar cuaderno y verificar CTA
  updateNotebook();
  checkCTA();

  // Flash en el botón del cuaderno
  var nbBtn = document.getElementById('nb-btn');
  if (nbBtn) {
    nbBtn.style.transform = 'scale(1.15)';
    nbBtn.style.borderColor = 'var(--color-amber)';
    setTimeout(function() { nbBtn.style.transform = ''; nbBtn.style.borderColor = ''; }, 400);
  }
}

function applyMark(el) {
  el.style.transition = 'background 0.3s, padding 0.3s';
  el.style.background = 'rgba(245,166,35,0.07)';
  el.style.padding = '8px 12px';
  el.style.borderRadius = '6px';
  el.style.borderLeft = '3px solid rgba(245,166,35,0.3)';
  el.style.position = 'relative';

  // Badge ✓
  var oldBadge = el.querySelector('.rx-badge');
  if (oldBadge) oldBadge.remove();
  var badge = document.createElement('span');
  badge.className = 'rx-badge';
  badge.textContent = '✓';
  el.appendChild(badge);
}

// ==========================================
// CUADERNO PERSONAL (notebook)
// ==========================================
function buildNotebook() {
  // Botón flotante — icono de cuaderno, no puntaje
  var btn = document.createElement('button');
  btn.className = 'nb-btn';
  btn.id = 'nb-btn';
  btn.onclick = toggleNotebook;

  // Panel
  var panel = document.createElement('div');
  panel.className = 'nb-panel';
  panel.id = 'nb-panel';

  document.body.appendChild(btn);
  document.body.appendChild(panel);

  updateNotebook();
}

function updateNotebook() {
  var s = getS();
  var reactions = s.reactions;
  var keys = Object.keys(reactions);
  var count = keys.length;

  // Botón
  var btn = document.getElementById('nb-btn');
  if (!btn) return;
  btn.innerHTML = count > 0
    ? '<span class="nb-btn__icon">📖</span><span class="nb-btn__count">' + count + '</span>'
    : '<span class="nb-btn__icon">📖</span>';

  // Panel
  var panel = document.getElementById('nb-panel');
  if (!panel) return;

  if (count === 0) {
    panel.innerHTML =
      '<div class="nb-panel__header"><span class="nb-panel__title">Tu cuaderno</span><button class="nb-panel__close" onclick="toggleNotebook()">×</button></div>' +
      '<div class="nb-empty"><p>Mientras exploras el sitio, puedes marcar los párrafos que te resuenen tocando el <strong>+</strong> que aparece a su costado.</p><p>Aquí verás todo lo que elegiste destacar — como un cuaderno personal de ideas.</p></div>';
    return;
  }

  // Agrupar por página
  var byPage = {};
  keys.forEach(function(k) {
    var r = reactions[k];
    if (!byPage[r.page]) byPage[r.page] = [];
    byPage[r.page].push(r);
  });

  var html =
    '<div class="nb-panel__header"><span class="nb-panel__title">Tu cuaderno</span><button class="nb-panel__close" onclick="toggleNotebook()">×</button></div>' +
    '<div class="nb-panel__sub">' + count + ' idea' + (count > 1 ? 's' : '') + ' que te resonaron</div>';

  Object.keys(byPage).forEach(function(page) {
    var pageName = PAGE_NAMES[page] || page;
    html += '<div class="nb-group">' + pageName + '</div>';
    byPage[page].forEach(function(r) {
      html += '<div class="nb-item"><span class="nb-item__check">✓</span><span class="nb-item__text">' + r.text + '</span></div>';
    });
  });

  // Acciones: copiar + compartir + borrar
  html += '<div class="nb-actions">' +
    '<button onclick="copyNotebook()" class="nb-action-btn">📋 Copiar todo</button>' +
    '<button onclick="shareNotebook()" class="nb-action-btn">📤 Compartir</button>' +
    '</div>' +
    '<div class="nb-actions" style="margin-top:.5rem">' +
    '<button onclick="clearNotebook()" class="nb-clear">Borrar cuaderno</button>' +
    '</div>';

  panel.innerHTML = html;
}

function toggleNotebook() {
  document.getElementById('nb-panel').classList.toggle('nb-panel--open');
}

function copyNotebook() {
  var s = getS();
  var keys = Object.keys(s.reactions);
  if (!keys.length) return;

  // Agrupar por página
  var byPage = {};
  keys.forEach(function(k) {
    var r = s.reactions[k];
    var pageName = PAGE_NAMES[r.page] || r.page;
    if (!byPage[pageName]) byPage[pageName] = [];
    byPage[pageName].push(r.text);
  });

  var text = '📖 Mi cuaderno de ideas — Colegio Camilo Henríquez\n\n';
  Object.keys(byPage).forEach(function(page) {
    text += '— ' + page + ' —\n';
    byPage[page].forEach(function(t) { text += '✓ ' + t + '\n'; });
    text += '\n';
  });
  text += 'Explora más: ' + window.location.origin + window.location.pathname;

  navigator.clipboard.writeText(text).then(function() {
    var btn = document.querySelector('.nb-action-btn');
    if (btn) { btn.textContent = '✓ Copiado'; setTimeout(function() { btn.textContent = '📋 Copiar todo'; }, 2000); }
  });
}

function shareNotebook() {
  var s = getS();
  var count = Object.keys(s.reactions).length;
  var url = encodeURIComponent(window.location.origin + '/redesign-v2/index.html');
  var text = encodeURIComponent('Marqué ' + count + ' ideas que me resonaron sobre educación del siglo XXI. ¿Cuáles te resuenan a ti?');
  window.open('https://wa.me/?text=' + text + '%20' + url, '_blank');
}

function clearNotebook() {
  if (confirm('¿Borrar todas tus notas? Esta acción no se puede deshacer.')) {
    localStorage.removeItem(STORE);
    location.reload();
  }
}

// ==========================================
// CTA EMERGENTE — aparece cuando hay 3+ reacciones
// ==========================================
function checkCTA() {
  var count = getReactionCount();
  if (count < 3) return;
  if (document.querySelector('.nb-cta-banner')) return; // ya existe

  var banner = document.createElement('div');
  banner.className = 'nb-cta-banner anim';

  var messages = [
    'Has marcado varias ideas que te resonaron. ¿Quieres conversar sobre cómo llevarlas a la práctica?',
    'Tu cuaderno muestra que esto te importa. El siguiente paso es una conversación.',
    'Las ideas que destacaste tienen algo en común: todas apuntan al futuro. ¿Quieres ser parte?',
  ];
  var msg = messages[Math.floor(Math.random() * messages.length)];

  banner.innerHTML =
    '<div class="container" style="max-width:600px;text-align:center">' +
    '<p class="nb-cta-banner__text">' + msg + '</p>' +
    '<a href="visita.html" class="nb-cta-banner__btn">Conversemos →</a>' +
    '</div>';

  // Insertar antes de la última sección
  var sections = document.querySelectorAll('main > section, section');
  if (sections.length > 1) {
    sections[sections.length - 1].parentNode.insertBefore(banner, sections[sections.length - 1]);
  }
}

// ==========================================
// INIT
// ==========================================
(function() {
  function run() {
    buildNotebook();
    initReactions();

    // Si ya tiene 3+ reacciones, mostrar CTA
    if (getReactionCount() >= 3) {
      setTimeout(checkCTA, 1000);
    }
  }

  if (document.querySelector('main')) {
    setTimeout(run, 300);
  } else {
    document.addEventListener('DOMContentLoaded', function() { setTimeout(run, 700); });
  }
})();
