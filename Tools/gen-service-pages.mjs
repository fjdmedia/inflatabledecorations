/* Generates the 6 Inflatable Decorations service pages from one template.
   Run from the site root. Structure is shared so multi-page coherence can't
   drift; only copy/photos/accent differ per page.

   HONESTY CONSTRAINTS baked in (fjmedia-design G33-G40):
   - Every testimonial is a VERBATIM published review, attributed by name.
   - No pricing (site carries none; prices live only in the inquiry form).
   - No insurance/COI claims - unconfirmed with the client.
   - No service-radius number - unconfirmed. The travel fact is carried only
     by a real customer's own words (Sari Levi), never asserted by us.
   - No lead times beyond what the live homepage already publishes.

   NO .reveal ON THESE PAGES - deliberate. .reveal is opacity:0 until script.js
   adds .in, so any content wearing it is invisible to a crawler that does not
   execute JS (ChatGPT's does not). It also violates the restraint rule that a
   page arrives present rather than introduced. Do not add it back.
*/
import { writeFileSync } from 'node:fs';

const ORIGIN = 'https://inflatabledecorationswpg.ca';

const PAGES = [
  {
    slug: 'corporate-events',
    acc: 'acc-sky',
    nav: 'Corporate',
    crumb: 'Corporate Events',
    title: 'Corporate Balloon Decor Winnipeg | Grand Openings & Offices',
    desc: 'Corporate balloon decor in Winnipeg for grand openings, anniversaries and office parties — brand colours matched, installed and cleared for you.',
    h1: 'Corporate Balloon Decor in Winnipeg',
    eyebrow: 'For Winnipeg Businesses',
    lede: 'Company events run on a different clock than birthdays — brand colours have to be exact, and nobody on your team should end up on a ladder taking it down after.',
    svcName: 'Corporate Balloon Decor',
    prose: [
      { h: 'Built around the brand, not just the theme', p: [
        'Every corporate install starts with your brand kit, not a colour wheel — the exact blues, the exact reds, matched from your palette instead of eyeballed off a swatch card. Where the branding needs to read from across a lobby, balloons get printed with your logo directly.',
        'An engineering firm wanted their logo on the arch and a giant 40 in balloons beside it, marking the office entrance for their fortieth anniversary. That is the kind of brief this side of the business is built for. One specific ask, right the first time — there is no second day to redo it.'
      ]},
      { h: 'Timed to the business day', p: [
        'Schools call on this side of the business just as often as offices do. A first-day-of-school install one week, balloon columns marking a retiring teacher’s send-off the next. Every one of them goes up before the room fills and clears out on a timeline that never lands on your staff’s task list.'
      ]},
      { h: 'Long enough to matter', p: [
        'A birthday setup only has to survive one afternoon. A lobby, a storefront window or a month-long promotion is a longer ask — say so up front, and the design gets built to hold for the length of the run, not just the first hour.'
      ]}
    ],
    includes: [
      'Brand or event colours pulled straight from your palette, not a guess',
      'Logo-printed balloons where the branding needs to read from across a room',
      'Up before doors open, cleared before your team is back at their desks',
      'Arches, garlands, backdrops, columns and number displays',
      'Sized for lobbies, storefronts, showrooms and offices'
    ],
    chipsHead: 'What we set up for businesses',
    chips: ['Grand openings', 'Ribbon-cuttings', 'Holiday office parties', 'Lobby & reception installs', 'Storefront & showroom displays', 'Product launches', 'Restaurants & hospitality', 'Schools & institutions', 'Staff appreciation & retirements', 'Company anniversaries'],
    photoDir: 'Assets/Gallery/Columns',
    photos: [
      { f: 'Main.jpg',   a: 'Custom logo-printed balloon column installed at a Winnipeg salon', tall: true },
      { d: 'Assets/Gallery/Walkthrough Arches', f: 'Cover.jpg', a: 'Brand-colour balloon arch with logo balloons at a Winnipeg entertainment venue' },
      { f: 'IMG_2820.jpg', a: 'Milkshake-themed balloon column built for a Winnipeg diner' },
      { d: 'Assets/Gallery/Walkthrough Arches', f: 'IMG_2589.jpg', a: 'Balloon arch marking a promotional event at a Winnipeg storefront' },
      { f: 'IMG_2906.jpg', a: 'Retirement party balloon columns installed at a Winnipeg school' }
    ],
    heroPhoto: { d: 'Assets/Gallery/Walkthrough Arches', f: 'IMG_3333.jpg', a: 'Corporate anniversary balloon arch with custom logo balloons at a Winnipeg office entrance' },
    quotes: [
      { p: 'I&rsquo;ve used Inflatable Decorations multiple times now at my nail salon for both Christmas and Halloween, as well as for my own birthday, and every time I&rsquo;m blown away. The setups are always so creative and perfectly suited to the occasion. One thing that really stands out is the quality &mdash; the balloons last MONTHS! Which is amazing, especially for a business space where I want things to look good for as long as possible. My clients always compliment the decor and it really adds such a fun vibe to the salon!', c: 'Lisa', s: 'Repeat client &middot; nail salon' },
      { p: 'Jess killed it with the set up and take down. So effortless and easy to host when your vendors are 12/10. Everything was all set up for the time of our event and Jess came back after to take it all down so we did not have to lift a finger. She&rsquo;s your decor expert!', c: 'Emily Parker', s: 'Google review' }
    ]
  },
  {
    slug: 'balloon-arches',
    acc: 'acc-yellow',
    nav: 'Balloon Arches',
    crumb: 'Balloon Arches',
    title: 'Balloon Arch Winnipeg | Walk-Through Arches & Entryways',
    desc: 'Walk-through balloon arches in Winnipeg, built to the width of your doorway or aisle. Colours set to your theme, up before your guests arrive.',
    h1: 'Balloon Arches in Winnipeg',
    eyebrow: 'Walk-Through Arches',
    lede: 'Guests do not just look at an arch. They walk through it — which is why it gets sized to the actual doorway or aisle before a single balloon is picked.',
    svcName: 'Walk-Through Balloon Arches',
    prose: [
      { h: 'Built to the opening, not a standard size', p: [
        'A ceremony aisle is not the same width as an office entrance, so the arch does not ship at one standard size — we measure the actual opening first and size the structure to it before a single balloon goes on.',
        'One entertainment venue used its walk-through arch as the check-in point itself: guests filed through it to get scanned in, so it had to read as branded from across the room and hold up through a full night of foot traffic, not just one photo.'
      ]},
      { h: 'Your colours, without the guesswork', p: [
        'Bring a theme, an invitation or a dress and the palette gets built around it — the actual shades get settled first, and the balloon colours get picked to match after, not swapped in from whatever is already inflated.'
      ]}
    ],
    includes: [
      'An arch sized to your actual doorway or aisle',
      'Colours built around your theme or invitation',
      'Freestanding and steady enough to walk through for hours, not just one photo',
      'Optional florals, vinyl lettering and themed foil accents',
      'Up before your guests arrive, gone after the last one leaves'
    ],
    chipsHead: 'Good for',
    chips: ['Wedding ceremonies', 'Grand openings', 'Ribbon-cuttings', 'Bridal & baby showers', 'Milestone birthdays', 'Graduations', 'Storefront entrances', 'Photo moments'],
    photoDir: 'Assets/Gallery/Walkthrough Arches',
    photos: [
      { f: 'Main.jpg', a: 'Walk-through balloon arch at a Winnipeg event entrance', tall: true },
      { f: 'Cover.jpg', a: 'Pastel walk-through balloon arch installed in Winnipeg' },
      { f: 'Themed-WTA.jpg', a: 'Themed walk-through balloon arch by Inflatable Decorations, Winnipeg' },
      { f: 'IMG_3296.jpg', a: 'Balloon arch framing a doorway at a Winnipeg celebration' },
      { f: 'IMG_3200.jpg', a: 'Custom colour balloon arch set up for a Winnipeg event' }
    ],
    heroPhoto: { d: 'Assets/Gallery/Walkthrough Arches', f: 'IMG_3333.jpg', a: 'Custom walk-through balloon arch at a Winnipeg office entrance, built by Inflatable Decorations' },
    quotes: [
      { p: 'I had the pleasure of working with this service to decorate for a baby shower! They provide quick communication while we planned and picked the colours for the arch, very professional service and they executed the vision we had perfectly! Would recommend this service to anyone in need for decorations!', c: 'Kristy Johnson', s: 'Google review' }
    ]
  },
  {
    slug: 'balloon-garlands',
    acc: '',
    nav: 'Backdrops & Garlands',
    crumb: 'Backdrops & Garlands',
    title: 'Balloon Backdrop &amp; Garland Winnipeg | Custom Decor',
    desc: 'Balloon backdrops and hand-clustered organic garlands in Winnipeg for showers, birthdays and weddings — built around your colours, installed for you.',
    h1: 'Balloon Backdrops &amp; Garlands in Winnipeg',
    eyebrow: 'Backdrops & Balloon Garlands',
    lede: 'Every eye in the room lands on one spot first — the backdrop is built to be that spot, with balloons clustered in real clumps of different sizes instead of spaced out like a store-bought strip.',
    svcName: 'Balloon Backdrops and Garlands',
    prose: [
      { h: 'One focal point, not a wall of balloons', p: [
        'A backdrop and garland set gives a space a single centre — the spot every phone points at the moment someone walks in, before colour or shape enter the conversation.',
        'Organic clustering means balloons of different sizes bunched in irregular groups instead of lined up at even intervals. Gaps get filled with smaller balloons rather than stretched wider, so the shape holds even at the ends.'
      ]},
      { h: 'The shape follows the wall', p: [
        'Backdrops come as arched panels, circle or hoop frames, or a garland run straight along a wall. The shape gets picked around the room it is going into, then the palette gets layered on after.'
      ]}
    ],
    includes: [
      'An organic garland clustered by hand, not spaced on a strip',
      'Backdrop shape matched to the room, not one fixed design',
      'Palette built around your theme or invitation',
      'Custom welcome signage and vinyl lettering available',
      'Set in place before the event, cleared away once it wraps'
    ],
    chipsHead: 'Good for',
    chips: ['Baby showers', 'Bridal showers', 'Birthdays', 'Gender reveals', 'Weddings', 'Graduations', 'Corporate events', 'Photo backdrops'],
    photoDir: 'Assets/Gallery/Backdrop and Balloon Garland setup',
    photos: [
      { f: 'Cover.jpg', a: 'Balloon backdrop with organic garland at a Winnipeg celebration', tall: true },
      { f: 'Favorite.jpg', a: 'Pastel balloon garland and backdrop install in Winnipeg' },
      { f: 'IMG_3827.jpg', a: 'Custom colour balloon backdrop set up in Winnipeg' },
      { f: 'IMG_4091.jpg', a: 'Organic balloon garland across an event backdrop, Winnipeg' },
      { f: 'IMG_4247.jpg', a: 'Balloon garland and backdrop styled for a Winnipeg event' }
    ],
    heroPhoto: { d: 'Assets/Gallery/Backdrop and Balloon Garland setup', f: 'IMG_3963.jpg', a: 'Balloon backdrop with a custom organic garland by Inflatable Decorations, Winnipeg' },
    quotes: [
      { p: 'We had the best experience from the quote to design to the day of set up. Our Baby Girl Shower had the extra wow we needed for making the room look better and for the best photo opportunities.', c: 'paige kibsey', s: 'Google review' }
    ]
  },
  {
    slug: 'balloon-columns',
    acc: 'acc-lilac',
    nav: 'Balloon Columns',
    crumb: 'Balloon Columns',
    title: 'Balloon Columns Winnipeg | Entrances, Stages & Events',
    desc: 'Balloon columns in Winnipeg, from a single branded accent to a full sculptural shape, in your colours, for entrances, stages and storefronts.',
    h1: 'Balloon Columns in Winnipeg',
    eyebrow: 'Standing Balloon Columns',
    lede: 'A column does not need a wall to lean on or a doorway to fill — just a spot on the floor and a height in mind, which makes it the answer when nothing else in the room gives you a place to build.',
    svcName: 'Balloon Columns',
    prose: [
      { h: 'From a single accent to a full shape', p: [
        'A logo balloon column in a Winnipeg salon can be as simple as one column dressed in brand colours by the front door — small footprint, clear signal, done in the time it takes to set a chair.',
        'A 1950s-style diner wanted something bigger: a column built into the shape of a milkshake, cherry and all, standing in for the signage most businesses order in vinyl instead. Columns can go either direction: quiet accent, or the thing people stop to photograph.'
      ]},
      { h: 'Paired, sized and coloured for the spot', p: [
        'Two columns either side of an entrance or a stage read as intentional the moment someone walks up, and height gets set to the space — a column flanking a school stage is not built the same as one standing at a retail entrance.'
      ]}
    ],
    includes: [
      'Freestanding columns, from a single branded accent to a full sculptural shape',
      'Single columns or matched pairs',
      'Height and colour set to the entrance, stage or spot you have in mind',
      'Themed foil toppers and accents available',
      'Installed where you need it, removed once the event is done'
    ],
    chipsHead: 'Good for',
    chips: ['Entrances', 'Stages & podiums', 'Grand openings', 'School events', 'Corporate functions', 'Photo areas', 'Retail storefronts'],
    photoDir: 'Assets/Gallery/Columns',
    photos: [
      { f: 'Cover.jpg', a: 'Matched pair of balloon columns framing a venue check-in entrance in Winnipeg', tall: true },
      { f: 'IMG_2820.jpg', a: 'Sculptural milkshake balloon column built for a Winnipeg diner' },
      { f: 'Main.jpg', a: 'Black and white balloon column with a custom printed topper, Winnipeg' },
      { f: '669598196_784596854516659_4741304633711714289_n.jpg', a: 'Pastel balloon column at a Winnipeg school classroom doorway' },
      { f: 'IMG_2906.jpg', a: 'Themed balloon columns for a retirement party at a Winnipeg school' }
    ],
    heroPhoto: { d: 'Assets/Gallery/Columns', f: 'Main2.jpg', a: 'Balloon column installed in a Winnipeg commercial showroom by Inflatable Decorations' },
    quotes: [
      { p: 'Jess killed it with the set up and take down. So effortless and easy to host when your vendors are 12/10. Everything was all set up for the time of our event and Jess came back after to take it all down so we did not have to lift a finger. She&rsquo;s your decor expert!', c: 'Emily Parker', s: 'Google review' }
    ]
  },
  {
    slug: 'grab-and-go-garlands',
    acc: 'acc-mint',
    nav: 'Grab & Go',
    crumb: 'Grab & Go Garlands',
    title: 'Grab &amp; Go Balloon Garlands Winnipeg | Ready to Hang',
    desc: 'Grab &amp; Go balloon garlands in Winnipeg, hand-clustered and ready for pickup. Hang it yourself in minutes — the same look as a full install, no appointment.',
    h1: 'Grab &amp; Go Balloon Garlands in Winnipeg',
    eyebrow: 'Pre-Made &middot; Ready for Pickup',
    lede: 'The same garland we build for a full install, minus the appointment — pick it up finished and hang it yourself in whatever time you actually have.',
    svcName: 'Grab and Go Balloon Garlands',
    prose: [
      { h: 'Built the same way, handed over finished', p: [
        'Grab &amp; Go garlands go through the same process as an install, clustered by hand and built in your colours. The only difference is where the last step happens: instead of mounting it on your wall, we hand it to you already assembled.',
        'That makes it the option when the venue only gives you access an hour beforehand, when the space is small enough to manage alone, or when a full install is more than the day actually calls for.'
      ]},
      { h: 'Up in minutes, no experience needed', p: [
        'A finished garland goes up at a few fixed points on whatever surface you have — a wall or a doorway frame. If it can hold a picture frame, it can hold a garland.'
      ]}
    ],
    includes: [
      'The exact same garland we would install, handed to you instead of mounted',
      'Ready for pickup at a time that works for you',
      'Hangs anywhere from a home party to a rented hall',
      'The lower-cost way to get the same look as a full install',
      'Themed foil accents available'
    ],
    chipsHead: 'Good for',
    chips: ['Home celebrations', 'Small venues', 'Tight setup windows', 'Office break rooms', 'Classroom parties', 'Budget-conscious events'],
    photoDir: 'Assets/Gallery/Grab & Go',
    photos: [
      { f: 'Main2.jpg', a: 'Pre-made Grab and Go balloon garland ready for pickup in Winnipeg', tall: true },
      { f: 'Cover.jpg', a: 'Grab and Go balloon garland in custom colours, Winnipeg' },
      { f: 'Main.jpg', a: 'Assembled Grab and Go balloon garland by Inflatable Decorations, Winnipeg' },
      { f: '670611478_3926052884357320_2655556587710275461_n.jpg', a: 'Pastel Grab and Go balloon garland made in Winnipeg' }
    ],
    heroPhoto: { d: 'Assets/Gallery/Grab & Go', f: 'Cover.jpg', a: 'Pre-assembled Grab and Go balloon garland from Inflatable Decorations, Winnipeg' },
    quotes: []
  },
  {
    slug: 'balloon-number-stacks',
    acc: 'acc-peach',
    nav: 'Number Stacks',
    crumb: 'Number Stacks & Bouquets',
    title: 'Balloon Number Stacks Winnipeg | Milestone Birthdays',
    desc: 'Giant balloon number stacks in Winnipeg for milestone birthdays and anniversaries, built in your palette and sized to be the photo. Bouquets available.',
    h1: 'Balloon Number Stacks in Winnipeg',
    eyebrow: 'Number Stacks &amp; Bouquets',
    lede: 'A first birthday, a fortieth, a golden anniversary — the number gets built big enough to be the photo itself, not a detail standing next to the cake.',
    svcName: 'Balloon Number Stacks and Bouquets',
    prose: [
      { h: 'The number is the photo, not a prop', p: [
        'Store-bought foil numbers come in whatever shade the aisle had that week. A balloon number stack gets built in your actual palette, at a size that holds up as the main subject of every photo taken that day.',
        'Big enough to see from across the room. Small enough to still fit through the door.'
      ]},
      { h: 'Bouquets, sized down', p: [
        'The same palette works smaller for bouquets — clustered arrangements for the gift table and entryway, so the number is not the only thing carrying the theme.'
      ]}
    ],
    includes: [
      'A giant number stack sized to be the photo, in your event colours',
      'Balloon bouquets for the gift table and entryway',
      'Matched to the rest of the room, not sold separately',
      'Themed foil and confetti accents available',
      'Delivered and set up ahead of the celebration'
    ],
    chipsHead: 'Good for',
    chips: ['First birthdays', 'Milestone birthdays', 'Anniversaries', 'Graduations', 'Retirement parties', 'Company anniversaries', 'Gift tables'],
    photoDir: 'Assets/Gallery/Ballon Bouquets-Number Stacks',
    photos: [
      { f: 'Main2.jpg', a: 'Giant balloon number stack for a Winnipeg birthday celebration', tall: true },
      { f: 'Cover.jpg', a: 'Balloon number stack in custom colours, Winnipeg' },
      { f: 'Main.jpg', a: 'Balloon bouquet and number display by Inflatable Decorations, Winnipeg' },
      { f: 'IMG_2924.jpg', a: 'Milestone birthday balloon number stack set up in Winnipeg' },
      { f: 'IMG_3392.jpg', a: 'Balloon bouquet arrangement for a Winnipeg celebration' }
    ],
    heroPhoto: { d: 'Assets/Gallery/Ballon Bouquets-Number Stacks', f: 'Cover.jpg', a: 'Giant balloon number stack built by Inflatable Decorations in Winnipeg' },
    quotes: [
      { p: 'We had an amazing experience using Inflatable Decorations for my son&rsquo;s first birthday party. We live 20 minutes outside of Winnipeg and a few other businesses I tried first, refused to set up outside the city, then I luckily came across Jessica on Instagram and she had no problem coming to set up at our house.', c: 'Sari Levi', s: 'Google review' }
    ]
  }
];

