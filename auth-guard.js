// Auth guard compartido para todas las páginas privadas
var sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function checkAuth() {
  var r = await sb.auth.getSession();
  if (r.data && r.data.session) return true;
  // No hay sesión, redirigir a solicitud
  window.location.href = 'solicitud.html';
  return false;
}

async function doLogout() {
  await sb.auth.signOut();
  window.location.href = 'solicitud.html';
}

// Animaciones de scroll compartidas
function initAnimations() {
  var obs = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) { if (e.isIntersecting) e.target.classList.add('anim--visible'); });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.anim').forEach(function(el) { obs.observe(el); });
}

// Active nav link
function initActivePageNav() {
  var current = window.location.pathname.split('/').pop() || 'privado.html';
  document.querySelectorAll('.sitenav a').forEach(function(a) {
    if (a.getAttribute('href') === current) a.classList.add('sitenav--active');
  });
}
