// nav.js — Navegación compartida · Dos capas: institucional + submenús

const NAV_ITEMS = [
  { href: 'index.html', label: 'Inicio' },
  {
    label: 'Proyecto Educativo',
    children: [
      { href: 'modelo-educativo.html', label: 'Nuestro modelo educativo' },
      { href: 'por-que-importa.html', label: '¿Por qué esto importa?' },
      { href: 'para-familias.html', label: 'Programa Familias Guardianas' },
    ]
  },
  {
    label: 'Comunidad',
    children: [
      { href: 'para-familias.html', label: 'Para familias de este colegio' },
      { href: 'familias-otros-colegios.html', label: 'Para familias de otros colegios' },
      { href: 'trabaja-con-nosotros.html', label: 'Para docentes' },
      { href: 'industria.html', label: 'Para la industria' },
    ]
  },
];

const MOBILE_LINKS = [
  { href: 'index.html', label: 'Inicio' },
  { label: 'Proyecto Educativo', isSection: true },
  { href: 'modelo-educativo.html', label: 'Nuestro modelo educativo' },
  { href: 'por-que-importa.html', label: '¿Por qué esto importa?' },
  { href: 'para-familias.html', label: 'Programa Familias Guardianas' },
  { label: 'Comunidad', isSection: true },
  { href: 'para-familias.html', label: 'Para familias de este colegio' },
  { href: 'familias-otros-colegios.html', label: 'Para familias de otros colegios' },
  { href: 'trabaja-con-nosotros.html', label: 'Para docentes' },
  { href: 'industria.html', label: 'Para la industria' },
];

const FOOTER_COLS = {
  proyecto: [
    { href: 'modelo-educativo.html', label: 'Modelo educativo' },
    { href: 'por-que-importa.html', label: '¿Por qué importa?' },
    { href: 'para-familias.html', label: 'Programa Familias Guardianas' },
  ],
  comunidad: [
    { href: 'para-familias.html', label: 'Familias de este colegio' },
    { href: 'familias-otros-colegios.html', label: 'Familias de otros colegios' },
    { href: 'industria.html', label: 'Industria y empresas' },
    { href: 'trabaja-con-nosotros.html', label: 'Trabaja con nosotros' },
  ],
};

function getCurrentPage() {
  return window.location.pathname.split('/').pop() || 'index.html';
}

function isActive(href) { return href === getCurrentPage(); }

function isParentActive(children) {
  return children.some(c => c.href === getCurrentPage());
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
      html += `<a href="${l.href}" class="mobile-nav__link${isActive(l.href) ? ' mobile-nav__link--active' : ''}">${l.label}</a>`;
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
          <p class="footer__title">Comunidad</p>
          ${FOOTER_COLS.comunidad.map(l => `<a href="${l.href}" class="footer__link">${l.label}</a>`).join('')}
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
        <p>Nacido en el Colegio Camilo Henríquez, Talca, Chile · Diseñado para cualquier escuela del mundo</p>
        <p style="margin-top:.35rem">Proyecto de Intervención en fases de Investigación, diseño y desarrollo de prototipos</p>
      </div>
    </div>
  `;
  return footer;
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
});