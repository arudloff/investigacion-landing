// Auth guard simplificado - acceso por acuerdo de confidencialidad
function checkAccess() {
  if (localStorage.getItem('fg_access') === 'granted') return true;
  window.location.href = 'solicitud.html';
  return false;
}

function doLogout() {
  localStorage.removeItem('fg_access');
  localStorage.removeItem('fg_nombre');
  localStorage.removeItem('fg_email');
  window.location.href = 'index.html';
}

function initAnimations() {
  var obs = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) { if (e.isIntersecting) e.target.classList.add('anim--visible'); });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.anim').forEach(function(el) { obs.observe(el); });
}

function initActivePageNav() {
  var current = window.location.pathname.split('/').pop() || 'privado.html';
  document.querySelectorAll('.sitenav a').forEach(function(a) {
    if (a.getAttribute('href') === current) a.classList.add('sitenav--active');
  });
}