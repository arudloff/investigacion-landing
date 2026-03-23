/* recursos-dash.js
   Inyecta el dashboard completo dentro de #dashboard en recursos.html
   y configura todos los charts Chart.js.
   ────────────────────────────────────────────────────────────────── */
;(function () {
'use strict';

/* ══════════════════════════════════════════════════════════════════
   HTML — se inyecta dentro de #dashboard conservando el r-section-header
   ══════════════════════════════════════════════════════════════════ */
var dashHTML = `
<!-- Tab bar horizontal scrollable -->
<div style="overflow-x:auto;scrollbar-width:none;-webkit-overflow-scrolling:touch;margin-bottom:18px;border-bottom:1px solid rgba(46,109,164,.2);display:flex;align-items:center;gap:0;white-space:nowrap">
  <div class="dtab active" data-sec="empleos" onclick="showSec('empleos',this)">Empleos</div>
  <div class="dtab" data-sec="sectores" onclick="showSec('sectores',this)">Sectores</div>
  <div class="dtab" data-sec="destrezas" onclick="showSec('destrezas',this)">Destrezas</div>
  <div class="dtab" data-sec="oportunidades" onclick="showSec('oportunidades',this)">Oportunidades</div>
  <div class="dtab" data-sec="chile" onclick="showSec('chile',this)">Chile</div>
  <div class="dtab" data-sec="digital" onclick="showSec('digital',this)">Econom\u00eda digital</div>
  <div class="dtab" data-sec="desinfo" onclick="showSec('desinfo',this)">Desinformaci\u00f3n</div>
  <div id="change-role-btn" onclick="resetPerspective()" style="display:none;margin-left:auto;font-size:11px;font-weight:600;color:rgba(232,237,245,.5);border:1px solid rgba(46,109,164,.2);border-radius:10px;padding:4px 12px;cursor:pointer;flex-shrink:0;white-space:nowrap">Cambiar perspectiva \u21ba</div>
</div>

<!-- Entry block — perspective selector -->
<div id="entry-block" class="rv vis" style="position:relative;text-align:center;padding:40px 20px 50px;border-bottom:1px solid var(--border);margin-bottom:28px">
  <p style="font-size:12px;color:var(--td);letter-spacing:.08em;text-transform:uppercase;margin-bottom:12px">Antes de explorar los datos</p>
  <h2 style="font-size:clamp(1.4rem,3vw,2rem);font-weight:800;color:var(--text);margin-bottom:8px;line-height:1.3">\u00bfDesde d\u00f3nde lees esto?</h2>
  <p style="font-size:.95rem;color:var(--tm);margin-bottom:24px">Los mismos datos revelan cosas diferentes seg\u00fan tu posici\u00f3n. Elige y el dashboard organiza lo m\u00e1s relevante para ti primero.</p>
  <div style="display:flex;flex-wrap:wrap;gap:12px;justify-content:center">
    <button onclick="setPerspective('familia')" class="entry-btn">\ud83d\udc6a Soy padre o madre</button>
    <button onclick="setPerspective('docente')" class="entry-btn">\ud83d\udcda Soy docente o directivo</button>
    <button onclick="setPerspective('empresa')" class="entry-btn">\ud83d\udcbc Trabajo en una empresa</button>
    <button onclick="setPerspective('estudiante')" class="entry-btn">\ud83c\udf93 Soy estudiante</button>
  </div>
  <p style="font-size:11px;color:var(--td);margin-top:20px;cursor:pointer" onclick="setPerspective('all')">Ver todo sin filtro \u2192</p>
</div>

<!-- \u2550\u2550\u2550\u2550 EMPLEOS \u2550\u2550\u2550\u2550 -->
<div class="section active" id="empleos">
  <div class="sh rv">
    <h1>El mercado laboral se <span>reinventa en tiempo real</span></h1>
    <p>170 millones de nuevos empleos y 92 millones desplazados para 2030. No es el fin del trabajo \u2014 es una transformaci\u00f3n profunda de qu\u00e9 tipo de trabajo tiene valor. Filtra por tipo de rol para explorar.</p>
    <span class="src">\ud83d\udcc4 WEF Future of Jobs Report 2025 \u00b7 1.000+ empresas \u00b7 55 econom\u00edas</span>
  </div>

  <div class="g4 rv">
    <div class="card kpi"><div class="num a">170M</div><div class="kpi-bar ba"></div><div class="lbl">Nuevos empleos creados para 2030</div><div class="sub">WEF, 2025</div></div>
    <div class="card kpi"><div class="num r">92M</div><div class="kpi-bar br"></div><div class="lbl">Empleos desplazados para 2030</div><div class="sub">WEF, 2025</div></div>
    <div class="card kpi"><div class="num g">+78M</div><div class="kpi-bar bg"></div><div class="lbl">Balance neto de empleos nuevos</div><div class="sub">WEF, 2025</div></div>
    <div class="card kpi"><div class="num b">22%</div><div class="kpi-bar bb"></div><div class="lbl">De todos los empleos actuales disrumpidos</div><div class="sub">WEF, 2025</div></div>
  </div>

  <div class="card rv" style="margin-bottom:18px">
    <h3>Los empleos que m\u00e1s crecen son exactamente los que la IA no puede hacer.</h3>
    <div class="filters" id="job-filters">
      <span class="pill active" onclick="filterJobs('all',this)">Todos</span>
      <span class="pill" onclick="filterJobs('tech',this)">Tecnolog\u00eda</span>
      <span class="pill" onclick="filterJobs('care',this)">Cuidado humano</span>
      <span class="pill" onclick="filterJobs('green',this)">Transici\u00f3n verde</span>
      <span class="pill" onclick="filterJobs('creative',this)">Creatividad</span>
      <span class="pill" onclick="filterJobs('declining',this)">En declive</span>
    </div>
    <div class="cw" style="height:320px"><canvas id="chartJobs"></canvas></div>
    <p class="src-card">Fuente: WEF Future of Jobs Report 2025 \u2014 variaci\u00f3n % proyectada al 2030</p>
  </div>

  <div class="g2 rv">
    <div class="card">
      <h3>39% de las habilidades actuales ser\u00e1n obsoletas antes de 2030.</h3>
      <div class="pi"><div class="ph"><span class="pl">Habilidades que cambiar\u00e1n al 2030</span><span class="pv a">39%</span></div><div class="pt"><div class="pf" style="width:39%;background:linear-gradient(90deg,var(--amber-d),var(--amber))"></div></div></div>
      <div class="pi"><div class="ph"><span class="pl">Trabajadores que necesitar\u00e1n reskilling</span><span class="pv a">59%</span></div><div class="pt"><div class="pf" style="width:59%;background:linear-gradient(90deg,var(--amber-d),var(--amber))"></div></div></div>
      <div class="pi"><div class="ph"><span class="pl">Brecha de habilidades como barrera #1</span><span class="pv r">63%</span></div><div class="pt"><div class="pf" style="width:63%;background:linear-gradient(90deg,#8B2020,#E85D24)"></div></div></div>
      <div class="pi"><div class="ph"><span class="pl">Trabajadores sin acceso a reskilling</span><span class="pv r">11%</span></div><div class="pt"><div class="pf" style="width:11%;background:linear-gradient(90deg,#8B2020,#E85D24)"></div></div></div>
      <p class="src-card">Fuente: WEF Future of Jobs Report 2025</p>
    </div>
    <div class="card">
      <h3>La geograf\u00eda dej\u00f3 de ser un l\u00edmite. Lo que importa ahora es qu\u00e9 sabes hacer.</h3>
      <div class="hl"><div class="hn">90M</div><div class="hx">posiciones remotas proyectadas para 2030 \u2014 un estudiante en Talca compite y colabora con el mundo</div></div>
      <div class="pi"><div class="ph"><span class="pl">Crecimiento contrataci\u00f3n transfronteriza</span><span class="pv g">+38%/a\u00f1o</span></div><div class="pt"><div class="pf" style="width:60%;background:linear-gradient(90deg,var(--green),#5DCAA5)"></div></div></div>
      <div class="pi"><div class="ph"><span class="pl">Fuerza laboral remota de 18\u201330 a\u00f1os</span><span class="pv b">45%</span></div><div class="pt"><div class="pf" style="width:45%;background:linear-gradient(90deg,var(--blue),#7EC8E3)"></div></div></div>
      <div class="pi"><div class="ph"><span class="pl">Ofertas que ya no exigen t\u00edtulo universitario</span><span class="pv a">31%</span></div><div class="pt"><div class="pf" style="width:31%;background:linear-gradient(90deg,var(--amber-d),var(--amber))"></div></div></div>
      <p class="src-card">Fuente: WEF 2025 \u00b7 OIT 2025 \u00b7 Deel 2026 \u00b7 Lightcast 2023</p>
    </div>
  </div>

  <div style="border-left:3px solid var(--amber);padding:16px 20px;background:rgba(245,166,35,.06);border-radius:0 10px 10px 0;margin-top:24px">
    <p style="font-size:13px;color:var(--tm);line-height:1.6;margin-bottom:10px">Esta transformaci\u00f3n del mercado laboral es exactamente el contexto que el Colegio Camilo Henr\u00edquez pone sobre la mesa. No para alarmar \u2014 para preparar con tiempo.</p>
    <a href="modelo-educativo.html" style="font-size:13px;font-weight:700;color:var(--amber);text-decoration:none">Ver c\u00f3mo respondemos a este desaf\u00edo \u2192</a>
  </div>
</div>

<!-- \u2550\u2550\u2550\u2550 SECTORES \u2550\u2550\u2550\u2550 -->
<div class="section" id="sectores">
  <div class="sh rv">
    <h1>Cada industria enfrenta la misma pregunta: <span>\u00bfqu\u00e9 tareas hace mejor una m\u00e1quina y qu\u00e9 solo puede hacer un humano?</span></h1>
    <p>Cada industria enfrenta la disrupci\u00f3n de forma diferente. Selecciona el sector que m\u00e1s te interesa para ver qu\u00e9 empleos crecen, cu\u00e1les declinan y qu\u00e9 destrezas demanda.</p>
    <span class="src">\ud83d\udcc4 WEF 2025 \u00b7 McKinsey 2024 \u00b7 Challenger Report 2025 \u00b7 casos documentados</span>
  </div>

  <div class="sector-grid rv" id="sector-grid">
    <div class="sector-card selected" onclick="selectSector('salud',this)"><div class="si">\ud83c\udfe5</div><div class="sn">Salud</div><div class="sd">Crecimiento fuerte</div></div>
    <div class="sector-card" onclick="selectSector('educacion',this)"><div class="si">\ud83d\udcda</div><div class="sn">Educaci\u00f3n</div><div class="sd">Transformaci\u00f3n profunda</div></div>
    <div class="sector-card" onclick="selectSector('finanzas',this)"><div class="si">\ud83d\udcb3</div><div class="sn">Finanzas</div><div class="sd">Alta exposici\u00f3n IA</div></div>
    <div class="sector-card" onclick="selectSector('logistica',this)"><div class="si">\ud83d\ude9a</div><div class="sn">Log\u00edstica</div><div class="sd">Automatizaci\u00f3n masiva</div></div>
    <div class="sector-card" onclick="selectSector('tech',this)"><div class="si">\ud83d\udcbb</div><div class="sn">Tecnolog\u00eda</div><div class="sd">Explosi\u00f3n de demanda</div></div>
    <div class="sector-card" onclick="selectSector('energia',this)"><div class="si">\u26a1</div><div class="sn">Energ\u00eda verde</div><div class="sd">Roles emergentes</div></div>
    <div class="sector-card" onclick="selectSector('creativo',this)"><div class="si">\ud83c\udfa8</div><div class="sn">Industrias creativas</div><div class="sd">Redefinici\u00f3n por IA</div></div>
    <div class="sector-card" onclick="selectSector('legal',this)"><div class="si">\u2696\ufe0f</div><div class="sn">Legal</div><div class="sd">IA reemplaza tareas jr.</div></div>
  </div>

  <div id="sector-detail" class="rv">
    <div class="g2">
      <div class="card">
        <h3 id="sec-growing-title">Empleos en crecimiento \u2014 Salud</h3>
        <div class="cw" style="height:220px"><canvas id="chartSecGrow"></canvas></div>
        <p class="src-card" id="sec-src">Fuente: WEF Future of Jobs Report 2025</p>
      </div>
      <div class="card">
        <h3 id="sec-declining-title">Empleos en declive \u2014 Salud</h3>
        <div class="cw" style="height:220px"><canvas id="chartSecDecl"></canvas></div>
        <p class="src-card">Fuente: WEF 2025 \u00b7 McKinsey 2024</p>
      </div>
    </div>
    <div class="card rv">
      <h3 id="sec-skills-title">Destrezas m\u00e1s demandadas en este sector</h3>
      <div id="sec-skills-bars"></div>
      <p class="src-card">Fuente: WEF Future of Jobs Report 2025 \u00b7 LinkedIn Emerging Jobs 2025</p>
    </div>
  </div>

  <div style="border-left:3px solid var(--amber);padding:16px 20px;background:rgba(245,166,35,.06);border-radius:0 10px 10px 0;margin-top:24px">
    <p style="font-size:13px;color:var(--tm);line-height:1.6;margin-bottom:10px">Cada sector necesita personas que dominen lo que la IA no puede hacer. La pregunta es si la educaci\u00f3n que reciben hoy los prepara para eso.</p>
    <a href="modelo-educativo.html" style="font-size:13px;font-weight:700;color:var(--amber);text-decoration:none">Ver c\u00f3mo el Colegio Camilo Henr\u00edquez lo integra \u2192</a>
  </div>
</div>

<!-- \u2550\u2550\u2550\u2550 DESTREZAS \u2550\u2550\u2550\u2550 -->
<div class="section" id="destrezas">
  <div class="sh rv">
    <h1>10 marcos internacionales distintos. Una misma conclusi\u00f3n: <span>estas 5 destrezas no tienen reemplazo tecnol\u00f3gico.</span></h1>
    <p>10 marcos internacionales convergen en las mismas competencias. Filtra por marco o tipo de destreza para entender qu\u00e9 respaldo tiene cada una.</p>
    <span class="src">\ud83d\udcc4 OCDE 2030 \u00b7 WEF 2025 \u00b7 UNESCO \u00b7 Harvard PZ \u00b7 CASEL \u00b7 P21 \u00b7 MINEDUC</span>
  </div>

  <div class="card rv" style="margin-bottom:18px">
    <h3>Las destrezas m\u00e1s demandadas por empleadores globales al 2030 \u2014 y cu\u00e1ntos las priorizan.</h3>
    <div class="filters" id="skill-type-filters">
      <span class="pill active" onclick="filterSkills('all',this)">Todas</span>
      <span class="pill" onclick="filterSkills('cognitive',this)">Cognitivas</span>
      <span class="pill" onclick="filterSkills('social',this)">Socioemocionales</span>
      <span class="pill" onclick="filterSkills('adaptive',this)">Adaptativas</span>
      <span class="pill" onclick="filterSkills('creative',this)">Creativas</span>
    </div>
    <div class="cw" style="height:300px"><canvas id="chartSkills"></canvas></div>
    <p class="src-card">Fuente: WEF Future of Jobs Report 2025 \u2014 % empleadores globales que priorizan cada destreza</p>
  </div>

  <div class="g2 rv">
    <div class="card">
      <h3>OCDE, WEF, CASEL, Harvard PZ y P21 no se pusieron de acuerdo. Llegaron solos a las mismas conclusiones.</h3>
      <div class="filters" id="framework-filters">
        <span class="pill active-blue pill" onclick="filterFramework('all',this)" style="border-color:rgba(126,200,227,.4);color:#7EC8E3;background:rgba(46,109,164,.2)">Todos</span>
        <span class="pill" onclick="filterFramework('ocde',this)">OCDE</span>
        <span class="pill" onclick="filterFramework('wef',this)">WEF</span>
        <span class="pill" onclick="filterFramework('casel',this)">CASEL</span>
        <span class="pill" onclick="filterFramework('p21',this)">P21</span>
        <span class="pill" onclick="filterFramework('harvard',this)">Harvard PZ</span>
      </div>
      <div class="cw" style="height:260px"><canvas id="chartRadar"></canvas></div>
      <p class="src-card" id="radar-src">Mostrando convergencia de todos los marcos</p>
    </div>
    <div class="card">
      <h3>La IA ya hace muchas cosas mejor que los humanos. Lo que no puede hacer, nadie lo puede reemplazar.</h3>
      <div style="margin-top:6px">
        <div class="cr"><span class="cl">Tareas rutinarias y repetitivas</span><span class="ct can">IA lo hace</span></div>
        <div class="cr"><span class="cl">Procesamiento masivo de datos</span><span class="ct can">IA lo hace</span></div>
        <div class="cr"><span class="cl">Traducci\u00f3n y resumen de texto</span><span class="ct can">IA lo hace</span></div>
        <div class="cr"><span class="cl">Dise\u00f1o basado en plantillas</span><span class="ct can">IA lo hace</span></div>
        <div class="cr"><span class="cl">Juicio \u00e9tico en contextos complejos</span><span class="ct cannot">Humano</span></div>
        <div class="cr"><span class="cl">Creatividad genuinamente original</span><span class="ct cannot">Humano</span></div>
        <div class="cr"><span class="cl">Empat\u00eda y relaciones profundas</span><span class="ct cannot">Humano</span></div>
        <div class="cr"><span class="cl">Liderazgo adaptativo en incertidumbre</span><span class="ct cannot">Humano</span></div>
        <div class="cr"><span class="cl">Motivaci\u00f3n intr\u00ednseca y prop\u00f3sito</span><span class="ct cannot">Humano</span></div>
        <div class="cr"><span class="cl">Pensamiento sist\u00e9mico original</span><span class="ct cannot">Humano</span></div>
      </div>
    </div>
  </div>

  <div class="card rv">
    <h3>Impacto de desarrollar habilidades socioemocionales (SEL)</h3>
    <div class="g3" style="margin-bottom:0">
      <div class="kpi"><div class="num g" style="font-size:2rem">+11</div><div class="kpi-bar bg"></div><div class="lbl">Puntos percentiles de mejora en rendimiento acad\u00e9mico</div><div class="sub">Durlak et al., 270.000 estudiantes</div></div>
      <div class="kpi"><div class="num b" style="font-size:2rem">213</div><div class="kpi-bar bb"></div><div class="lbl">Programas SEL analizados en el meta-an\u00e1lisis</div><div class="sub">Child Development 82(1), 2011</div></div>
      <div class="kpi"><div class="num a" style="font-size:2rem">10/10</div><div class="kpi-bar ba"></div><div class="lbl">Marcos internacionales que incluyen habilidades SEL como esenciales</div><div class="sub">OCDE \u00b7 WEF \u00b7 UNESCO \u00b7 CASEL y otros</div></div>
    </div>
  </div>

  <div style="border-left:3px solid var(--amber);padding:16px 20px;background:rgba(245,166,35,.06);border-radius:0 10px 10px 0;margin-top:24px">
    <p style="font-size:13px;color:var(--tm);line-height:1.6;margin-bottom:10px">Estas destrezas no se desarrollan con una clase extra. Se cultivan en un modelo educativo dise\u00f1ado alrededor de ellas.</p>
    <a href="modelo-educativo.html" style="font-size:13px;font-weight:700;color:var(--amber);text-decoration:none">Conocer el modelo del Colegio Camilo Henr\u00edquez \u2192</a>
  </div>
</div>

<!-- \u2550\u2550\u2550\u2550 OPORTUNIDADES \u2550\u2550\u2550\u2550 -->
<div class="section" id="oportunidades">
  <div class="sh rv">
    <h1>Ya no existe ning\u00fan rinc\u00f3n del planeta <span>al que no puedas llegar</span> con tus ideas.</h1>
    <p>La tecnolog\u00eda derrib\u00f3 las barreras de distancia, idioma, acceso y procesamiento. Lo que queda es lo \u00fanico que siempre fue tuyo: la capacidad de pensar, crear y decidir qu\u00e9 mundo quieres construir.</p>
    <span class="src">WEF 2025 \u00b7 OIT 2025 \u00b7 Deel 2026 \u00b7 Lightcast 2023</span>
  </div>
  <div class="g4 rv">
    <div class="card kpi"><div class="num g">90M</div><div class="kpi-bar bg"></div><div class="lbl">Posiciones remotas disponibles para 2030</div><div class="sub">WEF, 2025</div></div>
    <div class="card kpi"><div class="num b">45%</div><div class="kpi-bar bb"></div><div class="lbl">De la fuerza laboral remota tiene entre 18 y 30 a\u00f1os</div><div class="sub">Deel, 2026</div></div>
    <div class="card kpi"><div class="num a">31%</div><div class="kpi-bar ba"></div><div class="lbl">De las ofertas laborales ya no exigen t\u00edtulo universitario</div><div class="sub">Lightcast, 2023</div></div>
    <div class="card kpi"><div class="num g">+38%</div><div class="kpi-bar bg"></div><div class="lbl">Crecimiento anual de contrataci\u00f3n transfronteriza</div><div class="sub">OIT, 2025</div></div>
  </div>
  <div class="card rv" style="margin-bottom:18px">
    <h3>Lo que la tecnolog\u00eda elimin\u00f3 para siempre</h3>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:8px">
      <div class="cr"><span class="cl">\ud83c\udf0d Distancia geogr\u00e1fica</span><span class="ct cannot">Derribada</span></div>
      <div class="cr"><span class="cl">\ud83d\udde3\ufe0f Barrera del idioma</span><span class="ct cannot">Derribada</span></div>
      <div class="cr"><span class="cl">\ud83d\udcda Acceso al conocimiento</span><span class="ct cannot">Derribada</span></div>
      <div class="cr"><span class="cl">\u26a1 Capacidad de procesamiento</span><span class="ct cannot">Derribada</span></div>
      <div class="cr"><span class="cl">\ud83d\udd2c Laboratorio para experimentar</span><span class="ct cannot">Derribada</span></div>
      <div class="cr"><span class="cl">\ud83d\udcb0 Capital inicial para publicar</span><span class="ct cannot">Derribada</span></div>
      <div class="cr"><span class="cl">\ud83e\udde0 Pensamiento cr\u00edtico y criterio</span><span class="ct can">A\u00fan tuya</span></div>
      <div class="cr"><span class="cl">\u2764\ufe0f Creatividad y prop\u00f3sito</span><span class="ct can">A\u00fan tuya</span></div>
    </div>
    <p class="src-card">Fuente: WEF 2025 \u00b7 an\u00e1lisis basado en tendencias documentadas</p>
  </div>
  <div class="card rv" style="margin-bottom:18px">
    <h3>Los empleos que m\u00e1s crecen requieren exactamente lo que est\u00e1s aprendiendo a desarrollar</h3>
    <div class="cw" style="height:280px"><canvas id="chartOpportunity"></canvas></div>
    <p class="src-card">Fuente: WEF Future of Jobs Report 2025</p>
  </div>
  <div class="g3 rv">
    <div class="card"><div style="font-size:22px;margin-bottom:10px">\ud83c\udf10</div><h3 style="font-size:14px;color:var(--text);text-transform:none;letter-spacing:0;margin-bottom:8px;font-weight:700">Colaborar sin fronteras</h3><p style="font-size:14px;color:var(--tm);line-height:1.6">Puedes trabajar con equipos en cualquier pa\u00eds sin salir de tu ciudad. La geograf\u00eda dej\u00f3 de definir con qui\u00e9n puedes crear.</p></div>
    <div class="card"><div style="font-size:22px;margin-bottom:10px">\ud83d\ude80</div><h3 style="font-size:14px;color:var(--text);text-transform:none;letter-spacing:0;margin-bottom:8px;font-weight:700">Publicar con alcance global</h3><p style="font-size:14px;color:var(--tm);line-height:1.6">Investigaci\u00f3n, arte, c\u00f3digo, ideas. Desde tu computador puedes llegar a quien necesita lo que t\u00fa puedes crear.</p></div>
    <div class="card"><div style="font-size:22px;margin-bottom:10px">\ud83d\udd27</div><h3 style="font-size:14px;color:var(--text);text-transform:none;letter-spacing:0;margin-bottom:8px;font-weight:700">Resolver problemas reales</h3><p style="font-size:14px;color:var(--tm);line-height:1.6">Puedes construir una soluci\u00f3n para un problema real y llevarla a quien la necesita \u2014 sin necesitar permiso ni capital inicial.</p></div>
  </div>
  <div style="text-align:center;padding:32px 20px;margin:8px 0 18px"><p style="font-size:clamp(1.2rem,3vw,1.8rem);font-weight:800;color:var(--amber);line-height:1.3;max-width:680px;margin:0 auto">"Crear un mundo mejor es una labor que ya no puede esperar."</p></div>
  <div style="border-left:3px solid var(--amber);padding:16px 20px;background:rgba(245,166,35,.06);border-radius:0 10px 10px 0;margin-bottom:18px"><p style="font-size:14px;color:var(--tm);line-height:1.6;margin-bottom:10px">Estas oportunidades existen hoy. La pregunta es si tienes las destrezas para aprovecharlas. Eso es exactamente lo que este colegio pone en el centro.</p><a href="estudiantes.html" style="font-size:14px;font-weight:700;color:var(--amber);text-decoration:none">Ver qu\u00e9 est\u00e1s desarrollando aqu\u00ed \u2192</a></div>
</div>

<!-- \u2550\u2550\u2550\u2550 CHILE \u2550\u2550\u2550\u2550 -->
<div class="section" id="chile">
  <div class="sh rv">
    <h1>Chile lidera Latinoam\u00e9rica en PISA. Y tiene el mayor porcentaje de empleos repetitivos de toda la OCDE. <span>Las dos cosas son verdad.</span></h1>
    <p>Chile lidera Latinoam\u00e9rica en PISA pero tiene el mayor porcentaje de empleos repetitivos de toda la OCDE. Selecciona los pa\u00edses con los que quieres comparar.</p>
    <span class="src">\ud83d\udcc4 INE 2024 \u00b7 OCDE/PIAAC 2023 \u00b7 CENIA-SOFOFA 2024 \u00b7 PISA 2022 \u00b7 Ipsos 2024</span>
  </div>

  <div class="card rv" style="margin-bottom:18px">
    <h3>\u00bfEn qu\u00e9 mundo va a empezar a trabajar tu hijo?</h3>
    <div class="slider-row">
      <label>A\u00f1o de nacimiento</label>
      <input type="range" min="2010" max="2022" value="2015" id="birthSlider" step="1" oninput="updateChildSim()">
      <span class="val" id="birthVal">2015</span>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:14px;margin-top:16px">
      <div style="background:rgba(13,31,60,.7);border:1px solid var(--border);border-radius:10px;padding:16px;text-align:center">
        <div id="sim-grad-year" style="font-size:1.8rem;font-weight:900;color:var(--amber)">2033</div>
        <div style="font-size:11px;color:var(--tm);margin-top:4px">A\u00f1o estimado de egreso</div>
      </div>
      <div style="background:rgba(13,31,60,.7);border:1px solid var(--border);border-radius:10px;padding:16px;text-align:center">
        <div id="sim-jobs-pct" style="font-size:1.8rem;font-weight:900;color:#E85D24">~40%</div>
        <div style="font-size:11px;color:var(--tm);margin-top:4px">Empleos habr\u00e1n cambiado para entonces</div>
      </div>
      <div style="background:rgba(13,31,60,.7);border:1px solid var(--border);border-radius:10px;padding:16px;text-align:center">
        <div id="sim-top-skill" style="font-size:1rem;font-weight:800;color:#5DCAA5;line-height:1.3">Pensamiento anal\u00edtico</div>
        <div style="font-size:11px;color:var(--tm);margin-top:4px">Destreza #1 m\u00e1s demandada (WEF)</div>
      </div>
    </div>
    <p style="font-size:11px;color:var(--td);margin-top:12px;font-style:italic">Proyecci\u00f3n basada en WEF Future of Jobs Report 2025.</p>
  </div>

  <div class="g2 rv">
    <div class="card">
      <h3>Selecciona pa\u00edses para comparar</h3>
      <div id="country-list">
        <div class="country-row"><input type="checkbox" class="country-check" checked disabled><span class="country-name">\ud83c\udde8\ud83c\uddf1 Chile</span><span class="country-val a">55% repetitivo</span></div>
        <div class="country-row"><input type="checkbox" class="country-check" id="c-latam" checked onchange="updateCountryChart()"><span class="country-name">\ud83c\udf0e Prom. Latinoam\u00e9rica</span><span class="country-val" style="color:var(--tm)">~42%</span></div>
        <div class="country-row"><input type="checkbox" class="country-check" id="c-ocde" checked onchange="updateCountryChart()"><span class="country-name">\ud83c\udf10 Prom. OCDE</span><span class="country-val" style="color:var(--tm)">35%</span></div>
        <div class="country-row"><input type="checkbox" class="country-check" id="c-fin" onchange="updateCountryChart()"><span class="country-name">\ud83c\uddeb\ud83c\uddee Finlandia</span><span class="country-val g">28%</span></div>
        <div class="country-row"><input type="checkbox" class="country-check" id="c-kor" onchange="updateCountryChart()"><span class="country-name">\ud83c\uddf0\ud83c\uddf7 Corea del Sur</span><span class="country-val b">31%</span></div>
        <div class="country-row"><input type="checkbox" class="country-check" id="c-bra" onchange="updateCountryChart()"><span class="country-name">\ud83c\udde7\ud83c\uddf7 Brasil</span><span class="country-val" style="color:var(--tm)">48%</span></div>
        <div class="country-row"><input type="checkbox" class="country-check" id="c-mex" onchange="updateCountryChart()"><span class="country-name">\ud83c\uddf2\ud83c\uddfd M\u00e9xico</span><span class="country-val" style="color:var(--tm)">46%</span></div>
        <div class="country-row"><input type="checkbox" class="country-check" id="c-col" onchange="updateCountryChart()"><span class="country-name">\ud83c\udde8\ud83c\uddf4 Colombia</span><span class="country-val" style="color:var(--tm)">44%</span></div>
        <div class="country-row"><input type="checkbox" class="country-check" id="c-usa" onchange="updateCountryChart()"><span class="country-name">\ud83c\uddfa\ud83c\uddf8 EE.UU.</span><span class="country-val g">30%</span></div>
        <div class="country-row"><input type="checkbox" class="country-check" id="c-deu" onchange="updateCountryChart()"><span class="country-name">\ud83c\udde9\ud83c\uddea Alemania</span><span class="country-val b">33%</span></div>
      </div>
    </div>
    <div class="card">
      <h3>% empleos en tareas repetitivas \u2014 comparaci\u00f3n</h3>
      <div class="cw" style="height:300px"><canvas id="chartCountry"></canvas></div>
      <p class="src-card">Fuente: OCDE/PIAAC 2023 \u00b7 Estimaciones regionales BID 2023</p>
    </div>
  </div>

  <div class="g2 rv">
    <div class="card">
      <h3>Elige el indicador a comparar</h3>
      <div class="filters" style="margin-bottom:14px" id="indicator-filters">
        <span class="pill active" onclick="switchIndicator('repetitivo',this)">Empleos repetitivos</span>
        <span class="pill" onclick="switchIndicator('juvenil',this)">Desempleo juvenil</span>
        <span class="pill" onclick="switchIndicator('pisa_mat',this)">PISA Matem\u00e1ticas</span>
        <span class="pill" onclick="switchIndicator('pisa_lect',this)">PISA Lectura</span>
      </div>
      <div class="cw" style="height:220px"><canvas id="chartIndicator"></canvas></div>
      <p class="src-card" id="indicator-src">Fuente: OCDE/PIAAC 2023</p>
    </div>
    <div class="card">
      <h3>4 de cada 5 chilenos saben que la IA facilita las fake news. Solo 1 de 4 puede detectarlas.</h3>
      <div class="pi" style="margin-top:8px"><div class="ph"><span class="pl">Creen que IA facilita fake news</span><span class="pv r">81%</span></div><div class="pt"><div class="pf" style="width:81%;background:linear-gradient(90deg,#8B2020,#E85D24)"></div></div></div>
      <div class="pi"><div class="ph"><span class="pl">Pueden detectar contenido IA</span><span class="pv g">25.5%</span></div><div class="pt"><div class="pf" style="width:25.5%;background:linear-gradient(90deg,var(--green),#5DCAA5)"></div></div></div>
      <div class="pi"><div class="ph"><span class="pl">Se exponen a info falsa a diario</span><span class="pv a">52%</span></div><div class="pt"><div class="pf" style="width:52%;background:linear-gradient(90deg,var(--amber-d),var(--amber))"></div></div></div>
      <div class="pi"><div class="ph"><span class="pl">Confianza en noticias (Chile)</span><span class="pv b">36%</span></div><div class="pt"><div class="pf" style="width:36%;background:linear-gradient(90deg,var(--blue),#7EC8E3)"></div></div></div>
      <p class="src-card">Fuente: Ipsos 2024 \u00b7 Reuters/Oxford Digital News 2025 \u00b7 Statista 2024</p>
    </div>
  </div>

  <div style="border-left:3px solid var(--amber);padding:16px 20px;background:rgba(245,166,35,.06);border-radius:0 10px 10px 0;margin-top:24px">
    <p style="font-size:13px;color:var(--tm);line-height:1.6;margin-bottom:10px">55% de empleos repetitivos y solo 1 de 4 puede detectar desinformaci\u00f3n. Estos datos definen la urgencia de actuar desde la educaci\u00f3n.</p>
    <a href="modelo-educativo.html" style="font-size:13px;font-weight:700;color:var(--amber);text-decoration:none">Ver la propuesta educativa del Colegio Camilo Henr\u00edquez \u2192</a>
  </div>
</div>

<!-- \u2550\u2550\u2550\u2550 ECONOM\u00cdA DIGITAL \u2550\u2550\u2550\u2550 -->
<div class="section" id="digital">
  <div class="sh rv">
    <h1>Distancia, idioma, capital inicial. <span>Las barreras que antes defin\u00edan qui\u00e9n pod\u00eda participar ya no existen igual.</span></h1>
    <p>Distancia, idioma, capital inicial, tama\u00f1o del equipo. Las reglas que antes limitaban qui\u00e9n pod\u00eda participar en la econom\u00eda global ya no aplican igual. Explora qu\u00e9 tan lejos lleg\u00f3 ese cambio.</p>
    <span class="src">\ud83d\udcc4 WEF 2025 \u00b7 Chainalysis 2024 \u00b7 MBO Partners 2025 \u00b7 Statista 2025 \u00b7 Deel 2026</span>
  </div>

  <div class="g4 rv">
    <div class="card kpi"><div class="num a">560M</div><div class="kpi-bar ba"></div><div class="lbl">Usuarios globales de criptomonedas</div><div class="sub">Chainalysis / Triple-A, 2024</div></div>
    <div class="card kpi"><div class="num b">$24T</div><div class="kpi-bar bb"></div><div class="lbl">Mercado global de pagos digitales</div><div class="sub">Statista, 2025</div></div>
    <div class="card kpi"><div class="num g">40-60M</div><div class="kpi-bar bg"></div><div class="lbl">N\u00f3madas digitales en el mundo</div><div class="sub">MBO Partners, 2025</div></div>
    <div class="card kpi"><div class="num p">55-73</div><div class="kpi-bar bp"></div><div class="lbl">Pa\u00edses con visa para n\u00f3madas digitales</div><div class="sub">MBO Partners, 2025</div></div>
  </div>

  <div class="card rv" style="margin-bottom:18px">
    <h3>Empresas de alto impacto \u2014 el efecto multiplicador con IA</h3>
    <div class="cw" style="height:260px"><canvas id="chartImpact"></canvas></div>
    <p class="src-card">Fuente: The Information 2024 \u00b7 Wired 2014 \u00b7 Meta SEC Filings \u00b7 SAM.gov \u00b7 Solopreneurs.ai \u2014 ingresos o valuaci\u00f3n en USD millones, empleados al momento de la m\u00e9trica</p>
  </div>

  <div class="g2 rv">
    <div class="card">
      <h3>Lo que la tecnolog\u00eda elimin\u00f3 \u2014 y lo que todav\u00eda depende de ti.</h3>
      <div style="margin-top:8px">
        <div class="cr"><span class="cl">\ud83c\udf0d Distancia geogr\u00e1fica</span><span class="ct cannot">Derribada</span></div>
        <div class="cr"><span class="cl">\ud83d\udde3\ufe0f Idioma (traducci\u00f3n en tiempo real)</span><span class="ct cannot">Derribada</span></div>
        <div class="cr"><span class="cl">\ud83d\udcda Acceso al conocimiento</span><span class="ct cannot">Derribada</span></div>
        <div class="cr"><span class="cl">\u26a1 Capacidad de procesamiento</span><span class="ct cannot">Derribada</span></div>
        <div class="cr"><span class="cl">\ud83d\udd2c Laboratorio para experimentar</span><span class="ct cannot">Derribada</span></div>
        <div class="cr"><span class="cl">\ud83d\udcb0 Capital inicial para publicar</span><span class="ct cannot">Derribada</span></div>
        <div class="cr"><span class="cl">\ud83e\udde0 Pensamiento cr\u00edtico y criterio propio</span><span class="ct can">A\u00fan tuya</span></div>
        <div class="cr"><span class="cl">\u2764\ufe0f Empat\u00eda y prop\u00f3sito</span><span class="ct can">A\u00fan tuya</span></div>
      </div>
    </div>
    <div class="card">
      <h3>Conectividad satelital \u2014 Starlink a marzo 2026</h3>
      <div class="hl" style="margin-bottom:14px"><div class="hn">10M</div><div class="hx">suscriptores en 125+ pa\u00edses \u2014 millones de personas que antes no ten\u00edan internet de calidad ahora participan en la econom\u00eda digital global</div></div>
      <div class="pi"><div class="ph"><span class="pl">Sat\u00e9lites en \u00f3rbita baja</span><span class="pv b">9.422</span></div><div class="pt"><div class="pf" style="width:80%;background:linear-gradient(90deg,var(--blue),#7EC8E3)"></div></div></div>
      <div class="pi"><div class="ph"><span class="pl">Nuevos mercados lanzados en 2025</span><span class="pv g">26</span></div><div class="pt"><div class="pf" style="width:40%;background:linear-gradient(90deg,var(--green),#5DCAA5)"></div></div></div>
      <div class="pi"><div class="ph"><span class="pl">Crecimiento de suscriptores 2024\u21922026</span><span class="pv a">+150%</span></div><div class="pt"><div class="pf" style="width:75%;background:linear-gradient(90deg,var(--amber-d),var(--amber))"></div></div></div>
      <p class="src-card">Fuente: SpaceLaunchIndex 2026 \u00b7 SpaceX \u00b7 SUBTEL Chile 2024</p>
    </div>
  </div>

  <div style="border-left:3px solid var(--amber);padding:16px 20px;background:rgba(245,166,35,.06);border-radius:0 10px 10px 0;margin-top:24px">
    <p style="font-size:13px;color:var(--tm);line-height:1.6;margin-bottom:10px">El acceso se democratiz\u00f3. Lo que falta ahora es preparar a las personas para aprovecharlo con criterio propio.</p>
    <a href="modelo-educativo.html" style="font-size:13px;font-weight:700;color:var(--amber);text-decoration:none">Ver c\u00f3mo preparamos estudiantes para este mundo \u2192</a>
  </div>
</div>

<!-- \u2550\u2550\u2550\u2550 DESINFORMACI\u00d3N \u2550\u2550\u2550\u2550 -->
<div class="section" id="desinformacion">
  <div class="sh rv">
    <h1>El riesgo global #1 en 2024 no fue el cambio clim\u00e1tico ni las guerras. <span>Fue la desinformaci\u00f3n.</span></h1>
    <p>Los deepfakes crecen 900% anual. La buena noticia: el pensamiento cr\u00edtico se puede ense\u00f1ar, y tiene un efecto medible. Explora la evidencia.</p>
    <span class="src">\ud83d\udcc4 WEF Global Risks 2024 \u00b7 Sumsub 2024 \u00b7 Europol \u00b7 Amazeen et al. 2024</span>
  </div>

  <div class="g4 rv">
    <div class="card kpi"><div class="num r">900%</div><div class="kpi-bar br"></div><div class="lbl">Crecimiento anual de deepfakes</div><div class="sub">WEF / Sumsub, 2024</div></div>
    <div class="card kpi"><div class="num a">#1</div><div class="kpi-bar ba"></div><div class="lbl">Riesgo global 2024 \u2014 desinformaci\u00f3n</div><div class="sub">WEF Global Risks 2024</div></div>
    <div class="card kpi"><div class="num p">90%</div><div class="kpi-bar bp"></div><div class="lbl">Contenido online podr\u00eda ser IA en 2026</div><div class="sub">Europol, 2022</div></div>
    <div class="card kpi"><div class="num b">0.60</div><div class="kpi-bar bb"></div><div class="lbl">Efecto de la alfabetizaci\u00f3n medi\u00e1tica para detectar fake news</div><div class="sub">Amazeen et al., 81.155 personas</div></div>
  </div>

  <div class="g2 rv">
    <div class="card">
      <h3>El pensamiento cr\u00edtico se puede ense\u00f1ar. Y tiene un efecto medible sobre cu\u00e1nto te afecta la desinformaci\u00f3n.</h3>
      <div class="slider-row"><label>Exposici\u00f3n diaria a informaci\u00f3n</label><input type="range" min="1" max="10" value="5" id="exposureSlider" oninput="updateDisinfoSim()"><span class="val" id="expVal">5</span></div>
      <div class="slider-row"><label>Nivel de alfabetizaci\u00f3n medi\u00e1tica</label><input type="range" min="1" max="10" value="3" id="literacySlider" oninput="updateDisinfoSim()"><span class="val" id="litVal">3</span></div>
      <div style="margin-top:16px;padding:16px;background:rgba(13,31,60,.6);border-radius:10px;border:1px solid var(--border)">
        <div style="font-size:11px;color:var(--td);margin-bottom:8px;text-transform:uppercase;letter-spacing:.06em">Riesgo de decisiones basadas en informaci\u00f3n falsa</div>
        <div id="risk-bar" style="height:8px;border-radius:4px;background:linear-gradient(90deg,#8B2020,#E85D24);width:60%;transition:width .5s"></div>
        <div id="risk-label" style="font-size:1.4rem;font-weight:800;color:#E85D24;margin-top:8px">Alto</div>
        <div id="risk-desc" style="font-size:12px;color:var(--tm);margin-top:4px;line-height:1.5">Alta exposici\u00f3n con baja capacidad de filtro: decisiones de salud, financieras y pol\u00edticas basadas en informaci\u00f3n no verificada.</div>
      </div>
      <p class="src-card">Simulaci\u00f3n basada en Amazeen et al. 2024 \u00b7 WEF 2024 \u2014 efectos relativos aproximados</p>
    </div>
    <div class="card">
      <h3>\u00c1mbitos de vida afectados por la desinformaci\u00f3n</h3>
      <div class="cw" style="height:260px"><canvas id="chartDisinfo"></canvas></div>
      <p class="src-card">Fuente: WEF Global Risks 2024 \u00b7 An\u00e1lisis basado en casos documentados</p>
    </div>
  </div>

  <div class="card rv">
    <h3>Casos documentados de da\u00f1o real por deepfakes</h3>
    <div class="tl"><div class="td2" style="background:#E85D24;box-shadow:0 0 10px rgba(232,93,36,.5)"></div><div class="tc"><div class="tll">Arup, Hong Kong \u00b7 CNN 2024</div><div class="tln">USD $25M</div><div class="tlt">Empleado transfiri\u00f3 fondos tras videollamada con deepfakes de ejecutivos de la empresa.</div></div></div>
    <div class="tl"><div class="td2" style="background:var(--amber)"></div><div class="tc"><div class="tll">Eslovaquia, elecciones 2023</div><div class="tln">Elecci\u00f3n alterada</div><div class="tlt">Audio deepfake de candidato difundido 48h antes del cierre. Sin tiempo para verificar.</div></div></div>
    <div class="tl"><div class="td2" style="background:#C4A8F0"></div><div class="tc"><div class="tll">India, m\u00faltiples elecciones 2024</div><div class="tln">Candidatos "resucitados"</div><div class="tlt">Videos generados por IA de pol\u00edticos fallecidos para capturar votos en campa\u00f1as activas.</div></div></div>
    <div class="tl" style="margin-bottom:0"><div class="td2" style="background:#5DCAA5"></div><div class="tc"><div class="tll">Meta-an\u00e1lisis \u00b7 Amazeen et al. 2024 \u00b7 49 estudios \u00b7 81.155 participantes</div><div class="tln">Efecto 0.60</div><div class="tlt">Las intervenciones de alfabetizaci\u00f3n medi\u00e1tica tienen efecto significativo y medible para detectar informaci\u00f3n falsa. El pensamiento cr\u00edtico se ense\u00f1a.</div></div></div>
  </div>

  <div style="border-left:3px solid var(--amber);padding:16px 20px;background:rgba(245,166,35,.06);border-radius:0 10px 10px 0;margin-top:24px">
    <p style="font-size:13px;color:var(--tm);line-height:1.6;margin-bottom:10px">La desinformaci\u00f3n no se combate con prohibiciones. Se combate con pensamiento cr\u00edtico entrenado desde la educaci\u00f3n.</p>
    <a href="modelo-educativo.html" style="font-size:13px;font-weight:700;color:var(--amber);text-decoration:none">Ver c\u00f3mo el Colegio Camilo Henr\u00edquez integra esto en su modelo \u2192</a>
  </div>
</div>
`;

/* ══════════════════════════════════════════════════════════════════
   INJECT HTML on DOMContentLoaded
   ══════════════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', function () {
  var dash = document.getElementById('dashboard');
  if (!dash) return;

  // Keep the r-section-header that is already in the page
  var header = dash.querySelector('.r-section-header');
  var headerHTML = header ? header.outerHTML : '';

  // Replace contents: header + dashboard body
  dash.innerHTML = headerHTML + dashHTML;

  // Make all .rv elements visible immediately (no scroll animation needed)
  dash.querySelectorAll('.rv').forEach(function (el) {
    el.classList.add('vis');
  });

  // ── Init charts after HTML is in the DOM ──
  initDashboardCharts();
});

/* ══════════════════════════════════════════════════════════════════
   CHART.JS — colours & shared options
   ══════════════════════════════════════════════════════════════════ */
var C = {
  amber:'#F5A623', amberD:'#C86400',
  green:'#5DCAA5', greenD:'#1F6B3B',
  blue:'#7EC8E3',  blueD:'#2E6DA4',
  red:'#E85D24',   redD:'#8B2020',
  purple:'#C4A8F0',purpleD:'#4A235A',
  tm:'rgba(232,237,245,.6)',
  td:'rgba(232,237,245,.28)',
  border:'rgba(46,109,164,.15)'
};

var baseOpts = {
  responsive:true,
  maintainAspectRatio:false,
  plugins:{
    legend:{display:false},
    tooltip:{backgroundColor:'rgba(13,31,60,.95)',borderColor:'rgba(46,109,164,.3)',borderWidth:1,titleColor:'#E8EDF5',bodyColor:C.tm,padding:10}
  }
};

var scalesXY = {
  x:{ticks:{color:C.tm,font:{size:13}},grid:{color:C.border}},
  y:{ticks:{color:C.tm,font:{size:13}},grid:{color:C.border}}
};

var scalesYX = {
  y:{ticks:{color:C.tm,font:{size:12}},grid:{color:C.border}},
  x:{ticks:{color:C.tm,font:{size:13}},grid:{color:C.border}}
};

/* ══════════════════════════════════════════════════════════════════
   DATA OBJECTS
   ══════════════════════════════════════════════════════════════════ */
var jobData = {
  all:{
    labels:['Esp. IA y Big Data','Ing. Fintech','Dev. Software','Esp. Ciberseguridad','Enfermería','Ing. Energía Verde','Trabajo Social','UX/Diseño IA','Gestión Talentos','Ed. Secundaria','Cajeros','Asist. Admin.','Digitadores','Emp. Postales','Diseño gráfico (IA)'],
    values:[30,25,22,19,18,17,15,14,13,12,-26,-22,-18,-15,-14],
    colors:['#5DCAA5','#5DCAA5','#5DCAA5','#7EC8E3','#5DCAA5','#5DCAA5','#5DCAA5','#C4A8F0','#7EC8E3','#5DCAA5','#E85D24','#E85D24','#E85D24','#E85D24','#E85D24']
  },
  tech:{
    labels:['Esp. IA y Big Data','Ing. Fintech','Dev. Software','Esp. Ciberseguridad','UX/Diseño IA','Analistas datos'],
    values:[30,25,22,19,14,16],
    colors:Array(6).fill('#5DCAA5')
  },
  care:{
    labels:['Enfermería prof.','Trabajo Social','Educación secundaria','Consejería prof.','Terapia ocupacional'],
    values:[18,15,12,11,10],
    colors:Array(5).fill('#7EC8E3')
  },
  green:{
    labels:['Ing. Energía renovable','Esp. vehículos eléctricos','Ing. Medioambiental','Gestores sostenibilidad','Técnicos energía solar'],
    values:[17,15,14,13,11],
    colors:Array(5).fill('#5DCAA5')
  },
  creative:{
    labels:['UX/Diseño IA','Contenidos digitales','Gestión cultural','Comunicación estratégica'],
    values:[14,10,8,9],
    colors:Array(4).fill('#C4A8F0')
  },
  declining:{
    labels:['Cajeros y tick.','Asistentes admin.','Digitadores datos','Empleados postales','Diseño gráfico (IA)','Operadores call center','Analistas contables jr.'],
    values:[-26,-22,-18,-15,-14,-11,-12],
    colors:Array(7).fill('#E85D24')
  }
};

var sectorData = {
  salud:{grow:['Enfermería','Trabajo Social','Esp. salud digital','Terapia ocupacional','Gestión clínica'],gv:[28,22,20,18,15],decl:['Técnicos admisión','Facturación médica','Digitación registros'],dv:[-18,-15,-12],skills:['Empatía clínica',85,'Pensamiento crítico',80,'Manejo tecnología salud',75,'Trabajo en equipo',88,'Comunicación asertiva',82]},
  educacion:{grow:['Docentes innovadores','Diseñadores curriculares','Esp. ed. digital','Mentores vocacionales','Facilitadores SEL'],gv:[20,16,18,14,15],decl:['Docentes transmisores','Admin. escolar básica'],dv:[-12,-8],skills:['Pensamiento pedagógico',90,'Habilidades digitales',78,'Empatía',92,'Creatividad curricular',80,'Evaluación formativa',85]},
  finanzas:{grow:['Analistas IA-finanzas','Esp. ciberseguridad fin.','Esp. fintech','Asesores estratégicos','Compliance digital'],gv:[24,20,22,16,14],decl:['Cajeros banco','Analistas jr. rutinarios','Auditores básicos','Asistentes contables'],dv:[-30,-25,-20,-18],skills:['Análisis crítico datos',88,'Juicio ético',82,'Comunicación ejecutiva',75,'Adaptabilidad',80,'Comprensión tecnológica',78]},
  logistica:{grow:['Esp. automatización','Planificadores cadena suministro','Analistas datos logística','Gestores última milla'],gv:[20,16,18,14],decl:['Conductores rutinarios','Almacenistas básicos','Digitadores pedidos','Asist. coord. básica'],dv:[-20,-18,-22,-14],skills:['Pensamiento sistémico',85,'Adaptabilidad',88,'Gestión tecnológica',78,'Resolución problemas',82,'Colaboración',75]},
  tech:{grow:['Ing. IA/ML','Esp. ciberseguridad','Arquitectos cloud','Desarrolladores full-stack','Esp. ética digital'],gv:[34,28,24,22,18],decl:['Dev. tareas repetitivas','QA manual básico','Soporte técnico nivel 1'],dv:[-15,-12,-18],skills:['Pensamiento analítico',92,'Creatividad técnica',85,'Aprendizaje continuo',90,'Colaboración',80,'Ética tecnológica',75]},
  energia:{grow:['Ing. energía solar','Esp. almacenamiento','Técnicos eólicos','Gestores transición energética','Analistas sostenibilidad'],gv:[28,22,20,18,16],decl:['Técnicos combustibles fósiles','Operadores plantas convencionales'],dv:[-20,-16],skills:['Pensamiento sistémico',88,'Conocimiento técnico',82,'Adaptabilidad',85,'Sostenibilidad',90,'Colaboración multidisciplinar',78]},
  creativo:{grow:['Directores creativos IA','Narradores digitales','Esp. experiencia usuario','Gestores comunidad','Estrategas de contenido'],gv:[18,16,20,14,15],decl:['Diseñadores gráficos básicos','Fotógrafos estudio','Traductores literales'],dv:[-22,-15,-25],skills:['Creatividad genuina',95,'Pensamiento crítico',88,'Empatía cultural',85,'Adaptabilidad',82,'Comunicación',90]},
  legal:{grow:['Abogados estratégicos','Esp. derecho digital','Mediadores','Analistas legal-IA','Consultores ética IA'],gv:[16,20,14,18,16],decl:['Asociados tareas rutinarias','Revisores documentos básicos','Paralegal básico'],dv:[-30,-25,-18],skills:['Juicio ético',95,'Razonamiento complejo',92,'Comunicación persuasiva',88,'Adaptabilidad',80,'Empatía',78]}
};

var skillData = {
  all:{labels:['Pensamiento analítico','Resiliencia/flexibilidad','Pensamiento creativo','Liderazgo','Motivación/autoconciencia','Alfab. tecnológica','Empatía','Curiosidad/ap. continuo','Orientación servicio','Gestión talento'],values:[72,69,65,63,61,60,58,57,52,50],types:['cognitive','adaptive','creative','social','social','adaptive','social','adaptive','social','social']},
  cognitive:{labels:['Pensamiento analítico','Pensamiento creativo','Curiosidad/ap. continuo','Razonamiento complejo','Metacognición'],values:[72,65,57,55,50],types:Array(5).fill('cognitive')},
  social:{labels:['Liderazgo','Motivación/autoconciencia','Empatía','Orientación servicio','Gestión talento','Inteligencia emocional'],values:[63,61,58,52,50,56],types:Array(6).fill('social')},
  adaptive:{labels:['Resiliencia/flexibilidad','Alfab. tecnológica','Curiosidad/ap. continuo','Tolerancia ambigüedad','Aprendizaje ágil'],values:[69,60,57,54,52],types:Array(5).fill('adaptive')},
  creative:{labels:['Pensamiento creativo','Innovación','Diseño thinking','Resolución problemas orig.'],values:[65,58,52,55],types:Array(4).fill('creative')}
};

var frameworkData = {
  all:{labels:['Pensamiento crítico','Agencia propia','Colaboración','Adaptabilidad','Ap. continuo','Creatividad','Habilidades SEL'],ds:[
    {label:'OCDE',data:[10,10,9,9,10,8,8],bc:'#F5A623',bg:'rgba(245,166,35,.15)'},
    {label:'WEF',data:[10,8,10,10,9,10,7],bc:'#5DCAA5',bg:'rgba(93,202,165,.15)'},
    {label:'CASEL',data:[8,9,10,8,7,6,10],bc:'#C4A8F0',bg:'rgba(196,168,240,.15)'}
  ]},
  ocde:{labels:['Pensamiento crítico','Agencia propia','Colaboración','Adaptabilidad','Ap. continuo','Creatividad','Habilidades SEL'],ds:[{label:'OCDE 2030',data:[10,10,9,9,10,8,8],bc:'#F5A623',bg:'rgba(245,166,35,.15)'}]},
  wef:{labels:['Pensamiento crítico','Agencia propia','Colaboración','Adaptabilidad','Ap. continuo','Creatividad','Habilidades SEL'],ds:[{label:'WEF 2025',data:[10,8,10,10,9,10,7],bc:'#5DCAA5',bg:'rgba(93,202,165,.15)'}]},
  casel:{labels:['Pensamiento crítico','Agencia propia','Colaboración','Adaptabilidad','Ap. continuo','Creatividad','Habilidades SEL'],ds:[{label:'CASEL',data:[8,9,10,8,7,6,10],bc:'#C4A8F0',bg:'rgba(196,168,240,.15)'}]},
  p21:{labels:['Pensamiento crítico','Agencia propia','Colaboración','Adaptabilidad','Ap. continuo','Creatividad','Habilidades SEL'],ds:[{label:'P21',data:[10,8,10,7,8,10,7],bc:'#7EC8E3',bg:'rgba(126,200,227,.15)'}]},
  harvard:{labels:['Pensamiento crítico','Agencia propia','Colaboración','Adaptabilidad','Ap. continuo','Creatividad','Habilidades SEL'],ds:[{label:'Harvard PZ',data:[9,10,8,8,9,9,8],bc:'#F09595',bg:'rgba(240,149,149,.15)'}]}
};

var countryData = {
  'Chile':{rep:55,juv:21.4,pisa_mat:412,pisa_lect:448,color:'#F5A623'},
  'Prom. Latinoamérica':{rep:42,juv:18,pisa_mat:395,pisa_lect:410,color:'rgba(232,237,245,.5)'},
  'Prom. OCDE':{rep:35,juv:12,pisa_mat:489,pisa_lect:476,color:'#7EC8E3'},
  'Finlandia':{rep:28,juv:9.4,pisa_mat:484,pisa_lect:490,color:'#5DCAA5'},
  'Corea del Sur':{rep:31,juv:6.4,pisa_mat:527,pisa_lect:515,color:'#C4A8F0'},
  'Brasil':{rep:48,juv:22,pisa_mat:379,pisa_lect:410,color:'rgba(232,237,245,.45)'},
  'México':{rep:46,juv:16,pisa_mat:395,pisa_lect:415,color:'rgba(232,237,245,.45)'},
  'Colombia':{rep:44,juv:19,pisa_mat:383,pisa_lect:409,color:'rgba(232,237,245,.45)'},
  'EE.UU.':{rep:30,juv:9.2,pisa_mat:465,pisa_lect:504,color:'#7EC8E3'},
  'Alemania':{rep:33,juv:5.9,pisa_mat:475,pisa_lect:480,color:'#7EC8E3'}
};

var countryIds = {
  'Prom. Latinoamérica':'c-latam',
  'Prom. OCDE':'c-ocde',
  'Finlandia':'c-fin',
  'Corea del Sur':'c-kor',
  'Brasil':'c-bra',
  'México':'c-mex',
  'Colombia':'c-col',
  'EE.UU.':'c-usa',
  'Alemania':'c-deu'
};

var indicatorMeta = {
  repetitivo:{key:'rep',label:'% empleos tareas repetitivas',src:'Fuente: OCDE/PIAAC 2023'},
  juvenil:{key:'juv',label:'% desempleo juvenil <25 años',src:'Fuente: INE Chile 2024 · Banco Mundial 2023'},
  pisa_mat:{key:'pisa_mat',label:'Puntaje PISA Matemáticas',src:'Fuente: PISA 2022 · Agencia Calidad Educación'},
  pisa_lect:{key:'pisa_lect',label:'Puntaje PISA Lectura',src:'Fuente: PISA 2022 · Agencia Calidad Educación'}
};

/* ══════════════════════════════════════════════════════════════════
   CHART INSTANCES (module-scoped)
   ══════════════════════════════════════════════════════════════════ */
var jobChart = null;
var secGrowChart = null;
var secDeclChart = null;
var skillChart = null;
var radarChart = null;
var countryChart = null;
var indicatorChart = null;
var currentIndicator = 'rep';

/* ══════════════════════════════════════════════════════════════════
   NAV — showSec (tabs within dashboard)
   ══════════════════════════════════════════════════════════════════ */
window.showSec = function (id, el) {
  var dash = document.getElementById('dashboard');
  if (!dash) return;
  dash.querySelectorAll('.section').forEach(function (s) { s.classList.remove('active'); });
  dash.querySelectorAll('.dtab').forEach(function (t) { t.classList.remove('active'); });
  var sec = document.getElementById(id);
  if (sec) sec.classList.add('active');
  if (el) el.classList.add('active');

  // Scroll dashboard into view
  dash.scrollIntoView({ behavior: 'smooth', block: 'start' });

  setTimeout(function () {
    if (id === 'sectores') {
      var sel = dash.querySelector('.sector-card.selected') || dash.querySelector('.sector-card');
      if (sel) selectSector('salud', sel);
    }
    if (id === 'chile') {
      updateCountryChart();
      var indBtn = dash.querySelector('#indicator-filters .pill.active') || dash.querySelector('#indicator-filters .pill');
      if (indBtn) switchIndicator('repetitivo', indBtn);
    }
    if (id === 'destrezas') {
      buildSkillChart('all');
      buildRadar('all');
    }
    if (id === 'oportunidades') {
      buildOpportunityChart();
    }
    // Make all .rv visible immediately
    dash.querySelectorAll('.rv').forEach(function (el) { el.classList.add('vis'); });
  }, 100);
};

/* ══════════════════════════════════════════════════════════════════
   EMPLEOS — buildJobChart / filterJobs
   ══════════════════════════════════════════════════════════════════ */
function buildJobChart(key) {
  var d = jobData[key];
  var ctx = document.getElementById('chartJobs');
  if (!ctx) return;
  if (jobChart) jobChart.destroy();
  jobChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: d.labels,
      datasets: [{
        data: d.values,
        backgroundColor: d.colors.map(function (c) { return c + 'BB'; }),
        borderColor: d.colors,
        borderWidth: 1,
        borderRadius: 4
      }]
    },
    options: Object.assign({}, baseOpts, { indexAxis: 'y', scales: scalesYX })
  });
}

