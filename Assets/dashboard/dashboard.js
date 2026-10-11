// dashboard.js — renders the numbers payload. ALL client-readable chrome strings live
// in the STRINGS block below (the banned-terms lint scans this file in full).
(function () {
  /* STRINGS-START */
  var STRINGS = {
    gateLabel: 'Enter your password to see your numbers',
    gateButton: 'Show me',
    gateChecking: 'Checking…',
    emptyPassword: 'Type your password first.',
    wrongPassword: 'That password didn\'t work. Lost it? Ask us for a new one.',
    slowDown: 'Too many tries. Wait a few minutes, then try again.',
    loading: 'Getting your numbers…',
    pending: 'We\'re still hooking this up.',
    blockError: 'This part didn\'t load. Try refreshing the page.',
    offline: 'We couldn\'t reach your numbers. Check your connection and refresh.',
    heroEyebrow: '{Month} so far',
    daysIn: '{n} days in',
    daysInOne: '1 day in',
    windowLabel: 'inquiries from {Month} to now',
    windowLabelOne: 'inquiry from {Month} to now',
    factsLabel: 'Running total and Google rating',
    ratingLabel: 'Google rating',
    ratingSub: '{count} reviews\u00a0· checked {date}',
    ratingSubOne: '1 review\u00a0· checked {date}',
    monthsTitle: 'Month by month',
    partialMonth: 'so far',
    earlyNote: 'Too early to tell if things are picking up or slowing down. That takes six full months.',
    mixTitle: 'What people ask about most',
    latestTitle: 'Latest inquiries',
    sourcesTitle: 'How people found you',
    eventsTitle: 'What kind of events',
    busierHead: 'A busier stretch',
    busierBody: '{recent} inquiries over the last 3 full months, up from {prior} in the 3 months before.',
    steadyHead: 'A steady stretch',
    steadyBody: '{recent} inquiries over the last 3 full months, about the same as the 3 months before.',
    quieterHead: 'A quieter stretch',
    quieterBody: '{recent} inquiries over the last 3 full months, down from {prior} in the 3 months before.',
    reviewsGained: '{added} new Google reviews since our last check, {total} in all.',
    reviewsGainedOne: '1 new Google review since our last check, {total} in all.'
  };
  /* STRINGS-END */

  var MONTHS = { Jan: 'January', Feb: 'February', Mar: 'March', Apr: 'April', May: 'May', Jun: 'June',
    Jul: 'July', Aug: 'August', Sep: 'September', Oct: 'October', Nov: 'November', Dec: 'December' };

  var cfg = window.DASH_CONFIG;
  var root = document.getElementById('dash');
  Object.keys(cfg.tokens || {}).forEach(function (k) {
    document.documentElement.style.setProperty(k, cfg.tokens[k]);
  });

  function post(payload) {
    payload.clientId = cfg.clientId;
    return fetch(cfg.endpoint, { method: 'POST', headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify(payload) }).then(function (r) { return r.json(); });
  }

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text !== undefined) n.textContent = text;   // textContent everywhere: no HTML injection surface
    return n;
  }

  function fill(s, map) {
    return String(s).replace(/\{(\w+)\}/g, function (m, k) { return map[k] !== undefined ? map[k] : m; });
  }

  function title(key) {
    return (cfg.blockTitles || {})[key] || STRINGS[key + 'Title'] || key;
  }

  // ---------- password gate ----------
  function showGate(msg) {
    root.replaceChildren();
    var form = el('form', 'dash-gate');
    form.noValidate = true;
    var label = el('label', 'dash-gate-label', STRINGS.gateLabel);
    var input = el('input', 'dash-gate-input');
    input.type = 'password'; input.name = 'password'; input.required = true;
    input.autocomplete = 'current-password';
    label.appendChild(input);
    var btn = el('button', 'dash-gate-btn', STRINGS.gateButton);
    btn.type = 'submit';
    form.append(label, btn);
    if (msg) {
      var m = el('p', 'dash-gate-msg', msg);
      m.id = 'dash-gate-msg'; m.setAttribute('role', 'alert');
      input.setAttribute('aria-invalid', 'true');
      input.setAttribute('aria-describedby', 'dash-gate-msg');
      form.appendChild(m);
    }
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      if (!input.value) {
        var e = form.querySelector('.dash-gate-msg') || form.appendChild(el('p', 'dash-gate-msg'));
        e.id = 'dash-gate-msg'; e.setAttribute('role', 'alert'); e.textContent = STRINGS.emptyPassword;
        input.setAttribute('aria-invalid', 'true'); input.setAttribute('aria-describedby', 'dash-gate-msg');
        input.focus(); return;
      }
      var old = form.querySelector('.dash-gate-msg');
      if (old) old.remove();
      input.removeAttribute('aria-invalid'); input.removeAttribute('aria-describedby');
      btn.disabled = true; btn.textContent = STRINGS.gateChecking;
      load({ password: input.value }, true);
    });
    root.appendChild(form);
    input.focus();
  }

  function load(auth, fromGate) {
    if (!fromGate) root.replaceChildren(el('p', 'dash-loading', STRINGS.loading));
    post(auth).then(function (res) {
      if (!res.ok) {
        try { sessionStorage.removeItem('dashToken'); } catch (e) {}
        return showGate(res.error === 'try again later' ? STRINGS.slowDown
                        : auth.password ? STRINGS.wrongPassword : '');
      }
      if (res.token) { try { sessionStorage.setItem('dashToken', res.token); } catch (e) {} }
      render(res.data);
    }).catch(function (err) {
      /* This catch also sits downstream of render(), so a code error lands here too.
         The message she sees stays friendly; the cause goes to the console so it can
         be diagnosed instead of being blamed on her connection. */
      if (window.console && console.error) console.error('dashboard failed:', err);
      showGate(STRINGS.offline);
    });
  }

  // ---------- helpers on the leads block ----------
  function monthPoints(data) {
    var leads = (data.blocks || {}).leads;
    return (leads && leads.status === 'live' && leads.months && leads.months.points) || null;
  }
  // The server always ends the series on the current month, which is still filling up.
  function lastIsPartial(pts, data) {
    if (!pts || !pts.length) return false;
    var cur = String(data.monthLabel || '').slice(0, 3);
    return !!cur && pts[pts.length - 1].label === cur;
  }
  function sumPts(a) { return a.reduce(function (t, p) { return t + (Number(p.value) || 0); }, 0); }

  // ---------- charts: visual marks are decorative, a real table carries the values ----------
  // A table grows to fit its cells whatever width it is given, so the hidden copy sits
  // inside a 1px clipping wrapper; on its own it widened the page at 320px.
  function srTable(caption, rows) {
    var wrap = el('div', 'dash-sr');
    var t = el('table');
    t.appendChild(el('caption', null, caption));
    var tb = el('tbody');
    rows.forEach(function (r) {
      var tr = el('tr');
      tr.appendChild(el('th', null, r[0])).setAttribute('scope', 'row');
      tr.appendChild(el('td', null, String(r[1])));
      tb.appendChild(tr);
    });
    t.appendChild(tb);
    wrap.appendChild(t);
    return wrap;
  }

  // Each drawn month needs about 40px before its label runs into the next one. The cap
  // comes from the plot's measured width, so it holds in every layout and for any length
  // of history; the latest months are drawn and the hidden table lists every month.
  var MIN_COL = 40;
  function colsChart(chart, partial, caption) {
    var fig = el('figure', 'dash-chart dash-chart--cols');
    var vis = el('div', 'dash-cols'); vis.setAttribute('aria-hidden', 'true');
    var labs = el('div', 'dash-col-labs'); labs.setAttribute('aria-hidden', 'true');
    var all = chart.points;
    var rows = all.map(function (p, i) {
      var last = partial && i === all.length - 1;
      return [(MONTHS[p.label] || p.label) + (last ? ' (' + STRINGS.partialMonth + ')' : ''), p.value];
    });
    fig.append(vis, labs, srTable(caption, rows));
    fig._draw = function () {
      var room = vis.clientWidth ? Math.max(1, Math.floor(vis.clientWidth / MIN_COL)) : all.length;
      var shown = all.length > room ? all.slice(-room) : all;
      var max = Math.max.apply(null, shown.map(function (p) { return Number(p.value) || 0; })) || 1;
      vis.replaceChildren(); labs.replaceChildren();
      shown.forEach(function (p, i) {
        var isPartial = partial && i === shown.length - 1;
        var col = el('div', 'dash-col' + (isPartial ? ' dash-col--partial' : ''));
        col.appendChild(el('span', 'dash-col-val', String(p.value)));
        var bar = el('div', 'dash-col-bar');
        // 150px is the tallest mark; the value label and gap ride above it inside the 200px plot
        bar.style.height = Math.max(3, Math.round((Number(p.value) || 0) / max * 150)) + 'px';
        col.appendChild(bar);
        vis.appendChild(col);
        var lab = el('p', 'dash-col-lab', p.label);
        if (isPartial) lab.appendChild(el('span', null, STRINGS.partialMonth));
        labs.appendChild(lab);
      });
    };
    fig._draw();
    return fig;
  }
  function fitCharts() {
    root.querySelectorAll('.dash-chart--cols').forEach(function (f) { if (f._draw) f._draw(); });
  }
  var fitTimer = null;
  window.addEventListener('resize', function () { clearTimeout(fitTimer); fitTimer = setTimeout(fitCharts, 150); });

  function barsChart(chart, caption) {
    var fig = el('figure', 'dash-chart');
    var list = el('ul', 'dash-bars'); list.setAttribute('aria-hidden', 'true');
    var max = Math.max.apply(null, chart.points.map(function (p) { return Number(p.value) || 0; })) || 1;
    chart.points.forEach(function (p) {
      var li = el('li');
      var head = el('div', 'dash-bar-head');
      head.append(el('p', 'dash-bar-lab', p.label), el('span', 'dash-bar-val', String(p.value)));
      var track = el('div', 'dash-bar-track');
      var f = el('div', 'dash-bar-fill');
      f.style.width = Math.max(3, Math.round((Number(p.value) || 0) / max * 100)) + '%';
      track.appendChild(f);
      li.append(head, track);
      list.appendChild(li);
    });
    fig.append(list, srTable(caption, chart.points.map(function (p) { return [p.label, p.value]; })));
    return fig;
  }

  function chartCard(key, chart, builder, span) {
    var card = el('section', 'dash-card dash-c-' + key + ' ' + span);
    var t = title(key);
    card.appendChild(el('h2', 'dash-card-title', t));
    // the server's mix sentence restates the card title ("... is the thing people ask about
    // most") and the first bar already says it, so only the other charts print theirs
    if (chart.sentence && key !== 'mix') card.appendChild(el('p', 'dash-sentence', chart.sentence));
    card.appendChild(builder(chart, t));
    return card;
  }

  /* ---------- status line ----------
     One plain sentence saying whether things are busier, steady or quieter than THIS
     client's own recent past, never against a target.
     1. THREE-MONTH WINDOWS of COMPLETE months. The current month is still filling up,
        so counting it would tilt every reading toward "quieter".
     2. The band is max(3, 20% of the prior window): roughly one standard deviation at
        about ten inquiries a month, with a floor so one extra inquiry never flips it.
     3. Needs six complete months. With fewer it says nothing, and the month card
        explains why instead. */
  function statusLine(data) {
    var pts = monthPoints(data);
    if (!pts) return null;
    var done = lastIsPartial(pts, data) ? pts.slice(0, -1) : pts;
    if (done.length < 6) return null;
    var recent = sumPts(done.slice(-3)), prior = sumPts(done.slice(-6, -3));
    var band = Math.max(3, prior * 0.2), diff = recent - prior;
    var state = diff > band ? 'busier' : (diff < -band ? 'quieter' : 'steady');
    var box = el('div', 'dash-status dash-status--' + state);
    box.appendChild(el('span', 'dash-status-dot')).setAttribute('aria-hidden', 'true');
    box.appendChild(el('p', 'dash-status-head', STRINGS[state + 'Head']));
    box.appendChild(el('p', 'dash-status-body', fill(STRINGS[state + 'Body'], { recent: recent, prior: prior })));
    var s = cfg.snapshot && cfg.snapshot.reviews;
    if (s && s.count && s.prev && s.count > s.prev) {
      var added = s.count - s.prev;
      box.appendChild(el('p', 'dash-status-review',
        fill(added === 1 ? STRINGS.reviewsGainedOne : STRINGS.reviewsGained, { added: added, total: s.count })));
    }
    return box;
  }

  /* ---------- the answer: this month ----------
     One big number, the one an owner feels first: how many people asked for work this
     month. The partial month gets its day count beside it so a short month is never
     read as a slow one. The two facts beside it are derived, never re-entered: the
     window total is summed from the same months the chart draws, and the rating is a
     monthly hand-read that always shows the date it was taken. */
  function stat(big, label, sub) {
    var d = el('div', 'dash-stat');
    d.appendChild(el('p', 'dash-stat-big', big));
    d.appendChild(el('p', 'dash-stat-label', label));
    if (sub) d.appendChild(el('p', 'dash-stat-sub', sub));
    return d;
  }

  function heroCard(data, leads) {
    var card = el('section', 'dash-card dash-hero dash-c-hero dash-span-all');
    card.setAttribute('aria-labelledby', 'dash-hero-eyebrow');
    var main = el('div', 'dash-hero-main');
    var month = data.monthLabel || '';
    var eyebrow = el('h2', 'dash-eyebrow', fill(STRINGS.heroEyebrow, { Month: month }));
    eyebrow.id = 'dash-hero-eyebrow';
    main.appendChild(eyebrow);

    var h = leads.headline;
    var value = String(h.value);
    var sentence = String(h.sentence || '');
    // the server writes "3 new inquiries so far in October" (or "no new inquiries yet in
    // October"). The figure carries the count and the eyebrow carries the month, so the
    // label keeps only the noun: "new inquiries". Anything unexpected shows as sent.
    var label = sentence;
    var m = sentence.match(new RegExp('^(?:' + value + '|no) (.+?) (?:so far|yet) in ' + month + '$'));
    if (m) label = m[1];
    else if (sentence.indexOf(value + ' ') === 0) label = sentence.slice(value.length + 1);
    var row = el('div', 'dash-figure-row');
    row.append(el('p', 'dash-figure', value), el('p', 'dash-figure-label', label));
    main.appendChild(row);

    var ctx = el('ul', 'dash-context');
    var pts = monthPoints(data);
    if (lastIsPartial(pts, data)) {
      var day = new Date().getDate();
      ctx.appendChild(el('li', 'dash-chip', fill(day === 1 ? STRINGS.daysInOne : STRINGS.daysIn, { n: day, Month: month })));
    }
    if (h.prev) ctx.appendChild(el('li', 'dash-chip', h.prev));
    if (ctx.childNodes.length) main.appendChild(ctx);
    card.appendChild(main);

    var status = statusLine(data);
    if (status) card.appendChild(status);

    var facts = el('section', 'dash-card dash-facts dash-c-facts dash-span-5');
    var fh = el('h2', 'dash-sr', STRINGS.factsLabel);
    fh.id = 'dash-facts-title';
    facts.appendChild(fh);
    facts.setAttribute('aria-labelledby', 'dash-facts-title');
    if (pts && pts.length) {
      var total = sumPts(pts);
      // the series is consecutive months ending this month, so its first month's year is
      // known; the year is named once the window reaches back into an earlier year
      var now = new Date(), back = pts.length - 1;
      var startYear = new Date(now.getFullYear(), now.getMonth() - back, 1).getFullYear();
      var startName = (MONTHS[pts[0].label] || pts[0].label) + (startYear !== now.getFullYear() ? ' ' + startYear : '');
      facts.appendChild(stat(String(total),
        fill(total === 1 ? STRINGS.windowLabelOne : STRINGS.windowLabel, { Month: startName })));
    }
    var s = cfg.snapshot && cfg.snapshot.reviews;
    if (s && s.count) {
      facts.appendChild(stat(String(s.rating), STRINGS.ratingLabel,
        fill(Number(s.count) === 1 ? STRINGS.ratingSubOne : STRINGS.ratingSub, { count: s.count, date: String(s.asOf || '').replace(/ /g, ' ') })
          .replace(/ · $/, '')));
    }
    if (!facts.querySelector('.dash-stat')) facts = null;
    else card.classList.replace('dash-span-all', 'dash-span-7');
    return { card: card, facts: facts, hasStatus: !!status };
  }

  // the server writes "Balloon Columns — Oct 6"; the date goes in its own column
  function splitMeta(meta) {
    var s = String(meta || ''), i = s.lastIndexOf(' — ');
    return i < 0 ? { what: s, when: '' } : { what: s.slice(0, i), when: s.slice(i + 3) };
  }

  function latestCard(list) {
    var card = el('section', 'dash-card dash-c-latest dash-span-all');
    card.appendChild(el('h2', 'dash-card-title', title('latest')));
    var ul = el('ul', 'dash-list');
    list.forEach(function (it) {
      var m = splitMeta(it.meta);
      var li = el('li', 'dash-item');
      li.appendChild(el('span', 'dash-item-name', it.title || ''));
      if (m.what) li.appendChild(el('span', 'dash-item-what', m.what));
      if (m.when) li.appendChild(el('span', 'dash-item-when', m.when));
      ul.appendChild(li);
    });
    card.appendChild(ul);
    return card;
  }

  // any block other than leads keeps the plain card layout
  function genericCard(name, b) {
    var card = el('section', 'dash-card dash-span-all dash-' + name);
    card.appendChild(el('h2', 'dash-card-title', title(name)));
    if (b.status !== 'live') {
      card.appendChild(el('p', 'dash-state', b.status === 'pending' ? STRINGS.pending : STRINGS.blockError));
      return card;
    }
    if (b.headline) {
      card.appendChild(el('p', 'dash-stat-big', b.headline.value));
      card.appendChild(el('p', 'dash-sentence', b.headline.sentence));
      if (b.headline.prev) card.appendChild(el('p', 'dash-stat-sub', b.headline.prev));
    }
    ['items', 'how', 'list'].forEach(function (kind) {
      (Array.isArray(b[kind]) ? b[kind] : []).forEach(function (it) {
        var row = el('div', 'dash-row');
        row.appendChild(el('span', 'dash-row-label', it.title || it.label));
        row.appendChild(el('span', 'dash-row-value', it.meta || it.value || ''));
        card.appendChild(row);
      });
    });
    return card;
  }

  function render(data) {
    root.replaceChildren();
    var grid = el('div', 'dash-grid');
    (cfg.blockOrder || []).forEach(function (name) {
      var b = (data.blocks || {})[name]; if (!b) return;
      if (name !== 'leads' || b.status !== 'live' || !b.headline) { grid.appendChild(genericCard(name, b)); return; }
      var hero = heroCard(data, b);
      grid.appendChild(hero.card);
      if (hero.facts) grid.appendChild(hero.facts);
      if (b.months) {
        var pts = b.months.points || [];
        var partial = lastIsPartial(pts, data);
        var months = chartCard('months', b.months, function (c, cap) { return colsChart(c, partial, cap); }, 'dash-span-5');
        if (!hero.hasStatus) months.appendChild(el('p', 'dash-note', STRINGS.earlyNote));
        grid.appendChild(months);
      }
      /* sources and events are optional in the payload and stay absent until the
         backend sends them. They are NOT named 'how': that key is an array on other
         blocks, and an object there would throw inside the row loop. */
      if (b.mix) grid.appendChild(chartCard('mix', b.mix, barsChart, b.months ? 'dash-span-7' : 'dash-span-all'));
      if (b.sources) grid.appendChild(chartCard('sources', b.sources, barsChart, 'dash-span-all'));
      if (b.events) grid.appendChild(chartCard('events', b.events, barsChart, 'dash-span-all'));
      if (b.list && b.list.length) grid.appendChild(latestCard(b.list));
    });
    root.appendChild(grid);
    fitCharts();
  }

  var token = null;
  try { token = sessionStorage.getItem('dashToken'); } catch (e) {}
  if (token) load({ token: token }); else showGate();
})();
