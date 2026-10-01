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
    checkedOn: 'Checked ',
    busierHead: 'A busier stretch',
    busierBody: '{recent} inquiries came in over the last 3 months, up from {prior} in the 3 months before that. More coming in means more to handle.',
    steadyHead: 'A steady stretch',
    steadyBody: '{recent} inquiries came in over the last 3 months. That kind of consistency is easier to build a business around than the big swings up and down.',
    quieterHead: 'A quieter stretch',
    quieterBody: '{recent} inquiries came in over the last 3 months, down from {prior} in the 3 months before that. It happens for every business.',
    reviewsGained: '{added} new reviews rolled in, bringing your total to {total}.'
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
     A static number shown without its as-of date rots invisibly, so the date ships
     beside it and the reader can judge the number's age themselves. */
  function tile(big, label, sub) {
    var t = el('div', 'dash-tile');
    t.appendChild(el('p', 'dash-tile-big', big));
    t.appendChild(el('p', 'dash-tile-label', label));
    if (sub) t.appendChild(el('p', 'dash-tile-sub', sub));
    return t;
  }

  /* The status line. One plain sentence saying whether things are busier, steady or
     quieter than THIS client's own recent past — never against a target, because
     there is no honest absolute number to compare a small business to.

     Three decisions hold this together, and all three exist because the volume is
     low. This client averages about 9 or 10 inquiries a month, where a month of 6
     and a month of 13 are both completely ordinary:

     1. THREE-MONTH WINDOWS, never month over month. One slow month is noise. A slow
        quarter is information. Month-over-month on these numbers would swing the
        state constantly and teach the reader to ignore the whole page.
     2. The band is max(3, 20% of the prior window). Roughly a standard deviation
        at this volume, and the absolute floor of 3 stops a tiny client flipping
        state on a single extra inquiry.
     3. STEADY IS A GOOD STATE and is styled calm, not as a warning. It is where
        most quarters land, and a dashboard whose normal reading looks like an
        alarm is one nobody opens twice.

     Needs 6 months of history to say anything at all; with less it renders nothing
     rather than a verdict built on four data points. Colour is never the only
     signal — the sentence says it, the dot only decorates. */
  function statusLine(data) {
    var leads = (data.blocks || {}).leads;
    var pts = leads && leads.status === 'live' && leads.months && leads.months.points;
    if (!pts || pts.length < 6) return null;

    var n = function (p) { return Number(p.value) || 0; };
    var sum = function (a) { return a.reduce(function (t, p) { return t + n(p); }, 0); };
    var recent = sum(pts.slice(-3));
    var prior = sum(pts.slice(-6, -3));
    var band = Math.max(3, prior * 0.2);
    var diff = recent - prior;
    var state = diff > band ? 'busier' : (diff < -band ? 'quieter' : 'steady');

    var fill = function (s) {
      return s.replace('{recent}', recent).replace('{prior}', prior);
    };
    var box = el('div', 'dash-status dash-status--' + state);
    box.appendChild(el('span', 'dash-status-dot'))
      .setAttribute('aria-hidden', 'true');
    box.appendChild(el('p', 'dash-status-head', STRINGS[state + 'Head']));
    box.appendChild(el('p', 'dash-status-body', fill(STRINGS[state + 'Body'])));

    /* Reviews only go up, so this is the one unambiguous signal on the page. It
       needs a previous count to subtract from; without `prev` in the snapshot it
       stays silent rather than guessing at a delta. */
    var s = cfg.snapshot && cfg.snapshot.reviews;
    if (s && s.count && s.prev && s.count > s.prev) {
      box.appendChild(el('p', 'dash-status-review',
        STRINGS.reviewsGained.replace('{added}', s.count - s.prev).replace('{total}', s.count)));
    }
    return box;
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
    var status = statusLine(data);
    if (status) root.appendChild(status);
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
