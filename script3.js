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

  /* ---------- Gallery filter ---------- */
  const filterBtns = $$('.filter-btn');
  const galleryItems = $$('.gallery-item');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected', 'false'); });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      const filter = btn.dataset.filter;
      galleryItems.forEach(item => {
        const cat = item.dataset.cat;
        if (filter === 'all' || cat === filter) item.classList.remove('hide');
        else item.classList.add('hide');
      });
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
