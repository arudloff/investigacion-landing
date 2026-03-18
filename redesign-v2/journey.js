// journey.js — Escalera de Compromiso Emocional v2
// Mapa de viaje + checkpoints emocionales + efecto espejo + resumen personal
// Todo anónimo, localStorage, sin backend

// ==========================================
// ESTACIONES DEL VIAJE
// ==========================================
const STATIONS = [
  { id: 'inicio',       page: 'index.html',              name: 'El mundo cambió',           group: 'descubrir' },
  { id: 'contexto',     page: 'contexto-global.html',     name: 'La evidencia',              group: 'descubrir' },
  { id: 'modelo',       page: 'modelo-educativo.html',    name: 'Nuestra respuesta',         group: 'descubrir' },
  { id: 'familias',     page: 'para-familias.html',       name: 'Familias',                  group: 'conectar' },
  { id: 'estudiantes',  page: 'estudiantes.html',         name: 'Estudiantes',               group: 'conectar' },
  { id: 'profesores',   page: 'profesores.html',          name: 'Profesores',                group: 'conectar' },
  { id: 'industria',    page: 'industria.html',           name: 'Industria',                 group: 'conectar' },
  { id: 'colegios',     page: 'colegios.html',            name: 'Colegios',                  group: 'conectar' },
  { id: 'universidades',page: 'universidades.html',       name: 'Universidades',             group: 'conectar' },
  { id: 'cepah',        page: 'cepah.html',               name: 'CEPAH',                     group: 'profundizar' },
  { id: 'diagnostico',  page: 'autodiagnostico.html',     name: 'Autodiagnóstico',           group: 'profundizar' },
  { id: 'equipo',       page: 'equipo.html',              name: 'Nuestro equipo',            group: 'conocer' },
  { id: 'nosotros',     page: 'nosotros.html',            name: 'Quiénes somos',             group: 'conocer' },
  { id: 'visita',       page: 'visita.html',              name: 'Agenda tu visita',          group: 'actuar' },
];

const GROUP_LABELS = {
  descubrir: 'Descubrir',
  conectar: 'Conectar',
  profundizar: 'Profundizar',
  conocer: 'Conocer',
  actuar: 'Actuar',
};

const GROUP_COLORS = {
  descubrir: 'rgba(245,166,35,0.8)',
  conectar: 'rgba(46,109,164,0.8)',
  profundizar: 'rgba(74,35,90,0.8)',
  conocer: 'rgba(31,107,59,0.8)',
  actuar: 'rgba(245,166,35,1)',
};

// ==========================================
// CHECKPOINTS EMOCIONALES
// ==========================================
const CHECKPOINTS = [
  { after: 'inicio',    text: '¿Cómo te hace sentir lo que acabas de leer?' },
  { after: 'contexto',  text: 'Después de ver esta evidencia, ¿qué sientes?' },
  { after: 'modelo',    text: '¿Qué provocó en ti conocer este modelo?' },
  { after: 'estudiantes', text: '¿Cómo te sentiste leyendo esto?' },
  { after: 'profesores',  text: '¿Qué te provocó este manifiesto?' },
  { after: 'diagnostico', text: '¿Cómo te dejó tu resultado?' },
];

const EMOTIONS = [
  { emoji: '🤔', label: 'Reflexivo' },
  { emoji: '💡', label: 'Inspirado' },
  { emoji: '😮', label: 'Sorprendido' },
  { emoji: '🔥', label: 'Motivado' },
  { emoji: '😟', label: 'Preocupado' },
  { emoji: '✊', label: 'Comprometido' },
];

