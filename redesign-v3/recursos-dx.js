(function(){
'use strict';

// ============================================================
// DATA — 5 roles × 6 dimensions × 3 affirmations
// ============================================================
var ROLES = {
  persona: { label: 'Como persona', icon: '\u{1F9E0}', desc: 'Tus destrezas personales frente al mundo que viene' },
  docente: { label: 'Como docente', icon: '\u{1F4DA}', desc: 'Tu práctica pedagógica y su alineación con el siglo XXI' },
  establecimiento: { label: 'Como establecimiento', icon: '\u{1F3EB}', desc: 'Tu escuela frente a los estándares internacionales' },
  empresa: { label: 'Como empresa', icon: '\u{1F3E2}', desc: 'Tu organización y las competencias que necesita' },
  estudiante: { label: 'Como estudiante', icon: '\u{1F393}', desc: 'Tus destrezas y cómo las estás desarrollando' }
};

var dimensiones = {
  persona: [
    { icon: '🧠', nombre: 'Pensamiento crítico', marco: 'OCDE · P21 · Harvard PZ', afirmaciones: [
      'Evalúo la información que recibo antes de creerla o compartirla',
      'Cuando encuentro información contradictoria, busco más fuentes antes de decidir',
      'Puedo detectar cuando un argumento tiene fallas o sesgos'
    ]},
    { icon: '🤝', nombre: 'Colaboración', marco: 'OCDE · P21 · CASEL', afirmaciones: [
      'Trabajo bien con personas que piensan distinto a mí',
      'En equipos, contribuyo activamente y me adapto a diferentes roles',
      'Co-construyo soluciones que ninguno de los miembros hubiera logrado solo'
    ]},
    { icon: '🎯', nombre: 'Autonomía', marco: 'OCDE Learning Compass', afirmaciones: [
      'Me propongo metas propias sin necesitar que otros me digan qué hacer',
      'Cuando enfrento algo desconocido, busco cómo aprenderlo por mi cuenta',
      'Gestiono mi tiempo y mis prioridades de forma independiente'
    ]},
    { icon: '💡', nombre: 'Creatividad', marco: 'WEF · P21 · Robinson', afirmaciones: [
      'Genero ideas nuevas cuando enfrento problemas sin respuesta única',
      'El error me da información para mejorar, no me detiene',
      'Conecto conocimientos de áreas distintas para encontrar soluciones originales'
    ]},
    { icon: '❤️', nombre: 'Habilidades SEL', marco: 'CASEL · UNESCO · OCDE', afirmaciones: [
      'Reconozco mis emociones y las manejo antes de reaccionar',
      'Empatizo con perspectivas que son distintas a la mía',
      'Resuelvo conflictos con diálogo en lugar de evitarlos o escalarlos'
    ]},
    { icon: '💼', nombre: 'Adaptabilidad', marco: 'WEF · Lightcast · MINEDUC', afirmaciones: [
      'Me adapto con facilidad cuando las condiciones o las reglas cambian',
      'Aprendo cosas nuevas antes de necesitarlas, no solo cuando es urgente',
      'El cambio y la incertidumbre me generan más curiosidad que miedo'
    ]}
  ],
  docente: [
    { icon: '🧠', nombre: 'Pensamiento crítico', marco: 'OCDE · P21 · Harvard PZ', afirmaciones: [
      'Diseño actividades donde los estudiantes evalúan fuentes y argumentos',
      'El pensamiento crítico es una destreza que desarrollo de forma transversal',
      'Mis estudiantes argumentan con evidencia de forma autónoma'
    ]},
    { icon: '🤝', nombre: 'Colaboración', marco: 'OCDE · P21 · CASEL', afirmaciones: [
      'Diseño proyectos colaborativos con roles y objetivos claros',
      'Los estudiantes co-construyen conocimiento y me incluyo como par',
      'El aula funciona como una comunidad que aprende junta'
    ]},
    { icon: '🎯', nombre: 'Autonomía', marco: 'OCDE Learning Compass', afirmaciones: [
      'Los estudiantes eligen cómo demostrar su aprendizaje',
      'Co-diseño parte del proceso formativo con los estudiantes',
      'Cada estudiante gestiona su propio trayecto con mi acompañamiento'
    ]},
    { icon: '💡', nombre: 'Creatividad', marco: 'WEF · P21 · Robinson', afirmaciones: [
      'Creo espacios seguros para que los estudiantes experimenten',
      'El error se analiza como información útil en mi aula',
      'El aula es un laboratorio donde prototipar y mejorar es lo normal'
    ]},
    { icon: '❤️', nombre: 'Habilidades SEL', marco: 'CASEL · UNESCO · OCDE', afirmaciones: [
      'Integro dinámicas socioemocionales en mi práctica regular',
      'Las habilidades SEL son parte transversal de mi diseño pedagógico',
      'Mi aula modela autoconciencia, empatía y regulación todos los días'
    ]},
    { icon: '💼', nombre: 'Adaptabilidad', marco: 'WEF · Lightcast · MINEDUC', afirmaciones: [
      'Actualizo mi práctica cuando aparece evidencia relevante',
      'Busco activamente nuevas metodologías y las experimento en el aula',
      'Investigo, innovo, comparto y retroalimento a otros en mi práctica'
    ]}
  ],
  establecimiento: [
    { icon: '🧠', nombre: 'Pensamiento crítico', marco: 'OCDE · P21 · Harvard PZ', afirmaciones: [
      'Hay un diseño pedagógico transversal que incluye pensamiento crítico',
      'Es un sello del colegio con evidencia de impacto medible',
      'Los estudiantes detectan sesgos de forma autónoma como resultado del modelo'
    ]},
    { icon: '🤝', nombre: 'Colaboración', marco: 'OCDE · P21 · CASEL', afirmaciones: [
      'Hay una cultura de co-construcción entre docentes, familias y estudiantes',
      'La comunidad co-diseña el modelo y lo evalúa en ciclos continuos',
      'Docentes participan activamente en el diseño de proyectos'
    ]},
    { icon: '🎯', nombre: 'Autonomía', marco: 'OCDE Learning Compass', afirmaciones: [
      'Los estudiantes co-diseñan actividades, proyectos y evaluaciones',
      'La voz estudiantil incide en el diseño pedagógico e institucional',
      'Los estudiantes participan en decisiones que los afectan directamente'
    ]},
    { icon: '💡', nombre: 'Creatividad', marco: 'WEF · P21 · Robinson', afirmaciones: [
      'Existe una cultura de experimentación pedagógica respaldada',
      'La innovación es parte del ADN institucional con ciclos de mejora',
      'Se fomentan y respaldan innovaciones de los docentes'
    ]},
    { icon: '❤️', nombre: 'Habilidades SEL', marco: 'CASEL · UNESCO · OCDE', afirmaciones: [
      'Las habilidades SEL están integradas en el currículum transversalmente',
      'El bienestar y las SEL son ejes estructurales del modelo educativo',
      'Hay programas sistemáticos de desarrollo de habilidades humanas'
    ]},
    { icon: '💼', nombre: 'Adaptabilidad', marco: 'WEF · Lightcast · MINEDUC', afirmaciones: [
      'Monitorea activamente el entorno y ajusta su modelo proactivamente',
      'Tiene un brazo de I+D que investiga, innova y difunde hallazgos',
      'Se actualiza ante tendencias relevantes con regularidad'
    ]}
  ],
  empresa: [
    { icon: '🧠', nombre: 'Pensamiento crítico', marco: 'OCDE · P21 · Harvard PZ', afirmaciones: [
      'Los equipos evalúan, contrastan y proponen con evidencia regularmente',
      'El pensamiento crítico es una competencia activamente desarrollada',
      'El cuestionamiento constructivo es valorado en todos los niveles'
    ]},
    { icon: '🤝', nombre: 'Colaboración', marco: 'OCDE · P21 · CASEL', afirmaciones: [
      'La colaboración cross-funcional es parte de la cultura organizacional',
      'Los equipos humano-IA y cross-disciplinarios son la norma',
      'Los equipos colaboran en proyectos con objetivos compartidos'
    ]},
    { icon: '🎯', nombre: 'Autonomía', marco: 'OCDE Learning Compass', afirmaciones: [
      'Hay cultura de ownership: las personas diseñan cómo lograr sus objetivos',
      'Las personas proponen, experimentan y lideran cambios',
      'Las personas toman decisiones en su área con respaldo'
    ]},
    { icon: '💡', nombre: 'Creatividad', marco: 'WEF · P21 · Robinson', afirmaciones: [
      'La cultura organizacional acepta el error como parte del proceso',
      'La innovación está en el centro del modelo de negocio',
      'Hay proyectos de innovación con recursos asignados'
    ]},
    { icon: '❤️', nombre: 'Habilidades SEL', marco: 'CASEL · UNESCO · OCDE', afirmaciones: [
      'Las competencias SEL se incluyen en evaluaciones de desempeño',
      'Hay programas sistemáticos de desarrollo de habilidades humanas',
      'Las habilidades humanas son el diferenciador estratégico'
    ]},
    { icon: '💼', nombre: 'Adaptabilidad', marco: 'WEF · Lightcast · MINEDUC', afirmaciones: [
      'La organización monitorea tendencias y se adelanta proactivamente',
      'La adaptación continua es parte del ADN organizacional',
      'Hay una estrategia de transformación digital en marcha'
    ]}
  ],
  estudiante: [
    { icon: '🧠', nombre: 'Pensamiento crítico', marco: 'OCDE · P21 · Harvard PZ', afirmaciones: [
      'Antes de compartir algo que vi en redes, verifico si es verdad',
      'Cuando algo no me convence, busco más información antes de aceptarlo',
      'Noto cuando un argumento tiene huecos o está tratando de manipularme'
    ]},
    { icon: '🤝', nombre: 'Colaboración', marco: 'OCDE · P21 · CASEL', afirmaciones: [
      'Contribuyo y escucho en grupo aunque piensen distinto a mí',
      'Facilito al grupo, distribuyo roles y co-creo con otros',
      'Construyo con otros algo que ninguno hubiera logrado solo'
    ]},
    { icon: '🎯', nombre: 'Autonomía', marco: 'OCDE Learning Compass', afirmaciones: [
      'Busco y pruebo por mi cuenta antes de pedir ayuda',
      'Diseño mi propio camino de aprendizaje cuando algo me interesa',
      'Evalúo mi propio avance sin necesitar que me lo digan'
    ]},
    { icon: '💡', nombre: 'Creatividad', marco: 'WEF · P21 · Robinson', afirmaciones: [
      'Exploro problemas desde varios ángulos y genero soluciones distintas',
      'Disfruto los problemas difíciles y mejoro con cada intento fallido',
      'Conecto lo que aprendo en distintas materias para crear algo nuevo'
    ]},
    { icon: '❤️', nombre: 'Habilidades SEL', marco: 'CASEL · UNESCO · OCDE', afirmaciones: [
      'Cuando algo me sale mal, lo proceso y aprendo de la situación',
      'Tomo el feedback como información y lo uso para mejorar',
      'Manejo mis emociones antes de reaccionar en situaciones difíciles'
    ]},
    { icon: '💼', nombre: 'Adaptabilidad', marco: 'WEF · Lightcast · MINEDUC', afirmaciones: [
      'Aprendo destrezas que sé que sirven en cualquier contexto',
      'Construyo mi capacidad de aprender continuamente como herramienta principal',
      'El cambio me genera más curiosidad que preocupación'
    ]}
  ]
};

var benchmarks = {
  persona: { 'Promedio global': [52,48,55,45,42,40], 'Top 10% mundial': [88,85,90,82,78,80], 'Promedio Chile': [48,42,50,40,38,35] },
  docente: { 'Docente tradicional': [35,30,28,25,32,20], 'Docente innovador': [75,78,70,72,68,75], 'Estándar OCDE': [65,60,58,55,55,50] },
  establecimiento: { 'Colegio promedio Chile': [35,25,30,22,28,20], 'Estándar OCDE': [60,55,52,50,50,45], 'Escuela innovadora': [78,75,72,70,68,70] },
  empresa: { 'Empresa tradicional': [40,30,35,28,32,25], 'Startup tecnológica': [70,82,65,75,55,80], 'Top employer global': [85,80,80,78,75,82] },
  estudiante: { 'Promedio regional': [45,40,38,42,35,30], 'Estudiante proactivo': [72,70,68,75,65,70], 'Referente global': [88,85,82,85,80,82] }
};

var insightPool = {
  strength: [
    'Esta es la base sobre la que puedes construir todo lo demás. Las personas y organizaciones que dominan esta dimensión tienen una ventaja que la IA no puede replicar.',
    'Aquí tienes un activo que el mercado valora cada vez más. Mientras la tecnología avanza, esta destreza humana se vuelve más escasa — y más valiosa.',
    'Tu fortaleza en esta área te posiciona en el grupo que lidera la adaptación al cambio. Cultívala y compártela.'
  ],
  growth: [
    'Esta dimensión es donde más potencial de transformación tienes. Un pequeño avance aquí tiene un efecto multiplicador en todas las demás.',
    'No es una debilidad — es una oportunidad. Las destrezas del siglo XXI se desarrollan a cualquier edad. Lo que importa es la decisión de empezar.',
    'Aquí está tu próximo salto. Los datos muestran que las personas que trabajan esta dimensión de forma intencional ven resultados en semanas, no en años.'
  ]
};

// ============================================================
// STATE
// ============================================================
var currentRole = null;
var currentDim = 0;
var answers = {};
var TOTAL_DIMS = 6;
var AFFS_PER_DIM = 3;
var userScores = [];
var activeBenchmark = null;

// ============================================================
// RENDER ROLE CARDS
// ============================================================
(function initProfiles() {
  var container = document.getElementById('dx-profiles');
  if (!container) return;
  var keys = Object.keys(ROLES);
  container.innerHTML = keys.map(function(key) {
    var r = ROLES[key];
    return '<div class="dx-profile" data-role="' + key + '">' +
      '<div class="dx-profile__icon">' + r.icon + '</div>' +
      '<div class="dx-profile__name">' + r.label + '</div>' +
      '<div class="dx-profile__desc">' + r.desc + '</div>' +
    '</div>';
  }).join('');
  container.querySelectorAll('.dx-profile').forEach(function(card) {
    card.addEventListener('click', function() { selectRole(card.dataset.role, card); });
  });
})();

// ============================================================
// SELECT ROLE → GENERATE QUIZ
// ============================================================
function selectRole(role, cardEl) {
  currentRole = role;
  currentDim = 0;
  answers = {};

  document.getElementById('dx-results').classList.remove('dx-results--active');
  document.querySelectorAll('.dx-profile').forEach(function(p) { p.classList.remove('dx-profile--active'); });
  cardEl.classList.add('dx-profile--active');

  var dims = dimensiones[role];
  var area = document.getElementById('dx-quiz-area');
  var html = '';

  for (var d = 0; d < dims.length; d++) {
    var dim = dims[d];
    html += '<div class="dim-block" data-dim="' + d + '">';
    html += '<div class="dim-header"><div class="dim-meta">Dimensión ' + (d+1) + ' de ' + TOTAL_DIMS + '</div>';
    html += '<div class="dim-title">' + dim.icon + ' ' + dim.nombre + '</div>';
    html += '<div class="dim-sub">Marco: ' + dim.marco + '</div></div>';
    html += '<div class="global-progress"><div class="gp-fill" style="width:0%"></div></div>';
    html += '<div class="aff-list">';

    for (var a = 0; a < dim.afirmaciones.length; a++) {
      html += '<div class="aff-row" data-dim="' + d + '" data-aff="' + a + '">';
      html += '<div class="aff-text">' + dim.afirmaciones[a] + '</div>';
      html += '<div class="scale-dots">';
      var labels = ['Nunca','Rara vez','A veces','Frecuente','Siempre'];
      for (var v = 1; v <= 5; v++) {
        html += '<button class="dot" data-val="' + v + '" onclick="setAnswer(' + d + ',' + a + ',' + v + ',this)" title="' + labels[v-1] + '"><span class="dot-label">' + labels[v-1] + '</span></button>';
      }
      html += '</div></div>';
    }

    html += '</div>';
    html += '<div class="dim-nav">';
    html += '<button class="btn-prev-dim" onclick="prevDim()" style="visibility:' + (d > 0 ? 'visible' : 'hidden') + '">← Anterior</button>';
    html += '<span class="dim-counter">0 de ' + AFFS_PER_DIM + ' respondidas</span>';
    var isLast = d === dims.length - 1;
    html += '<button class="btn-next-dim" onclick="nextDim()" disabled>' + (isLast ? 'Ver resultados →' : 'Siguiente dimensión →') + '</button>';
    html += '</div></div>';
  }

  area.innerHTML = html;

  // Show first block
  var first = document.querySelector('.dim-block[data-dim="0"]');
  if (first) first.classList.add('active');

  area.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ============================================================
// ANSWER HANDLING
// ============================================================
window.setAnswer = function(dim, aff, val, btn) {
  if (!answers[dim]) answers[dim] = {};
  answers[dim][aff] = val;

  var row = btn.closest('.aff-row');
  row.querySelectorAll('.dot').forEach(function(d) { d.classList.remove('selected'); });
  btn.classList.add('selected');
  row.classList.add('answered');

  // Update counter for current block
  var block = document.querySelector('.dim-block[data-dim="' + currentDim + '"]');
  if (block) {
    var respondidas = Object.keys(answers[currentDim] || {}).length;
    var counter = block.querySelector('.dim-counter');
    if (counter) counter.textContent = respondidas + ' de ' + AFFS_PER_DIM + ' respondidas';
    var nextBtn = block.querySelector('.btn-next-dim');
    if (nextBtn) nextBtn.disabled = respondidas < AFFS_PER_DIM;
  }

  // Update global progress
  var total = 0;
  for (var k in answers) total += Object.keys(answers[k]).length;
  var pct = (total / (TOTAL_DIMS * AFFS_PER_DIM)) * 100;
  document.querySelectorAll('.gp-fill').forEach(function(el) { el.style.width = pct + '%'; });
};

window.nextDim = function() {
  document.querySelector('.dim-block[data-dim="' + currentDim + '"]').classList.remove('active');
  currentDim++;
  if (currentDim >= TOTAL_DIMS) { showResults(); return; }
  var next = document.querySelector('.dim-block[data-dim="' + currentDim + '"]');
  next.classList.add('active');
  var respondidas = Object.keys(answers[currentDim] || {}).length;
  var counter = next.querySelector('.dim-counter');
  if (counter) counter.textContent = respondidas + ' de ' + AFFS_PER_DIM + ' respondidas';
  var nextBtn = next.querySelector('.btn-next-dim');
  if (nextBtn) nextBtn.disabled = respondidas < AFFS_PER_DIM;
  var content = document.getElementById('v3-content');
  if (content) content.scrollTo({ top: 0, behavior: 'smooth' });
};

window.prevDim = function() {
  document.querySelector('.dim-block[data-dim="' + currentDim + '"]').classList.remove('active');
  currentDim--;
  var prev = document.querySelector('.dim-block[data-dim="' + currentDim + '"]');
  prev.classList.add('active');
  var content = document.getElementById('v3-content');
  if (content) content.scrollTo({ top: 0, behavior: 'smooth' });
};

// ============================================================
// SHOW RESULTS
// ============================================================
function showResults() {
  document.getElementById('dx-quiz-area').innerHTML = '';
  var results = document.getElementById('dx-results');
  results.classList.add('dx-results--active');

  var dims = dimensiones[currentRole];
  var scores = [];
  for (var d = 0; d < TOTAL_DIMS; d++) {
    var sum = 0;
    for (var a = 0; a < AFFS_PER_DIM; a++) {
      sum += (answers[d] && answers[d][a]) ? answers[d][a] : 3;
    }
    scores.push(Math.round((sum / (AFFS_PER_DIM * 5)) * 100));
  }
  userScores = scores;

  var total = Math.round(scores.reduce(function(a,b){return a+b;},0) / TOTAL_DIMS);

  document.getElementById('dx-results-profile').textContent = ROLES[currentRole].label;

  var title = 'Tu perfil muestra oportunidades de crecimiento importantes';
  if (total >= 80) title = 'Tu perfil está altamente alineado con el siglo XXI';
  else if (total >= 60) title = 'Tu perfil muestra una base sólida con espacio para crecer';
  else if (total >= 40) title = 'Tu perfil tiene fundamentos — y un gran potencial de desarrollo';
  document.getElementById('dx-results-title').textContent = title;

  var maxIdx = 0, minIdx = 0;
  for (var i = 1; i < TOTAL_DIMS; i++) {
    if (scores[i] > scores[maxIdx]) maxIdx = i;
    if (scores[i] < scores[minIdx]) minIdx = i;
  }

  document.getElementById('dx-scores').innerHTML =
    '<div class="dx-score"><div class="dx-score__val">' + total + '%</div><div class="dx-score__label">Score global</div></div>' +
    '<div class="dx-score" style="border-left-color:#5DCAA5"><div class="dx-score__val" style="color:#5DCAA5">' + scores[maxIdx] + '%</div><div class="dx-score__label">Mayor fortaleza</div></div>' +
    '<div class="dx-score" style="border-left-color:#2E6DA4"><div class="dx-score__val" style="color:#2E6DA4">' + scores[minIdx] + '%</div><div class="dx-score__label">Tu próximo movimiento</div></div>';

  // Dimension bars
  var dimNames = dims.map(function(d){return d.nombre;});
  var dimsHTML = '';
  for (var i = 0; i < TOTAL_DIMS; i++) {
    dimsHTML += '<div class="dx-dim"><div class="dx-dim__header"><span class="dx-dim__name">' + dimNames[i] + '</span><span class="dx-dim__pct">' + scores[i] + '%</span></div>' +
      '<div class="dx-dim__bar"><div class="dx-dim__fill" id="dx-bar-' + i + '"></div></div></div>';
  }
  document.getElementById('dx-dims').innerHTML = dimsHTML;
  setTimeout(function() {
    for (var i = 0; i < TOTAL_DIMS; i++) {
      document.getElementById('dx-bar-' + i).style.width = scores[i] + '%';
    }
  }, 200);

  // Radar
  drawRadar(dimNames, scores);

  // Benchmarks
  activeBenchmark = null;
  var bmarks = benchmarks[currentRole];
  var benchHTML = '';
  Object.keys(bmarks).forEach(function(name) {
    benchHTML += '<button class="dx-bench__opt" data-bench="' + name + '">' + name + '</button>';
  });
  document.getElementById('dx-bench-options').innerHTML = benchHTML;
  document.querySelectorAll('.dx-bench__opt').forEach(function(btn) {
    btn.addEventListener('click', function() { toggleBenchmark(btn, btn.dataset.bench); });
  });

  // Insights
  var sp = insightPool.strength;
  var gp = insightPool.growth;
  document.getElementById('dx-insights').innerHTML =
    '<div class="dx-insight"><div class="dx-insight__title">Tu mayor fortaleza</div>' +
    '<p class="dx-insight__text"><strong>' + dimNames[maxIdx] + ' (' + scores[maxIdx] + '%):</strong> ' + sp[Math.floor(Math.random()*sp.length)] + '</p></div>' +
    '<div class="dx-insight" style="border-color:rgba(46,109,164,0.25);background:rgba(46,109,164,0.05)">' +
    '<div class="dx-insight__title" style="color:#2E6DA4">Tu próximo movimiento</div>' +
    '<p class="dx-insight__text"><strong>' + dimNames[minIdx] + ' (' + scores[minIdx] + '%):</strong> ' + gp[Math.floor(Math.random()*gp.length)] + '</p></div>';

  // Show profiling form
  document.getElementById('profiling-form').style.display = 'block';

  results.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ============================================================
// RADAR CHART (SVG)
// ============================================================
function drawRadar(labels, scores, benchScores) {
  var svg = document.getElementById('dx-radar-svg');
  var cx=200,cy=200,r=140,n=labels.length;
  var step=(2*Math.PI)/n,offset=-Math.PI/2;
  function polar(a,rad){return[cx+rad*Math.cos(a),cy+rad*Math.sin(a)];}
  var html='';
  [0.2,0.4,0.6,0.8,1.0].forEach(function(p){
    var pts=[];for(var i=0;i<n;i++)pts.push(polar(offset+i*step,r*p).join(','));
    html+='<polygon points="'+pts.join(' ')+'" class="'+(p===1?'dx-radar__bg':'dx-radar__grid')+'"/>';
  });
  for(var i=0;i<n;i++){var pt=polar(offset+i*step,r);html+='<line x1="'+cx+'" y1="'+cy+'" x2="'+pt[0]+'" y2="'+pt[1]+'" stroke="rgba(255,255,255,0.04)" stroke-width="1"/>';}
  for(var i=0;i<n;i++){
    var lpt=polar(offset+i*step,r+28);var parts=labels[i].split(' ');var mid=Math.ceil(parts.length/2);
    html+='<text x="'+lpt[0]+'" y="'+(lpt[1]-6)+'" class="dx-radar__label">'+parts.slice(0,mid).join(' ')+'</text>';
    if(parts.slice(mid).join(' '))html+='<text x="'+lpt[0]+'" y="'+(lpt[1]+7)+'" class="dx-radar__label">'+parts.slice(mid).join(' ')+'</text>';
  }
  if(benchScores){
    var bPts=[],bDots='';
    for(var i=0;i<n;i++){var v=benchScores[i]/100;var bp=polar(offset+i*step,r*v);bPts.push(bp[0]+','+bp[1]);bDots+='<circle cx="'+bp[0]+'" cy="'+bp[1]+'" class="dx-radar__bench-dot"/>';}
    html+='<polygon points="'+bPts.join(' ')+'" class="dx-radar__bench"/>'+bDots;
  }
  var dataPts=[],dots='';
  for(var i=0;i<n;i++){var v=scores[i]/100;var dp=polar(offset+i*step,r*v);dataPts.push(dp[0]+','+dp[1]);dots+='<circle cx="'+dp[0]+'" cy="'+dp[1]+'" class="dx-radar__dot"/>';}
  html+='<polygon points="'+dataPts.join(' ')+'" class="dx-radar__shape"/>'+dots;
  if(benchScores){
    html+='<rect x="10" y="370" width="12" height="3" fill="#F5A623" rx="1"/><text x="26" y="374" fill="rgba(255,255,255,0.6)" font-size="9" font-weight="500">Tú</text>';
    html+='<rect x="50" y="370" width="12" height="3" fill="#2E6DA4" rx="1"/><text x="66" y="374" fill="rgba(255,255,255,0.6)" font-size="9" font-weight="500">Referente</text>';
  }
  svg.innerHTML=html;
}

function toggleBenchmark(btn,name){
  var wasActive=btn.classList.contains('dx-bench__opt--active');
  document.querySelectorAll('.dx-bench__opt').forEach(function(b){b.classList.remove('dx-bench__opt--active');});
  var dimNames=dimensiones[currentRole].map(function(d){return d.nombre;});
  if(wasActive){activeBenchmark=null;drawRadar(dimNames,userScores);}
  else{btn.classList.add('dx-bench__opt--active');activeBenchmark=name;drawRadar(dimNames,userScores,benchmarks[currentRole][name]);}
}

// ============================================================
// RETRY / RESET
// ============================================================
document.getElementById('dx-retry').addEventListener('click',function(){
  if(currentRole){var card=document.querySelector('.dx-profile[data-role="'+currentRole+'"]');if(card)selectRole(currentRole,card);}
});
document.getElementById('dx-reset').addEventListener('click',function(){
  document.getElementById('dx-results').classList.remove('dx-results--active');
  document.getElementById('dx-quiz-area').innerHTML='';
  document.querySelectorAll('.dx-profile').forEach(function(p){p.classList.remove('dx-profile--active');});
  currentRole=null;
  var content=document.getElementById('v3-content');
  if(content)content.scrollTo({top:0,behavior:'smooth'});
});

// ============================================================
// PROFILING + PDF
// ============================================================
var pfAnswers = {};
window.selPF = function(el, field, value) {
  el.closest('[id^="pf-"]').querySelectorAll('.pf-opt').forEach(function(o){o.classList.remove('selected');});
  el.classList.add('selected');
  pfAnswers[field] = value;
  var complete = pfAnswers.motivation && pfAnswers.stage && pfAnswers.rectype;
  var btn = document.getElementById('generate-btn');
  if(btn){
    btn.disabled = !complete;
    btn.style.background = complete ? '#F5A623' : 'rgba(245,166,35,.15)';
    btn.style.color = complete ? '#0A1628' : 'rgba(245,166,35,.4)';
    btn.style.borderColor = complete ? '#F5A623' : 'rgba(245,166,35,.2)';
    btn.style.cursor = complete ? 'pointer' : 'not-allowed';
  }
};

window.generateReport = async function() {
  document.getElementById('generate-btn').style.display='none';
  document.getElementById('generating-state').style.display='block';
  var dims=dimensiones[currentRole];
  var dimScores={};
  dims.forEach(function(d,i){
    var sum=0;for(var a=0;a<AFFS_PER_DIM;a++){sum+=(answers[i]&&answers[i][a])?answers[i][a]:3;}
    dimScores[d.nombre]=Math.round(sum/AFFS_PER_DIM*10)/10;
  });
  var totalScore=Object.values(dimScores).reduce(function(a,v){return a+v;},0);
  var maxScore=TOTAL_DIMS*5;
  var sorted=Object.entries(dimScores).sort(function(a,b){return b[1]-a[1];});
  var strongestDim=sorted[0][0],weakestDim=sorted[sorted.length-1][0];
  var name=(document.getElementById('pf-name').value||'').trim();
  var pct=totalScore/maxScore;
  var scoreLabel=pct>=0.75?'Perfil consolidado':pct>=0.5?'Perfil en desarrollo':'Perfil emergente';
  var roleLabels={persona:'Persona',docente:'Docente',establecimiento:'Establecimiento',empresa:'Empresa',estudiante:'Estudiante'};
  var diagnosticSummary=Object.entries(dimScores).map(function(e){return e[0]+': '+e[1]+'/5';}).join(' · ');
  var prompt='Eres un especialista en competencias del siglo XXI. Genera textos para un informe PDF. Responde SOLO con JSON válido.\n\nPERFIL:\n- Nombre: '+(name||'no indicado')+'\n- Rol: '+roleLabels[currentRole]+'\n- Resultados: '+diagnosticSummary+'\n- Fortaleza: '+strongestDim+' ('+dimScores[strongestDim]+'/5)\n- Oportunidad: '+weakestDim+' ('+dimScores[weakestDim]+'/5)\n- Score: '+totalScore.toFixed(1)+'/'+maxScore+' — '+scoreLabel+'\n- Motivación: '+pfAnswers.motivation+'\n- Punto de partida: '+pfAnswers.stage+'\n- Tipo recomendaciones: '+pfAnswers.rectype+'\n\nJSON con claves:\n"intro": 2-3 oraciones. Nombre si existe. Motivación. Fortaleza. Tono adulto.\n"lo_que_ya_tienes": 2 oraciones. Qué puede hacer AHORA con su fortaleza.\n"lo_que_puedes_lograr": 2 oraciones. Qué se abre al fortalecer su oportunidad.\n"recomendacion_1": Acción para hoy. Concreta. Max 2 oraciones.\n"recomendacion_2": Acción para este mes. Max 2 oraciones.\n"recomendacion_3": Acción para seguir creciendo. Max 2 oraciones.\n"etiquetas_recs": Array de 3 strings con etiqueta temporal.\n"cierre": 1-2 oraciones. Conecta fortaleza con lo que puede lograr.\n\nREGLA OBLIGATORIA DE TONO: Ningún texto puede generar miedo ni sensación de que el futuro está perdido. Cada recomendación debe abrir una posibilidad concreta. El futuro no está escrito — el informe debe transmitir que el visitante tiene agencia para escribirlo.\nREGLAS: Sin mencionar instituciones. Tú/tu. Max 50 palabras por campo.';

  var insights=null;
  try{
    var response=await fetch('https://cupykpcsxjihnzwyflbm.supabase.co/functions/v1/generate-report',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({prompt:prompt})});
    insights=await response.json();
  }catch(err){console.error(err);}
  buildPDF(insights,dimScores,name,totalScore,maxScore,scoreLabel,roleLabels[currentRole]);
};

function buildPDF(insights,dimScores,name,totalScore,maxScore,scoreLabel,roleLabel){
  var jsPDF=window.jspdf.jsPDF;
  var doc=new jsPDF({orientation:'portrait',unit:'mm',format:'a4'});
  var displayName=name||'Anónimo';
  var pct=totalScore/maxScore;
  var y=0;
  doc.setFillColor(10,22,40);doc.rect(0,0,210,48,'F');
  doc.setFillColor(245,166,35);doc.rect(0,0,4,48,'F');
  doc.setTextColor(200,130,20);doc.setFontSize(7);doc.setFont('helvetica','bold');
  doc.text('INFORME DE LIDERAZGO · SIGLO XXI',12,10);
  doc.setTextColor(245,166,35);doc.setFontSize(18);
  doc.text('Perfil de Habilidades del Siglo XXI',12,20);
  doc.setTextColor(255,255,255);doc.setFontSize(10);doc.setFont('helvetica','normal');
  doc.text(displayName+'  ·  '+roleLabel+'  ·  '+new Date().toLocaleDateString('es-CL'),12,28);
  doc.setTextColor(180,190,200);doc.setFontSize(6.5);
  doc.text('CASEL 2017 · OCDE Learning Compass 2030 · WEF Future of Jobs 2025 · IA (Anthropic)',12,38);
  y=56;
  if(insights&&insights.intro){
    doc.setFillColor(240,247,255);var il=doc.splitTextToSize(insights.intro,165);var ih=il.length*5+14;
    doc.roundedRect(12,y,186,ih,2,2,'F');doc.setDrawColor(24,95,165);doc.setLineWidth(0.8);doc.line(12,y,12,y+ih);
    doc.setTextColor(24,95,165);doc.setFontSize(6.5);doc.setFont('helvetica','bold');doc.text('ANÁLISIS PERSONALIZADO',18,y+6);
    doc.setTextColor(30,40,55);doc.setFontSize(9);doc.setFont('helvetica','normal');doc.text(il,18,y+12);y+=ih+8;
  }
  doc.setFillColor(240,243,248);doc.roundedRect(12,y,186,16,2,2,'F');
  doc.setTextColor(10,22,40);doc.setFontSize(18);doc.setFont('helvetica','bold');doc.text(totalScore.toFixed(1),22,y+11);
  doc.setTextColor(90,100,115);doc.setFontSize(10);doc.setFont('helvetica','normal');doc.text('/'+maxScore,37,y+11);
  var bc=pct>=0.75?[31,107,59]:pct>=0.5?[200,100,0]:[166,50,40];
  doc.setTextColor(bc[0],bc[1],bc[2]);doc.setFontSize(8);doc.setFont('helvetica','bold');doc.text(scoreLabel,190,y+11,{align:'right'});y+=22;
  doc.setTextColor(154,160,171);doc.setFontSize(7);doc.setFont('helvetica','bold');doc.text('RESULTADOS POR DIMENSIÓN',12,y);y+=6;
  Object.keys(dimScores).forEach(function(dim){
    var s=dimScores[dim];var c=s>=4?[31,107,59]:s>=3?[200,100,0]:[166,50,40];
    doc.setTextColor(30,40,55);doc.setFontSize(8.5);doc.setFont('helvetica','normal');doc.text(dim,14,y);
    doc.setFillColor(232,236,242);doc.roundedRect(90,y-3,85,4,1,1,'F');
    doc.setFillColor(c[0],c[1],c[2]);doc.roundedRect(90,y-3,(s/5)*85,4,1,1,'F');
    doc.setTextColor(c[0],c[1],c[2]);doc.setFontSize(8);doc.setFont('helvetica','bold');doc.text(s.toFixed(1),180,y,{align:'right'});y+=8;
  });y+=4;
  var h1=0,h2=0;
  if(insights&&insights.lo_que_ya_tienes){
    doc.setFillColor(234,243,222);var l1=doc.splitTextToSize(insights.lo_que_ya_tienes,82);h1=l1.length*5+12;
    doc.roundedRect(12,y,90,h1,2,2,'F');doc.setTextColor(31,107,59);doc.setFontSize(6.5);doc.setFont('helvetica','bold');doc.text('LO QUE YA PUEDES HACER',17,y+5.5);
    doc.setTextColor(20,80,40);doc.setFontSize(8.5);doc.setFont('helvetica','normal');doc.text(l1,17,y+10.5);
  }
  if(insights&&insights.lo_que_puedes_lograr){
    doc.setFillColor(250,238,218);var l2=doc.splitTextToSize(insights.lo_que_puedes_lograr,82);h2=l2.length*5+12;
    doc.roundedRect(108,y,90,h2,2,2,'F');doc.setTextColor(150,70,0);doc.setFontSize(6.5);doc.setFont('helvetica','bold');doc.text('LO QUE PUEDES LOGRAR',113,y+5.5);
    doc.setTextColor(100,50,0);doc.setFontSize(8.5);doc.setFont('helvetica','normal');doc.text(l2,113,y+10.5);
  }
  y+=Math.max(h1,h2)+8;
  if(insights&&insights.recomendacion_1){
    doc.setFillColor(10,22,40);doc.roundedRect(12,y,186,8,2,2,'F');
    doc.setTextColor(245,166,35);doc.setFontSize(7.5);doc.setFont('helvetica','bold');doc.text('3 ACCIONES CONCRETAS',105,y+5.5,{align:'center'});y+=12;
    var recs=[insights.recomendacion_1,insights.recomendacion_2,insights.recomendacion_3];
    var etiq=insights.etiquetas_recs||['Para hoy','Para este mes','Para seguir'];
    recs.filter(Boolean).forEach(function(rec,i){
      var rl=doc.splitTextToSize(rec,155);var rh=rl.length*5+12;
      doc.setFillColor(240,243,248);doc.roundedRect(12,y,186,rh,2,2,'F');
      doc.setFillColor(10,22,40);doc.circle(21,y+rh/2,4,'F');
      doc.setTextColor(255,255,255);doc.setFontSize(8);doc.setFont('helvetica','bold');doc.text(String(i+1),21,y+rh/2+1,{align:'center'});
      doc.setTextColor(24,95,165);doc.setFontSize(6.5);doc.text((etiq[i]||'').toUpperCase(),29,y+5);
      doc.setTextColor(30,40,55);doc.setFontSize(8.5);doc.setFont('helvetica','normal');doc.text(rl,29,y+10);y+=rh+4;
    });
  }
  if(insights&&insights.cierre){
    y+=2;var cl=doc.splitTextToSize('"'+insights.cierre+'"',172);var ch=cl.length*5.5+10;
    doc.setFillColor(10,22,40);doc.roundedRect(12,y,186,ch,2,2,'F');
    doc.setTextColor(255,255,255);doc.setFontSize(9.5);doc.setFont('helvetica','italic');doc.text(cl,105,y+7,{align:'center'});y+=ch+6;
  }
  if(y>258){doc.addPage();y=16;}
  doc.setTextColor(154,160,171);doc.setFontSize(7);doc.setFont('helvetica','italic');
  doc.text(doc.splitTextToSize('Basado en CASEL (2017), OCDE Learning Compass 2030, WEF Future of Jobs 2025. Textos generados con IA (Claude, Anthropic). Herramienta de reflexión, no evaluación certificada.',186),12,y);
  doc.setFillColor(10,22,40);doc.rect(0,282,210,15,'F');doc.setFillColor(245,166,35);doc.rect(0,282,4,15,'F');
  doc.setTextColor(245,166,35);doc.setFontSize(8);doc.setFont('helvetica','bold');doc.text('Colegio Camilo Henríquez · Talca, Chile',12,290);
  doc.setTextColor(180,190,205);doc.setFont('helvetica','normal');doc.setFontSize(7);doc.text(new Date().toLocaleDateString('es-CL'),198,290,{align:'right'});
  doc.save('perfil-liderazgo-'+(name||'anonimo').replace(/\s+/g,'-')+'-'+new Date().toISOString().split('T')[0]+'.pdf');
  document.getElementById('generating-state').style.display='none';
  document.getElementById('generate-btn').style.display='block';
  document.getElementById('generate-btn').textContent='✓ Descargado — Generar otro →';
}

})();
