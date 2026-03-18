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
// MARCADO — checkbox en cards y secciones, toggle para desmarcar
// ==========================================
function initReactions() {
  var s = getS();

  // Para CARDS: checkbox que toma el card completo
  document.querySelectorAll('main .card, main .contact-human, main .est-barrier, main .prof-reality__card, main .col-card, main .prof-challenge, main .prof-build-item, main .est-build-item, main .col-build, main .prof-together__col, main .col-col, main .ig-item, main .mg-skill, main .mg-career').forEach(function(card) {
    if (card.closest('.nb-panel, .nb-cta-banner, footer, nav')) return;
    if (card.textContent.trim().length < 20) return;
    setupMarkable(card, s);
  });

  // Para PÁRRAFOS sueltos (no dentro de cards ya procesadas)
  document.querySelectorAll('main p, main h2, main h3, main li').forEach(function(el) {
    if (el.textContent.trim().length < 30) return;
    if (el.closest('.nb-panel, .nb-cta-banner, footer, nav, .navbar, .mobile-nav, .footer, .card, .est-barrier, .prof-reality__card, .col-card, .prof-challenge, .prof-build-item, .est-build-item, .col-build, .prof-together__col, .col-col')) return;
    if (el.querySelector('button, .btn, .tab, a.btn')) return;
    setupMarkable(el, s);
  });
}

function setupMarkable(el, s) {
  var key = getParaKey(el);
  el.style.position = 'relative';
  el.dataset.markKey = key;

  if (s.reactions[key]) {
    applyMark(el, true);
  } else {
    applyMark(el, false);
  }

  // Click en el checkbox toggle
  var existing = el.querySelector('.rx-check');
  if (existing) return;

  var check = document.createElement('button');
  check.className = 'rx-check';
  check.innerHTML = s.reactions[key] ? '✓' : '';
  check.setAttribute('aria-label', 'Marcar idea');
  check.addEventListener('click', function(evt) {
    evt.stopPropagation();
    toggleMark(el);
  });
  el.appendChild(check);
}

function toggleMark(el) {
  var key = el.dataset.markKey;
  var s = getS();

  if (s.reactions[key]) {
    // DESMARCAR
    delete s.reactions[key];
    saveS(s);
    applyMark(el, false);
    var check = el.querySelector('.rx-check');
    if (check) check.innerHTML = '';
  } else {
    // MARCAR
    s.reactions[key] = {
      page: currentPage(),
      text: el.textContent.trim().replace(/[✓\+]/g, '').substring(0, 120).trim(),
      time: Date.now()
    };
    saveS(s);
    applyMark(el, true);
    var check = el.querySelector('.rx-check');
    if (check) check.innerHTML = '✓';

    // Flash en botón del cuaderno
    var nbBtn = document.getElementById('nb-btn');
    if (nbBtn) {
      nbBtn.style.transform = 'scale(1.15)';
      nbBtn.style.borderColor = 'var(--color-amber)';
      setTimeout(function() { nbBtn.style.transform = ''; nbBtn.style.borderColor = ''; }, 400);
    }
  }

  updateNotebook();
  checkCTA();
}

function applyMark(el, isMarked) {
  if (isMarked) {
    el.style.transition = 'background 0.3s';
    el.style.background = 'rgba(245,166,35,0.06)';
    el.style.borderLeft = '3px solid rgba(245,166,35,0.35)';
    el.style.borderRadius = '6px';
  } else {
    el.style.background = '';
    el.style.borderLeft = '';
    el.style.borderRadius = '';
  }
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
    '<button onclick="copyNotebook()" class="nb-action-btn">📋 Copiar ideas</button>' +
    '<button onclick="shareNotebook()" class="nb-action-btn">🦋 Enviar a alguien</button>' +
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
  var keys = Object.keys(s.reactions);
  if (!keys.length) return;

  // Tomar las 3 ideas más recientes para compartir
  var recent = keys.map(function(k) { return s.reactions[k]; })
    .sort(function(a, b) { return b.time - a.time; })
    .slice(0, 3);

  var ideas = recent.map(function(r) { return '• ' + r.text.substring(0, 80); }).join('\n');
  var url = window.location.origin + '/redesign-v2/index.html';
  var text = 'Encontré estas ideas sobre educación que me hicieron pensar:\n\n' + ideas + '\n\n¿Qué opinas tú?\n' + url;

  window.open('https://wa.me/?text=' + encodeURIComponent(text), '_blank');
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
    'Has marcado varias ideas. ¿Conoces a alguien que necesite leerlas?',
    'Las ideas que destacaste merecen salir de esta pantalla. ¿A quién se las enviarías?',
    'Tu cuaderno muestra que esto te importa. Una conversación con la persona correcta puede cambiar todo.',
  ];
  var msg = messages[Math.floor(Math.random() * messages.length)];

  banner.innerHTML =
    '<div class="container" style="max-width:600px;text-align:center">' +
    '<p class="nb-cta-banner__text">' + msg + '</p>' +
    '<div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap">' +
    '<button onclick="shareNotebook()" class="nb-cta-banner__btn">🦋 Enviar mis ideas a alguien</button>' +
    '<a href="visita.html" class="nb-cta-banner__btn" style="background:rgba(255,255,255,0.08);color:rgba(255,255,255,0.7);border:1px solid rgba(255,255,255,0.15)">Quiero conversar con el colegio</a>' +
    '</div></div>';

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
