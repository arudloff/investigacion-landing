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

  var PAGE_NAMES = {
    'index.html': 'Inicio',
    'umbral-ia.html': 'Umbral IA',
    'colegio.html': 'Colegio',
    'recursos.html': 'Recursos',
    'red-id.html': 'Red de I+D',
    'nosotros.html': 'Nosotros'
  };

  var currentFile = window.location.pathname.split('/').pop().replace('.html', '') || 'index';

  // Detect if we're in a subdirectory (e.g. /colegio/) and compute base path
  var pathParts = window.location.pathname.replace(/\/[^\/]*$/, '').split('/');
  var v3Idx = pathParts.indexOf('redesign-v3');
  var depth = v3Idx >= 0 ? pathParts.length - v3Idx - 1 : 0;
  var base = depth > 0 ? '../'.repeat(depth) : '';

  // ==========================================
  // TOPBAR
  // ==========================================
  var topbar = document.createElement('div');
  topbar.id = 'v3-topbar';
  topbar.innerHTML =
    '<a class="v3-logo" href="' + base + 'index.html">CCH<em>Colegio Camilo Henríquez</em></a>' +
    '<div class="v3-top-spacer"></div>' +
    '<button class="v3-role-chip" id="v3-role-chip" onclick="v3OpenRoles()"><span id="v3-role-label">¿Quién eres?</span> ↓</button>' +
    '<a class="v3-visit-btn" href="' + base + 'colegio/admision.html">Agenda una visita</a>' +
    '';
  document.body.prepend(topbar);

  // ==========================================
  // SIDEBAR
  // ==========================================
  var sidebar = document.createElement('nav');
  sidebar.id = 'v3-sidebar';

  var itemsHTML = LAYERS.map(function(l) {
    var pathStr = window.location.pathname;
    var active = currentFile === l.id || currentFile === l.href.replace('.html', '') || (currentFile.indexOf(l.id) === 0) || (pathStr.indexOf('/' + l.id + '/') !== -1);
    return '<a class="v3-si ' + (active ? 'v3-si--active' : '') + '" href="' + base + l.href + '" data-id="' + l.id + '" data-short="' + l.short + '">' +
      '<span class="v3-si-icon" style="background:' + l.color + '">' + l.icon + '</span>' +
      '<span><span class="v3-si-title">' + l.label + '</span><span class="v3-si-sub">' + l.sub + '</span></span>' +
      '</a>';
  }).join('');

  var nosotrosActive = (currentFile === 'nosotros' || pathStr.indexOf('/nosotros/') !== -1) ? 'v3-si--active' : '';

  sidebar.innerHTML =
    '<div class="v3-sb-label">Explorar</div>' +
    itemsHTML +
    '<div class="v3-sb-foundation">' +
      '<a class="v3-si-found ' + nosotrosActive + '" href="' + base + 'nosotros.html">' +
        '<span class="v3-found-icon">◎</span>' +
        '<span><span class="v3-found-title">Nosotros</span><span class="v3-found-sub">Origen · Visión · Equipo</span></span>' +
      '</a>' +
    '</div>';

  document.body.insertBefore(sidebar, topbar.nextSibling);

  // ==========================================
  // ROL
  // ==========================================
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

  // ==========================================
  // CUADERNO PERSONAL — sistema completo (portado de v2/journey.js)
  // ==========================================
  var STORE = 'v3_cuaderno';
  var generatedMessages = [];
  var activeMsg = 0;
  var hasGeneratedMsg = null;

  function getS() {
    try { return JSON.parse(localStorage.getItem(STORE)) || { reactions: {} }; }
    catch(e) { return { reactions: {} }; }
  }
  function saveS(s) { localStorage.setItem(STORE, JSON.stringify(s)); }

  function currentPage() {
    return window.location.pathname.split('/').pop() || 'index.html';
  }

  function getParaKey(el) {
    return currentPage() + '::' + el.textContent.trim().substring(0, 80);
  }

  function getReactionCount() {
    var s = getS();
    return Object.keys(s.reactions).length;
  }

  // ---- Marcado orgánico ----
  function initReactions() {
    var s = getS();

    // Cards v3 (dato, v3-card, etc.)
    document.querySelectorAll('#v3-content .dato, #v3-content .v3-card, #v3-content .eje-card, #v3-content .fuente').forEach(function(el) {
      if (el.closest('.v3-notebook-panel, .nb-panel, footer, nav, #v3-topbar, #v3-sidebar')) return;
      if (el.textContent.trim().length < 20) return;
      setupMarkable(el, s);
    });

    // Párrafos sueltos
    document.querySelectorAll('#v3-content p, #v3-content h2, #v3-content h3, #v3-content li').forEach(function(el) {
      if (el.textContent.trim().length < 30) return;
      if (el.closest('.v3-notebook-panel, .nb-panel, footer, nav, #v3-topbar, #v3-sidebar, .dato, .v3-card, .eje-card, .fuente')) return;
      if (el.querySelector('button, .v3-btn, a.v3-btn')) return;
      setupMarkable(el, s);
    });

    // Hint una sola vez
    if (!sessionStorage.getItem('v3_mark_hint') && getReactionCount() === 0) {
      setTimeout(showHint, 3000);
    }
  }

  function setupMarkable(el, s) {
    var key = getParaKey(el);
    el.classList.add('v3-markable');
    el.dataset.markKey = key;

    if (s.reactions[key]) {
      el.classList.add('v3-markable--on');
    }

    el.addEventListener('click', function(evt) {
      if (evt.target.closest('a, button, .v3-btn')) return;
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
      el.classList.remove('v3-markable--on');
    } else {
      // MARCAR
      s.reactions[key] = {
        page: currentPage(),
        text: el.textContent.trim().substring(0, 120).trim(),
        time: Date.now()
      };
      saveS(s);
      el.classList.add('v3-markable--on');

      // Dismiss hint
      var hint = document.querySelector('.v3-mark-hint');
      if (hint) hint.remove();

      // Flash en botón del cuaderno
      var nbBtn = document.getElementById('v3-nb-btn');
      if (nbBtn) {
        nbBtn.style.transform = 'scale(1.15)';
        nbBtn.style.borderColor = 'rgba(245,166,35,0.7)';
        setTimeout(function() { nbBtn.style.transform = ''; nbBtn.style.borderColor = ''; }, 400);
      }
    }

    if (hasGeneratedMsg) resetMessage(); else updateNotebook();
    updateNbBtnCount();
  }

  function showHint() {
    if (sessionStorage.getItem('v3_mark_hint')) return;
    sessionStorage.setItem('v3_mark_hint', '1');

    var hint = document.createElement('div');
    hint.className = 'v3-mark-hint';
    hint.innerHTML = '<strong>Toca cualquier texto</strong> que te resuene para guardarlo en tu cuaderno personal.';
    document.body.appendChild(hint);

    setTimeout(function() {
      if (hint.parentNode) {
        hint.style.opacity = '0';
        hint.style.transition = 'opacity 0.5s';
        setTimeout(function() { if (hint.parentNode) hint.remove(); }, 500);
      }
    }, 6000);
  }

  // ---- Botón flotante ----
  function buildNotebookBtn() {
    var btn = document.createElement('button');
    btn.className = 'v3-notebook-btn';
    btn.id = 'v3-nb-btn';
    btn.onclick = toggleNotebook;
    btn.title = 'Mi cuaderno';
    document.body.appendChild(btn);

    var panel = document.createElement('div');
    panel.className = 'v3-nb-panel';
    panel.id = 'v3-nb-panel';
    document.body.appendChild(panel);

    updateNbBtnCount();
    updateNotebook();
  }

  function updateNbBtnCount() {
    var count = getReactionCount();
    var btn = document.getElementById('v3-nb-btn');
    if (!btn) return;
    btn.innerHTML = count > 0
      ? '<span class="v3-nb-icon">📋</span><span class="v3-nb-label">Mis notas</span><span class="v3-nb-btn-count">' + count + '</span>'
      : '<span class="v3-nb-icon">📋</span><span class="v3-nb-label">Toca textos para guardar</span>';
  }

  // ---- Panel del cuaderno ----
  function updateNotebook() {
    var s = getS();
    var reactions = s.reactions;
    var keys = Object.keys(reactions);
    var count = keys.length;

    var panel = document.getElementById('v3-nb-panel');
    if (!panel) return;

    if (count === 0) {
      panel.innerHTML =
        '<div class="v3-nb-scroll">' +
        '<div class="v3-nb-header"><span class="v3-nb-title">MIS NOTAS DE LECTURA</span><button class="v3-nb-close" onclick="v3CloseNotebook()">×</button></div>' +
        '<div class="v3-nb-empty"><p>Selecciona lo que no puedes ignorar.<br>Juntos lo convertiremos en una conversación que no puede esperar.</p></div>' +
        '</div>';
      return;
    }

    // Agrupar por página
    var byPage = {};
    keys.forEach(function(k) {
      var r = reactions[k];
      if (!byPage[r.page]) byPage[r.page] = [];
      byPage[r.page].push({ key: k, data: r });
    });

    var itemsHTML = '';
    Object.keys(byPage).forEach(function(page) {
      var pageName = PAGE_NAMES[page] || page;
      itemsHTML += '<div class="v3-nb-group">' + pageName + '</div>';
      byPage[page].forEach(function(item) {
        var isActive = item.data.active !== false;
        itemsHTML += '<div class="v3-nb-item' + (isActive ? '' : ' v3-nb-item--dimmed') + '">' +
          '<button class="v3-nb-toggle' + (isActive ? '' : ' v3-nb-toggle--off') + '" onclick="v3ToggleItem(\'' + encodeURIComponent(item.key) + '\')">' + (isActive ? '✓' : '') + '</button>' +
          '<span class="v3-nb-item-text">' + item.data.text + '</span>' +
          '</div>';
      });
    });

    var html = '<div class="v3-nb-scroll">';

    if (generatedMessages.length > 0) {
      // MODO MENSAJE
      html += '<div class="v3-nb-header"><span class="v3-nb-title" style="font-size:.82rem;line-height:1.3"><span style="color:var(--amber);font-weight:800;display:block;margin-bottom:2px">EFECTO MARIPOSA</span>Comparte este mensaje con quienes te importan</span><button class="v3-nb-close" onclick="v3CloseNotebook()">×</button></div>';
      html += '<div id="v3-nb-message"><textarea class="v3-nb-textarea" id="v3-nb-textarea">' + generatedMessages[activeMsg] + '</textarea></div>';
      html += '<div class="v3-nb-msg-tabs">';
      for (var m = 0; m < generatedMessages.length; m++) {
        html += '<button class="v3-nb-msg-tab' + (m === activeMsg ? ' v3-nb-msg-tab--active' : '') + '" onclick="v3SwitchMsg(' + m + ')">' + (m + 1) + '</button>';
      }
      html += '</div>';
      html += '<details class="v3-nb-details"><summary class="v3-nb-details-sum">' + count + ' idea' + (count > 1 ? 's' : '') + ' seleccionadas</summary>' + itemsHTML + '</details>';
    } else {
      // MODO CUADERNO
      html += '<div class="v3-nb-header"><span class="v3-nb-title">MIS NOTAS DE LECTURA</span><button class="v3-nb-close" onclick="v3CloseNotebook()">×</button></div>';
      html += '<div class="v3-nb-sub">' + count + ' idea' + (count > 1 ? 's' : '') + ' que te resonaron</div>';
      html += itemsHTML;
      html += '<div id="v3-nb-message"></div>';
    }

    html += '</div>';

    // Footer fijo
    html += '<div class="v3-nb-footer">';
    if (generatedMessages.length > 0) {
      html += '<div class="v3-nb-actions"><button onclick="v3CopyMessage()" class="v3-nb-action-btn v3-nb-copy-big">Copia Este Mensaje</button></div>';
    } else {
      html += '<div class="v3-nb-actions"><button onclick="v3GenerateMessage()" class="v3-nb-action-btn v3-nb-gen-btn">✨ Generar mensaje</button></div>';
    }
    html += '<div style="text-align:center;margin-top:.4rem"><button onclick="v3ClearNotebook()" class="v3-nb-clear">Borrar cuaderno</button></div></div>';

    panel.innerHTML = html;

    // Auto-resize textarea
    var ta = document.getElementById('v3-nb-textarea');
    if (ta) {
      setTimeout(function() { ta.style.height = 'auto'; ta.style.height = ta.scrollHeight + 'px'; }, 50);
      ta.addEventListener('input', function() { this.style.height = 'auto'; this.style.height = this.scrollHeight + 'px'; });
    }
  }

  function toggleNotebook() {
    document.getElementById('v3-nb-panel').classList.toggle('v3-nb-panel--open');
  }

  window.v3CloseNotebook = function() {
    document.getElementById('v3-nb-panel').classList.remove('v3-nb-panel--open');
  };

  window.v3ToggleItem = function(encodedKey) {
    var key = decodeURIComponent(encodedKey);
    var s = getS();
    if (!s.reactions[key]) return;

    s.reactions[key].active = s.reactions[key].active === false ? true : false;
    saveS(s);
    if (hasGeneratedMsg) resetMessage(); else updateNotebook();

    // Actualizar visual en la página
    document.querySelectorAll('.v3-markable').forEach(function(el) {
      if (el.dataset.markKey === key) {
        if (s.reactions[key].active === false) {
          el.classList.remove('v3-markable--on');
        } else {
          el.classList.add('v3-markable--on');
        }
      }
    });

    updateNbBtnCount();
  };

  function resetMessage() {
    hasGeneratedMsg = null;
    generatedMessages = [];
    activeMsg = 0;
    updateNotebook();
  }

  window.v3SwitchMsg = function(idx) {
    activeMsg = idx;
    var ta = document.getElementById('v3-nb-textarea');
    if (ta) {
      ta.value = generatedMessages[idx];
      ta.style.height = 'auto';
      ta.style.height = ta.scrollHeight + 'px';
    }
    document.querySelectorAll('.v3-nb-msg-tab').forEach(function(t, i) {
      t.classList.toggle('v3-nb-msg-tab--active', i === idx);
    });
  };

  window.v3GenerateMessage = function() {
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

    var genBtn = document.querySelector('.v3-nb-gen-btn');
    if (genBtn) { genBtn.textContent = '✨ Generando...'; genBtn.disabled = true; }

    var url = 'https://cupykpcsxjihnzwyflbm.supabase.co/functions/v1/synthesize-notebook';

    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paragraphs: paragraphs })
    })
    .then(function(r) { return r.json(); })
    .then(function(data) {
      if (data.messages && data.messages.length > 0) {
        generatedMessages = data.messages.map(function(m) {
          return m.replace(/^\*?\*?[Mm]ensaje\s*\d+[^:\n]*:?\*?\*?\s*/gm, '')
            .replace(/^\*?\*?—[^—\n]*—\*?\*?\s*/gm, '')
            .replace(/^\*\*/gm, '').replace(/\*\*$/gm, '')
            .trim();
        });
        activeMsg = 0;
        hasGeneratedMsg = generatedMessages[0];
        updateNotebook();
      }
    })
    .catch(function() {
      if (genBtn) { genBtn.textContent = '✨ Reintentar'; }
    })
    .finally(function() {
      if (genBtn) { genBtn.disabled = false; }
    });
  };

  window.v3CopyMessage = function() {
    var textarea = document.getElementById('v3-nb-textarea');
    if (!textarea) return;
    navigator.clipboard.writeText(textarea.value).then(function() {
      var btn = document.querySelector('.v3-nb-copy-big');
      if (btn) { btn.textContent = '✓ Copiado'; setTimeout(function() { btn.textContent = 'Copia Este Mensaje'; }, 2500); }
    });
  };

  window.v3ClearNotebook = function() {
    if (confirm('¿Borrar todas tus notas? Esta acción no se puede deshacer.')) {
      localStorage.removeItem(STORE);
      location.reload();
    }
  };

  // Legacy: mantener compatibilidad con onclick="v3AddNote(...)" en HTML
  window.v3AddNote = function(text, layer) {
    var s = getS();
    var key = currentPage() + '::' + text.substring(0, 80);
    s.reactions[key] = { page: currentPage(), text: text.substring(0, 120), time: Date.now() };
    saveS(s);
    updateNbBtnCount();
    if (hasGeneratedMsg) resetMessage(); else updateNotebook();
    var nbBtn = document.getElementById('v3-nb-btn');
    if (nbBtn) {
      nbBtn.style.transform = 'scale(1.15)';
      nbBtn.style.borderColor = 'rgba(245,166,35,0.7)';
      setTimeout(function() { nbBtn.style.transform = ''; nbBtn.style.borderColor = ''; }, 400);
    }
  };

  window.v3ToggleNotebook = toggleNotebook;

  // ==========================================
  // Auto-wrap: si no hay #v3-content, envolver el body content
  // ==========================================
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

  // ==========================================
  // INIT — construir cuaderno y activar marcado
  // ==========================================
  function initCuaderno() {
    buildNotebookBtn();
    initReactions();
  }

  if (document.getElementById('v3-content')) {
    setTimeout(initCuaderno, 300);
  } else {
    document.addEventListener('DOMContentLoaded', function() { setTimeout(initCuaderno, 700); });
  }

})();
