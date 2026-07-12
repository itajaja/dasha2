/* Restores the page's interactive behavior:
   ritual gallery toggles, image lightbox, scroll-reveal, nav state. */
(function () {
  'use strict';

  /* ---- ritual galleries: open / close ---- */
  document.querySelectorAll('.ritual').forEach(function (ritual) {
    var cover = ritual.querySelector('.ritual-cover');
    var hint = ritual.querySelector('.ritual-hint');
    if (!cover) return;
    cover.addEventListener('click', function () {
      var open = ritual.classList.toggle('open');
      cover.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (hint) hint.textContent = open ? 'close' : 'open';
    });
  });

  /* ---- lightbox ---- */
  var lightbox = document.getElementById('lightbox');
  if (lightbox) {
    var lbImg = lightbox.querySelector('img');
    var lbCaption = lightbox.querySelector('figcaption');

    document.querySelectorAll('.ritual-gallery figure').forEach(function (fig) {
      var img = fig.querySelector('img');
      if (!img) return;
      img.style.cursor = 'zoom-in';
      img.addEventListener('click', function () {
        lbImg.src = img.src;
        lbImg.alt = img.alt;
        var cap = fig.querySelector('figcaption');
        if (lbCaption) lbCaption.textContent = cap ? cap.textContent : '';
        lightbox.classList.add('open');
      });
    });

    function closeLightbox() {
      lightbox.classList.remove('open');
      lbImg.src = '';
    }
    lightbox.addEventListener('click', closeLightbox);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && lightbox.classList.contains('open')) closeLightbox();
    });
  }

  /* ---- reveal on scroll ---- */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0, rootMargin: '0px 0px -10% 0px' });
    reveals.forEach(function (el) { revealObserver.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---- nav: on-dark over the hero, active section link ---- */
  var nav = document.getElementById('topnav');
  var hero = document.getElementById('hero');
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('#topnav ul a'));
  var sections = navLinks
    .map(function (a) { return document.getElementById((a.getAttribute('href') || '').slice(1)); })
    .filter(Boolean);

  var rootStyle = document.documentElement.style;

  function onScroll() {
    /* how far down the page we are, 0 at the top → 1 at the bottom;
       the stylesheet uses this to pull the two green threads apart */
    var scrollable = document.documentElement.scrollHeight - window.innerHeight;
    var progress = scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0;
    rootStyle.setProperty('--thread-sep', progress.toFixed(4));

    if (nav && hero) {
      var navHeight = nav.offsetHeight || 60;
      nav.classList.toggle('on-dark', hero.getBoundingClientRect().bottom > navHeight);
    }
    var current = null;
    var probe = window.innerHeight * 0.35;
    sections.forEach(function (sec) {
      var r = sec.getBoundingClientRect();
      if (r.top <= probe && r.bottom > probe) current = sec.id;
    });
    navLinks.forEach(function (a) {
      a.classList.toggle('active', (a.getAttribute('href') || '') === '#' + current);
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();
})();
