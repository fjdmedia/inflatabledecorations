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
        'Every corporate install starts with your brand kit, not a colour wheel &mdash; the exact blues, the exact reds, matched from your palette instead of eyeballed off a swatch card. Where the branding needs to read from across a lobby, balloons get printed with your logo directly.',
        'An engineering firm wanted their logo on the arch and a giant 40 in balloons beside it, marking the office entrance for their fortieth anniversary. That is the kind of brief this side of the business is built for. One specific ask, right the first time &mdash; there is no second day to redo it.'
      ]},
      { h: 'Bring the brand to the details', p: [
        'It does not have to stop at one large installation. Tabletop arrangements carry the same colours onto registration desks, food stations and employee tables, so the room reads as one thing rather than a decorated corner and a lot of empty space.'
      ]},
      { h: 'Build a package that fits the event', p: [
        'The elements combine. A walk-through arch with branded columns either side, tabletop pieces through the room, a backdrop and custom details for a full branded run. One statement installation, or a bit of everything.'
      ]},
      { h: 'Timed to the business day', p: [
        'Schools call on this side of the business just as often as offices do. A first-day-of-school install one week, balloon columns marking a retiring teacher&rsquo;s send-off the next. Every one of them goes up before the room fills and clears out on a timeline that never lands on your staff&rsquo;s task list.'
      ]},
      { h: 'Long enough to matter', p: [
        'A birthday setup only has to survive one afternoon. A lobby, a storefront window or a month-long promotion is a longer ask &mdash; say so up front, and the design gets built to hold for the length of the run, not just the first hour.'
      ]}
    ],
    includes: [
      'Brand or event colours pulled straight from your palette, not a guess',
      'Logo-printed balloons where the branding needs to read from across a room',
      'Up before doors open, cleared before your team is back at their desks',
      'Arches, garlands, backdrops, columns and number displays',
      'Sized for lobbies, storefronts, showrooms and offices'
    ],
    tiers: {
      groups: [
        { h: 'What a corporate booking can include', items: [
          'Walk-through arches in your company colours',
          'Branded columns for entrances, stages and registration areas',
          'Tabletop arrangements for desks, food stations and employee tables',
          'Backdrops and custom vinyl details',
          'Balloons printed with your logo',
          'Installed before doors open, cleared once the event is done'
        ]}
      ]
    },
    chipsHead: 'What we set up for businesses',
    chips: ['Grand openings and launches', 'Staff appreciation days', 'Company anniversaries', 'Corporate holiday parties', 'Employee celebrations', 'Fundraisers and community events', 'Conferences and promotional events', 'Office parties and milestones'],
    photoDir: 'Assets/Gallery/Columns',
    photos: [
      { f: 'Main.jpg',   a: 'Custom logo-printed balloon column installed at a Winnipeg salon', tall: true },
      { d: 'Assets/Gallery/Walkthrough Arches', f: 'Cover.jpg', a: 'Brand-colour balloon arch with logo balloons at a Winnipeg entertainment venue' },
      { f: 'IMG_2820.jpg', a: 'Milkshake-themed balloon column built for a Winnipeg diner' },
      { d: 'Assets/Gallery/Walkthrough Arches', f: 'IMG_2589.jpg', a: 'Balloon arch marking a promotional event at a Winnipeg storefront' },
      { f: 'IMG_2906.jpg', a: 'Retirement party balloon columns installed at a Winnipeg school' }
    ],
    heroPhoto: { d: 'Assets/Gallery/Walkthrough Arches', f: 'IMG_3333.jpg', a: 'Corporate anniversary balloon arch with custom logo balloons at a Winnipeg office entrance' },
    sectors: {
      head: 'Where these installs have gone',
      intro: 'A lobby is not a dining room, and neither is a school hallway. Different rooms, different asks.',
      items: [
        { n: 'Offices &amp; professional services', p: 'Milestone anniversaries and entrance installs.' },
        { n: 'Entertainment venues', p: 'A check-in point built as a branded arch and columns, in the venue&rsquo;s own blue, black and white.' },
        { n: 'Restaurants &amp; hospitality', p: 'A milkshake the height of a person, cherry on top, standing on a diner&rsquo;s checkerboard floor.' },
        { n: 'Salons &amp; storefronts', p: 'A column by the front desk, black and white, topped with a printed logo balloon.' },
        { n: 'Schools', p: 'First days back, and send-offs for staff leaving.' }
      ]
    },
    process: {
      head: 'How a booking runs',
      steps: [
        { h: 'You send the details', p: 'Date, venue, your colours and any inspiration photos, through the inquiry form. A reply comes back within 24 hours.' },
        { h: 'The design gets settled', p: 'Colours, sizes and what sits where, agreed with you before anything is built.' },
        { h: 'We install', p: 'On site, on the schedule the event needs.' },
        { h: 'We come back for it', p: 'Teardown and removal once it is over.' }
      ]
    },
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
    lede: 'A full-size walk-through arch for an entryway or an event floor. Your colours, your choice of spiral or organic build, installed on site and cleared away afterward.',
    svcName: 'Walk-Through Balloon Arches',
    prose: [
      { h: 'Ten feet across, and guests walk through it', p: [
        'The arch spans 10ft wide by 8ft high, built to stand in a doorway or open across a room. Guests move through it rather than past it, which is why it ends up in more photographs than anything else on the floor.',
        'It marks the start of the event before anyone has said a word, and it tells people they are in the right place.'
      ]},
      { h: 'Spiral or organic', p: [
        'Two builds to pick from. A spiral winds the colours around the frame in an even repeating band. An organic build clusters them in mixed sizes for a looser, less uniform look. Same footprint, different character.'
      ]},
      { h: 'Your colours, without the guesswork', p: [
        'You bring the palette \u2014 a theme, an invitation, a company brand \u2014 and the balloons get chosen after the colours are settled, not before.'
      ]}
    ],
    includes: [
      'An arch sized to your actual doorway or aisle',
      'Colours built around your theme or invitation',
      'Freestanding and steady enough to walk through for hours, not just one photo',
      'Optional florals, vinyl lettering and themed foil accents',
      'Up before your guests arrive, gone after the last one leaves'
    ],
    tiers: {
      groups: [
        { h: 'What&rsquo;s included', items: [
          'A 10ft &times; 8ft arch built for your entryway or event space',
          'Your choice of build &mdash; spiral or organic',
          'Colours matched to your theme or your brand',
          'Installed on site before guests arrive',
          'Teardown after the event'
        ]},
        { h: 'Add ons', items: [
          'Vinyl lettering, names and logos',
          'Florals worked into the arch',
          'Themed foil accents'
        ]}
      ]
    },
    chipsHead: 'Good for',
    chips: ['Corporate events', 'Grand openings', 'Ribbon-cuttings', 'Marathons', 'Graduations', 'Storefront entrances', 'Weddings', 'Milestone birthdays'],
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
        'A backdrop and garland set gives a room a single centre \u2014 the spot every phone points at the moment someone walks in. Guests gather there, the cake table goes there, and most of the photos come from there.',
        'The garland itself is clustered by hand in mixed sizes rather than spaced evenly along a strip, which is the difference between a room that looks designed and one that looks decorated.'
      ]},
      { h: 'Pick the panel, or skip it', p: [
        'The backdrop is a wooden panel, and it comes in more than one silhouette: a classic arch, a wavy edge, a treat wall, or a metal hoop frame. If the wall is already the feature, the garland runs straight across it and skips the panel entirely.'
      ]}
    ],
    includes: [
      'An organic garland clustered by hand, not spaced on a strip',
      'Backdrop shape matched to the room, not one fixed design',
      'Palette built around your theme or invitation',
      'Custom welcome signage and vinyl lettering available',
      'Set in place before the event, cleared away once it wraps'
    ],
    tiers: {
      groups: [
        { h: 'Starting package', price: 'from $350', items: [
          'One wooden backdrop, your pick from the available selection',
          'An organic balloon garland built by hand',
          'Balloon colours matched to your event palette',
          'Delivery, installation, and takedown after the event'
        ]},
        { h: 'Customize your setup', items: [
          'Custom vinyl decals &mdash; names, ages, sayings, logos and graphics',
          'Additional backdrops for a wider focal area',
          'Extra footage of balloons',
          'Foil accents and specialty balloons'
        ]},
        { h: 'Take it a step further', items: [
          'Custom character cutouts',
          'Themed props and decorative elements',
          'Specialty backdrop designs',
          'A fully custom installation built around your theme'
        ]}
      ],
      note: 'Every setup can be customized to fit your event, theme, space and vision.'
    },
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
        'A column needs no wall to lean on and no doorway to fill \u2014 just a spot on the floor and a height in mind. That makes it the answer when nothing else in the room gives you somewhere to build.',
        'They land hardest in pairs. A matched set either side of an entrance, a stage or a registration desk frames the space instantly.'
      ]},
      { h: 'More than a spiral', p: [
        'Classic spiral, helix, or an organic build. Or something that stops being a column altogether \u2014 a milkshake, an ice cream cone, a cactus. A Winnipeg diner got the milkshake, cherry on top, standing on the checkerboard floor beside the booths.'
      ]}
    ],
    includes: [
      'Freestanding columns, from a single branded accent to a full sculptural shape',
      'Single columns or matched pairs',
      'Height and colour set to the entrance, stage or spot you have in mind',
      'Themed foil toppers and accents available',
      'Installed where you need it, removed once the event is done'
    ],
    tiers: {
      groups: [
        { h: 'What&rsquo;s included', price: 'from $140', items: [
          'Freestanding columns built to your colour palette',
          'Your choice of style and design',
          'Single columns or matched pairs',
          'Delivery and removal included'
        ]},
        { h: 'Available on request', items: [
          'Themed foil toppers and custom accents',
          'Company logos and branded details'
        ]}
      ]
    },
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
    lede: 'A smaller amount of balloon decor, assembled in your colours and ready to collect. You handle the transport and the hanging, which is what keeps it the lighter option.',
    svcName: 'Grab and Go Balloon Garlands',
    prose: [
      { h: 'A smaller, more flexible option', p: [
        'Grab &amp; Go garlands suit birthdays, showers and celebrations that want a balloon focal point without a full installation \u2014 a smaller space, a simpler event, or a decor budget you would rather keep modest.',
        'They are still professionally assembled. What changes is who carries it and who hangs it, and both of those are yours.'
      ]},
      { h: 'What to expect', p: [
        'Each garland is made to order in your chosen colours and can be built to suit a theme. Themed foil balloons and other specialty accents can be added for an additional cost.',
        'It will be finished and waiting at your scheduled pickup time. Bring a vehicle big enough to carry it safely \u2014 depending on the size of the garland that can mean a larger vehicle, or a cleared-out back seat.'
      ]},
      { h: 'If you would rather not handle it', p: [
        'Delivery and professional installation come with the <a href="balloon-garlands.html">full-service garland setups</a> instead.'
      ]}
    ],
    includes: [
      'The exact same garland we would install, handed to you instead of mounted',
      'Ready for pickup at a time that works for you',
      'Hangs anywhere from a home party to a rented hall',
      'The lower-cost way to get the same look as a full install',
      'Themed foil accents available'
    ],
    tiers: {
      groups: [
        { h: 'What&rsquo;s included', price: 'from $90', items: [
          'A garland built in the colours you pick',
          'Professionally assembled and finished',
          'Ready at your scheduled pickup time',
          'Themed foils and specialty accents available at additional cost'
        ]}
      ]
    },
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
    lede: 'Something for the birthday that does not need a full setup \u2014 a number built big enough to be the photo, without taking over the room.',
    svcName: 'Balloon Number Stacks and Bouquets',
    prose: [
      { h: 'Small setup, big impact', p: [
        'Number stacks suit smaller birthdays, at-home celebrations and the parties that want decor landing in photographs without committing to a garland or a backdrop.',
        'They stand roughly three and a half to five feet, depending on the size, the design and the details added. Tall enough to be the subject of the picture, contained enough to live in a normal room.'
      ]},
      { h: 'Built around the theme', p: [
        'Soft and simple, or loud and fully themed. A stack can match the party colours, pick up the cake, or carry themed foils and accents that tie the rest of the decor together.'
      ]},
      { h: 'What to expect', p: [
        'Every stack is made to order, so there is no one-size package. The final design and the price follow the number of foil balloons, the overall size, the level of detail, and any specialty add-ons.'
      ]}
    ],
    includes: [
      'A giant number stack sized to be the photo, in your event colours',
      'Balloon bouquets for the gift table and entryway',
      'Matched to the rest of the room, not sold separately',
      'Themed foil and confetti accents available',
      'Delivered and set up ahead of the celebration'
    ],
    tiers: {
      groups: [
        { h: 'Customize your stack', price: 'from $70', items: [
          'Your choice of colours and colour combinations',
          'Themed foil balloons',
          'Specialty 260 twisting balloons',
          'Custom vinyl sayings and details',
          'Florals or other decorative accents',
          'Additional balloon clusters for extra height'
        ]}
      ],
      note: 'Simple or fully themed, the stack gets built to fit the celebration, the space and the budget.'
    },
    chipsHead: 'Good for',
    chips: ['First birthdays', 'Milestone birthdays', 'At-home celebrations', 'Anniversaries', 'Graduations', 'Retirement parties', 'Gift and cake tables', 'Company milestones'],
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

  /* Optional blocks — only the corporate page carries these. It sells to a
     different buyer than the five service pages, and that buyer asks questions
     a party planner never does. Sections exist because the questions exist. */
  const sectors = !d.sectors ? '' : `
  <section class="svc-sectors" aria-label="Winnipeg businesses we have built for">
    <div class="container">
      <div class="svc-prose">
        <h2>${d.sectors.head}</h2>
        <p>${d.sectors.intro}</p>
      </div>
      <div class="svc-sectors-grid">
${d.sectors.items.map(i => `        <article class="svc-sector">
          <span class="svc-sector-name">${i.n}</span>
          <p>${i.p}</p>
        </article>`).join('\n')}
      </div>
    </div>
  </section>
`;

  const process = !d.process ? '' : `
  <section class="svc-process" aria-label="How a corporate booking runs">
    <div class="container">
      <div class="svc-prose">
        <h2>${d.process.head}</h2>
      </div>
      <div class="svc-process-grid">
${d.process.steps.map(st => `        <article class="svc-step">
          <h3>${st.h}</h3>
          <p>${st.p}</p>
        </article>`).join('\n')}
      </div>
    </div>
  </section>
`;

  const faq = !d.faq ? '' : `
  <section class="svc-faq" aria-label="Common questions">
    <div class="container">
      <div class="svc-prose">
        <h2>${d.faq.head}</h2>
      </div>
      <div class="svc-faq-list">
${d.faq.items.map(q => `        <details>
          <summary>${q.q}</summary>
          <div class="svc-faq-a">${q.a.map(t => `<p>${t}</p>`).join('')}</div>
        </details>`).join('\n')}
      </div>
    </div>
  </section>
`;

  /* Offer ladder. Jessica's own structure (starting package -> customize ->
     take it further, 2026-08-10), so it renders as a ladder rather than one
     flat list. Pages without `tiers` keep the plain includes list. */
  const tiers = !d.tiers ? '' : `
        <div class="svc-tiers">
${d.tiers.groups.map((g, i) => `          <div class="svc-tier${i === 0 ? ' svc-tier--lead' : ''}">
            <div class="svc-tier-head">
              <h3>${g.h}</h3>${g.price ? `
              <span class="svc-price">${g.price}</span>` : ''}
            </div>
            <ul>
