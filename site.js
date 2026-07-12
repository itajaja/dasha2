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

  function onScroll() {
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

/* ---- the red thread ----
   A single strand runs down the left of the page. Below the welcome screen it
   splits into separate threads; each one bows out to feed a section's little
   cluster; by Contact they all draw back together into one. The whole shape is
   measured from the real position of every cluster, so it stays true when the
   window resizes or a photo album opens and pushes the sections around.

   Only the part of the thread inside the window is ever drawn: the shape is
   sampled once into points (in page coordinates), then on each scroll the
   on-screen slice is redrawn in window coordinates. That keeps every line
   short — browsers quietly stop painting a single line taller than a few
   thousand pixels, which a page this long would otherwise trip over. */
(function () {
  'use strict';
  var rail = document.getElementById('rail');
  if (!rail) return;
  var SVGNS = 'http://www.w3.org/2000/svg';
  var RAIL_W = 220;
  var threads = [];          // [{ pts:[{x,y}...], width, opacity, bright }]
  var built = false;

  function r1(v) { return Math.round(v * 10) / 10; }

  /* a smooth curve through a set of points (Catmull-Rom → Bézier) */
  function smoothPath(pts) {
    if (pts.length < 2) return '';
    var d = 'M' + r1(pts[0].x) + ' ' + r1(pts[0].y);
    for (var i = 0; i < pts.length - 1; i++) {
      var p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
      var c1x = p1.x + (p2.x - p0.x) / 6, c1y = p1.y + (p2.y - p0.y) / 6;
      var c2x = p2.x - (p3.x - p1.x) / 6, c2y = p2.y - (p3.y - p1.y) / 6;
      d += ' C' + r1(c1x) + ' ' + r1(c1y) + ' ' + r1(c2x) + ' ' + r1(c2y) +
           ' ' + r1(p2.x) + ' ' + r1(p2.y);
    }
    return d;
  }

  /* sample a smooth curve through `anchors` into a dense list of page points */
  var sampler = document.createElementNS(SVGNS, 'path');
  function sample(anchors) {
    sampler.setAttribute('d', smoothPath(anchors));
    var len = sampler.getTotalLength();
    var step = 9, out = [];
    for (var l = 0; l <= len; l += step) {
      var p = sampler.getPointAtLength(l);
      out.push({ x: p.x, y: p.y });
    }
    var last = sampler.getPointAtLength(len);
    out.push({ x: last.x, y: last.y });
    return out;
  }

  /* measure the thread's shape from the live page (page coordinates) */
  function build() {
    var scrollY = window.pageYOffset || 0;
    var scrollX = window.pageXOffset || 0;
    var docH = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
    var railX = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--thread-x')) || 48;

    var circles = Array.prototype.slice.call(document.querySelectorAll('.fray circle'));
    if (!circles.length) return;
    var clusters = circles.map(function (c) {
      var b = c.getBoundingClientRect();
      return { x: b.left + b.width / 2 + scrollX, y: b.top + b.height / 2 + scrollY };
    }).sort(function (a, b) { return a.y - b.y; });

    var hero = document.getElementById('hero');
    var heroBottom = hero ? hero.getBoundingClientRect().bottom + scrollY : 0;

    var last = clusters.length - 1;                 // Contact = the reconnection
    var reconnectY = clusters[last].y - 18;
    var fanStart = Math.max(heroBottom, clusters[0].y - 200);  // one thread through the welcome screen
    var fanEnd = fanStart + 60;                      // then it opens into separate threads
    if (fanEnd > reconnectY) fanEnd = reconnectY;

    var S = Math.max(1, last);                       // one strand per cluster (except Contact)
    var narrow = window.innerWidth <= 760;
    var gap = narrow ? 3.2 : 7;                       // how far apart the separate threads run

    threads = [];
    for (var i = 0; i < S; i++) {
      var off = (i - (S - 1) / 2) * gap;             // this strand's lane within the ribbon
      var pts = [{ x: railX, y: 0 }, { x: railX, y: fanStart }, { x: railX + off, y: fanEnd }];
      for (var j = 0; j < last; j++) {
        var cy = clusters[j].y;
        if (cy <= fanEnd || cy >= reconnectY) continue;
        if (j === i) {                               // this strand feeds this cluster
          pts.push({ x: railX + off * 0.6, y: cy - 46 });
          pts.push({ x: clusters[j].x, y: cy });
          pts.push({ x: railX + off * 0.6, y: cy + 46 });
        } else {
          pts.push({ x: railX + off, y: cy });       // others just run past in their lane
        }
      }
      pts.push({ x: railX, y: reconnectY });         // draw back together at Contact
      pts.push({ x: railX, y: docH });               // one thread on down to the foot
      threads.push({ pts: sample(pts), width: narrow ? 1.1 : 1.4, opacity: +(0.5 + 0.12 * Math.cos(i)).toFixed(2), bright: !!(i % 2) });
    }

    /* the reunited thread leaves the trunk and curls into the Contact knot —
       a tendril, tangent to the thread as it departs, not a right-angled branch */
    var mouthX = clusters[last].x - 17;              // the open left side of the spiral
    var jy = clusters[last].y, jd = mouthX - railX;
    threads.push({
      pts: sample([
        { x: railX,             y: reconnectY },     // the point where the threads become one
        { x: railX + 2,         y: jy - 7 },         // slip away still almost vertical
        { x: railX + jd * 0.40, y: jy + 9 },         // swing out and dip below
        { x: railX + jd * 0.76, y: jy + 3 },
        { x: mouthX,            y: jy }               // curl into the mouth of the spiral
      ]), width: narrow ? 1.3 : 1.7, opacity: 0.9, bright: false
    });

    render();
    if (!built) { built = true; requestAnimationFrame(function () { rail.classList.add('ready'); }); }
  }

  /* draw only the slice of the thread that is on screen, in window coordinates */
  function render() {
    var scrollY = window.pageYOffset || 0;
    var vpH = window.innerHeight || 0;
    var top = scrollY - 140, bot = scrollY + vpH + 140;

    rail.setAttribute('width', RAIL_W);
    rail.setAttribute('height', vpH);
    rail.setAttribute('viewBox', '0 0 ' + RAIL_W + ' ' + vpH);
    rail.style.height = vpH + 'px';
    while (rail.firstChild) rail.removeChild(rail.firstChild);

    function stroke(d, width, opacity, bright) {
      var p = document.createElementNS(SVGNS, 'path');
      p.setAttribute('d', d);
      p.setAttribute('stroke-width', width.toString());
      p.setAttribute('opacity', opacity.toString());
      if (bright) p.setAttribute('stroke', 'var(--kinovar-bright)');
      rail.appendChild(p);
    }
    function draw(d, t) {                             // faint wide halo + crisp line = a soft glow
      stroke(d, t.width * 3.2, +(t.opacity * 0.22).toFixed(2), t.bright);
      stroke(d, t.width, t.opacity, t.bright);
    }

    threads.forEach(function (t) {
      var pts = t.pts, d = '', open = false;
      for (var k = 0; k < pts.length; k++) {
        var p = pts[k], on = p.y >= top && p.y <= bot;
        if (on && !open) {                           // entering the window — start a segment
          var prev = pts[k - 1];
          d = prev ? ('M' + r1(prev.x) + ' ' + r1(prev.y - scrollY)) : ('M' + r1(p.x) + ' ' + r1(p.y - scrollY));
          if (prev) d += ' L' + r1(p.x) + ' ' + r1(p.y - scrollY);
          open = true;
        } else if (on) {
          d += ' L' + r1(p.x) + ' ' + r1(p.y - scrollY);
        } else if (open) {                           // just left the window — finish the segment
          d += ' L' + r1(p.x) + ' ' + r1(p.y - scrollY);
          draw(d, t); open = false;
        }
      }
      if (open) draw(d, t);
    });
  }

  var braf = 0;
  function scheduleBuild() { if (braf) return; braf = requestAnimationFrame(function () { braf = 0; build(); }); }
  var rraf = 0;
  function scheduleRender() { if (rraf) return; rraf = requestAnimationFrame(function () { rraf = 0; render(); }); }

  build();
  window.addEventListener('scroll', scheduleRender, { passive: true });
  window.addEventListener('load', scheduleBuild);
  window.addEventListener('resize', scheduleBuild);
  if ('ResizeObserver' in window) { new ResizeObserver(scheduleBuild).observe(document.body); }
  /* the page grows/shrinks when a photo album opens — remeasure to match */
  document.querySelectorAll('.ritual').forEach(function (rt) {
    rt.addEventListener('transitionend', scheduleBuild);
  });
})();
