// nav.js — Navegación compartida
// Visibles: Inicio | Contexto | Modelo Educativo | Familias | Estudiantes | I+D Colaborativo ▾
// I+D Colaborativo contiene CEPAH como sub-sección principal

const NAV_ITEMS = [
  { href: 'index.html', label: 'Inicio' },
  { href: 'contexto-global.html', label: 'Contexto' },
  { href: 'modelo-educativo.html', label: 'Modelo Educativo' },
  { href: 'para-familias.html', label: 'Familias' },
  { href: 'estudiantes.html', label: 'Estudiantes' },
  {
    label: 'I+D Colaborativo',
    children: [
      { href: 'cepah.html', label: 'CEPAH — Centro de Estudios' },
      { isSeparator: true },
      { href: 'industria.html', label: 'Empresas e industria' },
      { href: 'universidades.html', label: 'Universidades y centros de investigación' },
      { href: 'gobiernos.html', label: 'Gobiernos' },
      { href: 'profesores.html', label: 'Profesores Transformadores' },
      { href: 'colegios.html', label: 'Colegios Visionarios' },
    ]
  },
  {
    label: 'Conócenos',
    children: [
      { href: 'nosotros.html', label: 'Quiénes somos' },
      { href: 'equipo.html', label: 'Nuestro equipo' },
      { href: 'visita.html', label: 'Solicita una visita guiada' },
      { href: 'trabaja-con-nosotros.html', label: 'Trabaja con nosotros' },
      { isSeparator: true },
      { href: 'autodiagnostico.html', label: '🧭 Autodiagnóstico siglo XXI' },
    ]
  },
];

// Mobile: espejo exacto de NAV_ITEMS
const MOBILE_LINKS = [
  { href: 'index.html', label: 'Inicio' },
  { href: 'contexto-global.html', label: 'Contexto' },
  { href: 'modelo-educativo.html', label: 'Modelo Educativo' },
  { href: 'para-familias.html', label: 'Familias' },
  { href: 'estudiantes.html', label: 'Estudiantes' },

  { label: 'I+D Colaborativo', isSection: true },
  { href: 'cepah.html', label: 'CEPAH — Centro de Estudios' },
  { href: 'industria.html', label: 'Empresas e industria' },
  { href: 'universidades.html', label: 'Universidades y centros de investigación' },
  { href: 'gobiernos.html', label: 'Gobiernos' },
  { href: 'profesores.html', label: 'Profesores Transformadores' },
  { href: 'colegios.html', label: 'Colegios Visionarios' },

  { label: 'Conócenos', isSection: true },
  { href: 'nosotros.html', label: 'Quiénes somos' },
  { href: 'equipo.html', label: 'Nuestro equipo' },
  { href: 'visita.html', label: 'Solicita una visita guiada' },
  { href: 'trabaja-con-nosotros.html', label: 'Trabaja con nosotros' },
  { href: 'autodiagnostico.html', label: '🧭 Autodiagnóstico siglo XXI' },
];

const FOOTER_COLS = {
  proyecto: [
    { href: 'contexto-global.html', label: 'El contexto que nos moviliza' },
    { href: 'modelo-educativo.html', label: 'Modelo educativo' },
    { href: 'para-familias.html', label: 'Familias' },
  ],
  id: [
    { href: 'cepah.html', label: 'CEPAH — Centro de Estudios' },
    { href: 'industria.html', label: 'Empresas e industria' },
    { href: 'universidades.html', label: 'Universidades y centros de investigación' },
    { href: 'gobiernos.html', label: 'Gobiernos' },
    { href: 'profesores.html', label: 'Profesores Transformadores' },
  ],
};

function getCurrentPage() {
  return window.location.pathname.split('/').pop() || 'index.html';
}
function isActive(href) { return href === getCurrentPage(); }
function isParentActive(children) {
  return children.some(c => c.href && c.href === getCurrentPage());
}

