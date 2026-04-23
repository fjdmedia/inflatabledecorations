/* =========================================================================
   Inflatable Decorations · Private Preview Gate
   - Case-sensitive passphrase (exact match required)
   - Session-scoped: one unlock per session carries across all preview pages
   - Tamper defense: MutationObserver + interval watchdog. If the gate
     element is removed or the .ifd-locked class is stripped while the
     user isn't authed, the document is wiped and a refresh is required.
   ========================================================================= */
(function () {
  var SKEY = 'ifd.auth';
  // sha256("BLOONS204") — exact, case-sensitive
  var HASH = '3a00677a78c223ff02d13c52915686b599bde86b3e50fe5270dc68d815b7be9b';

  function isAuthed() {
    try { return sessionStorage.getItem(SKEY) === '1'; } catch (_) { return false; }
  }

  if (!isAuthed()) {
    document.documentElement.classList.add('ifd-locked');
  } else {
    document.documentElement.classList.remove('ifd-locked');
    return;
  }

  async function sha256hex(str) {
    var enc = new TextEncoder().encode(str);
    var buf = await crypto.subtle.digest('SHA-256', enc);
    return Array.prototype.map.call(new Uint8Array(buf), function (b) {
      return b.toString(16).padStart(2, '0');
    }).join('');
  }

  function injectStyles() {
    if (document.getElementById('ifd-gate-style')) return;
    var s = document.createElement('style');
    s.id = 'ifd-gate-style';
    s.textContent = [
      '.ifd-gate{position:fixed;inset:0;z-index:2147483647;background:#FFF7F4;display:flex;align-items:center;justify-content:center;padding:2rem;font-family:\'DM Sans\',\'Inter\',system-ui,-apple-system,sans-serif;color:#2A1E3C}',
      '.ifd-gate *{box-sizing:border-box;margin:0;padding:0}',
      '.ifd-gate::before{content:"";position:absolute;inset:0;background:radial-gradient(720px 420px at 50% 20%,rgba(252,96,144,.10) 0%,transparent 65%);pointer-events:none}',
      '.ig-card{position:relative;max-width:440px;width:100%;text-align:center;display:flex;flex-direction:column;align-items:center;gap:.35rem}',
      '.ig-script{font-family:\'Caveat\',\'Kalam\',cursive;font-size:clamp(2.6rem,5.4vw,3.4rem);color:#FC6090;line-height:1;font-weight:700}',
      '.ig-eyebrow{font-size:.62rem;letter-spacing:.42em;text-transform:uppercase;color:rgba(42,30,60,.55);font-weight:500;margin:.5rem 0 1.25rem;display:inline-flex;align-items:center;gap:.75rem}',
      '.ig-eyebrow::before,.ig-eyebrow::after{content:"";width:22px;height:1px;background:rgba(252,96,144,.45)}',
      '.ig-title{font-family:\'Caprasimo\',\'Fraunces\',Georgia,serif;font-weight:400;font-size:clamp(1.15rem,1.8vw,1.4rem);letter-spacing:.005em;line-height:1.4;color:#1E1333;max-width:30ch}',
      '.ig-form{display:flex;flex-direction:column;gap:.6rem;width:100%;margin-top:1.5rem}',
      '.ig-input{width:100%;background:#fff;border:1px solid rgba(252,96,144,.35);border-radius:999px;padding:1rem 1.5rem;color:#2A1E3C;font:inherit;font-size:.95rem;letter-spacing:.32em;text-align:center;outline:none;transition:border-color .2s ease,box-shadow .2s ease;caret-color:#FC6090}',
      '.ig-input::placeholder{color:rgba(42,30,60,.32);letter-spacing:.32em;font-weight:400}',
      '.ig-input:focus{border-color:#FC6090;box-shadow:0 0 0 4px rgba(252,96,144,.12)}',
      '.ig-btn{background:#FC6090;color:#fff;border:0;border-radius:999px;padding:1rem 1.5rem;font:inherit;font-size:.7rem;letter-spacing:.22em;text-transform:uppercase;font-weight:600;cursor:pointer;transition:background .2s ease,transform .2s ease,box-shadow .2s ease;box-shadow:0 8px 22px rgba(252,96,144,.28)}',
      '.ig-btn:hover{background:#E94F7F;transform:translateY(-1px);box-shadow:0 12px 28px rgba(252,96,144,.34)}',
      '.ig-btn:active{transform:translateY(0)}',
      '.ig-note{font-size:.72rem;letter-spacing:.04em;color:rgba(42,30,60,.5);line-height:1.65;margin-top:1.5rem;max-width:34ch}',
      '.ig-err{font-size:.64rem;letter-spacing:.2em;text-transform:uppercase;color:#C13B5C;min-height:1.2em;margin-top:.5rem;font-weight:500}',
      '.ig-shake{animation:igShake .38s}',
      '@keyframes igShake{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-6px)}40%,80%{transform:translateX(6px)}}',
      'html.ifd-locked body > *:not(.ifd-gate){display:none!important}',
      'html.ifd-locked body{overflow:hidden}',
      '@media print{.ifd-gate{display:none!important}}'
    ].join('');
    (document.head || document.documentElement).appendChild(s);
  }

  var mo = null;
  var watchInt = null;

  function wipe() {
    try { if (mo) mo.disconnect(); } catch (_) { }
    try { if (watchInt) clearInterval(watchInt); } catch (_) { }
    document.documentElement.innerHTML =
      '<head><meta charset="utf-8"><title>Refresh required &middot; Inflatable Decorations</title>' +
      '<style>*{box-sizing:border-box;margin:0;padding:0}html,body{height:100%}' +
      'body{background:#FFF7F4;color:#2A1E3C;font-family:system-ui,-apple-system,sans-serif;' +
      'display:flex;align-items:center;justify-content:center;flex-direction:column;' +
      'gap:1.25rem;padding:2rem;text-align:center}' +
      'h1{font-weight:600;font-size:.9rem;letter-spacing:.32em;text-transform:uppercase;color:#FC6090}' +
      'p{color:rgba(42,30,60,.6);font-size:.8rem;letter-spacing:.06em;max-width:36ch;line-height:1.7}' +
      'button{background:#FC6090;color:#fff;border:0;padding:.9rem 2rem;font:inherit;font-size:.65rem;' +
      'letter-spacing:.22em;text-transform:uppercase;border-radius:999px;cursor:pointer;margin-top:.5rem;font-weight:600}' +
      'button:hover{background:#E94F7F}</style></head>' +
      '<body><h1>Refresh Required</h1>' +
      '<p>This preview is password-protected. Refresh the page to re-enter the passphrase.</p>' +
      '<button onclick="location.reload()">Refresh</button></body>';
  }

  function tampered() {
    return !document.querySelector('.ifd-gate') ||
           !document.documentElement.classList.contains('ifd-locked');
  }

  function ensureFonts() {
    if (document.getElementById('ifd-gate-fonts')) return;
    if (document.querySelector('link[href*="Caveat"]') &&
        document.querySelector('link[href*="Caprasimo"]') &&
        document.querySelector('link[href*="DM+Sans"]')) return;
    var l = document.createElement('link');
    l.id = 'ifd-gate-fonts';
    l.rel = 'stylesheet';
    l.href = 'https://fonts.googleapis.com/css2?family=Caprasimo&family=Caveat:wght@500;700&family=DM+Sans:wght@400;500;600;700&display=swap';
    (document.head || document.documentElement).appendChild(l);
  }

  function buildGate() {
    if (isAuthed()) return;
    ensureFonts();
    injectStyles();

    var gate = document.createElement('div');
    gate.className = 'ifd-gate';
    gate.setAttribute('role', 'dialog');
    gate.setAttribute('aria-modal', 'true');
    gate.setAttribute('aria-label', 'Enter passphrase to view preview');
    gate.innerHTML = [
      '<div class="ig-card">',
        '<div class="ig-script">Inflatable Decorations</div>',
        '<div class="ig-eyebrow">Private Preview</div>',
        '<h1 class="ig-title">Enter passphrase to continue.</h1>',
        '<form class="ig-form" autocomplete="off" spellcheck="false">',
          '<input type="password" class="ig-input" name="p" placeholder="Passphrase" aria-label="Passphrase" required autofocus />',
          '<button type="submit" class="ig-btn">Unlock</button>',
        '</form>',
        '<div class="ig-err" role="alert" aria-live="assertive"></div>',
        '<div class="ig-note">This preview is private. If you were sent this link and haven’t received the passphrase, reach out to James at FJMedia.</div>',
      '</div>'
    ].join('');
    document.body.appendChild(gate);

    var form = gate.querySelector('.ig-form');
    var input = gate.querySelector('.ig-input');
    var err = gate.querySelector('.ig-err');

    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      err.textContent = '';
      var entered = input.value;
      var h;
      try {
        h = await sha256hex(entered);
      } catch (_) {
        err.textContent = 'Browser not supported';
        return;
      }
      if (h === HASH) {
        try { sessionStorage.setItem(SKEY, '1'); } catch (_) { }
        if (mo) { mo.disconnect(); mo = null; }
        if (watchInt) { clearInterval(watchInt); watchInt = null; }
        document.documentElement.classList.remove('ifd-locked');
        gate.style.transition = 'opacity .35s ease';
        gate.style.opacity = '0';
        setTimeout(function () {
          if (gate && gate.parentNode) gate.parentNode.removeChild(gate);
          // Land on hero, not the form
          window.scrollTo({ top: 0, behavior: 'auto' });
        }, 360);
      } else {
        err.textContent = 'Incorrect passphrase';
        input.value = '';
        input.focus();
        gate.classList.add('ig-shake');
        setTimeout(function () { gate.classList.remove('ig-shake'); }, 400);
      }
    });

    try { input.focus(); } catch (_) { }

    mo = new MutationObserver(function () {
      if (isAuthed()) return;
      if (tampered()) wipe();
    });
    mo.observe(document.documentElement, {
      childList: true, subtree: true,
      attributes: true, attributeFilter: ['class', 'style']
    });

    watchInt = setInterval(function () {
      if (isAuthed()) { clearInterval(watchInt); watchInt = null; return; }
      if (tampered()) wipe();
    }, 400);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildGate);
  } else {
    buildGate();
  }
})();