window.filterJobs = function (key, el) {
  document.querySelectorAll('#job-filters .pill').forEach(function (p) { p.className = 'pill'; });
  el.className = 'pill active';
  buildJobChart(key);
};

/* ══════════════════════════════════════════════════════════════════
   SECTORES — selectSector
   ══════════════════════════════════════════════════════════════════ */
function selectSector(key, el) {
  document.querySelectorAll('.sector-card').forEach(function (c) { c.classList.remove('selected'); });
  el.classList.add('selected');
  var d = sectorData[key];
  var name = el.querySelector('.sn').textContent;
  var gt = document.getElementById('sec-growing-title');
  var dt = document.getElementById('sec-declining-title');
  var st = document.getElementById('sec-skills-title');
  if (gt) gt.textContent = 'Empleos en crecimiento — ' + name;
  if (dt) dt.textContent = 'Empleos en declive — ' + name;
  if (st) st.textContent = 'Destrezas más demandadas en — ' + name;

  if (secGrowChart) secGrowChart.destroy();
  var ctxG = document.getElementById('chartSecGrow');
  if (ctxG) {
    secGrowChart = new Chart(ctxG, {
      type: 'bar',
      data: { labels: d.grow, datasets: [{ data: d.gv, backgroundColor: C.green + '99', borderColor: C.green, borderWidth: 1, borderRadius: 4 }] },
      options: Object.assign({}, baseOpts, { indexAxis: 'y', scales: scalesYX })
    });
  }

  if (secDeclChart) secDeclChart.destroy();
  var ctxD = document.getElementById('chartSecDecl');
  if (ctxD) {
    secDeclChart = new Chart(ctxD, {
      type: 'bar',
      data: { labels: d.decl, datasets: [{ data: d.dv, backgroundColor: C.red + '99', borderColor: C.red, borderWidth: 1, borderRadius: 4 }] },
      options: Object.assign({}, baseOpts, { indexAxis: 'y', scales: scalesYX })
    });
  }

  var sb = document.getElementById('sec-skills-bars');
  if (sb) {
    sb.innerHTML = '';
    for (var i = 0; i < d.skills.length; i += 2) {
      var lbl = d.skills[i], val = d.skills[i + 1];
      var pct = val + '%';
      var color = val >= 85 ? C.amber : val >= 75 ? C.green : C.blue;
      sb.innerHTML += '<div class="pi"><div class="ph"><span class="pl">' + lbl + '</span><span class="pv" style="color:' + color + '">' + pct + '</span></div><div class="pt"><div class="pf" style="width:' + val + '%;background:' + color + '"></div></div></div>';
    }
  }
}
window.selectSector = selectSector;

