/* =========================================================
   Inflatable Decorations — Website_3 "Confetti Party" JS
   - IntersectionObserver reveals (single source of truth)
   - Sticky nav scrolled state + active link highlight
   - Mobile nav toggle
   - Gallery filter + lightbox (focus trap, keyboard nav)
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
  const sectionIds = ['top', 'services', 'gallery', 'about', 'contact'];
  const sections = sectionIds.map(id => document.getElementById(id)).filter(Boolean);
  const linkMap  = {};
  $$('#navLinks a:not(.btn)').forEach(a => {
    const href = a.getAttribute('href') || '';
    if (href.startsWith('#')) linkMap[href.slice(1)] = a;
  });
  function updateActive() {
    const y = window.scrollY + 140;
    let activeId = sectionIds[0];
    for (const s of sections) {
      if (s.offsetTop <= y) activeId = s.id;
    }
    Object.keys(linkMap).forEach(k => linkMap[k].classList.toggle('active', k === activeId));
  }
  window.addEventListener('scroll', updateActive, { passive: true });
  updateActive();

  /* ---------- Scroll-to-top ---------- */
  const scrollTop = $('#scrollTop');
  if (scrollTop) {
    const toggleBtn = () => scrollTop.classList.toggle('show', window.scrollY > 800);
    window.addEventListener('scroll', toggleBtn, { passive: true });
    scrollTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' }));
    toggleBtn();
  }

  /* ---------- Gallery filter + random shuffle + cross-section routing ---------- */
  const filterBtns = $$('.filter-btn');
  const galleryItems = $$('.gallery-item');
  const galleryGrid = $('#galleryGrid');

  // Shuffle items on load so "All" feels fresh each visit
  if (galleryGrid && galleryItems.length) {
    const shuffled = galleryItems.slice().sort(() => Math.random() - 0.5);
    shuffled.forEach(item => galleryGrid.appendChild(item));
  }

  function applyFilter(filter) {
    filterBtns.forEach(b => {
      const isActive = b.dataset.filter === filter;
      b.classList.toggle('active', isActive);
      b.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });
    galleryItems.forEach(item => {
      const cat = item.dataset.cat;
      if (filter === 'all' || cat === filter) item.classList.remove('hide');
      else item.classList.add('hide');
    });
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => applyFilter(btn.dataset.filter));
  });

  // Service-card → gallery routing: clicking "View N examples" filters the gallery
  $$('a.inquire[data-cat]').forEach(link => {
    link.addEventListener('click', () => {
      const cat = link.dataset.cat;
      if (cat) setTimeout(() => applyFilter(cat), 60);
    });
  });

  /* ---------- Lightbox ---------- */
  const lightbox = $('#lightbox');
  const lbImage  = $('#lbImage');
  const lbClose  = $('#lbClose');
  const lbPrev   = $('#lbPrev');
  const lbNext   = $('#lbNext');
  let currentIdx = 0;
  let visibleItems = [];
  let lastFocused = null;

  function openLightbox(idx) {
    visibleItems = galleryItems.filter(i => !i.classList.contains('hide'));
    if (!visibleItems.length) return;
    currentIdx = Math.max(0, Math.min(idx, visibleItems.length - 1));
    const img = visibleItems[currentIdx].querySelector('img');
    lbImage.src = img.src;
    lbImage.alt = img.alt || '';
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
    lastFocused = document.activeElement;
    lbClose.focus();
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
    lbImage.src = '';
    if (lastFocused) lastFocused.focus();
  }

  function showAt(idx) {
    if (!visibleItems.length) return;
    currentIdx = (idx + visibleItems.length) % visibleItems.length;
    const img = visibleItems[currentIdx].querySelector('img');
    lbImage.classList.add('fading');
    setTimeout(() => {
      lbImage.src = img.src;
      lbImage.alt = img.alt || '';
      lbImage.classList.remove('fading');
    }, 120);
  }

  galleryItems.forEach((item, idx) => {
    item.addEventListener('click', () => {
      visibleItems = galleryItems.filter(i => !i.classList.contains('hide'));
      const vIdx = visibleItems.indexOf(item);
      openLightbox(vIdx >= 0 ? vIdx : 0);
    });
  });
  if (lbClose) lbClose.addEventListener('click', closeLightbox);
  if (lbPrev)  lbPrev.addEventListener('click', () => showAt(currentIdx - 1));
  if (lbNext)  lbNext.addEventListener('click', () => showAt(currentIdx + 1));
  if (lightbox) {
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
  }
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    else if (e.key === 'ArrowLeft') showAt(currentIdx - 1);
    else if (e.key === 'ArrowRight') showAt(currentIdx + 1);
    else if (e.key === 'Tab') {
      const focusables = [lbClose, lbPrev, lbNext];
      const idx = focusables.indexOf(document.activeElement);
      e.preventDefault();
      const next = e.shiftKey
        ? (idx <= 0 ? focusables.length - 1 : idx - 1)
        : (idx === focusables.length - 1 ? 0 : idx + 1);
      focusables[next].focus();
    }
  });

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

  /* ---------- Mobile sticky CTA bar (show after scroll past hero) ---------- */
  const mobileBar = $('#mobileCtaBar');
  if (mobileBar) {
    const heroEl = document.querySelector('.hero');
    function toggleMobileBar() {
      const heroBottom = heroEl ? heroEl.getBoundingClientRect().bottom : 600;
      mobileBar.classList.toggle('show', heroBottom < 0);
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
