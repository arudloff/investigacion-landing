// nav.js — Navegación + Footer compartidos · Inyectados en todas las páginas
// Cambios 9+10 de la iteración Antigravity

const NAV_ITEMS = [
  { href: 'index.html', label: 'Inicio' },
  {
    label: 'Proyecto Educativo',
    children: [
      { href: 'modelo-educativo.html', label: 'Nuestro modelo educativo' },
      { href: 'por-que-importa.html', label: 'Por qué esto importa' },
      { href: 'contexto-global.html', label: 'El contexto que nos moviliza' },
      { href: 'para-familias.html', label: 'Programa Familias Guardianas' },
      { href: 'publicaciones.html', label: 'Publicaciones' },
    ]
  },
  {
    label: 'Comunidad',
    children: [
      { href: 'para-familias.html', label: 'Para familias de este colegio' },
      { href: 'para-familias.html#otras-familias', label: 'Para familias de otros colegios' },
      { href: 'trabaja-con-nosotros.html', label: 'Para docentes' },
      { href: 'industria.html', label: 'Para la industria' },
      { href: 'universidades.html', label: 'Para universidades e investigadores' },
      { href: 'gobiernos.html', label: 'Para gobiernos y política pública' },
    ]
  },
  { href: 'visita.html', label: 'Admisión' },
  { href: '#contacto', label: 'Contacto' },
];

const MOBILE_LINKS = [
  { href: 'index.html', label: 'Inicio' },
  { label: 'Proyecto Educativo', isSection: true },
  { href: 'modelo-educativo.html', label: 'Nuestro modelo educativo' },
  { href: 'por-que-importa.html', label: 'Por qué esto importa' },
  { href: 'contexto-global.html', label: 'El contexto que nos moviliza' },
  { href: 'para-familias.html', label: 'Programa Familias Guardianas' },
  { href: 'publicaciones.html', label: 'Publicaciones' },
  { label: 'Comunidad', isSection: true },
  { href: 'para-familias.html', label: 'Familias de este colegio' },
  { href: 'para-familias.html#otras-familias', label: 'Familias de otros colegios' },
  { href: 'trabaja-con-nosotros.html', label: 'Para docentes' },
  { href: 'industria.html', label: 'Para la industria' },
  { href: 'universidades.html', label: 'Universidades e investigadores' },
  { href: 'gobiernos.html', label: 'Gobiernos y política pública' },
  { label: '', isSection: true },
  { href: 'visita.html', label: 'Admisión · Visita guiada' },
];

function getCurrentPage() {
  return window.location.pathname.split('/').pop() || 'index.html';
}
function isActive(href) {
  const page = getCurrentPage();
  return href === page || href.split('#')[0] === page;
}
function isParentActive(children) {
  return children.some(c => isActive(c.href));
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
        <!-- IMAGEN: Logo del Colegio Camilo Henríquez -->
        Colegio Camilo Henríquez
      </a>
      <div class="navbar__menu">${menuHTML}</div>
      <button class="navbar__hamburger" onclick="toggleMobileNav()" aria-label="Menú">&#9776;</button>
    </div>`;
  return nav;
}

function buildMobileNav() {
  const overlay = document.createElement('div');
  overlay.className = 'mobile-nav';
  overlay.id = 'mobile-nav';
  let html = '';
  MOBILE_LINKS.forEach(l => {
    if (l.isSection) {
      if (l.label) html += `<div class="mobile-nav__section">${l.label}</div>`;
      else html += `<div style="margin-top:.5rem"></div>`;
    } else {
      html += `<a href="${l.href}" class="mobile-nav__link${isActive(l.href) ? ' mobile-nav__link--active' : ''}">${l.label}</a>`;
    }
  });
  overlay.innerHTML = `<button class="mobile-nav__close" onclick="toggleMobileNav()">&times;</button>${html}`;
  return overlay;
}

function buildFooter() {
  const f = document.createElement('footer');
  f.className = 'footer';
  f.innerHTML = `
    <div class="container">
      <p class="footer__hero anim">Nacido en el Colegio Camilo Henríquez, Talca, Chile · Diseñado para cualquier escuela del mundo</p>
      <div class="footer__grid">
        <div>
          <p class="footer__title">Navegación</p>
          <a href="index.html" class="footer__link">Inicio</a>
          <a href="modelo-educativo.html" class="footer__link">Modelo educativo</a>
          <a href="por-que-importa.html" class="footer__link">Por qué importa</a>
          <a href="contexto-global.html" class="footer__link">Contexto global</a>
          <a href="publicaciones.html" class="footer__link">Publicaciones</a>
        </div>
        <div>
          <p class="footer__title">Audiencias</p>
          <a href="para-familias.html" class="footer__link">Familias de este colegio</a>
          <a href="para-familias.html#otras-familias" class="footer__link">Familias de otros colegios</a>
          <a href="industria.html" class="footer__link">Empresas e industria</a>
          <a href="universidades.html" class="footer__link">Universidades e investigación</a>
          <a href="gobiernos.html" class="footer__link">Gobiernos</a>
          <a href="trabaja-con-nosotros.html" class="footer__link">Docentes</a>
        </div>
        <div>
          <p class="footer__title">Contacto</p>
          <p class="footer__address">Av. Lircay 2550, Talca</p>
          <a href="mailto:colegio@colegiocamilohenriquez.cl" class="footer__link">colegio@colegiocamilohenriquez.cl</a>
          <p style="margin-top:.75rem;font-size:.78rem;color:rgba(255,255,255,.5)">[Nombre Apellido] · Dirección Académica</p>
          <p style="font-size:.78rem;color:rgba(255,255,255,.5)">[Nombre Apellido] · Coordinación de Alianzas</p>
          <p style="font-size:.78rem;color:rgba(255,255,255,.5)">[Nombre Apellido] · Admisión y Familias</p>
        </div>
        <div>
          <p class="footer__title">Fuentes citadas</p>
          <p style="font-size:.75rem;color:rgba(255,255,255,.5);line-height:1.6">OCDE · WEF · Goldman Sachs · PwC · FMI · McKinsey · Lightcast · CASEL · Harvard PZ · UNESCO · INE · CENIA-SOFOFA · Ipsos · 2026</p>
          <a href="contexto-global.html#fuentes" class="footer__link" style="margin-top:.5rem">Ver todas las fuentes &rarr;</a>
        </div>
      </div>
      <div class="footer__bottom">
        <p>&copy; 2026 Colegio Camilo Henríquez · Proyecto en evolución continua</p>
      </div>
    </div>`;
  return f;
}

function toggleMobileNav() {
  document.getElementById('mobile-nav').classList.toggle('mobile-nav--open');
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

// Animated counter for stat cards
function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      if (el.dataset.counted) return;
      el.dataset.counted = '1';
      const target = el.dataset.count;
      const suffix = el.dataset.suffix || '';
      const isNum = !isNaN(parseFloat(target));
      if (!isNum) { el.textContent = target + suffix; return; }
      const end = parseFloat(target);
      const duration = 1500;
      const start = performance.now();
      function tick(now) {
        const t = Math.min((now - start) / duration, 1);
        const ease = 1 - Math.pow(1 - t, 3); // easeOutCubic
        const val = Math.round(ease * end);
        el.textContent = val + suffix;
        if (t < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    });
  }, { threshold: 0.3 });
  counters.forEach(el => observer.observe(el));
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
  initCounters();
});