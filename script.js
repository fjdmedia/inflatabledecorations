/* =========================================================
   Inflatable Decorations — Website_3 "Confetti Party" JS
   - IntersectionObserver reveals (single source of truth)
   - Sticky nav scrolled state + active link highlight
   - Mobile nav toggle
   - Photo viewer / lightbox on the SERVICE + CORPORATE pages (focus trap,
     keyboard nav, swipe, full-resolution swap). The homepage gallery keeps its
     own separate viewer inline in index.html.
   - Scroll-to-top
   - Form submit stub with confetti burst
   - Reduced-motion friendly
   ========================================================= */
(function () {
  'use strict';

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  /* ---------- Current year ---------- */
  const yr = $('#yr');
  if (yr) yr.textContent = new Date().getFullYear();

  /* ---------- Reveal ---------- */
  const revealEls = $$('.reveal');
  if (reduced) {
    revealEls.forEach(el => el.classList.add('in'));
  } else if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => io.observe(el));

    // Above-the-fold: reveal immediately on load
    document.addEventListener('DOMContentLoaded', () => {
      const vh = window.innerHeight;
      revealEls.forEach(el => {
        const r = el.getBoundingClientRect();
        if (r.top < vh - 40) el.classList.add('in');
      });
    });

    // Safety fallback — force-reveal stragglers
    setTimeout(() => revealEls.forEach(el => el.classList.add('in')), 2500);
  } else {
    revealEls.forEach(el => el.classList.add('in'));
  }

  /* ---------- Sticky nav ---------- */
  const nav = $('#nav');
  const onScroll = () => {
    if (window.scrollY > 20) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile nav ---------- */
  const navToggle = $('#navToggle');
  const navLinks  = $('#navLinks');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const open = navLinks.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    $$('a', navLinks).forEach(a => {
      a.addEventListener('click', () => {
        navLinks.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- Active nav link on scroll ---------- */
  const sectionIds = ['top', 'services', 'about', 'gallery', 'contact'];
  const sections = sectionIds.map(id => document.getElementById(id)).filter(Boolean);
  const linkMap  = {};
  $$('#navLinks a:not(.btn)').forEach(a => {
    const href = a.getAttribute('href') || '';
    if (href.startsWith('#')) linkMap[href.slice(1)] = a;
  });
  function setActive(id) {
    Object.keys(linkMap).forEach(k => linkMap[k].classList.toggle('active', k === id));
  }
  if ('IntersectionObserver' in window && sections.length) {
    const visible = new Map();
    const spy = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) visible.set(e.target.id, e.intersectionRatio);
        else visible.delete(e.target.id);
      });
      if (window.scrollY < 80) { setActive(sectionIds[0]); return; }
      if (!visible.size) return;
      let top = sectionIds[0], best = -1;
      for (const [id, ratio] of visible) {
        if (ratio > best) { best = ratio; top = id; }
      }
      setActive(top);
    }, { rootMargin: '-35% 0px -55% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] });
    sections.forEach(s => spy.observe(s));
  } else {
    const onScroll = () => {
      const y = window.scrollY + window.innerHeight / 2;
      let activeId = sectionIds[0];
      for (const s of sections) if (s.offsetTop <= y) activeId = s.id;
      setActive(activeId);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Testimonial "Read more" expand (animated, one-at-a-time accordion) ---------- */
  const tCards = $$('.t-card');
  const collapseTCard = (card) => {
    if (!card.classList.contains('expanded')) return;
    const quote = card.querySelector('.t-quote');
    const btn   = card.querySelector('.t-expand');
    quote.style.maxHeight = quote.scrollHeight + 'px';      // pin current (may be 'none' after expand)
    requestAnimationFrame(() => { quote.style.maxHeight = (quote.dataset.collapsed || 0) + 'px'; });
    card.classList.remove('expanded');
    if (btn) { btn.setAttribute('aria-expanded', 'false'); btn.textContent = 'Read more'; }
  };
  tCards.forEach(card => {
    const quote = card.querySelector('.t-quote');
    const btn   = card.querySelector('.t-expand');
    if (!quote || !btn) return;
    const measure = () => {
      if (card.classList.contains('expanded')) return;
      quote.style.maxHeight = '';                       // reset to CSS collapsed, then measure
      const clamped = quote.scrollHeight > quote.clientHeight + 2;
      card.classList.toggle('is-clamped', clamped);
      btn.hidden = !clamped;
      quote.dataset.collapsed = quote.clientHeight;
    };
    requestAnimationFrame(measure);
    window.addEventListener('resize', () => requestAnimationFrame(measure), { passive: true });
    btn.addEventListener('click', () => {
      const willExpand = !card.classList.contains('expanded');
      if (willExpand) {
        tCards.forEach(c => { if (c !== card) collapseTCard(c); });   // accordion: close the others
        quote.style.maxHeight = quote.scrollHeight + 'px';            // animate open to full height
        card.classList.add('expanded');
        btn.setAttribute('aria-expanded', 'true');
        btn.textContent = 'Read less';
      } else {
        collapseTCard(card);
      }
    });
    quote.addEventListener('transitionend', (e) => {
      if (e.propertyName === 'max-height' && card.classList.contains('expanded')) quote.style.maxHeight = 'none';
    });
  });

  /* ---------- Scroll-to-top ---------- */
  const scrollTop = $('#scrollTop');
  if (scrollTop) {
    const toggleBtn = () => scrollTop.classList.toggle('show', window.scrollY > 800);
    window.addEventListener('scroll', toggleBtn, { passive: true });
    scrollTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' }));
    toggleBtn();
  }

  /* ---------- Photo viewer (lightbox) — SERVICE + CORPORATE PAGES ONLY ----------
     Scope is deliberate (James, 2026-08-23): the service pages and the corporate
     page get clickable photos; the HOMEPAGE DOES NOT. index.html's marquee gallery
     keeps its own self-contained viewer (#galLb, inline in that file) and the
     homepage hero and service-card photos stay non-clickable. Do not widen
     PHOTO_SEL to homepage selectors without asking — that was tried and reverted.

     Those photos are cropped by object-fit:cover, so a tile only ever shows a
     SLICE of the frame. This opens the whole picture, letterboxed.

     Two things worth knowing before editing:
       1. Full-resolution swap. Thumbs can be served at -800; the originals are
          1290-1800px wide and every -800 file has one. The viewer paints the
          already-cached thumb FIRST so the frame never opens blank, then swaps in
          the original once it decodes. A token guards the swap so a slow original
          landing after the visitor has moved on cannot overwrite the newer photo.
       2. Progressive markup. role/tabindex/aria-label are attached HERE, at
          runtime — never in the HTML. Crawlers that do not run JS (which is most
          AI crawlers) still see a plain <img alt="...">, so this costs nothing
          in SEO or GEO.
  */
  const PHOTO_SEL = '.svc-hero-photo img, .svc-shot img';

  // Assets/.../Cover-800.jpg -> Assets/.../Cover.jpg   (verified: all 86 thumbs have a full-size twin)
  const fullSrc = (s) => s.replace(/-800(\.[a-z0-9]+)(\?.*)?$/i, '$1$2');

  let lb, lbImg, lbCap, lbCount, lbClose, lbPrev, lbNext;
  let lbItems = [], lbIdx = 0, lbLast = null, lbToken = 0;

  function lbBuild() {
    if (lb) return;
    lb = document.createElement('div');
    lb.className = 'g-lb fj-lb';
    lb.setAttribute('role', 'dialog');
    lb.setAttribute('aria-modal', 'true');
    lb.setAttribute('aria-label', 'Photo viewer');
    lb.setAttribute('aria-hidden', 'true');
    lb.innerHTML =
      '<button class="g-lb-close" type="button" aria-label="Close photo viewer">&times;</button>' +
      '<button class="g-lb-nav g-lb-prev" type="button" aria-label="Previous photo">&#8249;</button>' +
      '<figure class="fj-lb-fig">' +
        '<img class="g-lb-img" alt="" />' +
        '<figcaption class="fj-lb-cap"></figcaption>' +
      '</figure>' +
      '<button class="g-lb-nav g-lb-next" type="button" aria-label="Next photo">&#8250;</button>' +
      '<div class="g-lb-count" aria-live="polite"></div>';
    document.body.appendChild(lb);

    lbImg   = lb.querySelector('.g-lb-img');
    lbCap   = lb.querySelector('.fj-lb-cap');
    lbCount = lb.querySelector('.g-lb-count');
    lbClose = lb.querySelector('.g-lb-close');
    lbPrev  = lb.querySelector('.g-lb-prev');
    lbNext  = lb.querySelector('.g-lb-next');

    lbClose.addEventListener('click', lbShut);
    lbPrev.addEventListener('click', () => lbShow(lbIdx - 1));
    lbNext.addEventListener('click', () => lbShow(lbIdx + 1));
    // Backdrop and the letterbox margin around the photo both dismiss; the caption does not.
    lb.addEventListener('click', (e) => {
      if (e.target === lb || e.target.classList.contains('fj-lb-fig')) lbShut();
    });

    let sx = 0, sy = 0;
    lb.addEventListener('touchstart', (e) => {
      sx = e.changedTouches[0].clientX; sy = e.changedTouches[0].clientY;
    }, { passive: true });
    lb.addEventListener('touchend', (e) => {
      const dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
      if (lbItems.length > 1 && Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) lbShow(lbIdx + (dx < 0 ? 1 : -1));
    }, { passive: true });

    document.addEventListener('keydown', (e) => {
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape') { e.preventDefault(); lbShut(); }
      else if (e.key === 'ArrowRight' && lbItems.length > 1) lbShow(lbIdx + 1);
      else if (e.key === 'ArrowLeft'  && lbItems.length > 1) lbShow(lbIdx - 1);
      else if (e.key === 'Tab') {
        // Focus stays inside the dialog — the page behind it is unreachable while open.
        const f = [lbClose, lbPrev, lbNext].filter(b => !b.hidden);
        const at = f.indexOf(document.activeElement);
        e.preventDefault();
        f[(at + (e.shiftKey ? -1 : 1) + f.length) % f.length].focus();
      }
    });
  }

  function lbShow(i) {
    const n = lbItems.length;
    if (!n) return;
    lbIdx = (i + n) % n;
    const it = lbItems[lbIdx];
    const token = ++lbToken;
    const start = it.thumb || it.full;

    lb.classList.add('is-loading');
    lbImg.src = start;
    lbImg.alt = it.alt || '';
    lbCap.textContent = it.alt || '';
    lbCap.hidden = !it.alt;
    lbCount.textContent = n > 1 ? (lbIdx + 1) + ' / ' + n : '';

    if (it.full && it.full !== start) {
      const hi = new Image();
      hi.onload  = () => { if (token === lbToken) { lbImg.src = it.full; lb.classList.remove('is-loading'); } };
      hi.onerror = () => { if (token === lbToken) lb.classList.remove('is-loading'); };  // full-size missing: keep the thumb, never blank the frame
      hi.src = it.full;
    } else {
      lb.classList.remove('is-loading');
    }
  }

  function lbOpen(items, i) {
    if (!items || !items.length) return;
    lbBuild();
    lbItems = items;
    lbLast = document.activeElement;
    const multi = items.length > 1;
    lbPrev.hidden = lbNext.hidden = !multi;   // a single photo gets no dead prev/next buttons
    lbShow(i || 0);
    lb.classList.add('open');
    lb.setAttribute('aria-hidden', 'false');
    document.body.classList.add('fj-lb-lock');
    lbClose.focus();
  }

  function lbShut() {
    if (!lb || !lb.classList.contains('open')) return;
    lbToken++;                                   // cancel any full-size load still in flight
    lb.classList.remove('open');
    lb.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('fj-lb-lock');
    lbImg.removeAttribute('src');
    if (lbLast && lbLast.focus) lbLast.focus();  // return focus to the photo that opened it
  }


  const photoNodes = $$(PHOTO_SEL);
  if (photoNodes.length) {
    const items = photoNodes.map(img => {
      const raw = img.getAttribute('src') || img.getAttribute('data-src') || '';
      return { thumb: raw, full: fullSrc(raw), alt: img.getAttribute('alt') || '' };
    });
    photoNodes.forEach((img, i) => {
      const host = img.closest('figure, .hero-arch, .img-arch, .svc-hero-photo') || img;
      host.classList.add('fj-zoom');
      img.setAttribute('role', 'button');
      img.setAttribute('tabindex', '0');
      img.setAttribute('aria-label', 'View full photo' + (img.alt ? ': ' + img.alt : ''));
      img.addEventListener('click', () => lbOpen(items, i));
      img.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') { e.preventDefault(); lbOpen(items, i); }
      });
    });
  }

  /* ---------- Form submit (placeholder) ---------- */
  const form = $('#inquiryForm');
  const fb   = $('#formFeedback');
  if (form && fb) {
    form.addEventListener('submit', (e) => {
      const key = form.querySelector('input[name="access_key"]').value;
      if (key === 'FORM_ACCESS_KEY_PLACEHOLDER') {
        e.preventDefault();
        fb.textContent = 'Your inquiry has been sent — we\'ll reply within 24h!';
        fb.classList.add('active');
        form.reset();
        if (!reduced) confettiBurst(form.querySelector('button[type="submit"]'));
        setTimeout(() => { fb.textContent = ''; fb.classList.remove('active'); }, 5000);
      }
    });
  }

  /* =========================================================
     ▒▒▒▒▒  SUPER SAIYAN V2 LAYER  ▒▒▒▒▒
     Page splash · scroll progress · hero parallax ·
     service-card tilt · cursor trail · mobile sticky CTA
     ========================================================= */

  /* ---------- Page splash dismiss ---------- */
  const splash = $('#pageSplash');
  if (splash) {
    setTimeout(() => splash.remove(), 1700);
  }

  /* ---------- Scroll-progress tracker ---------- */
  const trackFill    = $('#scrollTrackFill');
  const trackBalloon = $('#scrollTrackBalloon');
  const trackDots    = $$('.scroll-track-dots a');
  function updateTrack() {
    const h = document.documentElement;
    const max = h.scrollHeight - h.clientHeight;
    const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
    if (trackFill)    trackFill.style.height = pct + '%';
    if (trackBalloon) trackBalloon.style.top = pct + '%';

    // Active dot = dot nearest to the balloon position (unified visual).
    // Dots are evenly spaced on the track, so dot i sits at (i / (n-1)) * 100%.
    if (trackDots.length) {
      const step = 100 / (trackDots.length - 1);
      const activeIdx = Math.max(0, Math.min(trackDots.length - 1, Math.round(pct / step)));
      trackDots.forEach((d, i) => d.classList.toggle('active', i === activeIdx));
    }
  }
  window.addEventListener('scroll', updateTrack, { passive: true });
  updateTrack();

  /* ---------- Hero mouse-parallax ---------- */
  const heroVisual = document.querySelector('[data-tilt="hero"]');
  const hero = document.querySelector('.hero');
  if (heroVisual && hero && !reduced && window.matchMedia('(hover: hover)').matches) {
    let raf;
    hero.addEventListener('mousemove', (e) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const rect = hero.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;   // -0.5 ↔ 0.5
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        const tx = x * -16;
        const ty = y * -10;
        const rx = y * 4;
        const ry = x * -6;
        heroVisual.style.transform = `translate3d(${tx}px, ${ty}px, 0) rotateX(${rx}deg) rotateY(${ry}deg)`;
      });
    });
    hero.addEventListener('mouseleave', () => {
      heroVisual.style.transform = '';
    });
  }

  /* ---------- Service-card 3D tilt (subtle) ---------- */
  if (!reduced && window.matchMedia('(hover: hover)').matches) {
    $$('.service-card').forEach(card => {
      let raf;
      card.addEventListener('mouseenter', () => card.classList.add('tilt-active'));
      card.addEventListener('mousemove', (e) => {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          const r = card.getBoundingClientRect();
          const x = (e.clientX - r.left) / r.width - 0.5;
          const y = (e.clientY - r.top) / r.height - 0.5;
          card.style.transform = `translateY(-6px) rotateX(${y * -5}deg) rotateY(${x * 6}deg)`;
        });
      });
      card.addEventListener('mouseleave', () => {
        card.classList.remove('tilt-active');
        card.style.transform = '';
      });
    });
  }

  /* ---------- Cursor balloon trail (desktop only) ---------- */
  const cursorTrail = $('#cursorTrail');
  if (cursorTrail && !reduced && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    let lastTrail = 0;
    document.addEventListener('mousemove', (e) => {
      const now = performance.now();
      if (now - lastTrail < 60) return; // throttle
      lastTrail = now;
      const dot = document.createElement('span');
      dot.className = 'cursor-trail-dot';
      dot.style.left = e.clientX + 'px';
      dot.style.top  = e.clientY + 'px';
      const palette = ['#FF5FA2', '#FFE27A', '#A9E4C7', '#D7BEF2', '#FFB788'];
      dot.style.background = palette[Math.floor(Math.random() * palette.length)];
      cursorTrail.appendChild(dot);
      setTimeout(() => dot.remove(), 800);
    });
  }

  /* ---------- Form trigger: warm-load iframe before click for instant feel ---------- */
  const formCollapse = $('#formCollapse');
  const formTrigger  = $('#formTrigger');
  const formShell    = $('#formShell');
  if (formCollapse && formTrigger && formShell) {
    const iframe = formShell.querySelector('iframe');
    function warmLoad() {
      if (iframe && !iframe.dataset.loaded && iframe.dataset.src) {
        iframe.setAttribute('src', iframe.dataset.src);
        iframe.dataset.loaded = '1';
      }
    }
    // 1) Warm-load when the contact section gets close to viewport (rootMargin 600px)
    const contactEl = $('#contact');
    if (contactEl && 'IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries) => {
        if (entries.some(e => e.isIntersecting)) {
          warmLoad();
          io.disconnect();
        }
      }, { rootMargin: '600px 0px 600px 0px' });
      io.observe(contactEl);
    }
    // 2) Warm-load on hover/focus of the trigger (intent signal)
    ['pointerenter', 'focus', 'touchstart'].forEach(ev => {
      formTrigger.addEventListener(ev, warmLoad, { once: true, passive: true });
    });
    // 3) Fallback: warm-load on idle so it's ready even if user jumps straight to it
    if ('requestIdleCallback' in window) {
      requestIdleCallback(warmLoad, { timeout: 4000 });
    } else {
      setTimeout(warmLoad, 2500);
    }

    formTrigger.addEventListener('click', () => {
      if (formCollapse.dataset.state === 'open') return;
      formCollapse.dataset.state = 'open';
      formTrigger.setAttribute('aria-expanded', 'true');
      formShell.hidden = false;
      warmLoad();
      // Scroll the form into view so the user lands at the first field
      setTimeout(() => {
        formShell.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
      }, 60);
    });
    // Auto-open if user clicked any in-page link to #contact (intent already committed)
    function maybeOpenFromHash() {
      if (window.location.hash === '#contact' && formCollapse.dataset.state !== 'open') {
        setTimeout(() => formTrigger.click(), 220);
      }
    }
    maybeOpenFromHash();
    window.addEventListener('hashchange', maybeOpenFromHash);
    $$('a[href="#contact"]').forEach(a => {
      a.addEventListener('click', () => {
        if (formCollapse.dataset.state !== 'open') {
          setTimeout(() => formTrigger.click(), 220);
        }
      });
    });
  }

  /* ---------- Mobile sticky CTA bar (show after scroll past hero, hide near form) ---------- */
  const mobileBar = $('#mobileCtaBar');
  if (mobileBar) {
    const heroEl = document.querySelector('.hero');
    const contactSection = document.querySelector('#contact');
    function toggleMobileBar() {
      const heroBottom = heroEl ? heroEl.getBoundingClientRect().bottom : 600;
      // Hide the bar once the contact section enters the viewport so it never
      // covers the form's Submit button on mobile.
      const cr = contactSection ? contactSection.getBoundingClientRect() : null;
      const contactInView = cr && cr.top < window.innerHeight && cr.bottom > 0;
      mobileBar.classList.toggle('show', heroBottom < 0 && !contactInView);
    }
    window.addEventListener('scroll', toggleMobileBar, { passive: true });
    toggleMobileBar();
  }

  /* ---------- Confetti burst (tiny SVG rain, 2s) ---------- */
  function confettiBurst(anchor) {
    if (!anchor || reduced) return;
    const colors = ['#FF5FA2', '#FFE27A', '#A9E4C7', '#D7BEF2', '#FFB788', '#A6D5F5'];
    const rect = anchor.getBoundingClientRect();
    const startX = rect.left + rect.width / 2;
    const startY = rect.top + rect.height / 2;
    const layer = document.createElement('div');
    layer.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:2000;';
    document.body.appendChild(layer);
    for (let i = 0; i < 28; i++) {
      const p = document.createElement('span');
      const c = colors[i % colors.length];
      const size = 6 + Math.random() * 7;
      const dx = (Math.random() - 0.5) * 360;
      const dy = -120 - Math.random() * 220;
      p.style.cssText = `position:absolute;left:${startX}px;top:${startY}px;width:${size}px;height:${size}px;background:${c};border-radius:${Math.random()>.5?'50%':'2px'};transform:translate(-50%,-50%) rotate(${Math.random()*360}deg);transition:transform 1.6s cubic-bezier(.22,1,.36,1),opacity 1.6s ease;`;
      layer.appendChild(p);
      requestAnimationFrame(() => {
        p.style.transform = `translate(${dx}px, ${dy + 300}px) rotate(${Math.random()*720}deg)`;
        p.style.opacity = '0';
      });
    }
    setTimeout(() => layer.remove(), 2000);
  }
})();
