// Inflatable Decorations — dashboard config. The ONLY per-client file.
// Lint-scanned: no analytics jargon anywhere in this file.
window.DASH_CONFIG = {
  clientId: 'inflatable-decorations',
  endpoint: 'PASTE-DASHBOARD-EXEC-URL',   // filled at provisioning (plan Task 8), before staging
  blockOrder: ['leads', 'traffic'],       // her money block first — the site's job is filtered inquiries
  blockTitles: { leads: 'People who reached out', traffic: 'Visits to your site' },
  pageNames: {
    '/': 'Home page', '/index.html': 'Home page',
    '/inquiry.html': 'Inquiry page', '/thank-you.html': 'Thank-you page',
    '/balloon-garlands.html': 'Backdrops & Balloon Garlands',
    '/balloon-arches.html': 'Walk-Through Arches',
    '/balloon-columns.html': 'Columns',
    '/balloon-number-stacks.html': 'Bouquets & Number Stacks',
    '/birthday-shower-balloons.html': 'Birthdays & Showers',
    '/corporate-events.html': 'Corporate Events',
    '/grab-and-go-garlands.html': 'Grab & Go Garlands'
  },
  tokens: {
    '--dash-accent': '#FF5FA2', '--dash-bg': '#FFF9F5', '--dash-ink': '#3A2E39',
    '--dash-card': '#FFFFFF', '--dash-font': '"DM Sans", system-ui, sans-serif'
  }
};
