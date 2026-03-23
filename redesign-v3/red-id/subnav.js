(function() {
  var path = window.location.pathname;
  var inSubdir = path.indexOf('/red-id/') !== -1;
  var subPrefix = inSubdir ? '' : 'red-id/';
  var rootPrefix = inSubdir ? '../' : '';

  var items = [
    { id: 'home',           label: 'Red de I+D',       href: rootPrefix + 'red-id.html' },
    { id: 'cepah',          label: 'CEPAH',             href: subPrefix + 'cepah.html' },
    { id: 'empresas',       label: 'Empresas',          href: subPrefix + 'empresas.html' },
    { id: 'universidades',  label: 'Universidades',     href: subPrefix + 'universidades.html' },
    { id: 'gobiernos',      label: 'Gobiernos',         href: subPrefix + 'gobiernos.html' },
    { id: 'docentes',       label: 'Docentes',          href: subPrefix + 'docentes.html' },
    { id: 'colegios',       label: 'Colegios',          href: subPrefix + 'colegios.html' }
  ];

  var currentFile = path.split('/').pop().replace('.html', '') || 'red-id';

  var nav = document.createElement('div');
  nav.className = 'r-subnav';
  nav.id = 'redid-subnav';
  nav.innerHTML = items.map(function(item) {
    var isActive =
      currentFile === item.id ||
      (currentFile === 'red-id' && item.id === 'home');
    return '<a class="' + (isActive ? 'active' : '') + '" href="' + item.href + '">' + item.label + '</a>';
  }).join('');

  var content = document.getElementById('v3-content');
  if (content) content.prepend(nav);
})();
