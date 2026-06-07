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
    // Ordered non-file field schema → lets the backend write a stable, complete,
    // correctly-labelled sheet header regardless of which optional fields are filled.
    var schema = [];
    (config.groups || []).forEach(function (g) {
      (g.fields || []).forEach(function (f) {
        if (f.type !== 'file') schema.push({ id: f.id, label: f.label || f.id });
      });
    });
    return { clientId: config.clientId, fields: fields, images: images, meta: meta, schema: schema };
  }

  function digits_(s) { return (s == null ? '' : String(s)).replace(/\D/g, ''); }

  // North American 10-digit body, dropping a leading country "1" and any overflow.
  function tenDigits_(s) {
    var d = digits_(s);
    if (d.length === 11 && d.charAt(0) === '1') d = d.slice(1);
    return d.slice(0, 10);
  }

  function formatPhone(raw) {
    var d = tenDigits_(raw);
    if (!d) return '';
    if (d.length <= 3) return '(' + d;
    if (d.length <= 6) return '(' + d.slice(0, 3) + ') ' + d.slice(3);
    return '(' + d.slice(0, 3) + ') ' + d.slice(3, 6) + '-' + d.slice(6);
  }

  function isCompletePhone(raw) { return tenDigits_(raw).length === 10; }

  function isPastDate(value, today) { return !!value && !!today && value < today; }

  function endAfterStart(start, end) { return (!start || !end) ? true : end > start; }

  function isPositiveNumber(value) {
    var v = (value == null ? '' : String(value)).trim();
    return /^\d*\.?\d+$/.test(v) && parseFloat(v) > 0;
  }

  function todayISO_() {
    var d = new Date(), m = d.getMonth() + 1, day = d.getDate();
    return d.getFullYear() + '-' + (m < 10 ? '0' + m : m) + '-' + (day < 10 ? '0' + day : day);
  }

  // ctx (optional) carries the other field values, for cross-field rules like `after`.
  function validateField(field, value, ctx) {
    var v = (value == null ? '' : String(value)).trim();
    if (field.required && !v) return "This one's required.";
    if (!v) return null; // empties beyond "required" are nothing to validate
    if (field.type === 'email' && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v)) return 'Enter a valid email so we can reach you.';
    if (field.type === 'phone' && !isCompletePhone(v)) return 'Enter a 10-digit phone number — like (204) 123-4567.';
    if (field.type === 'date' && field.notPast && isPastDate(v, todayISO_())) return "Pick a date that hasn't already passed.";
    if (field.type === 'number' && !isPositiveNumber(v)) return 'Enter a number greater than zero.';
    if (field.after && ctx && !endAfterStart(ctx[field.after], v)) return 'End time has to be after the start time.';
    return null;
  }

  var api = { computeTargetDims: computeTargetDims, buildPayload: buildPayload, validateField: validateField, formatPhone: formatPhone, isCompletePhone: isCompletePhone, isPastDate: isPastDate, endAfterStart: endAfterStart, isPositiveNumber: isPositiveNumber };
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

  var INPUT_TYPES = { text: 'text', email: 'email', phone: 'tel', date: 'date', time: 'time', number: 'text' };

  function renderField(f) {
    var wrap = document.createElement('div'); wrap.className = 'fj-field';
    var id = 'f_' + f.id;
    var simple = ['text', 'email', 'phone', 'date', 'time', 'number'];

    if (f.type === 'radio' || f.type === 'checkbox') {
      var head = document.createElement('span'); head.className = 'fj-lbl'; head.textContent = f.label; wrap.appendChild(head);
      if (f.hint) { var hint = document.createElement('p'); hint.className = 'fj-hint'; hint.textContent = f.hint; wrap.appendChild(hint); }
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
      var fprev = document.createElement('div'); fprev.className = 'fj-file-previews'; fprev.id = id + '-previews';
      wrap.appendChild(fhead); wrap.appendChild(finp); wrap.appendChild(flbl); wrap.appendChild(fprev); wrap.appendChild(fhelp); return wrap;
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
      if (f.type === 'phone') { control.inputMode = 'tel'; control.maxLength = 16; }
      if (f.type === 'number') { control.inputMode = 'decimal'; }
      if (f.type === 'date' && f.notPast) control.min = todayISO_();
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
    // Snapshot of the text-ish field values, so cross-field rules (e.g. end `after` start) can see siblings.
    function currentValues() {
      var vals = {};
      allFields.forEach(function (f) {
        if (f.type === 'checkbox' || f.type === 'radio' || f.type === 'file') return;
        var el = fieldEl(f.id); if (el) vals[f.id] = el.value;
      });
      return vals;
    }
    function showErr(f, msg) {
      var el = fieldEl(f.id), help = form.querySelector('#f_' + f.id + '-help'); if (!el) return;
      if (msg) { el.setAttribute('aria-invalid', 'true'); if (help) { help.className = 'fj-help is-error'; help.textContent = '⚠ ' + msg; } }
      else { el.removeAttribute('aria-invalid'); if (help) { help.className = 'fj-help'; help.textContent = ''; } }
    }
    function checkField(f) { showErr(f, validateField(f, fieldEl(f.id).value, currentValues())); }
    // Fields that gate another via `after` (e.g. start gates end) — re-check the dependent when the source moves.
    function revalidateDependents(srcId) {
      allFields.forEach(function (df) { if (df.after === srcId && touched[df.id] && fieldEl(df.id)) checkField(df); });
    }
    allFields.forEach(function (f) {
      var el = fieldEl(f.id); if (!el) return;
      if (f.type === 'phone') el.addEventListener('input', function () { el.value = formatPhone(el.value); });
      el.addEventListener('blur', function () { touched[f.id] = 1; checkField(f); revalidateDependents(f.id); });
      el.addEventListener('input', function () { if (touched[f.id]) checkField(f); revalidateDependents(f.id); });
    });

    // Conditional enable: a field with requiresAnyOf stays locked until >=1 box in the source field is checked.
    allFields.forEach(function (f) {
      if (!f.requiresAnyOf) return;
      var src = form.querySelectorAll('input[name="' + f.requiresAnyOf + '"]');
      var dep = form.querySelectorAll('input[name="' + f.id + '"]');
      function sync() {
        var any = Array.prototype.some.call(src, function (i) { return i.checked; });
        Array.prototype.forEach.call(dep, function (i) {
          i.disabled = !any; if (!any) i.checked = false;
          var card = i.closest('.fj-check-card'); if (card) card.classList.toggle('fj-disabled', !any);
        });
      }
      Array.prototype.forEach.call(src, function (i) { i.addEventListener('change', sync); });
      sync();
    });

    // Photo picker: track our own list (so we can preview, remove, and re-add the same file).
    var selected = [];
    var fileField = allFields.filter(function (f) { return f.type === 'file'; })[0];
    if (fileField) {
      var fInput = fieldEl(fileField.id);
      var fWrap = fInput.closest('.fj-file-field');
      var fPrev = form.querySelector('#f_' + fileField.id + '-previews');
      var fHelp = form.querySelector('#f_' + fileField.id + '-help');
      var MAX_PHOTOS = fileField.max || 12;
      function updateCount() {
        var n = selected.length;
        fHelp.className = 'fj-help' + (n ? ' is-ok' : '');
        fHelp.textContent = n ? ('✓ ' + n + ' photo' + (n > 1 ? 's' : '') + ' added') : '';
      }
      function renderPreviews() {
        fPrev.innerHTML = '';
        selected.forEach(function (item, idx) {
          var card = document.createElement('div'); card.className = 'fj-photo';
          var im = document.createElement('img'); im.src = item.url; im.alt = item.file.name;
          var rm = document.createElement('button'); rm.type = 'button'; rm.className = 'fj-photo-rm';
          rm.setAttribute('aria-label', 'Remove ' + item.file.name); rm.textContent = '✕';
          rm.addEventListener('click', function () { URL.revokeObjectURL(item.url); selected.splice(idx, 1); renderPreviews(); updateCount(); });
          var nm = document.createElement('span'); nm.className = 'fj-photo-name'; nm.textContent = item.file.name;
          card.appendChild(im); card.appendChild(rm); card.appendChild(nm); fPrev.appendChild(card);
        });
      }
      function addFiles(list) {
        Array.prototype.forEach.call(list, function (file) {
          if (!/^image\//.test(file.type) || selected.length >= MAX_PHOTOS) return;
          selected.push({ file: file, url: URL.createObjectURL(file) });
        });
        renderPreviews(); updateCount();
      }
      fInput.addEventListener('change', function () { addFiles(fInput.files); fInput.value = ''; });
      ['dragenter', 'dragover'].forEach(function (ev) { fWrap.addEventListener(ev, function (e) { e.preventDefault(); fWrap.classList.add('fj-dragging'); }); });
      ['dragleave', 'drop'].forEach(function (ev) { fWrap.addEventListener(ev, function (e) { e.preventDefault(); fWrap.classList.remove('fj-dragging'); }); });
      fWrap.addEventListener('drop', function (e) { if (e.dataTransfer && e.dataTransfer.files) addFiles(e.dataTransfer.files); });
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var ctx = currentValues();
      var ok = true, firstBad = null;
      allFields.forEach(function (f) { var el = fieldEl(f.id); if (!el) return; touched[f.id] = 1; var msg = validateField(f, el.value, ctx); showErr(f, msg); if (msg) { ok = false; firstBad = firstBad || el; } });
      if (!ok) { if (firstBad) firstBad.focus(); return; }
      btn.dataset.state = 'loading'; btn.disabled = true;
      var fields = {};
      allFields.forEach(function (f) {
        if (f.type === 'checkbox') { fields[f.id] = Array.prototype.slice.call(form.querySelectorAll('input[name="' + f.id + '"]:checked')).map(function (i) { return i.value; }); }
        else if (f.type === 'radio') { var rr = form.querySelector('input[name="' + f.id + '"]:checked'); if (rr) fields[f.id] = rr.value; }
        else if (f.type !== 'file') { var el = fieldEl(f.id); if (el && el.value) fields[f.id] = el.value; }
      });
      Promise.all(selected.map(function (item) { return compressImage(item.file, 1280, 0.72); })).then(function (images) {
        var meta = { honeypot: form.querySelector('input[name="company_url"]').value, renderedAt: renderedAt, submittedAt: Date.now() };
        return fetch(config.endpoint, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(buildPayload(config, fields, images, meta)) });
      }).then(function (res) { return res.json(); }).then(function (out) {
        if (!out.ok) throw new Error(out.error || 'failed');
        btn.dataset.state = 'success';
        // If a thank-you page is configured, show the success tick briefly, then hand off.
        // Pass the photo count so the thank-you copy can adapt (only mention photos if any were sent).
        if (config.successRedirect) {
          var url = config.successRedirect + (config.successRedirect.indexOf('?') > -1 ? '&' : '?') + 'photos=' + selected.length;
          setTimeout(function () { window.location.assign(url); }, 900); return;
        }
        setTimeout(function () {
          form.reset();
          selected.forEach(function (item) { URL.revokeObjectURL(item.url); });
          selected.length = 0;
          if (fileField) { form.querySelector('#f_' + fileField.id + '-previews').innerHTML = ''; var fh = form.querySelector('#f_' + fileField.id + '-help'); fh.className = 'fj-help'; fh.textContent = ''; }
          btn.dataset.state = ''; btn.disabled = false;
        }, 3000);
      }).catch(function () {
        btn.dataset.state = 'error'; btn.disabled = false;
        setTimeout(function () { btn.dataset.state = ''; }, 3000);
      });
    });
  }

  root.FJInquiryForm = { render: render };
})(typeof window !== 'undefined' ? window : this);