function buildNavbar() {
  const nav = document.createElement('nav');
  nav.className = 'navbar';
  nav.setAttribute('role', 'navigation');
  let menuHTML = '';
  NAV_ITEMS.forEach(item => {
    if (item.children) {
      const active = isParentActive(item.children) ? ' navbar__link--active' : '';
      const childrenHTML = item.children.map(c =>
        c.isSeparator ? '<hr class="dropdown__separator">' :
        `<a href="${c.href}" class="dropdown__link${isActive(c.href) ? ' dropdown__link--active' : ''}">${c.label}</a>`
      ).join('');
      menuHTML += `
        <div class="navbar__dropdown">
          <button class="navbar__link navbar__link--parent${active}" type="button" aria-expanded="false">${item.label} <span class="navbar__chevron">&#9662;</span></button>
          <div class="dropdown__panel">${childrenHTML}</div>
        </div>`;
    } else {
      menuHTML += `<a href="${item.href}" class="navbar__link${isActive(item.href) ? ' navbar__link--active' : ''}">${item.label}</a>`;
    }
  });
  nav.innerHTML = `
    <div class="navbar__inner">
      <a href="index.html" class="navbar__brand">
        <img src="logo-cch.png" alt="Logo Colegio Camilo Henríquez" style="height:44px;width:auto;filter:brightness(0) invert(1);opacity:0.9;object-fit:cover;object-position:top;clip-path:inset(0 15% 28% 15%);margin-right:-6px">
        Colegio Camilo Henríquez
      </a>
      <div class="navbar__menu">${menuHTML}</div>
      <button class="navbar__hamburger" onclick="toggleMobileNav()" aria-label="Menú">&#9776;</button>
    </div>
  `;
  return nav;
}

function buildMobileNav() {
  const overlay = document.createElement('div');
  overlay.className = 'mobile-nav';
  overlay.id = 'mobile-nav';
  let html = '';
  MOBILE_LINKS.forEach(l => {
    if (l.isSection) {
      html += `<div class="mobile-nav__section">${l.label}</div>`;
    } else {
      html += `<a href="${l.href}" class="mobile-nav__link${isActive(l.href) ? ' mobile-nav__link--active' : ''}" onclick="closeMobileNav()">${l.label}</a>`;
    }
  });
  overlay.innerHTML = `<button class="mobile-nav__close" onclick="toggleMobileNav()">&times;</button>${html}`;
  return overlay;
}

function buildFooter() {
  const footer = document.createElement('footer');
  footer.className = 'footer';
  footer.innerHTML = `
    <div class="container">
      <div class="footer__grid">
        <div>
          <p class="footer__title">Proyecto Educativo</p>
          ${FOOTER_COLS.proyecto.map(l => `<a href="${l.href}" class="footer__link">${l.label}</a>`).join('')}
        </div>
        <div>
          <p class="footer__title">I+D Colaborativo</p>
          ${FOOTER_COLS.id.map(l => `<a href="${l.href}" class="footer__link">${l.label}</a>`).join('')}
        </div>
        <div>
          <p class="footer__title">Contacto</p>
          <p class="footer__address">Av. Lircay 2550, Talca</p>
          <a href="tel:+56712681435" class="footer__link">+56 71 268 1435</a>
          <a href="mailto:colegio@colegiocamilohenriquez.cl" class="footer__link">colegio@colegiocamilohenriquez.cl</a>
        </div>
      </div>
      <div style="text-align:center;padding:1.25rem 1.5rem;border-top:1px solid rgba(245,166,35,0.1);background:rgba(245,166,35,0.03)">
        <p style="font-size:1.05rem;color:rgba(245,166,35,0.85);margin:0 0 .75rem;max-width:none;font-weight:600;line-height:1.55" id="footer-dyk"></p>
        <button onclick="refreshDyk()" class="dyk-btn">Otro dato que no conocías →</button>
      </div>
      <div class="footer__bottom">
        <p style="text-align:center;max-width:none;margin:0 auto">Colegio Camilo Henríquez, Talca, Chile</p>
      </div>
    </div>
  `;
  return footer;
}

function toggleMobileNav() {
  const nav = document.getElementById('mobile-nav');
  if (nav) nav.classList.toggle('mobile-nav--open');
}
function closeMobileNav() {
  const nav = document.getElementById('mobile-nav');
  if (nav) nav.classList.remove('mobile-nav--open');
}