/* ══════════════════════════════════════════════════════════════════
   DESTREZAS — buildSkillChart / filterSkills / buildRadar / filterFramework
   ══════════════════════════════════════════════════════════════════ */
var skillColors = { cognitive: C.amber, social: C.green, adaptive: C.blue, creative: C.purple };

function buildSkillChart(key) {
  var d = skillData[key];
  var ctx = document.getElementById('chartSkills');
  if (!ctx) return;
  if (skillChart) skillChart.destroy();
  skillChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: d.labels,
      datasets: [{
        data: d.values,
        backgroundColor: d.types.map(function (t) { return skillColors[t] + 'BB'; }),
        borderColor: d.types.map(function (t) { return skillColors[t]; }),
        borderWidth: 1,
        borderRadius: 4
      }]
    },
    options: Object.assign({}, baseOpts, {
      indexAxis: 'y',
      scales: {
        y: { ticks: { color: C.tm, font: { size: 12 } }, grid: { color: C.border } },
        x: { ticks: { color: C.tm, font: { size: 13 } }, grid: { color: C.border }, max: 100 }
      }
    })
  });
}

window.filterSkills = function (key, el) {
  document.querySelectorAll('#skill-type-filters .pill').forEach(function (p) { p.className = 'pill'; });
  el.className = 'pill active';
  buildSkillChart(key);
};