const enc = p => p.split('/').map(encodeURIComponent).join('/');
const strip = s => s.replace(/&[a-z]+;/g, m => ({ '&amp;': '&', '&middot;': '·', '&rsquo;': '’', '&mdash;': '—' }[m] ?? m));

function page(d) {
  const url = `${ORIGIN}/${d.slug}.html`;
  const sibs = PAGES.filter(p => p.slug !== d.slug);
  const cls = ['svc-page', d.acc].filter(Boolean).join(' ');

  const shots = d.photos.map(ph =>
    `        <figure class="svc-shot${ph.tall ? ' svc-shot--tall' : ''}">
          <img loading="lazy" width="800" height="1000" src="${enc(ph.d || d.photoDir)}/${enc(ph.f)}" alt="${ph.a}" />
        </figure>`).join('\n');

  const quotes = d.quotes.map(q =>
    `      <blockquote class="svc-quote">
        <p>&ldquo;${q.p}&rdquo;</p>
        <cite>${q.c}<span class="svc-quote-src">${q.s}</span></cite>
      </blockquote>`).join('\n');

  const prose = d.prose.map(s =>
    `        <h3>${s.h}</h3>\n${s.p.map(t => `        <p>${t}</p>`).join('\n')}`).join('\n');

  /* Two separate blocks rather than one @graph: the shared FJMedia schema
     linter asserts a top-level @type per block, and weakening that check to
     accommodate @graph would blind it for every other client site. */
  const ldService = {
    '@context': 'https://schema.org',
    '@type': 'Service', '@id': `${url}#service`, name: d.svcName,
    serviceType: d.svcName,
    description: strip(d.desc),
    provider: { '@type': 'LocalBusiness', '@id': `${ORIGIN}/#business`, name: 'Inflatable Decorations', url: `${ORIGIN}/` },
    areaServed: [{ '@type': 'City', name: 'Winnipeg' }, { '@type': 'AdministrativeArea', name: 'Manitoba' }],
    url
  };
  const ldCrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList', '@id': `${url}#crumb`,
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${ORIGIN}/` },
      { '@type': 'ListItem', position: 2, name: strip(d.crumb), item: url }
    ]
  };

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />

  <title>${d.title}</title>
  <meta name="description" content="${d.desc}" />
  <meta name="geo.region" content="CA-MB" />
  <meta name="geo.placename" content="Winnipeg" />
  <meta name="robots" content="index,follow" />
  <link rel="canonical" href="${url}" />

  <meta property="og:type" content="website" />
  <meta property="og:url" content="${url}" />
  <meta property="og:title" content="${d.title}" />
  <meta property="og:description" content="${d.desc}" />
  <meta property="og:image" content="${ORIGIN}/Assets/Brand/logo-social.png" />
  <meta property="og:image:alt" content="Inflatable Decorations balloon logo" />
  <meta property="og:locale" content="en_CA" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${d.title}" />
  <meta name="twitter:description" content="${d.desc}" />
  <meta name="twitter:image" content="${ORIGIN}/Assets/Brand/logo-social.png" />

  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Caprasimo&family=Caveat:wght@500;700&family=DM+Sans:wght@400;500;600;700;800&display=swap" />

  <link rel="icon" type="image/png" href="Assets/Brand/logo-512.png" />
  <link rel="stylesheet" href="styles.css" />

  <script type="application/ld+json">
${JSON.stringify(ldService, null, 2)}
  </script>
  <script type="application/ld+json">
${JSON.stringify(ldCrumb, null, 2)}
  </script>
</head>
<body class="${cls}">

  <nav class="nav" id="nav" aria-label="Primary">
    <div class="nav-inner">
      <a href="index.html" class="nav-logo" aria-label="Inflatable Decorations home">
        <img src="Assets/Brand/logo-512.png" alt="Inflatable Decorations balloon logo" />
        <span><span class="script-accent">Inflatable</span> Decorations</span>
      </a>

      <ul class="nav-links" id="navLinks">
        <li><a href="index.html">Home</a></li>
        <li><a href="index.html#services">Services</a></li>
        <li><a href="corporate-events.html">Corporate</a></li>
        <li><a href="index.html#about">About</a></li>
        <li><a href="index.html#gallery">Gallery</a></li>
        <li><a href="inquiry.html">Inquiry</a></li>
        <li><a href="inquiry.html" class="btn btn-primary btn-sm">Book Now</a></li>
      </ul>

      <button class="nav-toggle" id="navToggle" aria-label="Toggle navigation" aria-expanded="false">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round">
          <line x1="4" y1="7" x2="20" y2="7"/>
          <line x1="4" y1="12" x2="20" y2="12"/>
          <line x1="4" y1="17" x2="20" y2="17"/>
        </svg>
      </button>
    </div>
  </nav>

  <header class="svc-hero">
    <div class="container svc-hero-grid">
      <div>
        <p class="svc-crumb">
          <a href="index.html">Home</a> &rsaquo; <span aria-current="page">${d.crumb}</span>
        </p>
        <span class="eyebrow">${d.eyebrow}</span>
        <h1>${d.h1}</h1>
        <p class="svc-lede">${d.lede}</p>
        <a href="inquiry.html" class="btn btn-primary">Start your inquiry</a>
      </div>
      <div class="svc-hero-photo">
        <img width="900" height="990" src="${enc(d.heroPhoto.d)}/${enc(d.heroPhoto.f)}" alt="${d.heroPhoto.a}" />
      </div>
    </div>
  </header>

  <section class="svc-body">
    <div class="container">
      <div class="svc-prose">
        <h2>${d.prose[0].h}</h2>
${d.prose[0].p.map(t => `        <p>${t}</p>`).join('\n')}
${d.prose.slice(1).map(s => `        <h3>${s.h}</h3>\n${s.p.map(t => `        <p>${t}</p>`).join('\n')}`).join('\n')}

        <h3>What&rsquo;s included</h3>
        <ul class="svc-includes">
${d.includes.map(i => `          <li>${i}</li>`).join('\n')}
        </ul>

        <h3>${d.chipsHead}</h3>
        <ul class="svc-chips">
${d.chips.map(c => `          <li>${c}</li>`).join('\n')}
        </ul>
      </div>
    </div>
  </section>

  <section class="svc-strip" aria-label="Recent ${strip(d.crumb).toLowerCase()} in Winnipeg">
    <div class="container">
      <div class="svc-strip-grid">
${shots}
      </div>
    </div>
  </section>
${d.quotes.length ? `
  <section class="svc-body" aria-label="What clients say" style="padding-top:0">
    <div class="container">
${quotes}
    </div>
  </section>
` : ''}
  <div class="scallop-div pink-mint" aria-hidden="true" style="background-color: var(--cream);"></div>

  <section class="svc-cta">
    <div class="container">
      <h2>Tell us about your event</h2>
      <p>Share your date, your colours and a few inspiration photos &mdash; we reply within 24 hours.</p>
      <a href="inquiry.html" class="btn btn-primary">Start your inquiry</a>
    </div>
  </section>

  <section class="svc-siblings" aria-label="Other services">
    <div class="container">
      <h2>Other things we set up</h2>
      <div class="svc-sib-grid">
${sibs.map(s => `        <a href="${s.slug}.html">${s.nav}</a>`).join('\n')}
        <a href="index.html#gallery">Full gallery</a>
      </div>
    </div>
  </section>

  <footer>
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <div class="logo-row">
            <img src="Assets/Brand/logo-512.png" alt="Inflatable Decorations logo" />
            <span>Inflatable Decorations</span>
          </div>
          <p>Custom-designed balloon installs for Winnipeg weddings, showers, birthdays and everything in between. Let's make your day unforgettable.</p>
        </div>

        <div>
          <h3>Services</h3>
          <ul>
${PAGES.map(s => `            <li><a href="${s.slug}.html">${s.nav}</a></li>`).join('\n')}
          </ul>
        </div>

        <div>
          <h3>Stay in the loop</h3>
          <ul>
            <li><a href="https://instagram.com/inflatabledecorations" target="_blank" rel="noopener">Instagram @inflatabledecorations</a></li>
            <li><a href="mailto:jhma24@hotmail.com">jhma24@hotmail.com</a></li>
            <li>Winnipeg, Manitoba</li>
          </ul>
        </div>
      </div>

      <div class="footer-bottom">
        <span>&copy; <span id="yr">2026</span> Inflatable Decorations. All rights reserved.</span>
        <span>Site crafted by <a href="https://fjmedia.ca" target="_blank" rel="noopener">FJMedia</a></span>
      </div>
    </div>
  </footer>

  <script src="script.js" defer></script>
</body>
</html>
`;
}

let fail = 0;
for (const d of PAGES) {
  const html = page(d);
  writeFileSync(`${d.slug}.html`, html, 'utf8');
  const tLen = strip(d.title).length, dLen = strip(d.desc).length;
  const tOk = tLen >= 50 && tLen <= 60, dOk = dLen >= 140 && dLen <= 160;
  if (!tOk || !dOk) fail++;
  console.log(`${d.slug.padEnd(24)} title ${String(tLen).padStart(3)} ${tOk ? 'ok ' : 'BAD'}  desc ${String(dLen).padStart(3)} ${dOk ? 'ok ' : 'BAD'}`);
}
console.log(fail ? `\n${fail} page(s) outside spec` : '\nall 6 pages within title/meta spec');
