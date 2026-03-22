(function() {

  var LAYERS = [
    { id: 'colegio', icon: '🏫', label: 'Colegio', short: 'Colegio', sub: 'Familias · Gestión · Info', href: 'colegio.html', color: 'rgba(24,95,165,0.2)' },
    { id: 'umbral-ia', icon: '⚡', label: 'Umbral IA', short: 'Umbral', sub: 'El cambio está aquí. La respuesta, también.', href: 'umbral-ia.html', color: 'rgba(186,117,23,0.25)' },
    { id: 'recursos', icon: '🧭', label: 'Recursos', short: 'Recursos', sub: 'Diagnóstico · PDF · Dashboard', href: 'recursos.html', color: 'rgba(83,74,183,0.2)' },
    { id: 'red-id', icon: '🔬', label: 'Red de I+D', short: 'Red I+D', sub: 'CEPAH · Alianzas · Red', href: 'red-id.html', color: 'rgba(13,92,99,0.2)' }
  ];

  var ROLES = {
    familia: 'Familia',
    docente: 'Docente',
    estudiante: 'Estudiante',
    empresa: 'Empresa',
    establecimiento: 'Establecimiento'
  };

  var currentFile = window.location.pathname.split('/').pop().replace('.html', '') || 'index';

  // TOPBAR
  var topbar = document.createElement('div');
  topbar.id = 'v3-topbar';
  topbar.innerHTML =
    '<a class="v3-logo" href="index.html">CCH<em>Colegio Camilo Henríquez</em></a>' +
    '<div class="v3-top-spacer"></div>' +
    '<button class="v3-role-chip" id="v3-role-chip" onclick="v3OpenRoles()"><span id="v3-role-label">¿Quién eres?</span> ↓</button>' +
    '<a class="v3-visit-btn" href="colegio.html#visita">Agenda una visita</a>' +
    '';
  document.body.prepend(topbar);

  // SIDEBAR
  var sidebar = document.createElement('nav');
  sidebar.id = 'v3-sidebar';

  var itemsHTML = LAYERS.map(function(l) {
    var active = currentFile === l.id || currentFile === l.href.replace('.html', '');
    return '<a class="v3-si ' + (active ? 'v3-si--active' : '') + '" href="' + l.href + '" data-id="' + l.id + '" data-short="' + l.short + '">' +
      '<span class="v3-si-icon" style="background:' + l.color + '">' + l.icon + '</span>' +
      '<span><span class="v3-si-title">' + l.label + '</span><span class="v3-si-sub">' + l.sub + '</span></span>' +
      '</a>';
  }).join('');

  var nosotrosActive = currentFile === 'nosotros' ? 'v3-si--active' : '';

  sidebar.innerHTML =
    '<div class="v3-sb-label">Explorar</div>' +
    itemsHTML +
    '<div class="v3-sb-foundation">' +
      '<a class="v3-si-found ' + nosotrosActive + '" href="nosotros.html">' +
        '<span class="v3-found-icon">◎</span>' +
        '<span><span class="v3-found-title">Nosotros</span><span class="v3-found-sub">Origen · Visión · Equipo</span></span>' +
      '</a>' +
    '</div>';

  document.body.insertBefore(sidebar, topbar.nextSibling);

  // ROL
  function loadRole() {
    var saved = localStorage.getItem('v3-role');
    if (saved && ROLES[saved]) {
      document.getElementById('v3-role-label').textContent = ROLES[saved];
      document.getElementById('v3-role-chip').classList.add('set');
    }
  }

  window.v3OpenRoles = function() {
    var existing = document.getElementById('v3-role-modal');
    if (existing) { existing.remove(); return; }
    var modal = document.createElement('div');
    modal.id = 'v3-role-modal';
    var optsHTML = Object.keys(ROLES).map(function(k) {
      return '<button class="v3-role-opt" onclick="v3SetRole(\'' + k + '\',\'' + ROLES[k] + '\')">' + ROLES[k] + '</button>';
    }).join('');
    modal.innerHTML =
      '<div class="v3-role-modal-box">' +
        '<div class="v3-role-modal-title">¿Desde qué perspectiva navegas?</div>' +
        '<div class="v3-role-modal-sub">El contenido se adapta a tu perfil</div>' +
        '<div class="v3-role-options">' + optsHTML + '</div>' +
      '</div>';
    document.body.appendChild(modal);
    modal.addEventListener('click', function(e) { if (e.target === modal) modal.remove(); });
  };

  window.v3SetRole = function(key, label) {
    localStorage.setItem('v3-role', key);
    document.getElementById('v3-role-label').textContent = label;
    document.getElementById('v3-role-chip').classList.add('set');
    var m = document.getElementById('v3-role-modal');
    if (m) m.remove();
  };

  loadRole();

  // CUADERNO
  window.v3AddNote = function(text, layer) {
    var notes = JSON.parse(localStorage.getItem('v3-notes') || '[]');
    notes.push({ text: text, layer: layer, ts: Date.now() });
    localStorage.setItem('v3-notes', JSON.stringify(notes));
    v3UpdateNbCount();
  };

  function v3UpdateNbCount() {
    var notes = JSON.parse(localStorage.getItem('v3-notes') || '[]');
    var el = document.getElementById('v3-nb-count');
    if (!el) return;
    if (notes.length > 0) {
      el.textContent = notes.length;
      el.style.display = 'inline-flex';
    } else {
      el.style.display = 'none';
    }
  }

  window.v3ToggleNotebook = function() {
    var existing = document.getElementById('v3-notebook-panel');
    if (existing) { existing.remove(); return; }
    var notes = JSON.parse(localStorage.getItem('v3-notes') || '[]');
    var panel = document.createElement('div');
    panel.id = 'v3-notebook-panel';
    var itemsHTML = notes.length === 0
      ? '<div class="nb-empty">Guarda lo que te mueve.<br>Conviértelo en una conversación<br>con quienes te importan.</div>'
      : notes.map(function(n) {
          return '<div class="nb-item"><div class="nb-dot"></div><div class="nb-text">' + n.text + '<span class="nb-layer">' + (n.layer || '') + '</span></div></div>';
        }).join('');
    panel.innerHTML =
      '<div class="nb-header"><span style="font-size:16px">📋</span><div class="nb-title">Mi cuaderno</div><div class="nb-count-badge">' + notes.length + ' notas</div></div>' +
      '<div class="nb-items">' + itemsHTML + '</div>' +
      '<div class="nb-footer"><button class="nb-cta" onclick="window.location.href=\'recursos.html\'">Convertir en mensajes para compartir →</button></div>';
    document.body.appendChild(panel);
  };

  // NOTEBOOK FLOATING BUTTON (fixed, como en v2)
  var nbBtn = document.createElement('button');
  nbBtn.className = 'v3-notebook-btn';
  nbBtn.id = 'v3-nb-btn';
  nbBtn.onclick = window.v3ToggleNotebook;
  nbBtn.title = 'Mi cuaderno';
  nbBtn.innerHTML = '<span class="v3-nb-icon">📋</span><span class="v3-nb-count" id="v3-nb-count">0</span>';
  document.body.appendChild(nbBtn);

  v3UpdateNbCount();

  // Auto-wrap: si no hay #v3-content, envolver el body content
  if (!document.getElementById('v3-content')) {
    var main = document.createElement('main');
    main.id = 'v3-content';
    var children = [];
    for (var i = 0; i < document.body.childNodes.length; i++) {
      var node = document.body.childNodes[i];
      if (node !== topbar && node !== sidebar && node.id !== 'v3-topbar' && node.id !== 'v3-sidebar') {
        children.push(node);
      }
    }
    children.forEach(function(c) { main.appendChild(c); });
    document.body.appendChild(main);
  }

})();