function buildRadar(key) {
  var d = frameworkData[key];
  var ctx = document.getElementById('chartRadar');
  if (!ctx) return;
  if (radarChart) radarChart.destroy();
  radarChart = new Chart(ctx, {
    type: 'radar',
    data: {
      labels: d.labels,
      datasets: d.ds.map(function (ds) {
        return { label: ds.label, data: ds.data, borderColor: ds.bc, backgroundColor: ds.bg, pointBackgroundColor: ds.bc, borderWidth: 2 };
      })
    },
    options: Object.assign({}, baseOpts, {
      plugins: Object.assign({}, baseOpts.plugins, {
        legend: { display: d.ds.length > 1, labels: { color: C.tm, font: { size: 13 }, padding: 12 } }
      }),
      scales: {
        r: { ticks: { color: C.tm, backdropColor: 'transparent', font: { size: 12 }, stepSize: 2 }, grid: { color: C.border }, pointLabels: { color: C.tm, font: { size: 12 } }, min: 0, max: 10 }
      }
    })
  });
  var src = document.getElementById('radar-src');
  if (src) src.textContent = key === 'all' ? 'Convergencia de todos los marcos internacionales — escala 1-10' : 'Marco: ' + d.ds[0].label + ' — escala 1-10';
}

window.filterFramework = function (key, el) {
  document.querySelectorAll('#framework-filters .pill').forEach(function (p) { p.className = 'pill'; });
  if (key === 'all') {
    el.className = 'pill active-blue pill';
    el.style.borderColor = 'rgba(126,200,227,.4)';
    el.style.color = '#7EC8E3';
    el.style.background = 'rgba(46,109,164,.2)';
  } else {
    el.className = 'pill active';
  }
  buildRadar(key);
};

