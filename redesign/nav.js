// nav.js — Navegación compartida para todas las páginas

const NAV_LINKS = [
  { href: 'index.html', label: 'Inicio' },
  { href: 'por-que-importa.html', label: '¿Por qué importa?' },
  { href: 'modelo-educativo.html', label: 'Modelo' },
  { href: 'para-familias.html', label: 'Familias CCH' },
  { href: 'familias-otros-colegios.html', label: 'Otras familias' },
  { href: 'industria.html', label: 'Industria' },
  { href: 'trabaja-con-nosotros.html', label: 'Únete' },
];

const FOOTER_COLS = {
  navegacion: [
    { href: 'index.html', label: 'Inicio' },
    { href: 'por-que-importa.html', label: '¿Por qué importa?' },
    { href: 'modelo-educativo.html', label: 'Modelo educativo' },
  ],
  audiencias: [
    { href: 'para-familias.html', label: 'Familias de este colegio' },
    { href: 'familias-otros-colegios.html', label: 'Familias de otros colegios' },
    { href: 'industria.html', label: 'Industria y empresas' },
    { href: 'trabaja-con-nosotros.html', label: 'Trabaja con nosotros' },
  ],
};

function getCurrentPage() {
  return window.location.pathname.split('/').pop() || 'index.html';
}

function buildNavbar() {
  const current = getCurrentPage();
  const nav = document.createElement('nav');
  nav.className = 'navbar';
  nav.setAttribute('role', 'navigation');
  nav.innerHTML = `
    <div class="navbar__inner">
      <a href="index.html" class="navbar__brand">
        <!-- IMAGEN: Logo del Colegio Camilo Henríquez -->
        Colegio Camilo Henríquez
      </a>
      <div class="navbar__menu">
        ${NAV_LINKS.map(l => `<a href="${l.href}" class="navbar__link${l.href === current ? ' navbar__link--active' : ''}">${l.label}</a>`).join('')}
      </div>
      <button class="navbar__hamburger" onclick="toggleMobileNav()" aria-label="Menú">☰</button>
    </div>
  `;
  return nav;
}

function buildMobileNav() {
  const current = getCurrentPage();
  const overlay = document.createElement('div');
  overlay.className = 'mobile-nav';
  overlay.id = 'mobile-nav';
  overlay.innerHTML = `
    <button class="mobile-nav__close" onclick="toggleMobileNav()">&times;</button>
    ${NAV_LINKS.map(l => `<a href="${l.href}" class="mobile-nav__link${l.href === current ? ' navbar__link--active' : ''}">${l.label}</a>`).join('')}
  `;
  return overlay;
}

function buildFooter() {
  const footer = document.createElement('footer');
  footer.className = 'footer';
  footer.innerHTML = `
    <div class="container">
      <div class="footer__grid">
        <div>
          <p class="footer__title">Navegación</p>
          ${FOOTER_COLS.navegacion.map(l => `<a href="${l.href}" class="footer__link">${l.label}</a>`).join('')}
        </div>
        <div>
          <p class="footer__title">Audiencias</p>
          ${FOOTER_COLS.audiencias.map(l => `<a href="${l.href}" class="footer__link">${l.label}</a>`).join('')}
        </div>
        <div>
          <p class="footer__title">Contacto</p>
          <p class="footer__address">Av. Lircay 2550, Talca</p>
          <a href="mailto:colegio@colegiocamilohenriquez.cl" class="footer__link">colegio@colegiocamilohenriquez.cl</a>
        </div>
        <div>
          <p class="footer__title">Identidad</p>
          <p style="font-size:0.78rem;color:rgba(255,255,255,0.6);line-height:1.5">«Un colegio que enseña desde el futuro, para el futuro — porque el mapa solo puede dibujarse entre todos.»</p>
        </div>
      </div>
      <div class="footer__bottom">
        <p>Colegio Camilo Henríquez · Talca, Chile · 2026</p>
        <p>Proyecto de Intervención en fases de Investigación, diseño y desarrollo de prototipos</p>
      </div>
    </div>
  `;
  return footer;
}

function toggleMobileNav() {
  const nav = document.getElementById('mobile-nav');
  nav.classList.toggle('mobile-nav--open');
}

// Scroll animations
function initAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) e.target.classList.add('anim--visible');
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.anim').forEach(el => observer.observe(el));
}

// Auto-inject on load
document.addEventListener('DOMContentLoaded', () => {
  // Wrap existing body content in <main>
  const main = document.createElement('main');
  while (document.body.firstChild) main.appendChild(document.body.firstChild);
  document.body.appendChild(main);
  // Insert navbar + mobile nav before <main>
  document.body.insertBefore(buildNavbar(), main);
  document.body.insertBefore(buildMobileNav(), main);
  // Append footer after <main>
  document.body.appendChild(buildFooter());
  // Init animations
  initAnimations();
});