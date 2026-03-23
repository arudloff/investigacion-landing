(function() {
  var path = window.location.pathname;
  var inSubdir = path.indexOf('/nosotros/') !== -1;
  var subPrefix = inSubdir ? '' : 'nosotros/';
  var rootPrefix = inSubdir ? '../' : '';

  var items = [
    { id: 'home',       label: 'Nosotros',          href: rootPrefix + 'nosotros.html' },
    { id: 'fundamento', label: 'El Fundamento',     href: subPrefix + 'fundamento.html' },
    { id: 'linea-de-tiempo', label: 'Línea de Tiempo', href: subPrefix + 'linea-de-tiempo.html' },
    { id: 'equipo',     label: 'Equipo',            href: subPrefix + 'equipo.html' }
  ];

  var currentFile = path.split('/').pop().replace('.html', '') || 'nosotros';

  var nav = document.createElement('div');
  nav.className = 'r-subnav';
  nav.id = 'nosotros-subnav';
  nav.innerHTML = items.map(function(item) {
    var isActive =
      currentFile === item.id ||
      (currentFile === 'nosotros' && item.id === 'home');
    return '<a class="' + (isActive ? 'active' : '') + '" href="' + item.href + '">' + item.label + '</a>';
  }).join('');

  var content = document.getElementById('v3-content');
  if (content) content.prepend(nav);
})();
