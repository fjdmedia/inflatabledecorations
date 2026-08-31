// Inflatable Decorations — dashboard config. The ONLY per-client file.
// Lint-scanned: no analytics jargon anywhere in this file.
window.DASH_CONFIG = {
  clientId: 'inflatable-decorations',
  endpoint: 'https://script.google.com/macros/s/AKfycbxbtk-0SIPpl9_6yHPWvejubKffUtR2whJzwZpl_t9xr4kLnC4VgHa4T10naYcK6Xk/exec',
  blockOrder: ['leads', 'traffic'],       // her money block first — the site's job is filtered inquiries
  blockTitles: { leads: 'People who reached out', traffic: 'Visits to your site' },
  // Page display names live SERVER-SIDE in her DASH_TENANTS entry (the payload arrives
  // with final labels) — never duplicate them here.
  tokens: {
    '--dash-accent': '#FF5FA2', '--dash-bg': '#FFF9F5', '--dash-ink': '#3A2E39',
    '--dash-card': '#FFFFFF', '--dash-font': '"DM Sans", system-ui, sans-serif'
  }
};
