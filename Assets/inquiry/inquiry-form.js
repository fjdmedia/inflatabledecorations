/* FJMedia inquiry form module. Pure helpers are exported for tests;
   browser behavior runs only when a document is present. Emits namespaced
   (fj-) classes scoped under .fj-inquiry so it never collides with a host site. */
(function (root) {
  'use strict';

  function computeTargetDims(w, h, maxEdge) {
    var longest = Math.max(w, h);
    if (longest <= maxEdge) return { w: w, h: h };
    var scale = maxEdge / longest;
    return { w: Math.round(w * scale), h: Math.round(h * scale) };
  }

  function buildPayload(config, fields, images, meta) {
    return { clientId: config.clientId, fields: fields, images: images, meta: meta };
  }

  function validateField(field, value) {
    var v = (value == null ? '' : String(value)).trim();
    if (field.required && !v) return "This one's required.";
    if (field.type === 'email' && v && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v)) return 'Enter a valid email so we can reach you.';
    return null;
  }

  var api = { computeTargetDims: computeTargetDims, buildPayload: buildPayload, validateField: validateField };
  if (typeof module !== 'undefined' && module.exports) { module.exports = api; }

  // ---- Browser-only below ----
  if (typeof document === 'undefined') return;

  function compressImage(file, maxEdge, quality) {
    return new Promise(function (resolve) {
      var img = new Image();
      var url = URL.createObjectURL(file);
      img.onload = function () {
        var d = computeTargetDims(img.width, img.height, maxEdge);
        var c = document.createElement('canvas');
        c.width = d.w; c.height = d.h;
        c.getContext('2d').drawImage(img, 0, 0, d.w, d.h);
        URL.revokeObjectURL(url);
        var dataUrl = c.toDataURL('image/jpeg', quality);
        resolve({ filename: file.name.replace(/\.[^.]+$/, '') + '.jpg', mimeType: 'image/jpeg', dataBase64: dataUrl.split(',')[1] });
      };
      img.src = url;
    });
  }

  var INPUT_TYPES = { text: 'text', email: 'email', phone: 'tel', date: 'date', time: 'time' };

  function renderField(f) {
    var wrap = document.createElement('div'); wrap.className = 'fj-field';
    var id = 'f_' + f.id;
    var simple = ['text', 'email', 'phone', 'date', 'time'];

    if (f.type === 'radio' || f.type === 'checkbox') {
      var head = document.createElement('span'); head.className = 'fj-lbl'; head.textContent = f.label; wrap.appendChild(head);
      var grp = document.createElement('div'); grp.className = f.type === 'checkbox' ? 'fj-check-grid' : 'fj-choices';
      (f.options || []).forEach(function (opt) {
        var lab = document.createElement('label'); lab.className = f.type === 'checkbox' ? 'fj-check-card' : 'fj-choice';
        var inp = document.createElement('input'); inp.type = f.type; inp.name = f.id; inp.value = opt;
        var sp = document.createElement('span'); sp.textContent = opt;
        lab.appendChild(inp); lab.appendChild(sp); grp.appendChild(lab);
      });
      wrap.appendChild(grp); return wrap;
    }

    if (f.type === 'file') {
      wrap.className = 'fj-field fj-file-field';
      var fhead = document.createElement('span'); fhead.className = 'fj-lbl'; fhead.textContent = f.label;
      var finp = document.createElement('input'); finp.type = 'file'; finp.id = id; finp.name = f.id; finp.accept = 'image/*'; finp.multiple = true;
      var flbl = document.createElement('label'); flbl.className = 'fj-file-label'; flbl.htmlFor = id; flbl.textContent = '＋ Add photos — drag in or browse';
      var fhelp = document.createElement('p'); fhelp.className = 'fj-help'; fhelp.id = id + '-help';
      wrap.appendChild(fhead); wrap.appendChild(finp); wrap.appendChild(flbl); wrap.appendChild(fhelp); return wrap;
    }

    var lbl = document.createElement('label'); lbl.className = 'fj-lbl'; lbl.htmlFor = id; lbl.textContent = f.label;
    if (f.required) { var r = document.createElement('span'); r.className = 'fj-req'; r.setAttribute('aria-hidden', 'true'); r.textContent = ' *'; lbl.appendChild(r); }
    wrap.appendChild(lbl);

    var control;
    if (f.type === 'textarea') { control = document.createElement('textarea'); control.rows = f.rows || 4; control.className = 'fj-input'; }
    else if (f.type === 'select') {
      var sw = document.createElement('div'); sw.className = 'fj-select-wrap';
      control = document.createElement('select'); control.className = 'fj-input';
      var o0 = document.createElement('option'); o0.value = ''; o0.textContent = 'Select one'; o0.selected = true; control.appendChild(o0);
      (f.options || []).forEach(function (opt) { var o = document.createElement('option'); o.textContent = opt; control.appendChild(o); });
      sw.appendChild(control); wrap.appendChild(sw);
    }
    else if (simple.indexOf(f.type) !== -1) {
      control = document.createElement('input'); control.type = INPUT_TYPES[f.type]; control.className = 'fj-input';
      if (f.placeholder) control.placeholder = f.placeholder; if (f.autocomplete) control.autocomplete = f.autocomplete;
    }
    if (control) {
      control.id = id; control.name = f.id; if (f.required) control.required = true;
      if (f.type !== 'select') wrap.appendChild(control);
      var help = document.createElement('p'); help.className = 'fj-help'; help.id = id + '-help'; wrap.appendChild(help);
    }
    return wrap;
  }

  function render(config, mount) {
    mount.classList.add('fj-inquiry');
    Object.keys(config.brand || {}).forEach(function (k) { mount.style.setProperty(k, config.brand[k]); });
    if (config.head) {
      var h = document.createElement('header'); h.className = 'fj-head';
      if (config.head.eyebrow) { var e = document.createElement('p'); e.className = 'fj-eyebrow'; e.textContent = config.head.eyebrow; h.appendChild(e); }
      if (config.head.title) { var t = document.createElement('h1'); t.textContent = config.head.title; h.appendChild(t); }
      if (config.head.intro) { var p = document.createElement('p'); p.textContent = config.head.intro; h.appendChild(p); }
      mount.appendChild(h);
    }
    var form = document.createElement('form'); form.noValidate = true;
    var hp = document.createElement('input'); hp.type = 'text'; hp.name = 'company_url'; hp.tabIndex = -1; hp.autocomplete = 'off';
    hp.style.cssText = 'position:absolute;left:-9999px;width:1px;height:1px;opacity:0'; form.appendChild(hp);
    (config.groups || []).forEach(function (g) {
      var fs = document.createElement('fieldset'); var lg = document.createElement('legend'); lg.textContent = g.legend; fs.appendChild(lg);
      (g.fields || []).forEach(function (f) { fs.appendChild(renderField(f)); }); form.appendChild(fs);
    });
    var btn = document.createElement('button'); btn.type = 'submit'; btn.className = 'fj-btn';
    btn.innerHTML = '<span class="fj-spinner" aria-hidden="true"></span><span class="fj-l-default">Send my inquiry</span><span class="fj-l-loading">Sending…</span><span class="fj-l-success">✓ Sent — we’ll be in touch</span><span class="fj-l-error">Didn’t send — try again</span>';
    form.appendChild(btn); mount.appendChild(form);
    wire(config, form, btn);
  }

  function wire(config, form, btn) {
    var renderedAt = Date.now();
    var allFields = (config.groups || []).reduce(function (a, g) { return a.concat(g.fields || []); }, []);
    var touched = {};
    function fieldEl(id) { return form.querySelector('#f_' + id); }
    function showErr(f, msg) {
      var el = fieldEl(f.id), help = form.querySelector('#f_' + f.id + '-help'); if (!el) return;
      if (msg) { el.setAttribute('aria-invalid', 'true'); if (help) { help.className = 'fj-help is-error'; help.textContent = '⚠ ' + msg; } }
      else { el.removeAttribute('aria-invalid'); if (help) { help.className = 'fj-help'; help.textContent = ''; } }
    }
    allFields.forEach(function (f) {
      var el = fieldEl(f.id); if (!el) return;
      el.addEventListener('blur', function () { touched[f.id] = 1; showErr(f, validateField(f, el.value)); });
      el.addEventListener('input', function () { if (touched[f.id]) showErr(f, validateField(f, el.value)); });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = true, firstBad = null;
      allFields.forEach(function (f) { var el = fieldEl(f.id); if (!el) return; touched[f.id] = 1; var msg = validateField(f, el.value); showErr(f, msg); if (msg) { ok = false; firstBad = firstBad || el; } });
      if (!ok) { if (firstBad) firstBad.focus(); return; }
      btn.dataset.state = 'loading'; btn.disabled = true;
      var fields = {};
      allFields.forEach(function (f) {
        if (f.type === 'checkbox') { fields[f.id] = Array.prototype.slice.call(form.querySelectorAll('input[name="' + f.id + '"]:checked')).map(function (i) { return i.value; }); }
        else if (f.type === 'radio') { var rr = form.querySelector('input[name="' + f.id + '"]:checked'); if (rr) fields[f.id] = rr.value; }
        else if (f.type !== 'file') { var el = fieldEl(f.id); if (el && el.value) fields[f.id] = el.value; }
      });
      var fileField = allFields.filter(function (f) { return f.type === 'file'; })[0];
      var input = fileField ? fieldEl(fileField.id) : null;
      var files = input && input.files ? Array.prototype.slice.call(input.files) : [];
      Promise.all(files.map(function (file) { return compressImage(file, 1600, 0.8); })).then(function (images) {
        var meta = { honeypot: form.querySelector('input[name="company_url"]').value, renderedAt: renderedAt, submittedAt: Date.now() };
        return fetch(config.endpoint, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(buildPayload(config, fields, images, meta)) });
      }).then(function (res) { return res.json(); }).then(function (out) {
        if (!out.ok) throw new Error(out.error || 'failed');
        btn.dataset.state = 'success';
        setTimeout(function () { form.reset(); btn.dataset.state = ''; btn.disabled = false; }, 3000);
      }).catch(function () {
        btn.dataset.state = 'error'; btn.disabled = false;
        setTimeout(function () { btn.dataset.state = ''; }, 3000);
      });
    });
  }

  root.FJInquiryForm = { render: render };
})(typeof window !== 'undefined' ? window : this);
