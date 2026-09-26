// dashboard.js — renders the payload contract. ALL client-readable chrome strings live
// in the STRINGS block below (the banned-terms lint scans this file in full).
(function () {
  /* STRINGS-START */
  var STRINGS = {
    passwordLabel: 'Enter your password to see your numbers',
    passwordButton: 'Show me',
    wrongPassword: 'That password didn\'t work — check with James if you\'ve lost it.',
    slowDown: 'Too many tries — wait a few minutes and try again.',
    loading: 'Getting your numbers…',
    pending: 'We\'re still hooking this up.',
    blockError: 'We couldn\'t load this right now — try a refresh.',
    offline: 'We couldn\'t reach your numbers — check your connection and refresh.',
    monthsTitle: 'Month by month',
    mixTitle: 'What people ask about most',
    sourcesTitle: 'How people found you',
    eventsTitle: 'What kind of events',
    totalLabel: 'Inquiries since ',
    reviewsLabel: 'Your Google rating',
    reviewsFrom: ' from ',
    reviewsCount: ' reviews',
    checkedOn: 'Checked '
  };
  /* STRINGS-END */

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
    if (text !== undefined) n.textContent = text;   // textContent everywhere — no HTML injection surface
    return n;
  }

  function showGate(msg) {
    root.replaceChildren();
    var form = el('form', 'dash-gate');
    var label = el('label', 'dash-gate-label', STRINGS.passwordLabel);
    var input = el('input', 'dash-gate-input');
    input.type = 'password'; input.autocomplete = 'current-password'; label.appendChild(input);
    var btn = el('button', 'dash-gate-btn', STRINGS.passwordButton);
    form.append(label, btn);
    if (msg) form.appendChild(el('p', 'dash-gate-msg', msg));
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      load({ password: input.value });
    });
    root.appendChild(form);
    input.focus();
  }

  function load(auth) {
    root.replaceChildren(el('p', 'dash-loading', STRINGS.loading));
    post(auth).then(function (res) {
      if (!res.ok) {
        try { sessionStorage.removeItem('dashToken'); } catch (e) {}
        return showGate(res.error === 'try again later' ? STRINGS.slowDown
                        : auth.password ? STRINGS.wrongPassword : '');
      }
      if (res.token) { try { sessionStorage.setItem('dashToken', res.token); } catch (e) {} }
      render(res.data);
    }).catch(function (err) {
      /* This catch sits downstream of render(), so a CODE error here was being
         reported to the client as "check your connection" -- sending her to reboot
         her router while the page was broken. The message she sees stays friendly;
         the cause now reaches the console so it is diagnosable at all. */
      if (window.console && console.error) console.error('dashboard failed:', err);
      showGate(STRINGS.offline);
    });
  }

  // Column chart (time trend) — single series, values direct-labeled, 4px data-end radius.
  function colsChart(chart) {
    var wrap = el('div', 'dash-cols');
    var max = Math.max.apply(null, chart.points.map(function (p) { return p.value; })) || 1;
    chart.points.forEach(function (p) {
      var col = el('div', 'dash-col');
      col.appendChild(el('span', 'dash-col-val', String(p.value)));
      var bar = el('div', 'dash-col-bar');
      bar.style.height = Math.max(4, Math.round(p.value / max * 110)) + 'px';
      col.appendChild(bar);
      col.appendChild(el('span', 'dash-col-lab', p.label));
      wrap.appendChild(col);
    });
    return wrap;
  }

  // Horizontal bars (category mix) — sorted by the server, values at the end.
  function barsChart(chart) {
    var wrap = el('div', 'dash-bars');
    var max = Math.max.apply(null, chart.points.map(function (p) { return p.value; })) || 1;
    chart.points.forEach(function (p) {
      var row = el('div', 'dash-bar-row');
      row.appendChild(el('p', 'dash-bar-lab', p.label));
      var line = el('div', 'dash-bar-line');
      var track = el('div', 'dash-bar-track');
      var fill = el('div', 'dash-bar-fill');
      fill.style.width = Math.max(4, Math.round(p.value / max * 100)) + '%';
      track.appendChild(fill);
      line.appendChild(track);
      line.appendChild(el('span', 'dash-bar-val', String(p.value)));
      row.appendChild(line);
      wrap.appendChild(row);
    });
    return wrap;
  }

  function chartCard(titleKey, chart, builder) {
    var card = el('section', 'dash-card dash-chart');
    card.appendChild(el('h2', 'dash-card-title',
      (cfg.blockTitles || {})[titleKey] || STRINGS[titleKey + 'Title']));
    if (chart.sentence) card.appendChild(el('p', 'dash-sentence', chart.sentence));
    card.appendChild(builder(chart));
    return card;
  }

  /* The headline strip. Two numbers, chosen because they are the two a business owner
     actually feels: how many people have asked her for work, and what strangers see
     when they look her up. Everything below this is the detail behind them.

     Both are derived, never re-entered: the total is summed from the same months the
     chart draws, so the strip can never disagree with the chart under it. The rating
     comes from cfg.snapshot and is a MEASURED MONTHLY READ, not a live feed — Google
     exposes no rating API we can use — so it renders with the date it was taken.
     A static number on a client-facing page without its as-of date rots invisibly:
     her site badge sat 40 days stale at 22 reviews while the real count reached 30. */
  function tile(big, label, sub) {
    var t = el('div', 'dash-tile');
    t.appendChild(el('p', 'dash-tile-big', big));
    t.appendChild(el('p', 'dash-tile-label', label));
    if (sub) t.appendChild(el('p', 'dash-tile-sub', sub));
    return t;
  }

  function summaryStrip(data) {
    var strip = el('div', 'dash-strip'), any = false;

    var leads = (data.blocks || {}).leads;
    var pts = leads && leads.status === 'live' && leads.months && leads.months.points;
    if (pts && pts.length) {
      var total = pts.reduce(function (n, p) { return n + (Number(p.value) || 0); }, 0);
      strip.appendChild(tile(String(total), STRINGS.totalLabel + pts[0].label));
      any = true;
    }

    var s = cfg.snapshot && cfg.snapshot.reviews;
    if (s && s.count) {
      strip.appendChild(tile(
        String(s.rating),
        STRINGS.reviewsLabel,
        // no rating here — the big number already said it
        STRINGS.reviewsFrom.replace(/^ /, '') + s.count + STRINGS.reviewsCount +
          (s.asOf ? ' · ' + STRINGS.checkedOn + s.asOf : '')
      ));
      any = true;
    }
    return any ? strip : null;
  }

  function render(data) {
    root.replaceChildren();
    root.appendChild(el('p', 'dash-month', data.monthLabel));
    var strip = summaryStrip(data);
    if (strip) root.appendChild(strip);
    (cfg.blockOrder || []).forEach(function (name) {
      var b = data.blocks[name]; if (!b) return;
      var card = el('section', 'dash-card dash-' + name);
      card.appendChild(el('h2', 'dash-card-title', (cfg.blockTitles || {})[name] || name));
      if (b.status !== 'live') {
        card.appendChild(el('p', 'dash-state',
          b.status === 'pending' ? STRINGS.pending : STRINGS.blockError));
      } else {
        if (b.headline) {
          /* The server sends value "8" and sentence "8 new inquiries so far in September".
             Rendering both printed the same number twice, with the largest type on the
             page carrying no information the sentence did not already give. When the
             sentence already opens with the value, the sentence wins. */
          var dup = b.headline.sentence &&
                    String(b.headline.sentence).indexOf(String(b.headline.value)) === 0;
          if (!dup) card.appendChild(el('p', 'dash-big', b.headline.value));
          card.appendChild(el('p', 'dash-sentence', b.headline.sentence));
          if (b.headline.prev) card.appendChild(el('p', 'dash-prev', b.headline.prev));
        }
        ['items', 'how', 'list'].forEach(function (kind) {
          (b[kind] || []).forEach(function (it) {
            var row = el('div', 'dash-row');
            row.appendChild(el('span', 'dash-row-label', it.title || it.label));
            row.appendChild(el('span', 'dash-row-value', it.meta || it.value || ''));
            card.appendChild(row);
          });
        });
      }
      root.appendChild(card);
      if (name === 'leads') {
        if (b.months) root.appendChild(chartCard('months', b.months, colsChart));
        /* how + events are OPTIONAL in the payload and stay absent until the backend
           sends them -- an older deploy simply renders what it always did. They sit
           above 'mix' because "where did they come from" and "what kind of job" are
           the two she can act on; "which service" is detail under them. */
        /* NOT named 'how' -- that key is already consumed as an ARRAY by the list
           loop above, and an object there throws .forEach and blanks the whole page. */
        if (b.sources) root.appendChild(chartCard('sources', b.sources, barsChart));
        if (b.events) root.appendChild(chartCard('events', b.events, barsChart));
        if (b.mix) root.appendChild(chartCard('mix', b.mix, barsChart));
      }
    });
  }

  var token = null;
  try { token = sessionStorage.getItem('dashToken'); } catch (e) {}
  if (token) load({ token: token }); else showGate();
})();