/* ══════════════════════════════════════════════════════════════════
   CHILE — country / indicator charts
   ══════════════════════════════════════════════════════════════════ */
function getActiveCountries() {
  var active = ['Chile'];
  Object.keys(countryIds).forEach(function (name) {
    var id = countryIds[name];
    var el = document.getElementById(id);
    if (el && el.checked) active.push(name);
  });
  return active;
}

function updateCountryChart() {
  var active = getActiveCountries();
  var vals = active.map(function (c) { return countryData[c][currentIndicator]; });
  var colors = active.map(function (c) { return countryData[c].color; });
  var ctx = document.getElementById('chartCountry');
  if (!ctx) return;
  if (countryChart) countryChart.destroy();
  countryChart = new Chart(ctx, {
    type: 'bar',
    data: { labels: active, datasets: [{ data: vals, backgroundColor: colors.map(function (c) { return c + 'BB'; }), borderColor: colors, borderWidth: 1, borderRadius: 6 }] },
    options: Object.assign({}, baseOpts, { scales: scalesXY })
  });
}
window.updateCountryChart = updateCountryChart;

function switchIndicator(key, el) {
  document.querySelectorAll('#indicator-filters .pill').forEach(function (p) { p.className = 'pill'; });
  el.className = 'pill active';
  currentIndicator = indicatorMeta[key].key;
  var active = getActiveCountries();
  var vals = active.map(function (c) { return countryData[c][currentIndicator]; });
  var colors = active.map(function (c) { return countryData[c].color; });
  var ctx = document.getElementById('chartIndicator');
  if (!ctx) return;
  if (indicatorChart) indicatorChart.destroy();
  indicatorChart = new Chart(ctx, {
    type: 'bar',
    data: { labels: active, datasets: [{ data: vals, backgroundColor: colors.map(function (c) { return c + 'BB'; }), borderColor: colors, borderWidth: 1, borderRadius: 6, label: indicatorMeta[key].label }] },
    options: Object.assign({}, baseOpts, { plugins: Object.assign({}, baseOpts.plugins, { legend: { display: false } }), scales: scalesXY })
  });
  var src = document.getElementById('indicator-src');
  if (src) src.textContent = indicatorMeta[key].src;
  updateCountryChart();
}
window.switchIndicator = switchIndicator;

