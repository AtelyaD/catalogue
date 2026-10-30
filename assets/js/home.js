/* Atelya D — page d'accueil : catégories, sélection, compteurs */
(function () {
  'use strict';
  var A = window.Atelya;
  if (!A) return;
  var DATA = A.data, esc = A.esc;

  /* Catégories */
  var catBox = document.getElementById('home-categories');
  if (catBox) {
    catBox.innerHTML = DATA.categories.map(function (c) {
      var n = DATA.products.filter(function (p) { return p.category === c.id; }).length;
      if (!n) return '';
      return '' +
        '<a class="cat-card reveal" href="catalogue.html?cat=' + encodeURIComponent(c.id) + '">' +
          '<img src="images/products/thumbs/' + esc(c.cover) + '.webp" width="480" height="640" loading="lazy" decoding="async" alt="">' +
          '<span class="cat-card__text">' +
            '<span class="cat-card__name">' + esc(c.name) + '</span>' +
            '<span class="cat-card__count">' + n + (n > 1 ? ' modèles' : ' modèle') + '</span>' +
          '</span>' +
          '<span class="cat-card__arrow" aria-hidden="true">' + A.icons.arrow + '</span>' +
        '</a>';
    }).join('');
  }

  /* Sélection */
  var featBox = document.getElementById('home-featured');
  if (featBox) {
    var list = DATA.products.filter(function (p) { return p.featured; });
    if (!list.length) list = DATA.products.slice(0, 6);
    featBox.innerHTML = list.map(function (p) { return A.cardHTML(p, { reveal: true }); }).join('');
  }

  /* Compteur de modèles */
  document.querySelectorAll('[data-count-products]').forEach(function (el) {
    el.textContent = DATA.products.length;
  });

  A.initReveal();
})();