function initDropdowns() {
  document.querySelectorAll('.navbar__dropdown').forEach(dd => {
    const btn = dd.querySelector('.navbar__link--parent');
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = dd.classList.contains('navbar__dropdown--open');
      document.querySelectorAll('.navbar__dropdown--open').forEach(d => d.classList.remove('navbar__dropdown--open'));
      if (!isOpen) dd.classList.add('navbar__dropdown--open');
    });
  });
  document.addEventListener('click', () => {
    document.querySelectorAll('.navbar__dropdown--open').forEach(d => d.classList.remove('navbar__dropdown--open'));
  });
}

function initAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('anim--visible'); });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.anim').forEach(el => observer.observe(el));
}

document.addEventListener('DOMContentLoaded', () => {
  const main = document.createElement('main');
  while (document.body.firstChild) main.appendChild(document.body.firstChild);
  document.body.appendChild(main);
  document.body.insertBefore(buildNavbar(), main);
  document.body.insertBefore(buildMobileNav(), main);
  document.body.appendChild(buildFooter());
  initDropdowns();
  initAnimations();
  refreshDyk();
});

// ¿Sabías que...? — pool global + función de refresh
var dykData = [
  '¿Sabías que el 65% de los niños que entran hoy a la escuela trabajarán en empleos que aún no existen? (WEF, 2025)',
  '¿Sabías que Midjourney genera $500M al año con solo 40 empleados? Una persona con las destrezas correctas multiplica su impacto.',
  '¿Sabías que los contenidos falsos generados por IA crecen 900% cada año? El pensamiento crítico es la única defensa. (WEF/Sumsub)',
  '¿Sabías que las habilidades cambian un 66% más rápido en empleos expuestos a IA? Aprender a aprender es la destreza que no caduca. (PwC)',
  '¿Sabías que un estudiante en Talca puede trabajar con una startup en Berlín sin emigrar? La geografía dejó de ser un límite.',
  '¿Sabías que el 92% de los reclutadores valora la colaboración igual o más que las habilidades técnicas? (LinkedIn, 2023)',
  '¿Sabías que la creatividad es la 4ª habilidad más demandada al 2030? La IA puede copiar patrones — crear es humano. (WEF)',
  '¿Sabías que 270.000 estudiantes mostraron +11 puntos en rendimiento al integrar habilidades socioemocionales? (CASEL)',
  '¿Sabías que entre 55 y 73 países compiten con visas especiales por atraer talento digital? Las oportunidades son globales. (OCDE)',
  '¿Sabías que el 48% de empresas que usan ChatGPT ahorraron más de $50.000? Quien combina destrezas humanas + IA multiplica su valor. (Tech.co)',
  '¿Sabías que 10 de 10 marcos internacionales coinciden en que pensamiento crítico y colaboración son esenciales?',
  '¿Sabías que Chile tiene el 55% de empleos en tareas repetitivas — el mayor porcentaje de la OCDE?',
  '¿Sabías que la prima salarial por habilidades complementarias a IA es de +USD 18.000 al año? (Lightcast, 2025)',
  '¿Sabías que Google descubrió que su factor #1 de equipos exitosos no era el talento, sino la seguridad psicológica?',
  '¿Sabías que Klarna tuvo que recontratar humanos porque la IA no pudo manejar empatía ni interacciones complejas?',
];
var _lastDyk = -1;
var _dykFirst = true;
function refreshDyk() {
  var el = document.getElementById('footer-dyk');
  if (!el) return;
  var idx;
  do { idx = Math.floor(Math.random() * dykData.length); } while (dykData.length > 1 && idx === _lastDyk);
  _lastDyk = idx;
  if (_dykFirst) {
    el.textContent = dykData[idx];
    el.style.transition = 'opacity 0.25s ease';
    _dykFirst = false;
  } else {
    el.style.opacity = '0';
    setTimeout(function(){ el.textContent = dykData[idx]; el.style.opacity = '1'; }, 250);
  }
}