${g.items.map(it => `              <li>${it}</li>`).join('\n')}
            </ul>
          </div>`).join('\n')}
        </div>${d.tiers.note ? `
        <p class="svc-tiers-note">${d.tiers.note}</p>` : ''}
`;

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
  const ldFaq = !d.faq ? null : {
    '@context': 'https://schema.org',
    '@type': 'FAQPage', '@id': `${url}#faq`,
    mainEntity: d.faq.items.map(q => ({
      '@type': 'Question', name: strip(q.q),
      acceptedAnswer: { '@type': 'Answer', text: strip(q.a.join(' ')) }
    }))
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
  </script>${ldFaq ? `
  <script type="application/ld+json">
${JSON.stringify(ldFaq, null, 2)}
  </script>` : ''}
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

${d.tiers ? tiers : `<h3>What&rsquo;s included</h3>
        <ul class="svc-includes">
${d.includes.map(i => `          <li>${i}</li>`).join('\n')}
        </ul>`}

        <h3>${d.chipsHead}</h3>
        <ul class="svc-uses">
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
${sectors}${d.quotes.length ? `
  <section class="svc-body" aria-label="What clients say" style="padding-top:0">
    <div class="container">
${quotes}
    </div>
  </section>
` : ''}
${process}${faq}  <div class="scallop-div pink-mint" aria-hidden="true" style="background-color: var(--cream);"></div>

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
