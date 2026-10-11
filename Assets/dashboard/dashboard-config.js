// Inflatable Decorations — dashboard config. The ONLY per-client file.
// Lint-scanned: no analytics jargon anywhere in this file.
window.DASH_CONFIG = {
  clientId: 'inflatable-decorations',
  endpoint: 'https://script.google.com/macros/s/AKfycbxbtk-0SIPpl9_6yHPWvejubKffUtR2whJzwZpl_t9xr4kLnC4VgHa4T10naYcK6Xk/exec',
  // 'traffic' is REMOVED from the order until GA4 has data. It rendered "We're still
  // hooking this up" every time she opened the page, which advertises a half-built
  // product on every visit. Put it back the day the property collects.
  blockOrder: ['leads'],
  blockTitles: { leads: 'People who reached out', traffic: 'Visits to your site',
    months: 'Month by month', mix: 'What people ask about most', latest: 'Latest inquiries',
    sources: 'How people found you', events: 'What kind of events' },
  // Page display names live SERVER-SIDE in her DASH_TENANTS entry (the payload arrives
  // with final labels) — never duplicate them here.
  // MEASURED MONTHLY, not live: Google offers no rating feed we can read, so this is
  // read off her listing during the retainer cycle. `asOf` renders on the tile so a
  // reader can always see how fresh the number is instead of trusting it blindly.
  // UPDATE ALL THREE FIELDS TOGETHER, every cycle.
  snapshot: {
    // `prev` is the count at the PREVIOUS cycle's read. The status line subtracts
    // it to say how many arrived since; without it that line stays silent rather
    // than guessing a delta. Roll it forward every cycle: prev <- old count.
    reviews: { rating: '5.0', count: 32, prev: 30, asOf: 'Oct 8' }
  },
  // dashboard.html repeats these tokens in its inline :root so the first paint matches:
  // change both together.
  tokens: {
    // Her site's own tokens. The bright pink is decoration only; text and marks use the
    // two deeper pinks her site already defines for contrast (6.15:1 text, 4.97:1 white-on).
    '--dash-accent': '#FF5FA2', '--dash-accent-ink': '#B02E62', '--dash-accent-solid': '#C9356F',
    '--dash-accent-solid-dk': '#A32A59', '--dash-accent-soft': '#FFE0EC',
    '--dash-bg': '#FFF8F0', '--dash-ink': '#2D1B3D', '--dash-muted': '#6B6570',
    '--dash-card': '#FFFFFF', '--dash-font': '"DM Sans", system-ui, sans-serif',
    // Personality, per tenant. A client without these gets the plain house style and
    // never inherits her balloons -- that is the point of keeping them in config.
    '--dash-display': '"Caprasimo", "DM Sans", serif',
    '--dash-motif': 'radial-gradient(circle 8px at 8px 0, rgba(255,95,162,.30) 7px, transparent 8px)'
  }
};
