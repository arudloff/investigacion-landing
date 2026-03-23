(function(){

  function initMensajes() {
    var store = localStorage.getItem('v3_cuaderno');
    var notes = [];
    if (store) {
      try {
        var parsed = JSON.parse(store);
        if (parsed && parsed.reactions) {
          var keys = Object.keys(parsed.reactions);
          keys.forEach(function(k) {
            var r = parsed.reactions[k];
            if (r && r.text) notes.push({ text: r.text, key: k });
          });
        }
      } catch(e) {}
    }

    var empty = document.getElementById('mensajes-empty');
    var content = document.getElementById('mensajes-content');
    var lista = document.getElementById('notas-list');

    if (notes.length === 0) {
      if (empty) empty.style.display = 'flex';
      if (content) content.style.display = 'none';
      return;
    }

    if (empty) empty.style.display = 'none';
    if (content) content.style.display = 'block';

    if (lista) {
      lista.innerHTML = notes.map(function(n, i) {
        return '<div class="r-nota-item">' +
          '<div class="r-nota-dot"></div>' +
          '<div class="r-nota-text">' + n.text + '</div>' +
          '<button onclick="removeNota(\'' + encodeURIComponent(n.key) + '\')" class="r-nota-del" title="Quitar">&times;</button>' +
          '</div>';
      }).join('');
    }
  }

  window.removeNota = function(encodedKey) {
    var key = decodeURIComponent(encodedKey);
    var store = localStorage.getItem('v3_cuaderno');
    if (!store) return;
    try {
      var parsed = JSON.parse(store);
      if (parsed && parsed.reactions && parsed.reactions[key]) {
        delete parsed.reactions[key];
        localStorage.setItem('v3_cuaderno', JSON.stringify(parsed));
      }
    } catch(e) {}
    initMensajes();
  };

  window.generarMensajes = async function() {
    var store = localStorage.getItem('v3_cuaderno');
    var notes = [];
    if (store) {
      try {
        var parsed = JSON.parse(store);
        if (parsed && parsed.reactions) {
          Object.keys(parsed.reactions).forEach(function(k) {
            var r = parsed.reactions[k];
            if (r && r.text && r.active !== false) notes.push(r.text);
          });
        }
      } catch(e) {}
    }
    if (notes.length === 0) return;

    document.getElementById('btn-generar-mensajes').style.display = 'none';
    document.getElementById('mensajes-generating').style.display = 'block';

    var notasTexto = notes.map(function(t) { return '- ' + t; }).join('\n');

    var prompt = 'Eres un experto en comunicación y educación.\n' +
      'A partir de estas notas personales que alguien guardó mientras leía sobre\n' +
      'educación, IA y el futuro del trabajo, genera 3 mensajes para compartir\n' +
      'por WhatsApp o redes sociales.\n\n' +
      'NOTAS GUARDADAS:\n' + notasTexto + '\n\n' +
      'Genera exactamente este JSON sin backticks ni texto adicional:\n' +
      '{\n  "mensaje_1": "Mensaje para quien razona: dato + pregunta a sí mismo. Máx 55 palabras.",\n' +
      '  "mensaje_2": "Mensaje para quien siente: cotidiano + vulnerabilidad. Máx 55 palabras.",\n' +
      '  "mensaje_3": "Mensaje para quien actúa: posibilidad + convocatoria. Máx 55 palabras."\n}\n\n' +
      'REGLAS ABSOLUTAS:\n' +
      '- Primera persona siempre ("leí", "me hizo pensar", "descubrí")\n' +
      '- Nunca mencionar ningún colegio ni institución\n' +
      '- Nunca generar miedo ni urgencia apocalíptica\n' +
      '- Cada mensaje abre una pregunta o señala una posibilidad\n' +
      '- Sin emojis, sin URLs, sin hashtags\n' +
      '- Vocabulario distinto en los 3 mensajes';

    try {
      var res = await fetch('https://cupykpcsxjihnzwyflbm.supabase.co/functions/v1/synthesize-notebook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paragraphs: notes.map(function(t) { return { text: t, page: 'Recursos' }; }) })
      });
      var data = await res.json();

      var mensajes = [];
      if (data.messages && data.messages.length > 0) {
        mensajes = data.messages.map(function(m) {
          return m.replace(/^\*?\*?[Mm]ensaje\s*\d+[^:\n]*:?\*?\*?\s*/gm, '')
            .replace(/^\*?\*?—[^—\n]*—\*?\*?\s*/gm, '')
            .replace(/^\*\*/gm, '').replace(/\*\*$/gm, '')
            .trim();
        });
      }

      if (mensajes.length > 0) {
        var labels = ['Para quien razona', 'Para quien siente', 'Para quien actúa'];
        var grid = document.getElementById('mensajes-grid');
        if (grid) {
          grid.innerHTML = mensajes.slice(0, 3).map(function(m, i) {
            var safeMsg = m.replace(/`/g, "'").replace(/"/g, '&quot;');
            return '<div class="r-mensaje-card">' +
              '<div class="r-mensaje-label">' + (labels[i] || '') + '</div>' +
              '<div class="r-mensaje-text">' + m + '</div>' +
              '<button onclick="copiarMensaje(this,\'' + safeMsg.replace(/'/g, "\\'") + '\')" class="r-mensaje-copy">Copiar</button>' +
              '</div>';
          }).join('');
        }

        document.getElementById('mensajes-generating').style.display = 'none';
        document.getElementById('mensajes-resultado').style.display = 'block';
      }
    } catch(err) {
      console.error(err);
      document.getElementById('mensajes-generating').style.display = 'none';
      document.getElementById('btn-generar-mensajes').style.display = 'block';
    }
  };

  window.copiarMensaje = function(btn, texto) {
    navigator.clipboard.writeText(texto).then(function() {
      btn.textContent = '✓ Copiado';
      setTimeout(function() { btn.textContent = 'Copiar'; }, 2000);
    });
  };

  window.resetMensajes = function() {
    document.getElementById('mensajes-resultado').style.display = 'none';
    document.getElementById('btn-generar-mensajes').style.display = 'block';
  };

  // Init
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMensajes);
  } else {
    initMensajes();
  }

  // Auto-scroll si viene con ?action=mensajes
  if (window.location.search.indexOf('action=mensajes') !== -1) {
    document.addEventListener('DOMContentLoaded', function() {
      var el = document.getElementById('mensajes');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    });
  }

})();
