/* =========================================================
   Inflatable Decorations — site script
   Animation system: IntersectionObserver drives reveals.
   GSAP is kept only for the hero intro sequence (sequencing).
   ========================================================= */
(function () {
  'use strict';

  var reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------- Year in footer ----------
  var yr = document.getElementById('yr');
  if (yr) yr.textContent = new Date().getFullYear();

  // ---------- Mobile nav toggle ----------
  var navEl      = document.querySelector('.nav');
  var navToggle  = document.getElementById('navToggle');
  var navLinks   = document.getElementById('navLinks');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      var isOpen = navLinks.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });
    navLinks.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        if (navLinks.classList.contains('open')) {
          navLinks.classList.remove('open');
          navToggle.setAttribute('aria-expanded', 'false');
        }
      });
    });
  }

  // ---------- Sticky nav scrolled state ----------
  if (navEl) {
    var onScroll = function () {
      var y = window.scrollY || window.pageYOffset;
      navEl.classList.toggle('scrolled', y > 20);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // ---------- Active nav link highlight via IO ----------
  var sectionLinks = Array.prototype.slice.call(
    document.querySelectorAll('.nav-links a[href^="#"]')
  ).filter(function (a) {
    var href = a.getAttribute('href');
    return href && href.length > 1 && !a.classList.contains('btn');
  });
  var sectionTargets = sectionLinks
    .map(function (a) {
      var id = a.getAttribute('href').slice(1);
      return { link: a, el: document.getElementById(id) };
    })
    .filter(function (t) { return !!t.el; });

  if (sectionTargets.length && 'IntersectionObserver' in window) {
    var activeLinkMap = {};
    var setActive = function (id) {
      sectionLinks.forEach(function (a) {
        var isMatch = a.getAttribute('href') === '#' + id;
        if (isMatch) a.setAttribute('aria-current', 'true');
        else a.removeAttribute('aria-current');
      });
    };
    var linkObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        activeLinkMap[entry.target.id] = entry.isIntersecting ? entry.intersectionRatio : 0;
      });
      // Pick the currently most-visible section
      var best = null;
      var bestRatio = 0;
      Object.keys(activeLinkMap).forEach(function (id) {
        if (activeLinkMap[id] > bestRatio) {
          bestRatio = activeLinkMap[id];
          best = id;
        }
      });
      if (best) setActive(best);
    }, {
      rootMargin: '-40% 0px -45% 0px',
      threshold: [0, 0.25, 0.5, 0.75, 1]
    });
    sectionTargets.forEach(function (t) { linkObserver.observe(t.el); });
  }

  // ---------- Gallery filter ----------
  var filters = document.querySelectorAll('.filter-btn');
  var items   = document.querySelectorAll('.gallery-item');
  filters.forEach(function (btn) {
    btn.addEventListener('click', function () {
      filters.forEach(function (b) {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      var f = btn.getAttribute('data-filter');
      items.forEach(function (it) {
        var matches = (f === 'all' || it.getAttribute('data-cat') === f);
        it.classList.toggle('hidden', !matches);
        // Guarantee the card is revealed even if it never entered the IO viewport
        if (matches) it.classList.add('is-revealed');
      });
    });
  });

  // ---------- Lightbox with focus trap + keyboard nav ----------
  var lightbox = document.getElementById('lightbox');
  var lbImage  = document.getElementById('lbImage');
  var lbClose  = document.getElementById('lbClose');
  var lbPrev   = document.getElementById('lbPrev');
  var lbNext   = document.getElementById('lbNext');
  var currentIdx = -1;
  var lastFocus  = null;

  function getVisibleItems() {
    return Array.prototype.filter.call(items, function (it) {
      return !it.classList.contains('hidden');
    });
  }

  function swapLightboxImage(img) {
    if (!img || !lbImage) return;
    lbImage.classList.add('is-swapping');
    // Tiny delay so the opacity transition is visible
    setTimeout(function () {
      lbImage.src = img.src;
      lbImage.alt = img.alt || '';
      lbImage.classList.remove('is-swapping');
    }, 120);
  }

  function openLightbox(idx) {
    var visible = getVisibleItems();
    if (!visible.length || !lightbox || !lbImage) return;
    currentIdx = (idx + visible.length) % visible.length;
    var img = visible[currentIdx].querySelector('img');
    if (!img) return;

    var firstOpen = !lightbox.classList.contains('open');
    if (firstOpen) {
      lastFocus = document.activeElement;
      lbImage.src = img.src;
      lbImage.alt = img.alt || '';
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
      if (lbClose) lbClose.focus();
    } else {
      swapLightboxImage(img);
    }
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
    if (lbImage) lbImage.src = '';
    currentIdx = -1;
    if (lastFocus && typeof lastFocus.focus === 'function') {
      lastFocus.focus();
      lastFocus = null;
    }
  }

  items.forEach(function (it) {
    it.addEventListener('click', function () {
      var visible = getVisibleItems();
      var visibleIdx = visible.indexOf(it);
      if (visibleIdx !== -1) openLightbox(visibleIdx);
    });
  });

  if (lbClose) lbClose.addEventListener('click', closeLightbox);
  if (lbPrev)  lbPrev.addEventListener('click', function () { openLightbox(currentIdx - 1); });
  if (lbNext)  lbNext.addEventListener('click', function () { openLightbox(currentIdx + 1); });

  if (lightbox) {
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });
  }

  document.addEventListener('keydown', function (e) {
    if (!lightbox || !lightbox.classList.contains('open')) return;
    if (e.key === 'Escape')     { e.preventDefault(); closeLightbox(); }
    if (e.key === 'ArrowRight') { e.preventDefault(); openLightbox(currentIdx + 1); }
    if (e.key === 'ArrowLeft')  { e.preventDefault(); openLightbox(currentIdx - 1); }
    // Simple focus trap: cycle between close/prev/next
    if (e.key === 'Tab') {
      var focusables = [lbClose, lbPrev, lbNext].filter(Boolean);
      if (!focusables.length) return;
      var idx = focusables.indexOf(document.activeElement);
      e.preventDefault();
      var next;
      if (e.shiftKey) {
        next = idx <= 0 ? focusables[focusables.length - 1] : focusables[idx - 1];
      } else {
        next = idx === focusables.length - 1 || idx === -1 ? focusables[0] : focusables[idx + 1];
      }
      next.focus();
    }
  });

  // ---------- Scroll-to-top button ----------
  var scrollTop = document.getElementById('scrollTop');
  if (scrollTop) {
    var toggleScrollTop = function () {
      var y = window.scrollY || window.pageYOffset;
      scrollTop.classList.toggle('is-visible', y > 800);
    };
    toggleScrollTop();
    window.addEventListener('scroll', toggleScrollTop, { passive: true });
    scrollTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
    });
  }

  // ---------- Inquiry form feedback (placeholder — no backend) ----------
  var inquiryForm = document.getElementById('inquiryForm');
  if (inquiryForm) {
    inquiryForm.addEventListener('submit', function (e) {
      // The form action still points to Web3Forms with a placeholder key,
      // so we intercept for a clean "pretend success" UX until the real key lands.
      e.preventDefault();

      var submitBtn = inquiryForm.querySelector('button[type="submit"]');
      if (submitBtn) submitBtn.classList.add('is-disabled');

      var feedback = document.getElementById('formFeedback');
      if (feedback) {
        feedback.classList.add('is-visible');
        feedback.classList.remove('is-error');
        feedback.setAttribute('role', 'status');
        feedback.innerHTML =
          '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6L9 17l-5-5"/></svg>' +
          '<span>Your inquiry has been sent &mdash; we\'ll reply within 24h.</span>';
        // Bring it into view if it renders below the fold
        try { feedback.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'center' }); } catch (err) { /* noop */ }
      }

      // Softly reset the form after the success message registers
      setTimeout(function () {
        try { inquiryForm.reset(); } catch (err) { /* noop */ }
        if (submitBtn) submitBtn.classList.remove('is-disabled');
      }, 600);
    });
  }

  // ---------- Reveal animations (IntersectionObserver) ----------
  var revealEls = document.querySelectorAll('.reveal');

  // Reduced motion: just show everything and bail early.
  if (reducedMotion) {
    revealEls.forEach(function (el) { el.classList.add('is-revealed'); });
    return;
  }

  // Above-the-fold reveal: anything already in view on load pops in immediately.
  var vh = window.innerHeight || document.documentElement.clientHeight;
  var aboveFold = [];
  var offscreen = [];
  revealEls.forEach(function (el) {
    var rect = el.getBoundingClientRect();
    if (rect.top < vh * 0.95) aboveFold.push(el);
    else offscreen.push(el);
  });

  // Reveal above-the-fold with a tight stagger so hero feels intentional, not snap-in.
  aboveFold.forEach(function (el, i) {
    var delay = Math.min(i * 70, 350);
    setTimeout(function () { el.classList.add('is-revealed'); }, delay);
  });

  // Hero polish — if GSAP is loaded, run a more deliberate intro timeline.
  // This *replaces* the class-based reveal for hero-only elements, so no double animation.
  function runHeroTimeline() {
    if (!window.gsap) return false;
    var heroReveals = document.querySelectorAll('.hero .reveal');
    if (!heroReveals.length) return false;
    // Pre-set with GSAP to avoid a flash while the class-based reveal already fired.
    // We reset to the hidden state, then animate in smoothly.
    gsap.set(heroReveals, { opacity: 0, y: 22 });
    heroReveals.forEach(function (el) { el.classList.add('is-revealed'); }); // keep IO from re-touching
    gsap.to(heroReveals, {
      opacity: 1,
      y: 0,
      duration: 0.75,
      ease: 'power3.out',
      stagger: 0.08,
      clearProps: 'transform,opacity'
    });
    return true;
  }

  // Try GSAP hero timeline once it's ready. If GSAP never loads, class-based reveal above is the fallback.
  if (document.readyState === 'complete') {
    runHeroTimeline();
  } else {
    window.addEventListener('load', runHeroTimeline);
  }

  // IntersectionObserver for offscreen reveals — fires once, no re-trigger on scroll-up.
  if (offscreen.length) {
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            io.unobserve(entry.target);
          }
        });
      }, {
        rootMargin: '0px 0px -8% 0px',
        threshold: 0.08
      });
      offscreen.forEach(function (el) { io.observe(el); });
    } else {
      // No IO support — just reveal everything.
      offscreen.forEach(function (el) { el.classList.add('is-revealed'); });
    }
  }

  // Safety net: after 2.5s, anything still not revealed gets forced visible.
  setTimeout(function () {
    revealEls.forEach(function (el) {
      if (!el.classList.contains('is-revealed')) el.classList.add('is-revealed');
    });
  }, 2500);
})();