/* ══════════════════════════════════════════════════════════════════
   DESINFORMACIÓN — sim + doughnut
   ══════════════════════════════════════════════════════════════════ */
function updateDisinfoSim() {
  var exp = parseInt(document.getElementById('exposureSlider').value);
  var lit = parseInt(document.getElementById('literacySlider').value);
  document.getElementById('expVal').textContent = exp;
  document.getElementById('litVal').textContent = lit;
  var risk = Math.round(Math.max(5, Math.min(95, (exp * 11) - (lit * 7) + 10)));
  document.getElementById('risk-bar').style.width = risk + '%';
  var color = risk > 66 ? C.red : risk > 33 ? C.amber : C.green;
  document.getElementById('risk-bar').style.background = color;
  document.getElementById('risk-label').style.color = color;
  document.getElementById('risk-label').textContent = risk > 66 ? 'Alto' : risk > 33 ? 'Moderado' : 'Bajo';
  document.getElementById('risk-desc').textContent = risk > 66
    ? 'Alta exposición con baja capacidad de filtro: decisiones de salud, financieras y políticas basadas en información no verificada.'
    : risk > 33
      ? 'Exposición moderada. Desarrollar habilidades de verificación reduciría significativamente el riesgo.'
      : 'Buena alfabetización mediática. Capacidad de filtrar información y tomar decisiones fundamentadas.';
}
window.updateDisinfoSim = updateDisinfoSim;

