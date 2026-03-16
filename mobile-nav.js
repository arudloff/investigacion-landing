// Mobile navigation - shared across all pages
(function() {
  // Only show on mobile (or always as fallback)
  var currentPage = window.location.pathname.split('/').pop() || 'privado.html';

  var links = [
    { href: 'privado.html', label: 'Inicio', icon: '&#x1F3E0;' },
    { href: 'contexto.html', label: 'Contexto', icon: '&#x1F4CA;' },
    { href: 'evidencia.html', label: 'Evidencia', icon: '&#x1F4D6;' },
    { href: 'modelo-educativo.html', label: 'Modelo', icon: '&#x1F3EB;' },
    { href: 'eslabon.html', label: 'Eslabón', icon: '&#x26A0;' },
    { href: 'intervencion.html', label: 'Intervención', icon: '&#x2699;' },
    { href: 'para-familias.html', label: 'Familias', icon: '&#x1F46A;' },
    { href: 'para-escuelas.html', label: 'Escuelas', icon: '&#x1F3EB;' },
    { href: 'fuentes.html', label: 'Fuentes', icon: '&#x1F4D6;' }
  ];

  // Create FAB button
  var fab = document.createElement('button');
  fab.className = 'mob-fab';
  fab.innerHTML = '&#9776;';
  fab.title = 'Menú';
  fab.onclick = function() {
    var menu = document.getElementById('mob-menu');
    menu.classList.toggle('mob-menu--open');
  };

  // Create menu
  var menu = document.createElement('div');
  menu.className = 'mob-menu';
  menu.id = 'mob-menu';

  var heading = document.createElement('div');
  heading.className = 'mob-menu__head';
  heading.textContent = 'Navegación';
  menu.appendChild(heading);

  links.forEach(function(link) {
    var a = document.createElement('a');
    a.className = 'mob-menu__link';
    a.href = link.href;
    if (link.href === currentPage) a.classList.add('mob-menu__link--active');
    a.innerHTML = '<span class="mob-menu__icon">' + link.icon + '</span> ' + link.label;
    menu.appendChild(a);
  });

  // Add home link
  var homeLink = document.createElement('a');
  homeLink.className = 'mob-menu__link mob-menu__link--home';
  homeLink.href = 'index.html';
  homeLink.textContent = '← Sitio público';
  menu.appendChild(homeLink);

  document.body.appendChild(fab);
  document.body.appendChild(menu);

  // Close menu when clicking outside
  document.addEventListener('click', function(e) {
    if (!fab.contains(e.target) && !menu.contains(e.target)) {
      menu.classList.remove('mob-menu--open');
    }
  });
})();
