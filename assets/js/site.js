/* Atelya D — script commun à toutes les pages
   Dépend de data/products.js (window.ATELYA). */
(function () {
  'use strict';

  var DATA = window.ATELYA || { site: {}, categories: [], products: [] };
  var SITE = DATA.site;
  document.documentElement.classList.add('js');

  /* ---------- Utilitaires ---------- */
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function normalize(s) {
    return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  }

  function formatPrice(n) {
    if (typeof n !== 'number' || isNaN(n)) return '';
    return n.toLocaleString('fr-FR').replace(/ | /g, ' ') + ' ' + (SITE.currency || '');
  }

  function categoryName(id) {
    for (var i = 0; i < DATA.categories.length; i++) {
      if (DATA.categories[i].id === id) return DATA.categories[i].name;
    }
    return '';
  }

  function productImage(p, thumb) {
    return 'images/products/' + (thumb ? 'thumbs/' : '') + p.image;
  }

  function productUrl(p) {
    return 'catalogue.html#' + encodeURIComponent(p.id);
  }

  /* ---------- WhatsApp ---------- */
  function waLink(message) {
    return 'https://wa.me/' + SITE.whatsapp + '?text=' + encodeURIComponent(message);
  }

  function waProductLink(p) {
    var lines = ['Bonjour Atelya D,', 'Je suis intéressé(e) par : ' + p.name + '.'];
    if (/^https?:/.test(location.protocol)) {
      lines.push(location.origin + location.pathname.replace(/[^/]*$/, '') + 'catalogue.html#' + p.id);
    }
    lines.push('Pouvez-vous me donner plus d’informations ?');
    return waLink(lines.join('\n'));
  }

  var GENERIC_MSG = 'Bonjour Atelya D, je souhaite des informations sur vos meubles.';

  /* ---------- Icônes ---------- */
  var ICON = {
    chat: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>',
    arrow: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>'
  };

  /* ---------- Carte produit (accueil + catalogue) ---------- */
  function cardHTML(p, opts) {
    opts = opts || {};
    var price = formatPrice(p.price) || 'Sur devis';
    var focus = p.focus ? ' style="object-position:' + esc(p.focus) + '"' : '';
    return '' +
      '<article class="card' + (opts.reveal ? ' reveal' : '') + '" data-id="' + esc(p.id) + '">' +
        '<a class="card__link" href="' + esc(productUrl(p)) + '" data-open="' + esc(p.id) + '" aria-label="Voir ' + esc(p.name) + '">' +
          '<span class="card__media">' +
            '<img src="' + esc(productImage(p, true)) + '" width="480" height="640" loading="lazy" decoding="async"' + focus +
            ' alt="' + esc(p.name + ' — ' + p.description) + '">' +
          '</span>' +
          '<span class="card__body">' +
            '<span class="card__cat">' + esc(categoryName(p.category)) + '</span>' +
            '<span class="card__name">' + esc(p.name) + '</span>' +
            '<span class="card__desc">' + esc(p.description) + '</span>' +
          '</span>' +
        '</a>' +
        '<div class="card__foot">' +
          '<span class="card__price">' + esc(price) + '</span>' +
          '<a class="icon-btn" href="' + esc(waProductLink(p)) + '" target="_blank" rel="noopener" ' +
            'aria-label="Demander « ' + esc(p.name) + ' » sur WhatsApp" title="Demander sur WhatsApp">' + ICON.chat + '</a>' +
        '</div>' +
      '</article>';
  }

  /* ---------- Menu mobile ---------- */
  function initNav() {
    var btn = document.querySelector('.nav-toggle');
    var nav = document.getElementById('site-nav');
    if (!btn || !nav) return;

    function setOpen(open) {
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      btn.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
      document.body.classList.toggle('nav-open', open);
    }
    btn.addEventListener('click', function () {
      setOpen(btn.getAttribute('aria-expanded') !== 'true');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) setOpen(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && btn.getAttribute('aria-expanded') === 'true') {
        setOpen(false);
        btn.focus();
      }
    });
    window.matchMedia('(min-width: 900px)').addEventListener('change', function (m) {
      if (m.matches) setOpen(false);
    });
  }

  /* ---------- En-tête : ombre au défilement ---------- */
  function initHeader() {
    var h = document.querySelector('.site-header');
    if (!h) return;
    function onScroll() { h.classList.toggle('is-scrolled', window.scrollY > 8); }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------- Apparition au défilement ---------- */
  var observer = null;
  function initReveal(root) {
    var els = (root || document).querySelectorAll('.reveal:not(.is-in)');
    if (!els.length) return;
    if (!('IntersectionObserver' in window) ||
        window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      els.forEach(function (el) { el.classList.add('is-in'); });
      return;
    }
    if (!observer) {
      observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            en.target.classList.add('is-in');
            observer.unobserve(en.target);
          }
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    }
    els.forEach(function (el) { observer.observe(el); });
  }

  /* ---------- Liens WhatsApp / contact génériques ---------- */
  function initContactLinks() {
    document.querySelectorAll('[data-wa]').forEach(function (a) {
      a.href = waLink(a.getAttribute('data-wa') || GENERIC_MSG);
      a.target = '_blank';
      a.rel = 'noopener';
    });
    document.querySelectorAll('[data-tel]').forEach(function (a) {
      a.href = 'tel:' + SITE.phoneHref;
      if (a.hasAttribute('data-show')) a.textContent = SITE.phoneDisplay;
    });
    document.querySelectorAll('[data-mail]').forEach(function (a) {
      a.href = 'mailto:' + SITE.email;
      if (a.hasAttribute('data-show')) a.textContent = SITE.email;
    });
    document.querySelectorAll('[data-year]').forEach(function (el) {
      el.textContent = new Date().getFullYear();
    });

    /* Réseaux sociaux : seuls ceux qui ont une adresse sont affichés */
    var box = document.querySelector('[data-socials]');
    if (box) {
      var labels = { instagram: 'Instagram', facebook: 'Facebook', twitter: 'X (Twitter)', linkedin: 'LinkedIn' };
      var html = '';
      Object.keys(labels).forEach(function (k) {
        var url = SITE.socials && SITE.socials[k];
        if (url) html += '<li><a href="' + esc(url) + '" target="_blank" rel="noopener">' + labels[k] + '</a></li>';
      });
      if (html) { box.innerHTML = html; box.hidden = false; } else { box.hidden = true; }
    }
  }

  /* ---------- Traduction FR → EN (Google Traduction, chargé à la demande) ---------- */
  function initTranslate() {
    var btn = document.querySelector('[data-lang-toggle]');
    if (!btn) return;
    var loaded = false;

    function isEnglish() { return /(?:^|;\s*)googtrans=\/fr\/en/.test(document.cookie); }

    function setLabel() {
      btn.textContent = isEnglish() ? 'FR' : 'EN';
      btn.setAttribute('aria-label', isEnglish() ? 'Revenir au français' : 'Translate this page into English');
    }

    function load(then) {
      if (loaded) { then && then(); return; }
      loaded = true;
      window.googleTranslateElementInit = function () {
        new google.translate.TranslateElement({ pageLanguage: 'fr', includedLanguages: 'en', autoDisplay: false }, 'google_translate_element');
        then && then();
      };
      var s = document.createElement('script');
      s.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      s.async = true;
      document.head.appendChild(s);
    }

    function pickEnglish(tries) {
      var combo = document.querySelector('.goog-te-combo');
      if (combo) {
        combo.value = 'en';
        combo.dispatchEvent(new Event('change'));
        setTimeout(setLabel, 400);
      } else if (tries < 40) {
        setTimeout(function () { pickEnglish(tries + 1); }, 150);
      }
    }

    function clearCookie() {
      var host = location.hostname;
      ['', '; domain=' + host, '; domain=.' + host].forEach(function (d) {
        document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/' + d;
      });
    }

    btn.addEventListener('click', function () {
      if (isEnglish()) { clearCookie(); location.reload(); return; }
      btn.disabled = true;
      load(function () { pickEnglish(0); });
      setTimeout(function () { btn.disabled = false; }, 1500);
    });

    setLabel();
    if (isEnglish()) load();
  }

  /* ---------- Démarrage ---------- */
  function init() {
    initNav();
    initHeader();
    initContactLinks();
    initTranslate();
    initReveal();
  }

  window.Atelya = {
    data: DATA, esc: esc, normalize: normalize, formatPrice: formatPrice,
    categoryName: categoryName, productImage: productImage, productUrl: productUrl,
    waLink: waLink, waProductLink: waProductLink, genericMessage: GENERIC_MSG,
    cardHTML: cardHTML, initReveal: initReveal, icons: ICON
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
