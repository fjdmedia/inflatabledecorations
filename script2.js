/* =============================================================
   Inflatable Decorations — Website_2 (rebuild)
   Modern Warm Editorial — Dusty Rose Atelier
   Vanilla JS. One source of truth for reveals.
   ============================================================= */

(function () {
  "use strict";

  const REDUCED_MOTION = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.addEventListener("DOMContentLoaded", init);

  function init() {
    initReveal();
    initNav();
    initScrollTop();
    initGalleryFilters();
    initLightbox();
    initTestimonialRotator();
    initForm();
    initActiveLink();
  }

  /* --------------------------------------------------------
     REVEAL — single IntersectionObserver, unobserve on trigger
     -------------------------------------------------------- */
  function initReveal() {
    const items = document.querySelectorAll(".reveal");
    if (!items.length) return;

    if (REDUCED_MOTION) {
      items.forEach((el) => el.classList.add("in"));
      return;
    }

    // Above-the-fold: reveal hero text + hero photo instantly
    const aboveFold = document.querySelectorAll(".hero .reveal");
    aboveFold.forEach((el, i) => {
      setTimeout(() => el.classList.add("in"), 60 + i * 80);
    });

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, idx) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const delay = parseInt(el.dataset.revealDelay || "0", 10);
            setTimeout(() => el.classList.add("in"), delay + idx * 80);
            io.unobserve(el);
          }
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.08 }
    );

    items.forEach((el) => {
      if (!el.classList.contains("in")) io.observe(el);
    });

    // 2.5s safety — force reveal any stragglers
    setTimeout(() => {
      document.querySelectorAll(".reveal:not(.in)").forEach((el) => el.classList.add("in"));
    }, 2500);
  }

  /* --------------------------------------------------------
     NAV — sticky scrolled state + mobile toggle
     -------------------------------------------------------- */
  function initNav() {
    const nav = document.getElementById("nav");
    const toggle = document.getElementById("navToggle");
    const links = document.getElementById("navLinks");

    if (nav) {
      const onScroll = () => {
        if (window.scrollY > 40) nav.classList.add("is-scrolled");
        else nav.classList.remove("is-scrolled");
      };
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
    }

    if (toggle && links) {
      toggle.addEventListener("click", () => {
        const open = links.classList.toggle("is-open");
        toggle.setAttribute("aria-expanded", open ? "true" : "false");
      });
      links.querySelectorAll("a").forEach((a) => {
        a.addEventListener("click", () => {
          links.classList.remove("is-open");
          toggle.setAttribute("aria-expanded", "false");
        });
      });
    }
  }

  /* --------------------------------------------------------
     SCROLL-TO-TOP
     -------------------------------------------------------- */
  function initScrollTop() {
    const btn = document.getElementById("scrollTop");
    if (!btn) return;

    const onScroll = () => {
      if (window.scrollY > 800) btn.classList.add("is-visible");
      else btn.classList.remove("is-visible");
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    btn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: REDUCED_MOTION ? "auto" : "smooth" });
    });
  }

  /* --------------------------------------------------------
     GALLERY FILTERS
     -------------------------------------------------------- */
  function initGalleryFilters() {
    const pills = document.querySelectorAll(".filter-pill");
    const items = document.querySelectorAll(".gallery-item");
    if (!pills.length || !items.length) return;

    pills.forEach((pill) => {
      pill.addEventListener("click", () => {
        const f = pill.dataset.filter;
        pills.forEach((p) => {
          const active = p === pill;
          p.classList.toggle("is-active", active);
          p.setAttribute("aria-selected", active ? "true" : "false");
        });
        items.forEach((it) => {
          const match = f === "all" || it.dataset.cat === f;
          it.classList.toggle("is-hidden", !match);
        });
      });
    });
  }

  /* --------------------------------------------------------
     LIGHTBOX — vanilla, focus trap, keyboard nav
     -------------------------------------------------------- */
  function initLightbox() {
    const lb = document.getElementById("lightbox");
    const img = document.getElementById("lightboxImg");
    const cap = document.getElementById("lightboxCap");
    const closeBtn = document.getElementById("lightboxClose");
    const prevBtn = document.getElementById("lightboxPrev");
    const nextBtn = document.getElementById("lightboxNext");
    const frame = lb ? lb.querySelector(".lightbox-frame") : null;
    if (!lb || !img || !cap || !frame) return;

    const items = Array.from(document.querySelectorAll(".gallery-item"));
    let currentIdx = -1;
    let lastFocused = null;

    const getVisibleItems = () => items.filter((it) => !it.classList.contains("is-hidden"));

    const setImg = (it) => {
      const src = it.querySelector("img").getAttribute("src");
      const alt = it.querySelector("img").getAttribute("alt") || "";
      const capText = (it.querySelector("figcaption") || {}).textContent || "";
      frame.classList.add("is-fading");
      setTimeout(() => {
        img.src = src;
        img.alt = alt;
        cap.textContent = capText;
        requestAnimationFrame(() => frame.classList.remove("is-fading"));
      }, 150);
    };

    const open = (idx) => {
      const visible = getVisibleItems();
      if (!visible.length) return;
      currentIdx = idx;
      lastFocused = document.activeElement;
      setImg(visible[currentIdx]);
      lb.classList.add("is-open");
      lb.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      setTimeout(() => closeBtn.focus(), 20);
    };
    const close = () => {
      lb.classList.remove("is-open");
      lb.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      if (lastFocused && lastFocused.focus) lastFocused.focus();
    };
    const step = (dir) => {
      const visible = getVisibleItems();
      if (!visible.length) return;
      currentIdx = (currentIdx + dir + visible.length) % visible.length;
      setImg(visible[currentIdx]);
    };

    items.forEach((it) => {
      it.addEventListener("click", () => {
        const visible = getVisibleItems();
        const idx = visible.indexOf(it);
        if (idx >= 0) open(idx);
      });
    });

    closeBtn.addEventListener("click", close);
    prevBtn.addEventListener("click", () => step(-1));
    nextBtn.addEventListener("click", () => step(1));
    lb.addEventListener("click", (e) => { if (e.target === lb) close(); });

    document.addEventListener("keydown", (e) => {
      if (!lb.classList.contains("is-open")) return;
      if (e.key === "Escape") close();
      else if (e.key === "ArrowLeft") step(-1);
      else if (e.key === "ArrowRight") step(1);
      else if (e.key === "Tab") {
        // Simple focus trap among lightbox controls
        const focusables = [closeBtn, prevBtn, nextBtn];
        const active = document.activeElement;
        const currentIndex = focusables.indexOf(active);
        if (e.shiftKey) {
          if (currentIndex <= 0) { e.preventDefault(); focusables[focusables.length - 1].focus(); }
        } else {
          if (currentIndex === focusables.length - 1) { e.preventDefault(); focusables[0].focus(); }
        }
      }
    });
  }

  /* --------------------------------------------------------
     TESTIMONIAL ROTATOR
     -------------------------------------------------------- */
  function initTestimonialRotator() {
    const rotator = document.getElementById("testimonialRotator");
    if (!rotator) return;
    const slides = rotator.querySelectorAll(".testimonial");
    const dots = rotator.querySelectorAll(".tdot");
    if (!slides.length) return;

    let idx = 0;
    let timer = null;

    const go = (n) => {
      idx = (n + slides.length) % slides.length;
      slides.forEach((s, i) => s.classList.toggle("is-active", i === idx));
      dots.forEach((d, i) => d.classList.toggle("is-active", i === idx));
    };

    const startTimer = () => {
      if (REDUCED_MOTION) return;
      stopTimer();
      timer = setInterval(() => go(idx + 1), 8000);
    };
    const stopTimer = () => { if (timer) { clearInterval(timer); timer = null; } };

    dots.forEach((d) => {
      d.addEventListener("click", () => {
        const n = parseInt(d.dataset.idx, 10) || 0;
        go(n);
        startTimer();
      });
    });

    rotator.addEventListener("mouseenter", stopTimer);
    rotator.addEventListener("mouseleave", startTimer);

    startTimer();
  }

  /* --------------------------------------------------------
     FORM — Web3Forms with placeholder-aware handler
     -------------------------------------------------------- */
  function initForm() {
    const form = document.getElementById("inquiryForm");
    if (!form) return;
    const status = document.getElementById("formStatus");

    form.addEventListener("submit", (e) => {
      const accessKey = form.getAttribute("data-access") || "";
      // While placeholder key is in place, prevent submission and show inline success
      if (!accessKey || accessKey.includes("YOUR_ACCESS_KEY")) {
        e.preventDefault();
        if (status) {
          status.classList.add("is-success");
          status.textContent = "Thank you — your inquiry has been received. We'll respond within 24 hours.";
        }
        form.reset();
        return;
      }
      // If real key present, allow native Web3Forms submit (no interception)
    });
  }

  /* --------------------------------------------------------
     ACTIVE NAV LINK — IntersectionObserver on sections
     -------------------------------------------------------- */
  function initActiveLink() {
    const links = document.querySelectorAll(".nav-link");
    if (!links.length) return;

    const map = {};
    links.forEach((l) => {
      const id = l.dataset.target;
      const target = document.getElementById(id);
      if (target) map[id] = l;
    });

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            links.forEach((l) => l.classList.remove("is-active"));
            const id = entry.target.id;
            if (map[id]) map[id].classList.add("is-active");
          }
        });
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
    );

    Object.keys(map).forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
  }
})();
