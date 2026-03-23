(function() {
  // Detect if we're inside /colegio/ subdir or at root level
  var path = window.location.pathname;
  var inSubdir = path.indexOf('/colegio/') !== -1;
  var subPrefix = inSubdir ? '' : 'colegio/';
  var rootPrefix = inSubdir ? '../' : '';

  var items = [
    { id: 'home',        label: 'Colegio',              href: rootPrefix + 'colegio.html' },
    { id: 'modelo',      label: 'Modelo Educativo',     href: subPrefix + 'modelo-educativo.html' },
    { id: 'proyectos',   label: 'Estudiantes en Acción', href: subPrefix + 'estudiantes-en-accion.html' },
    { id: 'familias',    label: 'Familias',             href: subPrefix + 'familias.html' },
    { id: 'estudiantes', label: 'Estudiantes',          href: subPrefix + 'estudiantes.html' },
    { id: 'testimonios', label: 'Testimonios',          href: subPrefix + 'testimonios.html' },
    { id: 'admision',    label: 'Admisión',             href: subPrefix + 'admision.html' }
  ];

  var currentFile = path.split('/').pop().replace('.html', '') || 'colegio';

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