/* ══════════════════════════════════════════════════════════════════
   CHILD SIMULATOR
   ══════════════════════════════════════════════════════════════════ */
function updateChildSim() {
  var birth = parseInt(document.getElementById('birthSlider').value);
  document.getElementById('birthVal').textContent = birth;
  var gradYear = birth + 18;
  document.getElementById('sim-grad-year').textContent = gradYear;
  var yearsFromNow = gradYear - 2026;
  var pct = Math.min(95, Math.round(yearsFromNow * 3.5 + 15));
  document.getElementById('sim-jobs-pct').textContent = '~' + pct + '%';
  var skills = ['Pensamiento analítico', 'Pensamiento creativo', 'Resiliencia y flexibilidad', 'Alfabetización tecnológica', 'Empatía y colaboración'];
  var skillIdx = Math.min(skills.length - 1, Math.floor(yearsFromNow / 4));
  document.getElementById('sim-top-skill').textContent = skills[skillIdx];
}
window.updateChildSim = updateChildSim;

/* ══════════════════════════════════════════════════════════════════
   OPORTUNIDADES — buildOpportunityChart
   ══════════════════════════════════════════════════════════════════ */
function buildOpportunityChart() {
  var ctx = document.getElementById('chartOpportunity');
  if (!ctx) return;
  if (ctx._chartInstance) ctx._chartInstance.destroy();
  var chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Esp. IA y Big Data', 'Ing. Fintech', 'Dev. Software', 'Esp. Ciberseguridad', 'Enfermería', 'Ing. Energía Verde', 'Trabajo Social', 'UX/Diseño IA'],
      datasets: [{ data: [30, 25, 22, 19, 18, 17, 15, 14], backgroundColor: '#5DCAA5BB', borderColor: '#5DCAA5', borderWidth: 1, borderRadius: 4 }]
    },
    options: Object.assign({}, baseOpts, {
      indexAxis: 'y',
      scales: {
        y: { ticks: { color: C.tm, font: { size: 13 } }, grid: { color: C.border } },
        x: { ticks: { color: C.tm, font: { size: 13 } }, grid: { color: C.border }, title: { display: true, text: '% crecimiento proyectado al 2030', color: C.tm, font: { size: 12 } } }
      }
    })
  });
  ctx._chartInstance = chart;
}
window.buildOpportunityChart = buildOpportunityChart;