// ==========================================
// FRASES ESPEJO (por nivel de profundidad)
// ==========================================
const MIRROR_PHRASES = {
  2:  'Si llegaste hasta aquí, algo de lo que leíste resonó contigo.',
  4:  'Ya has explorado varias estaciones. Eso dice algo sobre ti: te importa.',
  6:  'Has recorrido más que la mayoría. Quienes llegan hasta aquí suelen convertirse en agentes de cambio.',
  8:  'Pocas personas exploran un sitio con esta profundidad. Probablemente ya estás pensando en cómo actuar.',
  10: 'Has recorrido casi todo el viaje. Lo que queda es decidir qué haces con lo que descubriste.',
};

// ==========================================
// STATE (localStorage)
// ==========================================
const STORAGE_KEY = 'cch_journey';

function getJourney() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; }
  catch(e) { return {}; }
}

function saveJourney(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function markVisited(stationId) {
  const j = getJourney();
  if (!j.visited) j.visited = {};
  if (!j.visited[stationId]) {
    j.visited[stationId] = Date.now();
  }
  j.lastPage = stationId;
  saveJourney(j);
}

function saveEmotion(stationId, emotion) {
  const j = getJourney();
  if (!j.emotions) j.emotions = {};
  j.emotions[stationId] = emotion;
  saveJourney(j);
}

function getVisitedCount() {
  const j = getJourney();
  return j.visited ? Object.keys(j.visited).length : 0;
}

// ==========================================
// JOURNEY MAP (floating panel)
// ==========================================
function buildJourneyMap() {
  const j = getJourney();
  const visited = j.visited || {};
  const visitedCount = Object.keys(visited).length;
  const totalStations = STATIONS.length;

  // Floating button
  const btn = document.createElement('button');
  btn.className = 'jy-btn';
  btn.innerHTML = `<span class="jy-btn__icon">🧭</span><span class="jy-btn__count">${visitedCount}/${totalStations}</span>`;
  btn.onclick = toggleJourneyPanel;

  // Panel
  const panel = document.createElement('div');
  panel.className = 'jy-panel';
  panel.id = 'jy-panel';

  // Progress ring
  const pct = Math.round((visitedCount / totalStations) * 100);

  let html = `
    <div class="jy-panel__header">
      <div class="jy-panel__title">Tu viaje</div>
      <button class="jy-panel__close" onclick="toggleJourneyPanel()">×</button>
    </div>
    <div class="jy-panel__progress">
      <svg viewBox="0 0 80 80" class="jy-ring">
        <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="5"/>
        <circle cx="40" cy="40" r="34" fill="none" stroke="var(--color-amber)" stroke-width="5"
          stroke-dasharray="${(pct/100)*213.6} 213.6" stroke-linecap="round" transform="rotate(-90 40 40)"
          style="transition:stroke-dasharray 1s ease"/>
      </svg>
      <div class="jy-ring__text">${pct}%</div>
    </div>
    <div class="jy-panel__subtitle">${visitedCount} de ${totalStations} estaciones exploradas</div>
  `;

  // Stations grouped
  let currentGroup = '';
  STATIONS.forEach(st => {
    if (st.group !== currentGroup) {
      currentGroup = st.group;
      const color = GROUP_COLORS[st.group];
      html += `<div class="jy-group" style="color:${color}">${GROUP_LABELS[st.group]}</div>`;
    }
    const isVisited = !!visited[st.id];
    const isCurrent = getCurrentStationId() === st.id;
    const cls = isCurrent ? 'jy-station jy-station--current' : isVisited ? 'jy-station jy-station--visited' : 'jy-station';
    const dot = isVisited ? '●' : '○';
    const emotionBadge = j.emotions && j.emotions[st.id] ? `<span class="jy-station__emotion">${EMOTIONS.find(e => e.label === j.emotions[st.id])?.emoji || ''}</span>` : '';
    html += `<a href="${st.page}" class="${cls}"><span class="jy-station__dot" style="color:${GROUP_COLORS[st.group]}">${dot}</span> ${st.name} ${emotionBadge}</a>`;
  });

  // Mirror phrase
  const mirrorKeys = Object.keys(MIRROR_PHRASES).map(Number).sort((a,b) => b-a);
  const mirrorKey = mirrorKeys.find(k => visitedCount >= k);
  if (mirrorKey) {
    html += `<div class="jy-mirror">${MIRROR_PHRASES[mirrorKey]}</div>`;
  }

  panel.innerHTML = html;

  document.body.appendChild(btn);
  document.body.appendChild(panel);
}

function getCurrentStationId() {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  const st = STATIONS.find(s => s.page === page);
  return st ? st.id : null;
}

function toggleJourneyPanel() {
  const panel = document.getElementById('jy-panel');
  panel.classList.toggle('jy-panel--open');
}

// ==========================================
// CHECKPOINT EMOCIONAL
// ==========================================
function insertCheckpoint() {
  const stationId = getCurrentStationId();
  if (!stationId) return;

  const cp = CHECKPOINTS.find(c => c.after === stationId);
  if (!cp) return;

  const j = getJourney();
  if (j.emotions && j.emotions[stationId]) return; // ya respondió

  // Find the last section before the footer/nav script
  const sections = document.querySelectorAll('main > section, body > section');
  if (sections.length < 2) return;
  const targetSection = sections[sections.length - 1];

  const cpDiv = document.createElement('section');
  cpDiv.className = 'jy-checkpoint anim';
  cpDiv.innerHTML = `
    <div class="container" style="max-width:550px;text-align:center">
      <p class="jy-checkpoint__text">${cp.text}</p>
      <div class="jy-checkpoint__emotions">
        ${EMOTIONS.map(e =>
          `<button class="jy-checkpoint__emo" onclick="respondCheckpoint('${stationId}','${e.label}',this)">${e.emoji}<span>${e.label}</span></button>`
        ).join('')}
      </div>
    </div>
  `;

  targetSection.parentNode.insertBefore(cpDiv, targetSection);
}

function respondCheckpoint(stationId, emotion, btn) {
  saveEmotion(stationId, emotion);
  const container = btn.closest('.jy-checkpoint');
  container.innerHTML = `
    <div class="container" style="max-width:550px;text-align:center">
      <p style="color:var(--color-amber);font-size:1.1rem;font-weight:600;margin:0">Gracias. Tu reflexión queda contigo.</p>
      <p style="color:rgba(255,255,255,0.5);font-size:.85rem;margin-top:.5rem">Este momento de pausa es parte del viaje.</p>
    </div>
  `;
}

// ==========================================
// EFECTO ESPEJO (inline)
// ==========================================
function insertMirrorPhrase() {
  const count = getVisitedCount();
  if (count < 2) return;

  const mirrorKeys = Object.keys(MIRROR_PHRASES).map(Number).sort((a,b) => b-a);
  const key = mirrorKeys.find(k => count >= k);
  if (!key) return;

  // Insert before the last section of the page
  const main = document.querySelector('main');
  if (!main) return;
  const sections = main.querySelectorAll('section');
  if (sections.length < 2) return;

  const mirror = document.createElement('div');
  mirror.className = 'jy-mirror-inline anim';
  mirror.innerHTML = `<p>${MIRROR_PHRASES[key]}</p>`;
  sections[sections.length - 1].parentNode.insertBefore(mirror, sections[sections.length - 1]);
}

// ==========================================
// INIT — runs after nav.js has built the DOM
// ==========================================
(function initJourney() {
  // If main exists, nav.js already ran — go immediately
  // If not, wait for DOMContentLoaded + small delay
  function run() {
    const stationId = getCurrentStationId();
    if (stationId) markVisited(stationId);
    buildJourneyMap();
    insertCheckpoint();
    insertMirrorPhrase();
  }

  if (document.querySelector('main')) {
    // nav.js already built the DOM
    setTimeout(run, 100);
  } else {
    // Wait for nav.js
    document.addEventListener('DOMContentLoaded', function() {
      setTimeout(run, 600);
    });
  }
})();
