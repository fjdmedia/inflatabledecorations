// Inflatable Decorations — dashboard config. The ONLY per-client file.
// Lint-scanned: no analytics jargon anywhere in this file.
window.DASH_CONFIG = {
  clientId: 'inflatable-decorations',
  endpoint: 'PASTE-DASHBOARD-EXEC-URL',   // filled at provisioning (plan Task 8), before staging
  blockOrder: ['leads', 'traffic'],       // her money block first — the site's job is filtered inquiries
  blockTitles: { leads: 'People who reached out', traffic: 'Visits to your site' },
  // Page display names live SERVER-SIDE in her DASH_TENANTS entry (the payload arrives
  // with final labels) — never duplicate them here.
  tokens: {
    '--dash-accent': '#FF5FA2', '--dash-bg': '#FFF9F5', '--dash-ink': '#3A2E39',
    '--dash-card': '#FFFFFF', '--dash-font': '"DM Sans", system-ui, sans-serif'
  }
};