/* ══════════════════════════════════════════════════════════════════
   PERSPECTIVE — setPerspective / resetPerspective
   ══════════════════════════════════════════════════════════════════ */
function setPerspective(tipo) {
  sessionStorage.setItem('dashboard_perspective', tipo);
  var entry = document.getElementById('entry-block');
  if (entry) entry.style.display = 'none';
  var btn = document.getElementById('change-role-btn');
  if (btn) btn.style.display = 'block';

  if (tipo === 'familia') showSec('chile', document.querySelector('.dtab[data-sec="chile"]') || document.querySelector('.dtab'));
  else if (tipo === 'docente') showSec('destrezas', document.querySelector('.dtab[data-sec="destrezas"]') || document.querySelector('.dtab'));
  else if (tipo === 'empresa') showSec('sectores', document.querySelector('.dtab[data-sec="sectores"]') || document.querySelector('.dtab'));
  else if (tipo === 'estudiante') showSec('oportunidades', document.querySelector('.dtab[data-sec="oportunidades"]') || document.querySelector('.dtab'));
  else showSec('empleos', document.querySelector('.dtab'));
}
window.setPerspective = setPerspective;

function resetPerspective() {
  sessionStorage.removeItem('dashboard_perspective');
  var entry = document.getElementById('entry-block');
  if (entry) { entry.style.display = ''; }
  var dash = document.getElementById('dashboard');
  if (dash) dash.scrollIntoView({ behavior: 'smooth', block: 'start' });
  var btn = document.getElementById('change-role-btn');
  if (btn) btn.style.display = 'none';
}
window.resetPerspective = resetPerspective;

/* ══════════════════════════════════════════════════════════════════
   INIT — build all default charts + KPI notebook interaction
   ══════════════════════════════════════════════════════════════════ */
function initDashboardCharts() {
  // Empleos — default view
  buildJobChart('all');

  // Sectores — default salud
  var sel = document.querySelector('.sector-card.selected') || document.querySelector('.sector-card');
  if (sel) selectSector('salud', sel);

  // Destrezas
  buildSkillChart('all');
  buildRadar('all');

  // Chile
  updateCountryChart();
  var indBtn = document.querySelector('#indicator-filters .pill.active') || document.querySelector('#indicator-filters .pill');
  if (indBtn) switchIndicator('repetitivo', indBtn);

  // Child simulator
  updateChildSim();

  // Digital — bubble chart
  var ctxImpact = document.getElementById('chartImpact');
  if (ctxImpact) {
    new Chart(ctxImpact, {
      type: 'bubble',
      data: {
        datasets: [
          { label: 'WhatsApp 2014', data: [{ x: 55, y: 19000, r: 24 }], backgroundColor: C.green + 'BB', borderColor: C.green },
          { label: 'Instagram 2012', data: [{ x: 13, y: 1000, r: 14 }], backgroundColor: C.amber + 'BB', borderColor: C.amber },
          { label: 'Midjourney 2025', data: [{ x: 130, y: 500, r: 21 }], backgroundColor: C.purple + 'BB', borderColor: C.purple },
          { label: 'Cursor 2025', data: [{ x: 40, y: 1200, r: 16 }], backgroundColor: C.blue + 'BB', borderColor: C.blue }
        ]
      },
      options: Object.assign({}, baseOpts, {
        plugins: Object.assign({}, baseOpts.plugins, { legend: { display: true, labels: { color: C.tm, font: { size: 13 } } } }),
        scales: {
          x: { title: { display: true, text: 'N\u00b0 de empleados', color: C.tm, font: { size: 13 } }, ticks: { color: C.tm }, grid: { color: C.border } },
          y: { title: { display: true, text: 'Valorización / ingresos (USD millones)', color: C.tm, font: { size: 13 } }, ticks: { color: C.tm }, grid: { color: C.border } }
        }
      })
    });
  }

  // Desinformación — doughnut
  var ctxDisinfo = document.getElementById('chartDisinfo');
  if (ctxDisinfo) {
    new Chart(ctxDisinfo, {
      type: 'doughnut',
      data: {
        labels: ['Salud', 'Finanzas', 'Política', 'Educación', 'Relaciones', 'Seguridad'],
        datasets: [{
          data: [22, 20, 18, 16, 13, 11],
          backgroundColor: [C.red, C.amber, C.purple, C.blue, C.green, C.blueD].map(function (c) { return c + 'CC'; }),
          borderColor: [C.red, C.amber, C.purple, C.blue, C.green, C.blueD],
          borderWidth: 2
        }]
      },
      options: Object.assign({}, baseOpts, {
        cutout: '60%',
        plugins: Object.assign({}, baseOpts.plugins, { legend: { display: true, position: 'right', labels: { color: C.tm, font: { size: 13 }, padding: 10 } } })
      })
    });
  }

  // KPI click-to-save interaction
  document.querySelectorAll('#dashboard .card.kpi').forEach(function (card) {
    card.style.cursor = 'pointer';
    card.addEventListener('click', function () {
      var num = (this.querySelector('.num') || {}).textContent || '';
      var lbl = (this.querySelector('.lbl') || {}).textContent || '';
      var src = (this.querySelector('.sub') || {}).textContent || '';
      var saved = JSON.parse(sessionStorage.getItem('notebook') || '[]');
      saved.push({ num: num, lbl: lbl, src: src, type: 'dato' });
      sessionStorage.setItem('notebook', JSON.stringify(saved));
      this.style.borderColor = 'rgba(245,166,35,.8)';
      var self = this;
      setTimeout(function () { self.style.borderColor = ''; }, 1000);
    });
  });

  // Restore saved perspective
  var saved = sessionStorage.getItem('dashboard_perspective');
  var entry = document.getElementById('entry-block');
  var changeBtn = document.getElementById('change-role-btn');
  if (saved && entry) {
    entry.style.display = 'none';
    if (changeBtn) changeBtn.style.display = 'block';
  }
}

})();
