(function() {
  var items = [
    { id: 'home',        label: 'Colegio',                        href: '../colegio.html' },
    { id: 'modelo',      label: 'Modelo Educativo',               href: 'modelo-educativo.html' },
    { id: 'proyectos',   label: 'Estudiantes en Acción',          href: 'estudiantes-en-accion.html' },
    { id: 'familias',    label: 'Familias',                       href: 'familias.html' },
    { id: 'estudiantes', label: 'Estudiantes',                    href: 'estudiantes.html' },
    { id: 'testimonios', label: 'Testimonios',                    href: 'testimonios.html' },
    { id: 'admision',    label: 'Admisión',                       href: 'admision.html' }
  ];

  var currentFile = window.location.pathname.split('/').pop().replace('.html', '') || 'colegio';

  var nav = document.createElement('div');
  nav.className = 'r-subnav';
  nav.id = 'colegio-subnav';
  nav.innerHTML = items.map(function(item) {
    var isActive =
      currentFile === item.id ||
      (currentFile === 'colegio' && item.id === 'home') ||
      (currentFile === 'estudiantes-en-accion' && item.id === 'proyectos') ||
      (currentFile === 'modelo-educativo' && item.id === 'modelo');
    return '<a class="' + (isActive ? 'active' : '') + '" href="' + item.href + '">' + item.label + '</a>';
  }).join('');

  var content = document.getElementById('v3-content');
  if (content) content.prepend(nav);
})();
