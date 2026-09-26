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
    months: 'Inquiries month by month', mix: 'What people ask about most',
    sources: 'How people found you', events: 'What kind of events' },
  // Page display names live SERVER-SIDE in her DASH_TENANTS entry (the payload arrives
  // with final labels) — never duplicate them here.
  // MEASURED MONTHLY, not live — Google exposes no rating API we can read, so this is
  // read off her listing during the retainer cycle. `asOf` renders on the tile so the
  // number can never go quietly stale the way her site badge did (40 days at 22 while
  // the real count was 30). UPDATE ALL THREE FIELDS TOGETHER, every cycle.
  snapshot: {
    reviews: { rating: '5.0', count: 30, asOf: 'Sep 26' }
  },
  tokens: {
    '--dash-accent': '#FF5FA2', '--dash-bg': '#FFF9F5', '--dash-ink': '#3A2E39',
    '--dash-card': '#FFFFFF', '--dash-font': '"DM Sans", system-ui, sans-serif',
    // Personality, per tenant. A client without these gets the plain house style and
    // never inherits her balloons -- that is the point of keeping them in config.
    '--dash-display': '"Caprasimo", "DM Sans", serif',
    '--dash-motif': 'radial-gradient(circle 8px at 8px 0, rgba(255,95,162,.30) 7px, transparent 8px)'
  }
};
