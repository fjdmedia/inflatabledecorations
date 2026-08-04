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
    desc: 'Balloon decor for Winnipeg businesses — grand openings, ribbon-cuttings, holiday parties and office installs. Colour-matched, set up and taken down for you.',
    h1: 'Corporate Balloon Decor in Winnipeg',
    eyebrow: 'For Winnipeg Businesses',
    lede: 'Grand openings, ribbon-cuttings, holiday parties, storefront displays and office installs — designed around your brand colours, built on site, and taken down when it is over.',
    svcName: 'Corporate Balloon Decor',
    prose: [
      { h: 'Balloon decor that works for a business, not just a party', p: [
        'A company event has a different job than a birthday. It has to photograph well, hold up through a full day of foot traffic, and make the space feel deliberate the moment someone walks in. That is what these installs are built for.',
        'Every design starts with your colours. If you have brand colours we match to them, and where the branding needs to read from across a room, balloons can be printed with your logo directly.'
      ]},
      { h: 'Built to hold up', p: [
        'The most common worry with balloon decor at a business is how long it lasts. A birthday setup only has to survive one afternoon. A lobby, a storefront window or a month-long promotion is a different ask entirely — and it is the thing clients bring up most often afterward.'
      ]},
      { h: 'Set up and taken down for you', p: [
        'Installs happen on site, on your schedule, before doors open. When the event is finished we come back and clear it out, so nobody on your team is pulling balloons off a wall at the end of a long day.'
      ]}
    ],
    includes: [
      'A design matched to your brand or event colours',
      'Custom logo-printed balloons where you want the branding to read',
      'On-site installation before your event starts',
      'Teardown and removal after — you do not handle cleanup',
      'Arches, garlands, backdrops, columns and number displays',
      'Setups sized for lobbies, storefronts, showrooms and offices'
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
    desc: 'Custom walk-through balloon arches in Winnipeg for entryways, ceremonies, grand openings and photo moments. Colour-matched to your theme, installed on site.',
    h1: 'Balloon Arches in Winnipeg',
    eyebrow: 'Walk-Through Arches',
    lede: 'A full walk-through arch turns a doorway into the first photo of the day. Built to your colours, installed on site, and sized for the space it is going in.',
    svcName: 'Walk-Through Balloon Arches',
    prose: [
      { h: 'The entrance people walk through', p: [
        'An arch does something no other balloon setup does — guests move through it. It marks the start of the event, frames every photo taken near it, and tells people they are in the right place before anyone says a word.',
        'Each one is built for the opening it is going in. A ceremony aisle, a venue doorway, a storefront entrance and a backyard gate are all different shapes, and the arch gets designed around the actual space rather than dropped in at a standard size.'
      ]},
      { h: 'Colour-matched, not close enough', p: [
        'You bring the palette — a theme, an invitation, a brand colour, a dress. The arch is designed around it, and the balloon selection happens after the colours are settled, not before.'
      ]}
    ],
    includes: [
      'A custom arch designed for your entryway or ceremony space',
      'Colours matched to your theme, invitation or brand',
      'On-site installation before guests arrive',
      'Optional florals, vinyl lettering and themed foil accents',
      'Teardown after the event'
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
    desc: 'Custom balloon backdrops and organic garlands in Winnipeg. Built around your colours for showers, birthdays and weddings. Installed and removed for you.',
    h1: 'Balloon Backdrops &amp; Garlands in Winnipeg',
    eyebrow: 'Backdrops & Balloon Garlands',
    lede: 'The setup most people picture when they think of balloon decor — an organic garland running across a backdrop, colour-matched to your theme, built as the focal point of the room.',
    svcName: 'Balloon Backdrops and Garlands',
    prose: [
      { h: 'The focal point of the room', p: [
        'A backdrop with a balloon garland gives a space one clear centre. It is where the cake table goes, where people stand for photos, and where the eye lands when someone walks in — which is why it is the most requested setup.',
        'Garlands are built in the organic style: clustered, varied in size, and asymmetric rather than evenly spaced. That is what keeps it looking designed instead of decorated.'
      ]},
      { h: 'Your colours, your shape', p: [
        'Backdrops come in different silhouettes — arched panels, circle and hoop frames, or a garland running straight across a wall. The shape gets picked to suit the room and the photos you want out of it.'
      ]}
    ],
    includes: [
      'An organic balloon garland built in your colour palette',
      'Backdrop panel, hoop or wall-mounted options',
      'Custom welcome signage and vinyl lettering available',
      'Florals and themed foil accents as add-ons',
      'Installed on site and removed afterward'
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
    desc: 'Custom balloon columns in Winnipeg for entrances, stages, photo areas, grand openings and school events. Built to your colours and installed on site.',
    h1: 'Balloon Columns in Winnipeg',
    eyebrow: 'Standing Balloon Columns',
    lede: 'Freestanding columns that frame an entrance, flank a stage or mark a photo area — built to your colours and placed where the room needs structure.',
    svcName: 'Balloon Columns',
    prose: [
      { h: 'Structure where a room needs it', p: [
        'Columns do something a garland cannot: they stand on their own, at height, exactly where you put them. That makes them the answer when there is no wall to work against — an open ballroom floor, a stage edge, a set of double doors, the front of a store.',
        'They work in pairs more often than not. A matched set either side of an entrance or a stage reads as intentional immediately, and gives photographers a natural frame.'
      ]},
      { h: 'Sized and coloured for the space', p: [
        'Height and colour are both decisions, not defaults. A column flanking a school stage and one standing in a retail entrance are built differently, and the palette follows the theme or the brand.'
      ]}
    ],
    includes: [
      'Freestanding columns built to your colour palette',
      'Single columns or matched pairs',
      'Sized for entrances, stages, storefronts and photo areas',
      'Themed foil toppers and accents available',
      'Installed on site and removed afterward'
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
    desc: 'Pre-assembled Grab &amp; Go balloon garlands in Winnipeg, ready for pickup and easy to hang yourself. A budget-friendly way to get a custom balloon display.',
    h1: 'Grab &amp; Go Balloon Garlands in Winnipeg',
    eyebrow: 'Pre-Made &middot; Ready for Pickup',
    lede: 'A custom balloon garland, pre-assembled and ready to collect. You pick it up, you hang it — no install appointment, no setup window to plan around.',
    svcName: 'Grab and Go Balloon Garlands',
    prose: [
      { h: 'The same garland, without the install', p: [
        'Grab &amp; Go garlands are built the same way as the ones we install — same organic clustering, same colour matching — but they are handed to you finished instead of mounted on site.',
        'That makes them the practical option when the venue only gives you access an hour beforehand, when the space is small enough to handle yourself, or when a full install is more than the day calls for.'
      ]},
      { h: 'Easy to put up', p: [
        'Garlands arrive assembled in one piece. Hanging one is a matter of fixing it at a few points along a wall, a table edge or a doorway — no balloon experience required.'
      ]}
    ],
    includes: [
      'A pre-assembled garland in your chosen colours',
      'Ready for pickup at an arranged time',
      'Hangs at home, at a hall or at a venue',
      'A budget-friendly alternative to a full install',
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
    desc: 'Giant balloon number stacks and bouquets in Winnipeg for milestone birthdays and anniversaries. Custom colours, delivered and set up for your celebration.',
    h1: 'Balloon Number Stacks in Winnipeg',
    eyebrow: 'Number Stacks &amp; Bouquets',
    lede: 'Giant numbers built out of balloons for the birthdays and anniversaries worth marking — matched to your colours and set up ready to photograph.',
    svcName: 'Balloon Number Stacks and Bouquets',
    prose: [
      { h: 'The number is the photo', p: [
        'A first birthday, a fortieth, a fiftieth anniversary — the number is what the photos end up being about. A balloon stack makes it big enough to actually be the subject rather than a detail in the background.',
        'Stacks are built in your colours, so the number sits inside the theme instead of arriving as a generic foil shape in whatever shade the store had.'
      ]},
      { h: 'Bouquets too', p: [
        'Balloon bouquets work the same way at a smaller scale — clustered arrangements for tables, entryways and gift areas, in the same palette as the rest of the setup.'
      ]}
    ],
    includes: [
      'Giant number stacks in your colour palette',
      'Balloon bouquets for tables and entryways',
      'Matched to the rest of your decor',
      'Themed foil and confetti accents available',
      'Delivered and set up for the celebration'
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
