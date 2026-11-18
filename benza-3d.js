/* Parben Home · Benza en 3D para la ficha de producto (Tienda Nube).
   Lo carga una etiqueta de GTM. Mientras PARBEN3D_PUBLICO no sea true, solo se ve con ?ver3d=1
   (queda recordado en ese navegador; ?ver3d=0 lo apaga). */
(function () {
  if (window.__parben3d) return; window.__parben3d = true;
  var BASE = (function () {
    var s = document.currentScript || [].slice.call(document.getElementsByTagName('script')).filter(function (x) { return /benza-3d\.js/.test(x.src); })[0];
    return s ? s.src.replace(/benza-3d\.js.*$/, '') : '';
  })();
  var MV_URL = window.PARBEN3D_MV || 'https://unpkg.com/@google/model-viewer@3.5.0/dist/model-viewer.min.js';
  var q = location.search;
  try {
    if (/[?&]ver3d=1/.test(q)) localStorage.setItem('parben3d', '1');
    if (/[?&]ver3d=0/.test(q)) localStorage.removeItem('parben3d');
  } catch (e) {}
  var habilitado = window.PARBEN3D_PUBLICO === true;
  try { habilitado = habilitado || localStorage.getItem('parben3d') === '1'; } catch (e) {}
  if (!habilitado && !/[?&]ver3d=1/.test(q)) return;

  var LINEAS = [
  { id: 'odin', n: 'Odín', tex: 'odin', d: 'Pana de terminación aterciopelada, con proceso antimanchas. 100% poliéster.', c: [
    ['natural', '#B8B5A9'], ['lino', '#928E84'], ['visón', '#9F9D8F'], ['gold', '#987A22'],
    ['terra', '#6D352B'], ['oliva', '#797558'], ['musgo', '#686A62'], ['azul', '#2D4A6D'],
    ['jade', '#B4AFA5'], ['gris', '#727771'], ['plomo', '#676A67'], ['nickel', '#54545F']] },
  { id: 'shot', n: 'Shot', d: 'Pana de pelo corto con tratamiento antimanchas. 100% poliéster, ideal si tenés mascotas.', c: [
    ['latte', '#C7BCAC'], ['antique', '#BAAE91'], ['mastic', '#A19A8B'], ['stone', '#7E776C'],
    ['mustang', '#9A896F'], ['gold', '#DAB509'], ['bronze', '#A4801A'], ['cheek', '#B35D4C'],
    ['morado', '#9C8382'], ['piedra', '#A9A49A'], ['onyx', '#6C6C6A'], ['nickel', '#3D4445'],
    ['black', '#13171A'], ['blue', '#2D4663'], ['pine', '#2E5856'], ['green', '#102A20']] }, { id: 'murano', n: 'Murano', tex: 'murano', d: 'Pana de trama cerrada con proceso antimanchas. El pelo de las mascotas sale fácil.', c: [
    ['off white', '#ECEDEC'], ['beige', '#CEC9C3'], ['piedra', '#BAB3A9'], ['natural', '#D2C0A9'],
    ['camel', '#98846A'], ['visón', '#867D72'], ['chocolate', '#302823'], ['rojo', '#830519'],
    ['canela', '#732309'], ['mostaza', '#D2970C'], ['gris perla', '#A1A49E'], ['gris medio', '#6A6E6B'],
    ['verde seco', '#8F8E73'], ['verde malba', '#4C5D51'], ['petróleo', '#183C4C'], ['marino', '#0F2238'],
    ['acero', '#3F4143'], ['gris grafito', '#212224'], ['negro', '#0D0E12']] },
  { id: 'panne', n: 'Panné', tex: 'panne', d: 'Pana aterciopelada con antimanchas: el líquido queda arriba y se limpia fácil. Suave y con brillo.', c: [
    ['natural', '#C9BA9E'], ['beige', '#A0876A'], ['gamuza', '#896A4E'], ['dulce de leche', '#7F5D2A'],
    ['gold', '#8F6B1E'], ['yellow', '#BA8E1B'], ['almond', '#A1632C'], ['terracota', '#8B5148'],
    ['mocca', '#402B22'], ['seco', '#847362'], ['gris oscuro', '#63594F'], ['gris', '#5E544E'],
    ['perla', '#A9A293'], ['jade', '#88806C'], ['grey', '#4C4A46'], ['ultramar', '#465462'],
    ['dark blue', '#091635'], ['verde inglés', '#5D633B'], ['ocean', '#1C3939'], ['negro', '#090A0E']] }, { id: 'city', n: 'City', tex: 'city', d: 'Chenille antidesgarro de tramado semi rústico, parecido al lino. 100% poliéster. La más resistente a las uñas.', c: [
    ['natural', '#DFD9CB'], ['beige', '#CFC4AA'], ['arena', '#B6A689'], ['antique', '#9B896B'],
    ['cielo', '#91ABC6'], ['turquesa', '#3994AD'], ['blue', '#385078'], ['lila', '#B289A9'],
    ['uva', '#6D5166'], ['brick', '#CC5E47'], ['rojo', '#D13E4D'], ['bordó', '#AA4943'],
    ['mango', '#DAC957'], ['verde inglés', '#889061'], ['chocolate', '#625142'], ['piedra', '#B7BDBD'],
    ['almendra', '#C3BDB5'], ['plata', '#939394'], ['gris', '#6A6F70'], ['plomo', '#525151'], ['black', '#191E1F']] }
  ];
  var ANCHOS = ['140', '160', '180', '200', '220'], PROFS = ['80', '85', '90', '95', '100'];
  var W = '180', P = '90', linea = LINEAS[0], color = linea.c[1][1], texs = {}, mv = null;

  var css = '' +
    '.pb3d-btn{display:flex;align-items:center;justify-content:center;gap:10px;width:100%;margin:14px 0 0;padding:15px 18px;border:1px solid #37332D;background:transparent;color:#37332D;font:400 14px/1 Jost,"Helvetica Neue",Arial,sans-serif;letter-spacing:.04em;cursor:pointer}' +
    '.pb3d-btn:hover{background:#37332D;color:#F2F3EE}' +
    '.pb3d-btn svg{width:18px;height:18px}' +
    '.pb3d-modal{position:fixed;inset:0;z-index:99999;background:#F2F3EE;display:none;flex-direction:column;font-family:Jost,"Helvetica Neue",Arial,sans-serif;color:#37332D}' +
    '.pb3d-modal.abierto{display:flex}' +
    '.pb3d-top{display:flex;justify-content:space-between;align-items:center;padding:14px 16px;border-bottom:1px solid #DCD8CE}' +
    '.pb3d-top p{margin:0;font-size:11px;letter-spacing:.3em;text-transform:uppercase;color:#6E675C}' +
    '.pb3d-x{background:none;border:0;font-size:28px;line-height:1;cursor:pointer;color:#37332D;padding:4px 8px}' +
    '.pb3d-cuerpo{flex:1;display:grid;grid-template-columns:minmax(0,1.7fr) minmax(280px,1fr);min-height:0}' +
    '.pb3d-visor{position:relative;min-height:0}' +
    '.pb3d-visor model-viewer{width:100%;height:100%;background:transparent;--poster-color:transparent}' +
    '.pb3d-ar{position:absolute;left:50%;bottom:18px;transform:translateX(-50%);background:#37332D;color:#F2F3EE;border:0;padding:14px 22px;font:400 14px Jost,Arial,sans-serif;cursor:pointer;white-space:nowrap}' +
    '.pb3d-panel{overflow:auto;padding:20px 20px 28px;border-left:1px solid #DCD8CE}' +
    '.pb3d-l{font-size:10px;letter-spacing:.3em;text-transform:uppercase;color:#6E675C;margin:0 0 10px}' +
    '.pb3d-f{display:flex;flex-wrap:wrap;gap:8px;margin:0 0 20px}' +
    '.pb3d-p{border:1px solid #DCD8CE;background:transparent;color:#6E675C;padding:10px 14px;font:300 14px Jost,Arial,sans-serif;cursor:pointer}' +
    '.pb3d-p[aria-pressed=true]{border-color:#37332D;color:#100F0F}' +
    '.pb3d-sw{width:34px;height:34px;border-radius:50%;border:1px solid #DCD8CE;cursor:pointer;padding:0}' +
    '.pb3d-sw[aria-pressed=true]{box-shadow:0 0 0 2px #F2F3EE,0 0 0 3px #37332D}' +
    '.pb3d-d{font-size:12px;color:#6E675C;line-height:1.5;margin:-10px 0 18px}' +
    '.pb3d-n{font-size:13px;color:#6E675C;margin:-10px 0 18px}' +
    '.pb3d-a{font-size:12px;color:#6E675C;margin:0}' +
    '@media (max-width:760px){.pb3d-cuerpo{grid-template-columns:1fr;grid-template-rows:minmax(0,1fr) auto}.pb3d-panel{border-left:0;border-top:1px solid #DCD8CE;max-height:42vh;padding:16px}}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  function el(tag, cls, txt) { var e = document.createElement(tag); if (cls) e.className = cls; if (txt) e.textContent = txt; return e; }

  // botón en la ficha
  var btn = el('button', 'pb3d-btn');
  btn.type = 'button';
  btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M12 2l9 5v10l-9 5-9-5V7z"/><path d="M12 22V12M21 7l-9 5-9-5"/></svg><span>ver en 3D · en tu living</span>';
  function ubicar() {
    if (document.body.contains(btn)) return true;
    var sel = ['.js-product-slider-container', '.js-swiper-product', '.product-image-container', '[data-store="product-image"]', '.js-product-image-container', '.product-images', '.js-product-detail-images'];
    for (var i = 0; i < sel.length; i++) {
      var g = document.querySelector(sel[i]);
      if (g && g.parentNode) { g.parentNode.insertBefore(btn, g.nextSibling); return true; }
    }
    var f = document.querySelector('.js-addtocart, [data-store="product-buy-button"], form[action*="cart"]');
    if (f && f.parentNode) { f.parentNode.insertBefore(btn, f); return true; }
    var h1 = document.querySelector('h1');
    if (h1 && h1.parentNode) { h1.parentNode.insertBefore(btn, h1.nextSibling); return true; }
    return false;
  }

  // ventana del visor
  var modal = el('div', 'pb3d-modal');
  modal.setAttribute('role', 'dialog'); modal.setAttribute('aria-label', 'Benza en 3D');
  modal.innerHTML =
    '<div class="pb3d-top"><p>sofá benza · en 3D</p><button class="pb3d-x" type="button" aria-label="cerrar">&times;</button></div>' +
    '<div class="pb3d-cuerpo"><div class="pb3d-visor" id="pb3dVisor"></div><div class="pb3d-panel">' +
    '<p class="pb3d-l">ancho</p><div class="pb3d-f" id="pb3dW"></div>' +
    '<p class="pb3d-l">profundidad</p><div class="pb3d-f" id="pb3dP"></div>' +
    '<p class="pb3d-l">tela</p><div class="pb3d-f" id="pb3dL"></div><p class="pb3d-d" id="pb3dD"></p>' +
    '<p class="pb3d-l">color</p><div class="pb3d-f" id="pb3dC"></div><p class="pb3d-n" id="pb3dN"></p>' +
    '<p class="pb3d-a">Arrastrá para girar · pellizcá para acercar. Los colores en pantalla son de referencia: vení a verlos al showroom.</p>' +
    '</div></div>';
  function $(id) { return modal.querySelector('#' + id); }

  function pills(cont, vals, act, fn) {
    cont.innerHTML = '';
    vals.forEach(function (v) {
      var b = el('button', 'pb3d-p', v + ' cm'); b.type = 'button';
      b.setAttribute('aria-pressed', v === act ? 'true' : 'false');
      b.onclick = function () { [].forEach.call(cont.children, function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); }); fn(v); };
      cont.appendChild(b);
    });
  }
  function lineal(hex) { return [1, 3, 5].map(function (i) { return Math.pow(parseInt(hex.substr(i, 2), 16) / 255, 2.2); }).concat(1); }
  function pintar() {
    if (!mv || !mv.model) return;
    var id = linea.tex || 'base';
    if (!texs[id]) texs[id] = mv.createTexture(BASE + 'tex/' + id + '.png');
    texs[id].then(function (t) {
      mv.model.materials.forEach(function (m) {
        var ti = m.pbrMetallicRoughness.baseColorTexture;
        if (m.name === 'madera' || !ti) return;
        ti.setTexture(t);
        if (ti.texture && ti.texture.sampler) { ti.texture.sampler.setWrapS(10497); ti.texture.sampler.setWrapT(10497); }
      });
    });
    var c = lineal(color);
    mv.model.materials.forEach(function (m) {
      if (m.name === 'tela') m.pbrMetallicRoughness.setBaseColorFactor(c);
      if (m.name === 'botones') m.pbrMetallicRoughness.setBaseColorFactor(c.map(function (v, i) { return i < 3 ? v * 0.72 : 1; }));
    });
  }
  function cargar() { if (mv) mv.src = BASE + 'benza_' + W + 'x' + P + '.glb'; }
  function elegirColor(c) {
    color = c[1]; $('pb3dN').textContent = linea.n + ' · ' + c[0];
    [].forEach.call($('pb3dC').children, function (x) { x.setAttribute('aria-pressed', x.getAttribute('data-c') === c[1] ? 'true' : 'false'); });
    pintar();
  }
  function elegirLinea(l) {
    linea = l; $('pb3dD').textContent = l.d || '';
    [].forEach.call($('pb3dL').children, function (x) { x.setAttribute('aria-pressed', x.getAttribute('data-l') === l.id ? 'true' : 'false'); });
    var cc = $('pb3dC'); cc.innerHTML = '';
    l.c.forEach(function (c) {
      var b = el('button', 'pb3d-sw'); b.type = 'button'; b.style.background = c[1];
      b.setAttribute('data-c', c[1]); b.setAttribute('aria-label', c[0]); b.title = c[0];
      b.onclick = function () { elegirColor(c); };
      cc.appendChild(b);
    });
    elegirColor(l.c[1] || l.c[0]);
  }

  var armado = false;
  function armar() {
    if (armado) return; armado = true;
    if (!window.customElements || !customElements.get('model-viewer')) {
      var s = document.createElement('script'); s.type = 'module'; s.src = MV_URL; document.head.appendChild(s);
    }
    mv = document.createElement('model-viewer');
    mv.setAttribute('alt', 'Sofá Benza en 3D');
    mv.setAttribute('ar', ''); mv.setAttribute('ar-modes', 'webxr scene-viewer quick-look');
    mv.setAttribute('ar-scale', 'fixed'); mv.setAttribute('ar-placement', 'floor');
    mv.setAttribute('camera-controls', ''); mv.setAttribute('touch-action', 'pan-y');
    mv.setAttribute('camera-orbit', '25deg 72deg 110%'); mv.setAttribute('shadow-intensity', '1');
    mv.setAttribute('exposure', '1.05'); mv.setAttribute('environment-image', 'neutral');
    var ar = el('button', 'pb3d-ar', 'verlo en tu living →'); ar.setAttribute('slot', 'ar-button'); ar.type = 'button';
    mv.appendChild(ar);
    mv.addEventListener('load', pintar);
    $('pb3dVisor').appendChild(mv);
    pills($('pb3dW'), ANCHOS, W, function (v) { W = v; cargar(); });
    pills($('pb3dP'), PROFS, P, function (v) { P = v; cargar(); });
    var lc = $('pb3dL');
    LINEAS.forEach(function (l) {
      var b = el('button', 'pb3d-p', l.n); b.type = 'button'; b.setAttribute('data-l', l.id);
      b.onclick = function () { elegirLinea(l); };
      lc.appendChild(b);
    });
    elegirLinea(LINEAS[0]);
    cargar();
  }
  function abrir() {
    if (!modal.parentNode) document.body.appendChild(modal);
    armar(); modal.classList.add('abierto'); document.documentElement.style.overflow = 'hidden';
    try { window.dataLayer = window.dataLayer || []; window.dataLayer.push({ event: 'benza_3d_abierto' }); } catch (e) {}
  }
  function cerrar() { modal.classList.remove('abierto'); document.documentElement.style.overflow = ''; }
  btn.onclick = abrir;
  modal.querySelector('.pb3d-x').onclick = cerrar;
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') cerrar(); });

  function intentar(n) { if (!ubicar() && n > 0) setTimeout(function () { intentar(n - 1); }, 400); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { intentar(15); });
  else intentar(15);
})();
