/* Regenerates sitemap.xml for inflatabledecorationswpg.ca.
   Run from the site root.

   Homepage images come from the inline IMAGES array in index.html (the same
   array the gallery marquee renders from) so the sitemap can never drift from
   what the page actually shows. Service-page images are read from each page's
   own <img> tags for the same reason. Nothing here is hand-maintained.

   Supersedes the 2026-07-30 script; adds the six service-page URLs.
*/
import { readFileSync, writeFileSync } from 'node:fs';

const ORIGIN = 'https://inflatabledecorationswpg.ca';
const TODAY = process.argv[2];              // pass the date in — no Date.now() so runs are reproducible
if (!/^\d{4}-\d{2}-\d{2}$/.test(TODAY || '')) {
  console.error('usage: node gen-sitemap.mjs YYYY-MM-DD');
  process.exit(1);
}

const abs = p => `${ORIGIN}/${p.split('/').map(encodeURIComponent).join('/')}`;
const xesc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/* ---- homepage: the inline IMAGES array ---- */
const index = readFileSync('index.html', 'utf8');
const arrMatch = index.match(/(?:var|const|let)\s+IMAGES\s*=\s*(\[[\s\S]*?\]);/);
if (!arrMatch) { console.error('could not find the inline IMAGES array in index.html'); process.exit(1); }
/* The array is authored as JS object literals with UNQUOTED keys ({s:"…",a:"…"}),
   so quote the keys before JSON.parse rather than eval-ing site markup. */
const IMAGES = JSON.parse(arrMatch[1].replace(/([{,])\s*([A-Za-z_$][\w$]*)\s*:/g, '$1"$2":'));

const homeImgs = IMAGES.map(i => ({
  loc: abs(typeof i === 'string' ? i : (i.src || i.s)),
  title: typeof i === 'string' ? 'Balloon decor by Inflatable Decorations, Winnipeg' : (i.alt || i.a || 'Balloon decor by Inflatable Decorations, Winnipeg')
}));

/* ---- service pages: images straight out of the markup ----
   The slug list is READ from gen-service-pages.mjs rather than repeated here.
   It used to be a hardcoded array and silently went stale the moment two pages
   were added (2026-08-17) — the sitemap kept reporting 8 URLs while the site had
   10. Same principle as the IMAGES array above: derive from the source of truth
   so the sitemap cannot drift from what actually ships. */
const genSrc = readFileSync('Tools/gen-service-pages.mjs', 'utf8');
const SERVICE_PAGES = [...genSrc.matchAll(/^\s{4}slug: '([^']+)'/gm)].map(m => `${m[1]}.html`);
if (!SERVICE_PAGES.length) { console.error('no slugs found in gen-service-pages.mjs'); process.exit(1); }
const pageImgs = f => {
  const html = readFileSync(f, 'utf8');
  const out = [];
  for (const m of html.matchAll(/<img[^>]*?src="([^"]+)"[^>]*?alt="([^"]*)"/g)) {
    const [, src, alt] = m;
    if (src.startsWith('http') || /logo/i.test(src)) continue;   // brand marks aren't content images
    out.push({ loc: `${ORIGIN}/${src}`, title: alt });
  }
  return out;
};

const urls = [
  { loc: `${ORIGIN}/`, pri: '1.0', freq: 'monthly', imgs: homeImgs },
  ...SERVICE_PAGES.map(f => ({ loc: `${ORIGIN}/${f}`, pri: '0.8', freq: 'monthly', imgs: pageImgs(f) })),
  { loc: `${ORIGIN}/inquiry.html`, pri: '0.7', freq: 'yearly', imgs: [] }
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls.map(u => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>${u.freq}</changefreq>
    <priority>${u.pri}</priority>
${u.imgs.map(i => `    <image:image>
      <image:loc>${i.loc}</image:loc>
      <image:title>${xesc(i.title)}</image:title>
    </image:image>`).join('\n')}
  </url>`).join('\n')}
</urlset>
`;

writeFileSync('sitemap.xml', xml, 'utf8');
console.log(`sitemap.xml written — ${urls.length} URLs, ${urls.reduce((n, u) => n + u.imgs.length, 0)} images`);
for (const u of urls) console.log(`  ${String(u.imgs.length).padStart(3)} imgs  ${u.loc}`);
