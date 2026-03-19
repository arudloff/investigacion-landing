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
// MARCADO ORGÁNICO — sin checkbox, click directo, borde izquierdo
// ==========================================
var hintShown = false;

function initReactions() {
  var s = getS();

  // Cards completas
  document.querySelectorAll('main .card, main .est-barrier, main .prof-reality__card, main .col-card, main .prof-challenge, main .prof-build-item, main .est-build-item, main .col-build, main .prof-together__col, main .col-col').forEach(function(el) {
    if (el.closest('.nb-panel, .nb-cta-banner, footer, nav')) return;
    if (el.textContent.trim().length < 20) return;
    setupMarkable(el, s);
  });

  // Párrafos sueltos
  document.querySelectorAll('main p, main h2, main h3, main li').forEach(function(el) {
    if (el.textContent.trim().length < 30) return;
    if (el.closest('.nb-panel, .nb-cta-banner, footer, nav, .navbar, .mobile-nav, .footer, .card, .est-barrier, .prof-reality__card, .col-card, .prof-challenge, .prof-build-item, .est-build-item, .col-build, .prof-together__col, .col-col, .mg-eje, .mg-marco, .tabs, .tab')) return;
    if (el.querySelector('button, .btn, .tab, a.btn')) return;
    setupMarkable(el, s);
  });

  // Mostrar hint una sola vez
  if (!sessionStorage.getItem('cch_mark_hint') && getReactionCount() === 0) {
    setTimeout(showHint, 3000);
  }
}

function setupMarkable(el, s) {
  var key = getParaKey(el);
  el.classList.add('markable');
  el.dataset.markKey = key;

  if (s.reactions[key]) {
    el.classList.add('markable--on');
  }

  el.addEventListener('click', function(evt) {
    // No marcar si el click fue en un link o botón dentro del elemento
    if (evt.target.closest('a, button, .btn')) return;
    toggleMark(el);
  });
}

