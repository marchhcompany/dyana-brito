/* Dyana Brito Festas — interações do site (menu, catálogo, galeria, vídeos, dúvidas, orçamento, cookies e métricas) */
(function () {
  'use strict';

  var WHATS = '5521985473708';
  var CONSENT_KEY = 'dy_consent';

  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }
  function waLink(msg) { return 'https://wa.me/' + WHATS + '?text=' + encodeURIComponent(msg); }
  function track(name, params) { if (window.gtag) window.gtag('event', name, params || {}); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  /* ---------- Animação de entrada das seções ---------- */
  var revealObserver = 'IntersectionObserver' in window ? new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('is-visible'); revealObserver.unobserve(e.target); }
    });
  }, { rootMargin: '0px 0px -8% 0px' }) : null;
  function observeReveal(root) {
    $$('.reveal:not(.is-visible)', root).forEach(function (el) {
      if (revealObserver) revealObserver.observe(el); else el.classList.add('is-visible');
    });
  }
  observeReveal(document);

  /* ---------- Cabeçalho: sombra ao rolar e menu do celular ---------- */
  var header = $('header');
  function onScroll() { if (header) header.classList.toggle('shadow-[var(--shadow-festive)]', window.scrollY > 12); }
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

  var menuBtn = $('header button[aria-controls="menu-mobile"]');
  var menu = $('#menu-mobile');
  var ICON_MENU = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-6" aria-hidden="true"><path d="M4 5h16"/><path d="M4 12h16"/><path d="M4 19h16"/></svg>';
  var ICON_X = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-6" aria-hidden="true"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>';
  function setMenu(open) {
    if (!menu || !menuBtn) return;
    menu.classList.toggle('hidden', !open);
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    menuBtn.innerHTML = open ? ICON_X : ICON_MENU;
  }
  if (menuBtn) menuBtn.addEventListener('click', function () { setMenu(menuBtn.getAttribute('aria-expanded') !== 'true'); });
  if (menu) menu.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });

  /* ---------- Abas (catálogo e galeria) ---------- */
  var TAB_ON = ['border-primary', 'bg-primary', 'text-primary-foreground', 'shadow-[var(--shadow-festive)]'];
  var TAB_OFF = ['border-border', 'bg-card', 'text-foreground', 'hover:-translate-y-0.5', 'hover:border-secondary', 'hover:text-secondary'];
  function setTabs(list, activeId) {
    $$('[role=tab]', list).forEach(function (b) {
      var on = b.dataset.id === activeId;
      b.setAttribute('aria-selected', String(on));
      TAB_ON.forEach(function (c) { b.classList.toggle(c, on); });
      TAB_OFF.forEach(function (c) { b.classList.toggle(c, !on); });
    });
  }

  /* ---------- Catálogo ---------- */
  var catTabs = $('#catalogo [role=tablist]');
  function filterCatalog(id) {
    if (!catTabs) return;
    setTabs(catTabs, id);
    $$('#catalogo [data-cat]').forEach(function (card) {
      card.hidden = !(id === 'todos' || card.dataset.cat === id);
      if (!card.hidden) card.classList.add('is-visible');
    });
  }
  if (catTabs) catTabs.addEventListener('click', function (e) { var b = e.target.closest('[role=tab]'); if (b) filterCatalog(b.dataset.id); });
  function catalogFromHash() {
    var m = location.hash.match(/^#catalogo-(\w+)/);
    if (!m) return;
    filterCatalog(m[1]);
    var sec = $('#catalogo'); if (sec) sec.scrollIntoView({ behavior: 'smooth' });
  }
  window.addEventListener('hashchange', catalogFromHash); catalogFromHash();

  /* ---------- Galeria ---------- */
  var FOTOS = [
    ['decoracao-5', 'decoracao', 'Decoração de festa tema futebol com balões verdes e brancos'],
    ['gladiador-1', 'inflaveis', 'Inflável gladiador vermelho e azul montado ao ar livre'],
    ['cama-elastica-1', 'infantil', 'Cama elástica com rede de proteção montada em quintal'],
    ['aero-hockey-1', 'jogos', 'Mesa de aero hockey com LED azul'],
    ['decoracao-9', 'decoracao', 'Decoração de festa tema Frozen com balões azuis e lilás'],
    ['casinha-1', 'infantil', 'Casinha de bolinhas com toldo colorido'],
    ['toboagua-premium', 'inflaveis', 'Toboágua premium inflável com escorregador e piscina'],
    ['area-baby-1', 'infantil', 'Área baby com casinha de bolinhas, escorregador e gangorrinhas'],
    ['decoracao-7', 'decoracao', 'Decoração de festa tema princesas com balões lilás'],
    ['fliperama', 'jogos', 'Máquina de fliperama arcade para festas'],
    ['decoracao-1', 'decoracao', 'Decoração de aniversário com balões dourados e mesas de madeira com vista para o mar'],
    ['piscina-bolinha-1', 'inflaveis', 'Piscina inflável de bolinhas com rede de proteção'],
    ['area-baby-2', 'infantil', 'Área baby com cama elástica, casinha de bolinhas e escorregador'],
    ['decoracao-4', 'decoracao', 'Decoração de festa tema Homem-Aranha com arco de balões'],
    ['toboagua', 'inflaveis', 'Toboágua inflável colorido montado no gramado'],
    ['decoracao-2', 'decoracao', 'Decoração de chá de bebê Oh Baby com balões rosa e ursinho'],
    ['sinuca', 'jogos', 'Mesa de sinuca para locação em festas'],
    ['decoracao-6', 'decoracao', 'Decoração Happy Birthday com balões lilás e dourados'],
    ['area-baby-3', 'infantil', 'Casinha de bolinhas com escorregador e gangorrinhas'],
    ['decoracao-3', 'decoracao', 'Decoração Happy Birthday com neon e balões laranja e dourados'],
    ['decoracao-8', 'decoracao', 'Decoração Happy Birthday em branco com neon e cilindros'],
    ['toto-1', 'jogos', 'Mesa de totó de madeira'],
    ['decoracao-10', 'decoracao', 'Decoração de festa tema Branca de Neve'],
    ['futebol-mesa-1', 'jogos', 'Mesa de futebol de palheta de madeira'],
    ['gladiador-2', 'inflaveis', 'Inflável gladiador montado em área externa'],
    ['decoracao-11', 'decoracao', 'Decoração de chá de bebê azul com cubos BABY e ursinho'],
    ['cama-elastica-2', 'infantil', 'Cama elástica montada em quadra'],
    ['decoracao-12', 'decoracao', 'Decoração de festa tema fundo do mar'],
    ['aero-hockey-2', 'jogos', 'Mesa de aero hockey de madeira'],
    ['decoracao-13', 'decoracao', 'Decoração de festa tema palhaço e circo'],
    ['casinha-2', 'infantil', 'Casinha de bolinhas montada em festa ao ar livre'],
    ['decoracao-14', 'decoracao', 'Decoração de 21 anos com balões azuis e brancos'],
    ['cama-elastica-3', 'infantil', 'Cama elástica montada no gramado com vista para o mar'],
    ['decoracao-15', 'decoracao', 'Decoração de chá de bebê tema safári'],
    ['toto-2', 'jogos', 'Totó de madeira em salão'],
    ['decoracao-16', 'decoracao', 'Decoração de festa tema Carros'],
    ['gladiador-3', 'inflaveis', 'Inflável gladiador montado em jardim'],
    ['cama-elastica-4', 'infantil', 'Cama elástica com rede colorida'],
    ['toboga-2', 'inflaveis', 'Tobogã inflável gigante montado ao ar livre'],
    ['castelo-3', 'inflaveis', 'Castelinho inflável com piscina de bolinhas e escorregador'],
    ['multpark-2', 'inflaveis', 'Brinquedo inflável Mult Park montado em quintal'],
    ['circuito-2', 'inflaveis', 'Mini circuito inflável com escorregador em área arborizada'],
    ['espuma-2', 'inflaveis', 'Crianças se divertindo na piscina de espuma'],
    ['espuma-1', 'inflaveis', 'Canhão de espuma enchendo piscina inflável'],
    ['toboga-3', 'inflaveis', 'Tobogã inflável montado no gramado'],
    ['castelo-1', 'inflaveis', 'Castelinho inflável com escorregador e parede de escalada'],
    ['multpark-1', 'inflaveis', 'Mult Park inflável com obstáculos e escorregador'],
    ['circuito-3', 'inflaveis', 'Mini circuito inflável montado no gramado'],
    ['sabao-1', 'inflaveis', 'Crianças brincando no futebol de sabão inflável'],
    ['toboga-1', 'inflaveis', 'Tobogã inflável com escada e escorregador'],
    ['castelo-2', 'inflaveis', 'Castelinho inflável com bolinhas coloridas'],
    ['circuito-1', 'inflaveis', 'Mini circuito inflável vermelho e roxo em salão de festas'],
    ['toboga-4', 'inflaveis', 'Lateral do tobogã inflável com parede de escalada']
  ];
  var galTabs = $('#galeria [role=tablist]');
  var galGrid = $('#galeria .dy-gal-grid');
  var galMore = $('#galeria [data-acao="mais-fotos"]');
  var galFilter = 'todos', galAll = false, galList = [];

  function fotoHTML(f, i) {
    return '<button type="button" data-foto="' + i + '" aria-label="Ampliar foto: ' + esc(f[2]) + '" class="gallery-item group relative block w-full overflow-hidden rounded-2xl border border-border bg-muted shadow-sm" style="animation-delay:' + Math.min(i, 10) * 60 + 'ms">' +
      '<img alt="' + esc(f[2]) + '" loading="lazy" decoding="async" width="480" height="480" class="dy-gal-img transition-transform duration-700 ease-out group-hover:scale-110" src="/img/' + f[0] + '-480.jpg" srcset="/img/' + f[0] + '-480.jpg 480w, /img/' + f[0] + '-800.jpg 800w" sizes="(min-width:1024px) 270px, (min-width:768px) 32vw, 48vw">' +
      '<span class="absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></span></button>';
  }
  function renderGallery() {
    var all = galFilter === 'todos' ? FOTOS : FOTOS.filter(function (f) { return f[1] === galFilter; });
    galList = (galFilter === 'todos' && !galAll) ? all.slice(0, 12) : all;
    galGrid.innerHTML = galList.map(fotoHTML).join('');
    if (galMore) {
      var rest = all.length - galList.length;
      galMore.parentElement.hidden = rest <= 0;
      galMore.textContent = 'Ver mais fotos (' + rest + ')';
    }
  }
  if (galGrid) {
    galList = FOTOS.slice(0, 12);
    if (galTabs) galTabs.addEventListener('click', function (e) {
      var b = e.target.closest('[role=tab]'); if (!b) return;
      galFilter = b.dataset.id; galAll = false; setTabs(galTabs, galFilter); renderGallery();
    });
    if (galMore) galMore.addEventListener('click', function () { galAll = true; renderGallery(); });
    galGrid.addEventListener('click', function (e) {
      var b = e.target.closest('[data-foto]'); if (b) openLightbox(+b.dataset.foto);
    });
  }

  /* ---------- Foto ampliada ---------- */
  var lb = null, lbIndex = 0, lastFocus = null;
  function lbRender() {
    var f = galList[lbIndex];
    lb.querySelector('img').src = '/img/' + f[0] + '-800.jpg';
    lb.querySelector('img').alt = f[2];
    lb.setAttribute('aria-label', f[2]);
    lb.querySelector('[data-lb=contador]').textContent = (lbIndex + 1) + ' / ' + galList.length;
  }
  function lbKey(e) {
    if (e.key === 'Escape') closeLightbox();
    else if (e.key === 'ArrowLeft') { lbIndex = (lbIndex - 1 + galList.length) % galList.length; lbRender(); }
    else if (e.key === 'ArrowRight') { lbIndex = (lbIndex + 1) % galList.length; lbRender(); }
  }
  function openLightbox(i) {
    lastFocus = document.activeElement; lbIndex = i;
    var btn = 'absolute rounded-full bg-card/15 p-2 text-primary-foreground transition-colors hover:bg-card/30';
    lb = document.createElement('div');
    lb.setAttribute('role', 'dialog'); lb.setAttribute('aria-modal', 'true');
    lb.className = 'lightbox-in fixed inset-0 z-[60] flex items-center justify-center bg-foreground/90 p-4 backdrop-blur-sm';
    lb.innerHTML =
      '<button type="button" data-lb="fechar" aria-label="Fechar" class="' + btn + ' right-4 top-4"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" class="size-6" aria-hidden="true"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg></button>' +
      '<button type="button" data-lb="ant" aria-label="Foto anterior" class="' + btn + ' left-2 sm:left-6"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" class="size-7" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg></button>' +
      '<img alt="" class="lightbox-img max-h-[85vh] max-w-full rounded-2xl object-contain shadow-2xl">' +
      '<button type="button" data-lb="prox" aria-label="Próxima foto" class="' + btn + ' right-2 sm:right-6"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" class="size-7" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg></button>' +
      '<span data-lb="contador" class="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-card/15 px-3 py-1 text-xs font-semibold text-primary-foreground"></span>';
    lb.addEventListener('click', function (e) {
      var a = e.target.closest('[data-lb]');
      if (e.target.tagName === 'IMG') return;
      if (a && a.dataset.lb === 'ant') { lbIndex = (lbIndex - 1 + galList.length) % galList.length; lbRender(); }
      else if (a && a.dataset.lb === 'prox') { lbIndex = (lbIndex + 1) % galList.length; lbRender(); }
      else closeLightbox();
    });
    document.body.appendChild(lb);
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', lbKey);
    lbRender();
    lb.querySelector('[data-lb=fechar]').focus();
  }
  function closeLightbox() {
    if (!lb) return;
    document.removeEventListener('keydown', lbKey);
    lb.remove(); lb = null; document.body.style.overflow = '';
    if (lastFocus) lastFocus.focus();
  }

  /* ---------- Vídeos ---------- */
  var VIDEOS = [
    [5, 'Inflável Gladiador'], [2, 'Mult Park'], [6, 'Aero Hockey com LED'], [4, 'Mini Circuito'],
    [3, 'Circuito de Obstáculos'], [1, 'Diversão ao Ar Livre'], [7, 'Futebol de Mesa'], [8, 'Piscina de Bolinhas']
  ];
  var vidGrid = $('#galeria [data-videos]');
  var vidMore = $('#galeria [data-acao="mais-videos"]');
  var playIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" class="ml-1 size-6" aria-hidden="true"><path d="M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z"/></svg>';
  function videoHTML(v) {
    return '<div class="reveal is-visible"><figure class="group relative overflow-hidden rounded-2xl border border-border bg-foreground shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-festive)]">' +
      '<video src="/videos/video-' + v[0] + '.mp4" poster="/img/video-capa-' + v[0] + '.jpg" class="aspect-[9/16] w-full object-cover" preload="none" playsinline></video>' +
      '<button type="button" aria-label="Assistir vídeo: ' + esc(v[1]) + '" class="absolute inset-0 flex flex-col items-center justify-end gap-3 bg-gradient-to-t from-foreground/80 via-foreground/10 to-transparent p-4 text-primary-foreground">' +
      '<span class="pulse-ring relative isolate flex size-14 items-center justify-center rounded-full bg-secondary shadow-lg transition-transform duration-300 group-hover:scale-110 [--color-whatsapp:var(--color-secondary)]">' + playIcon + '</span>' +
      '<span class="text-sm font-bold">' + esc(v[1]) + '</span></button></figure></div>';
  }
  if (vidGrid) {
    vidGrid.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      var video = b.parentElement.querySelector('video');
      b.remove(); video.controls = true; video.play();
      track('video_play', { video: b.getAttribute('aria-label').replace('Assistir vídeo: ', '') });
    });
    if (vidMore) vidMore.addEventListener('click', function () {
      vidGrid.insertAdjacentHTML('beforeend', VIDEOS.slice(4).map(videoHTML).join(''));
      vidMore.parentElement.hidden = true;
    });
  }

  /* ---------- Formulário de orçamento ---------- */
  var form = $('#orcamento form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var nome = $('#orcamento-nome').value.trim();
      var zap = $('#orcamento-whatsapp').value.trim();
      var serv = $('#orcamento-servico').value;
      var msg = $('#orcamento-mensagem').value.trim();
      var data = ($('#orcamento-data') || {}).value || '';
      var bairro = (($('#orcamento-bairro') || {}).value || '').trim();
      var erro = $('#orcamento-erro');
      var falta = !nome ? 'seu nome' : zap.replace(/\D/g, '').length < 10 ? 'um WhatsApp válido com DDD' : !serv ? 'o tipo de serviço' : '';
      if (falta) { erro.textContent = 'Por favor, informe ' + falta + '.'; erro.hidden = false; return; }
      erro.hidden = true;
      var linhas = ['Olá! Vim pelo site da Dyana Brito Festas e gostaria de solicitar um orçamento.', '', '*Nome:* ' + nome, '*WhatsApp para retorno:* ' + zap, '*Tipo de Serviço:* ' + serv];
      if (data) linhas.push('*Data da festa:* ' + data.split('-').reverse().join('/'));
      if (bairro) linhas.push('*Bairro/cidade:* ' + bairro);
      if (msg) linhas.push('', '*Detalhes:* ' + msg);
      track('clique_whatsapp', { secao: 'orcamento', servico: serv });
      track('generate_lead', { servico: serv });
      window.open(waLink(linhas.join('\n')), '_blank', 'noopener');
    });
  }

  /* ---------- Barra fixa do celular: some quando o formulário está na tela ---------- */
  var sticky = $('.dy-sticky'), orc = $('#orcamento');
  function toggleSticky() {
    var r = orc.getBoundingClientRect();
    sticky.style.display = (r.top < window.innerHeight * 0.85 && r.bottom > 80) ? 'none' : '';
  }
  if (sticky && orc) { window.addEventListener('scroll', toggleSticky, { passive: true }); toggleSticky(); }

  /* ---------- Métricas de clique ---------- */
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href]'); if (!a) return;
    var href = a.getAttribute('href');
    var sec = a.closest('section[id], footer[id]');
    var secao = a.classList.contains('dy-sticky') ? 'barra_fixa_celular' : a.classList.contains('dy-float') ? 'botao_flutuante' : a.closest('header') ? 'cabecalho' : sec ? sec.id : 'pagina';
    var card = a.closest('article'); var item = card ? ($('h3', card) || {}).textContent : undefined;
    var cta = (a.textContent || '').trim().slice(0, 60);
    if (href.indexOf('wa.me') > -1) track('clique_whatsapp', { secao: secao, item: item, botao: cta });
    else if (href.indexOf('tel:') === 0) track('clique_telefone', { secao: secao });
    else if (href.indexOf('instagram.com') > -1) track('clique_instagram', { secao: secao });
  });

  /* ---------- Aviso de cookies (LGPD) ---------- */
  function getConsent() { try { return localStorage.getItem(CONSENT_KEY); } catch (e) { return null; } }
  function setConsent(v) { try { localStorage.setItem(CONSENT_KEY, v); } catch (e) {} }
  if (!getConsent()) {
    var bar = document.createElement('div');
    bar.setAttribute('role', 'dialog'); bar.setAttribute('aria-live', 'polite'); bar.setAttribute('aria-label', 'Aviso de cookies');
    bar.className = 'dy-cookie fixed inset-x-3 bottom-3 z-[55] mx-auto max-w-xl rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-festive)] sm:inset-x-6 sm:bottom-6';
    bar.innerHTML = '<p class="text-sm text-foreground">Usamos cookies apenas para entender quantas pessoas visitam o site e melhorar o atendimento. Nenhum dado pessoal é vendido ou compartilhado. <a href="/privacidade.html" class="font-semibold text-primary underline">Política de Privacidade</a></p>' +
      '<div class="mt-3 flex flex-wrap justify-end gap-2"><button type="button" data-c="recusado" class="dy-btn-44 rounded-full border border-border px-4 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-muted">Recusar</button>' +
      '<button type="button" data-c="aceito" class="dy-btn-44 rounded-full bg-primary px-4 py-2 text-xs font-bold text-primary-foreground transition-transform hover:scale-[1.03]">Aceitar</button></div>';
    bar.addEventListener('click', function (e) {
      var b = e.target.closest('[data-c]'); if (!b) return;
      setConsent(b.dataset.c);
      if (b.dataset.c === 'aceito' && window.gtag) window.gtag('consent', 'update', { analytics_storage: 'granted' });
      bar.remove();
    });
    setTimeout(function () { document.body.appendChild(bar); }, 600);
  }

  /* ---------- Google Analytics: carrega depois da página ---------- */
  function loadGA() {
    if (!window.GA_ID || window.GA_ID.indexOf('G-') !== 0) return;
    var s = document.createElement('script'); s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + window.GA_ID;
    document.head.appendChild(s);
  }
  if (document.readyState === 'complete') setTimeout(loadGA, 1200);
  else window.addEventListener('load', function () { setTimeout(loadGA, 1200); });
})();
