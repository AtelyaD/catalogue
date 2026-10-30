/* Atelya D — page catalogue : recherche, filtres, tri, fiche produit */
(function () {
  'use strict';
  var A = window.Atelya;
  if (!A) return;

  var DATA = A.data, esc = A.esc, norm = A.normalize;
  var PRODUCTS = DATA.products;
  var hasPrices = PRODUCTS.some(function (p) { return typeof p.price === 'number'; });

  var $ = function (id) { return document.getElementById(id); };
  var elQ = $('q'), elClear = $('q-clear'), elChips = $('chips'), elSort = $('sort'),
      elGrid = $('grid'), elCount = $('count'), elEmpty = $('empty'), elReset = $('empty-reset'),
      elEmptyWa = $('empty-wa'),
      dlg = $('product-dialog');

  var state = { q: '', cat: 'all', sort: 'default' };
  var visible = PRODUCTS.slice();
  var openedByClick = false;

  /* ---------- Tri ---------- */
  var SORTS = [
    { id: 'default', label: 'Sélection Atelya D' },
    { id: 'name-asc', label: 'Nom : A → Z' },
    { id: 'name-desc', label: 'Nom : Z → A' },
    { id: 'category', label: 'Par catégorie' }
  ];
  if (hasPrices) {
    SORTS.push({ id: 'price-asc', label: 'Prix croissant' }, { id: 'price-desc', label: 'Prix décroissant' });
  }
  elSort.innerHTML = SORTS.map(function (s) {
    return '<option value="' + s.id + '">' + esc(s.label) + '</option>';
  }).join('');

  function cmpName(a, b) { return a.name.localeCompare(b.name, 'fr', { sensitivity: 'base' }); }

  function sortList(list) {
    var l = list.slice();
    switch (state.sort) {
      case 'name-asc': l.sort(cmpName); break;
      case 'name-desc': l.sort(function (a, b) { return cmpName(b, a); }); break;
      case 'category':
        l.sort(function (a, b) {
          return A.categoryName(a.category).localeCompare(A.categoryName(b.category), 'fr') || cmpName(a, b);
        });
        break;
      case 'price-asc':
      case 'price-desc':
        var dir = state.sort === 'price-asc' ? 1 : -1;
        l.sort(function (a, b) {
          var pa = typeof a.price === 'number' ? a.price : Infinity;
          var pb = typeof b.price === 'number' ? b.price : Infinity;
          if (pa === pb) return cmpName(a, b);
          if (pa === Infinity) return 1;
          if (pb === Infinity) return -1;
          return (pa - pb) * dir;
        });
        break;
    }
    return l;
  }

  /* ---------- Recherche ---------- */
  function matchesQuery(p, words) {
    if (!words.length) return true;
    var hay = norm(p.name + ' ' + p.description);
    return words.every(function (w) { return hay.indexOf(w) !== -1; });
  }

  function words() { return norm(state.q).split(/\s+/).filter(Boolean); }

  /* ---------- Filtres (pastilles) ---------- */
  function renderChips() {
    var w = words();
    var base = PRODUCTS.filter(function (p) { return matchesQuery(p, w); });
    var html = chip('all', 'Tout', base.length);
    DATA.categories.forEach(function (c) {
      var n = base.filter(function (p) { return p.category === c.id; }).length;
      html += chip(c.id, c.name, n);
    });
    elChips.innerHTML = html;
  }

  function chip(id, label, n) {
    var on = state.cat === id;
    return '<button type="button" class="chip" data-cat="' + esc(id) + '" aria-pressed="' + on + '">' +
      esc(label) + ' <span class="chip__n">' + n + '</span></button>';
  }

  /* ---------- Rendu de la grille ---------- */
  function render() {
    var w = words();
    visible = sortList(PRODUCTS.filter(function (p) {
      return (state.cat === 'all' || p.category === state.cat) && matchesQuery(p, w);
    }));

    renderChips();
    elGrid.innerHTML = visible.map(function (p) { return A.cardHTML(p); }).join('');
    elGrid.classList.remove('is-fresh'); void elGrid.offsetWidth; elGrid.classList.add('is-fresh');

    var n = visible.length;
    var label = n === 0 ? 'Aucun modèle' : n + (n > 1 ? ' modèles' : ' modèle');
    if (state.cat !== 'all') label += ' · ' + A.categoryName(state.cat);
    if (state.q.trim()) label += ' · « ' + state.q.trim() + ' »';
    elCount.textContent = label;

    elEmpty.hidden = n !== 0;
    elGrid.hidden = n === 0;
    elClear.hidden = !state.q;

    if (n === 0) {
      var q = state.q.trim();
      $('empty-text').textContent = q
        ? 'Aucun modèle ne correspond à « ' + q + ' ».'
        : 'Aucun modèle dans cette catégorie pour le moment.';
      elEmptyWa.href = A.waLink('Bonjour Atelya D, je cherche un meuble' + (q ? ' : ' + q : '') +
        '. Pouvez-vous me conseiller ou le réaliser sur mesure ?');
    }
    syncURL();
  }

  /* ---------- URL (partage des filtres) ---------- */
  function syncURL() {
    var p = new URLSearchParams();
    if (state.q.trim()) p.set('q', state.q.trim());
    if (state.cat !== 'all') p.set('cat', state.cat);
    if (state.sort !== 'default') p.set('sort', state.sort);
    var qs = p.toString();
    history.replaceState(history.state, '', location.pathname + (qs ? '?' + qs : '') + location.hash);
  }

  function readURL() {
    var p = new URLSearchParams(location.search);
    state.q = p.get('q') || '';
    var cat = p.get('cat');
    state.cat = DATA.categories.some(function (c) { return c.id === cat; }) ? cat : 'all';
    var sort = p.get('sort');
    state.sort = SORTS.some(function (s) { return s.id === sort; }) ? sort : 'default';
    elQ.value = state.q;
    elSort.value = state.sort;
  }

  /* ---------- Fiche produit ---------- */
  var current = null;

  function findProduct(id) {
    for (var i = 0; i < PRODUCTS.length; i++) if (PRODUCTS[i].id === id) return PRODUCTS[i];
    return null;
  }

  function fillDialog(p) {
    current = p;
    var price = A.formatPrice(p.price);
    $('dlg-img').src = A.productImage(p, false);
    $('dlg-img').alt = p.name + ' — ' + p.description;
    $('dlg-cat').textContent = A.categoryName(p.category);
    $('dlg-title').textContent = p.name;
    $('dlg-desc').textContent = p.description;
    $('dlg-price').textContent = price || 'Prix sur devis';
    $('dlg-wa').href = A.waProductLink(p);
    $('dlg-status').textContent = '';
    document.title = p.name + ' — Atelya D';
    $('dlg-body').scrollTop = 0;
  }

  function openProduct(p) {
    fillDialog(p);
    if (!dlg.open) {
      document.body.classList.add('modal-open');
      if (typeof dlg.showModal === 'function') dlg.showModal(); else dlg.setAttribute('open', '');
    }
  }

  function closeProduct() {
    if (location.hash && openedByClick) {
      openedByClick = false;
      history.back();            // déclenche hashchange → fermeture
    } else {
      history.replaceState(history.state, '', location.pathname + location.search);
      reallyClose();
    }
  }

  function reallyClose() {
    if (dlg.open) { if (dlg.close) dlg.close(); else dlg.removeAttribute('open'); }
    document.body.classList.remove('modal-open');
    document.title = 'Catalogue — Atelya D';
    current = null;
  }

  function step(dir) {
    if (!current) return;
    var list = visible.indexOf(current) !== -1 ? visible : PRODUCTS;
    var i = list.indexOf(current);
    var next = list[(i + dir + list.length) % list.length];
    history.replaceState(history.state, '', location.pathname + location.search + '#' + next.id);
    fillDialog(next);
  }

  function onHash() {
    var id = decodeURIComponent(location.hash.slice(1));
    var p = id && findProduct(id);
    if (p) openProduct(p); else reallyClose();
  }

  function share() {
    if (!current) return;
    var url = location.origin + location.pathname + '#' + current.id;
    var data = { title: current.name + ' — Atelya D', text: current.name + ' — ' + current.description, url: url };
    var status = $('dlg-status');
    if (navigator.share) {
      navigator.share(data).catch(function () {});
    } else if (navigator.clipboard && /^https?:/.test(location.protocol)) {
      navigator.clipboard.writeText(url).then(function () { status.textContent = 'Lien copié.'; },
        function () { status.textContent = 'Copie impossible : ' + url; });
    } else {
      status.textContent = 'Lien : ' + url;
    }
  }

  /* ---------- Événements ---------- */
  elQ.addEventListener('input', function () { state.q = elQ.value; render(); });
  elClear.addEventListener('click', function () { elQ.value = ''; state.q = ''; render(); elQ.focus(); });
  elSort.addEventListener('change', function () { state.sort = elSort.value; render(); });

  elChips.addEventListener('click', function (e) {
    var b = e.target.closest('.chip');
    if (!b) return;
    state.cat = b.getAttribute('data-cat');
    render();
    var again = elChips.querySelector('.chip[aria-pressed="true"]');
    if (again) again.focus({ preventScroll: true });
  });

  elReset.addEventListener('click', function () {
    state = { q: '', cat: 'all', sort: 'default' };
    elQ.value = ''; elSort.value = 'default';
    render();
  });

  elGrid.addEventListener('click', function (e) {
    var a = e.target.closest('[data-open]');
    if (!a || e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return;
    e.preventDefault();
    openedByClick = true;
    location.hash = a.getAttribute('data-open');
  });

  $('dlg-close').addEventListener('click', closeProduct);
  $('dlg-prev').addEventListener('click', function () { step(-1); });
  $('dlg-next').addEventListener('click', function () { step(1); });
  $('dlg-share').addEventListener('click', share);

  dlg.addEventListener('click', function (e) { if (e.target === dlg) closeProduct(); });
  dlg.addEventListener('cancel', function (e) { e.preventDefault(); closeProduct(); });
  dlg.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') step(-1);
    if (e.key === 'ArrowRight') step(1);
  });

  window.addEventListener('hashchange', onHash);

  /* ---------- Données structurées (SEO) ---------- */
  function injectJSONLD() {
    var base = DATA.site.url;
    var ld = {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'Catalogue Atelya D',
      itemListElement: PRODUCTS.map(function (p, i) {
        return {
          '@type': 'ListItem', position: i + 1,
          item: {
            '@type': 'Product', name: p.name, description: p.description,
            image: base + A.productImage(p, false),
            url: base + 'catalogue.html#' + p.id,
            brand: { '@type': 'Brand', name: 'Atelya D' }
          }
        };
      })
    };
    var s = document.createElement('script');
    s.type = 'application/ld+json';
    s.textContent = JSON.stringify(ld);
    document.head.appendChild(s);
  }

  /* ---------- Démarrage ---------- */
  readURL();
  render();
  injectJSONLD();
  if (location.hash) onHash();
})();