function toggleMark(el) {
  var key = el.dataset.markKey;
  var s = getS();

  if (s.reactions[key]) {
    // DESMARCAR
    delete s.reactions[key];
    saveS(s);
    el.classList.remove('markable--on');
  } else {
    // MARCAR
    s.reactions[key] = {
      page: currentPage(),
      text: el.textContent.trim().substring(0, 120).trim(),
      time: Date.now()
    };
    saveS(s);
    el.classList.add('markable--on');

    // Dismiss hint if showing
    var hint = document.querySelector('.mark-hint');
    if (hint) hint.remove();

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

function showHint() {
  if (sessionStorage.getItem('cch_mark_hint')) return;
  sessionStorage.setItem('cch_mark_hint', '1');

  var hint = document.createElement('div');
  hint.className = 'mark-hint';
  hint.innerHTML = '<strong>Toca cualquier texto</strong> que te resuene para guardarlo en tu cuaderno personal.';
  document.body.appendChild(hint);

  // Auto-dismiss after 6 seconds
  setTimeout(function() { if (hint.parentNode) { hint.style.opacity = '0'; hint.style.transition = 'opacity 0.5s'; setTimeout(function() { if (hint.parentNode) hint.remove(); }, 500); } }, 6000);
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

  // Botón con instrucción
  var btn = document.getElementById('nb-btn');
  if (!btn) return;
  btn.innerHTML = count > 0
    ? '<span class="nb-btn__icon">📖</span><span class="nb-btn__label">Mi cuaderno</span><span class="nb-btn__count">' + count + '</span>'
    : '<span class="nb-btn__icon">📖</span><span class="nb-btn__label">Toca textos para guardar ideas</span>';

  // Panel
  var panel = document.getElementById('nb-panel');
  if (!panel) return;

  if (count === 0) {
    panel.innerHTML =
      '<div class="nb-panel__scroll">' +
      '<div class="nb-panel__header"><span class="nb-panel__title">Tu cuaderno</span><button class="nb-panel__close" onclick="toggleNotebook()">×</button></div>' +
      '<div class="nb-empty"><p>Toca cualquier texto que te resuene. Se guarda aquí para que puedas compartirlo después.</p></div>' +
      '</div>';
    return;
  }

  // Agrupar por página
  var byPage = {};
  keys.forEach(function(k) {
    var r = reactions[k];
    if (!byPage[r.page]) byPage[r.page] = [];
    byPage[r.page].push(r);
  });

  var html = '<div class="nb-panel__scroll">' +
    '<div class="nb-panel__header"><span class="nb-panel__title">Tu cuaderno</span><button class="nb-panel__close" onclick="toggleNotebook()">×</button></div>' +
    '<div class="nb-panel__sub">' + count + ' idea' + (count > 1 ? 's' : '') + ' que te resonaron</div>';

  Object.keys(byPage).forEach(function(page) {
    var pageName = PAGE_NAMES[page] || page;
    html += '<div class="nb-group">' + pageName + '</div>';
    byPage[page].forEach(function(r, idx) {
      // Encontrar la key real de esta reacción
      var rKey = keys.find(function(k) { return reactions[k] === r; });
      var isActive = r.active !== false;
      html += '<div class="nb-item' + (isActive ? '' : ' nb-item--dimmed') + '">' +
        '<button class="nb-item__toggle' + (isActive ? '' : ' nb-item__toggle--off') + '" onclick="toggleItemActive(\'' + encodeURIComponent(rKey) + '\')">' + (isActive ? '✓' : '') + '</button>' +
        '<span class="nb-item__text">' + r.text + '</span>' +
        '</div>';
    });
  });

  // Área donde aparece el mensaje generado
  html += '<div id="nb-message"></div>';

  // Cerrar zona scrollable
  html += '</div>';

  // Footer fijo con botones siempre visibles
  html += '<div class="nb-panel__footer">' +
    '<div class="nb-actions" style="margin:0">' +
    '<button onclick="generateMessage()" class="nb-action-btn nb-gen-btn">✨ Generar mensaje</button>' +
    '</div>' +
    '<div class="nb-actions" style="display:none;margin:.5rem 0 0" id="nb-copy-area">' +
    '<button onclick="copyMessage()" class="nb-action-btn nb-copy-btn">📋 Copiar mensaje</button>' +
    '</div>' +
    '<div style="text-align:center;margin-top:.4rem">' +
    '<button onclick="clearNotebook()" class="nb-clear">Borrar cuaderno</button>' +
    '</div>' +
    '</div>';

  panel.innerHTML = html;
}

function toggleNotebook() {
  document.getElementById('nb-panel').classList.toggle('nb-panel--open');
}

function toggleItemActive(encodedKey) {
  var key = decodeURIComponent(encodedKey);
  var s = getS();
  if (!s.reactions[key]) return;

  // Toggle active state
  s.reactions[key].active = s.reactions[key].active === false ? true : false;
  saveS(s);
  updateNotebook();

  // Actualizar visual en la página
  document.querySelectorAll('.markable').forEach(function(el) {
    if (el.dataset.markKey === key) {
      if (s.reactions[key].active === false) {
        el.classList.remove('markable--on');
      } else {
        el.classList.add('markable--on');
      }
    }
  });
}

function generateMessage() {
  var s = getS();
  var keys = Object.keys(s.reactions);
  if (!keys.length) return;

  var paragraphs = keys
    .filter(function(k) { return s.reactions[k].active !== false; })
    .map(function(k) {
      var r = s.reactions[k];
      return { text: r.text, page: PAGE_NAMES[r.page] || r.page };
    });
  if (!paragraphs.length) return;

  var genBtn = document.querySelector('.nb-gen-btn');
  var copyArea = document.getElementById('nb-copy-area');
  var msgArea = document.getElementById('nb-message');
  if (genBtn) { genBtn.textContent = '✨ Generando...'; genBtn.disabled = true; }

  fetch('https://cupykpcsxjihnzwyflbm.supabase.co/functions/v1/synthesize-notebook', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ paragraphs: paragraphs })
  })
  .then(function(res) { return res.json(); })
  .then(function(data) {
    if (data.message) {
      // Mostrar como textarea editable — sin encabezado, solo el texto
      if (msgArea) {
        msgArea.innerHTML =
          '<textarea class="nb-textarea" id="nb-textarea" rows="8">' + data.message + '</textarea>';
      }
      if (copyArea) copyArea.style.display = 'flex';
      if (genBtn) { genBtn.style.display = 'none'; }
    }
  })
  .catch(function() {
    if (msgArea) {
      msgArea.innerHTML = '<p style="color:rgba(255,255,255,0.4);font-size:.82rem;text-align:center">No se pudo generar. Intenta de nuevo.</p>';
    }
  })
  .finally(function() {
    if (genBtn) { genBtn.disabled = false; genBtn.textContent = '✨ Generar mensaje'; }
  });
}

function copyMessage() {
  var textarea = document.getElementById('nb-textarea');
  if (!textarea) return;
  var text = textarea.value;
  navigator.clipboard.writeText(text).then(function() {
    var btn = document.querySelector('.nb-copy-btn');
    if (btn) { btn.textContent = '✓ Copiado'; setTimeout(function() { btn.textContent = '📋 Copiar mensaje'; }, 2500); }
  });
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
    '<button onclick="toggleNotebook()" class="nb-cta-banner__btn">📖 Abrir mi cuaderno</button>' +
    '<a href="visita.html" class="nb-cta-banner__btn" style="background:rgba(255,255,255,0.08);color:rgba(255,255,255,0.7);border:1px solid rgba(255,255,255,0.15)">Conversar con el colegio</a>' +
    '</div></div>';

  // Insertar antes de la última sección
  var sections = document.querySelectorAll('main > section, section');
  if (sections.length > 1) {
    sections[sections.length - 1].parentNode.insertBefore(banner, sections[sections.length - 1]);
  }
}

// ==========================================
// WELCOME MODAL — primera visita al sitio
// ==========================================
function showWelcome() {
  if (localStorage.getItem('cch_welcome_seen')) return;

  // Solo en la página de inicio
  if (currentPage() !== 'index.html') return;

  localStorage.setItem('cch_welcome_seen', '1');

  var overlay = document.createElement('div');
  overlay.className = 'welcome-overlay';
  overlay.innerHTML =
    '<div class="welcome-modal">' +
      '<div class="welcome-modal__header">Bienvenido a una experiencia diferente</div>' +
      '<p class="welcome-modal__text">Este sitio no solo informa — te invita a pensar, descubrir y actuar.</p>' +
      '<div class="welcome-modal__features">' +
        '<div class="welcome-modal__feat">' +
          '<span class="welcome-modal__feat-icon">📖</span>' +
          '<div><strong>Tu cuaderno personal</strong><br>Toca cualquier texto que te resuene. Se guarda en tu cuaderno para que puedas compartirlo después.</div>' +
        '</div>' +
        '<div class="welcome-modal__feat">' +
          '<span class="welcome-modal__feat-icon">🔄</span>' +
          '<div><strong>Contenido que cambia</strong><br>Las frases e ideas rotan con cada visita. Siempre hay algo nuevo por descubrir.</div>' +
        '</div>' +
        '<div class="welcome-modal__feat">' +
          '<span class="welcome-modal__feat-icon">🧭</span>' +
          '<div><strong>Espacios interactivos</strong><br>Autodiagnóstico, marcos de referencia, datos explorables — cada sección invita a participar.</div>' +
        '</div>' +
        '<div class="welcome-modal__feat">' +
          '<span class="welcome-modal__feat-icon">🦋</span>' +
          '<div><strong>Desafía a tu red</strong><br>Envía las ideas que te marcaron a tus contactos. Genera conversaciones. Sé un provocador de pensamiento.</div>' +
        '</div>' +
      '</div>' +
      '<button class="welcome-modal__btn" onclick="dismissWelcome()">Empezar a explorar →</button>' +
      '<p class="welcome-modal__note">Anónimo · Sin registro · Todo vive en tu navegador</p>' +
    '</div>';

  document.body.appendChild(overlay);
}

function dismissWelcome() {
  var overlay = document.querySelector('.welcome-overlay');
  if (overlay) {
    overlay.style.opacity = '0';
    setTimeout(function() { overlay.remove(); }, 400);
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

    // Welcome modal en primera visita
    setTimeout(showWelcome, 1500);
  }

  if (document.querySelector('main')) {
    setTimeout(run, 300);
  } else {
    document.addEventListener('DOMContentLoaded', function() { setTimeout(run, 700); });
  }
})();
