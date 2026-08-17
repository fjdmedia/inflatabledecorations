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
    lede: 'Make your next company event feel like an event worth celebrating. From a grand opening to a staff appreciation day, corporate holiday party or milestone celebration, balloon decor can transform your space while keeping your company&rsquo;s branding front and centre.',
    svcName: 'Corporate Balloon Decor',
    prose: [
      { h: 'Designed Around Your Brand', p: [
        'Our corporate decor is designed around your company colours, logo and event goals, with options ranging from statement-making installations to smaller pieces that add a polished touch throughout your space.'
      ]},
      { h: 'Make an Entrance', p: [
        'Create a memorable first impression with a walk-through balloon arch at your entrance, designed in your company colours and customized to suit your event. Add your logo, branded details or other elements to make the installation feel like it belongs to your business.',
        'For grand openings, launches and milestone events, balloon columns are another great way to frame an entrance, highlight a space or draw attention to your business.'
      ]},
      { h: 'Bring the Brand to the Details', p: [
        'Corporate balloon decor doesn&rsquo;t have to stop at one large installation. Tabletop balloon arrangements can add branded colour and personality to registration tables, food stations, employee tables or throughout a larger event space.',
        'From subtle and professional to fun and bold, your decor can be designed to fit the atmosphere you&rsquo;re creating while still incorporating your company branding.'
      ]},
      { h: 'Your Brand, Your Event, Your Look', p: [
        'Every corporate event is different, so your decor is made to order around what you&rsquo;re celebrating and how you want your space to feel. Share your company colours, logo and vision with us, and we&rsquo;ll help turn it into balloon decor that gets noticed.',
        'From the moment guests walk through the door to the details around the room, balloon decor is a fun and memorable way to make your next company event stand out.'
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
        { h: 'Build a Package That Fits Your Event', items: [
          'A walk-through balloon arch paired with branded columns',
          'Tabletop balloon decor throughout the space',
          'A backdrop and custom details for a complete branded experience'
        ]}
      ],
      note: 'Whether you&rsquo;re looking for one statement installation or a little bit of everything, we&rsquo;ll help create a package that fits your space, event and budget.'
    },
    chipsHead: 'Perfect for All Kinds of Company Events',
    chips: ['Staff appreciation days', 'Grand openings and new business launches', 'Company anniversaries and milestones', 'Corporate holiday parties', 'Employee celebrations', 'Fundraisers and community events', 'Office parties and special events', 'Conferences, launches and promotional events'],
    chipsIntro: 'Corporate balloon decor is a great way to celebrate and bring your team together for:',
    photoDir: 'Assets/Gallery/Corporate',
    photos: [
      { f: 'IMG_3485.jpg', a: 'Matched balloon columns flanking a sponsor backdrop at a Special Olympics Manitoba Summer Games event in Winnipeg', tall: true },
      { f: 'IMG_1377.jpg', a: 'Blue and silver balloon garland on a corporate holiday party backdrop in Winnipeg' },
      { f: 'IMG_2606.jpg', a: 'Branded balloon arch with printed foil balloons at a Winnipeg car dealership charity event' },
      { f: 'IMG_3180.jpg', a: 'Matched balloon columns with printed anniversary balloons at a Winnipeg fundraiser' },
      { f: 'IMG_2591.jpg', a: 'Black and white balloon column at the entrance of a Winnipeg retail store' }
    ],
    heroPhoto: { d: 'Assets/Gallery/Corporate', f: 'IMG_3383.jpg', a: 'Corporate anniversary balloon arch with printed logo balloons in a Winnipeg office reception' },
    sectors: {
      head: 'Where these installs have gone',
      intro: 'A lobby is not a dining room, and neither is a school gym. Different rooms, different asks.',
      items: [
        { n: 'Offices &amp; professional services', p: 'Milestone anniversaries, reception installs and holiday parties.' },
        { n: 'Nonprofits &amp; fundraisers', p: 'Sponsor backdrops and matched columns for charity events and provincial games.' },
        { n: 'Retail &amp; storefronts', p: 'Branded columns at the door, in the shop&rsquo;s own colours.' },
        { n: 'Restaurants &amp; hospitality', p: 'A milkshake the height of a person, cherry on top, on a diner&rsquo;s checkerboard floor.' },
        { n: 'Salons &amp; studios', p: 'A column by the front desk, topped with a printed logo balloon.' },
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
      { p: 'Jess killed it with the set up and take down. So effortless and easy to host when your vendors are 12/10. Everything was all set up for the time of our event and Jess came back after to take it all down so we did not have to lift a finger. She&rsquo;s your decor expert!', c: 'Celeste Petrick', s: 'Google review' },
      { p: 'Our company hired Jessica to do the balloons for Employee Appreciation Day and she absolutely killed it! Jessica&rsquo;s communication and dedication was truly appreciated. She did great work and gave us exactly what we wanted and more. Highly recommend using Inflatable Decorations by Jessica for all your balloon needs, you won&rsquo;t regret it!', c: 'Sarah Bauer', s: 'Google review' },
      { p: 'Our Pink Ribbon Ladies Golf Classic For Hope - Golf Tournament hired Inflatable Decorations to help make our 30th year milestone extra special. Jessica&rsquo;s balloon design left everyone in awe of our banquet&rsquo;s decor and not to mention the personalized logos was a nice touch. Highly recommend using Inflatable Decorations for all your events!', c: 'Madison Rosas-Abrenica', s: 'Google review' },
    ],
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
    lede: 'A full walk through arch turns a doorway into the first photo of the day. Built to your colours, installed on site, and sized for the space it is going in.',
    svcName: 'Walk-Through Balloon Arches',
    prose: [
      { h: 'Make a Grand Entrance', p: [
        'Walk through balloon arches are the perfect way to make a grand first impression the moment your guests arrive. They create an eye catching entrance that instantly sets the tone for your event, while adding colour, excitement, and a memorable photo opportunity.'
      ]},
      { h: 'Perfect for Corporate Events', p: [
        'Walk through balloon arches are a great way to make grand openings, corporate parties, and special business events feel extra memorable. They can be customized using your company&rsquo;s colours, branding, and even custom vinyl logos or messaging, creating a polished and eye catching display that puts your business front and centre.'
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
      { p: 'I had the pleasure of working with this service to decorate for a baby shower! They provide quick communication while we planned and picked the colours for the arch, very professional service and they executed the vision we had perfectly! Would recommend this service to anyone in need for decorations!', c: 'paige kibsey', s: 'Google review' },
      { p: 'I booked Jessica for my baby shower and she created an incredible balloon arch with custom decals for us! We received many compliments! I would highly recommend her services and I would definitely book her again for future events.', c: 'Alyssa', s: 'Google review' },
    ],
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
    lede: 'The setup most people picture when they think of balloon decor &mdash; an organic balloon garland alongside a backdrop, colour matched to your theme, built as the focal point of the room.',

    svcName: 'Balloon Backdrops and Garlands',
    prose: [
      { h: 'Why Backdrops &amp; Balloon Decor Make a Difference', p: [
        'Backdrops and balloon decor can completely transform a space and become the main focal point of your event. They give the room a finished, intentional look while creating a designated area that naturally draws guests in.',
        'Whether it&rsquo;s a birthday, baby shower, bridal shower, corporate event, or celebration, a well designed backdrop paired with balloons creates the perfect photo moment. It&rsquo;s where guests gather to take pictures, celebrate, and capture memories throughout the event.'
      ]},
      { h: 'Your Colour Scheme &amp; Shape', p: [
        'Our wooden backdrops come in different silhouettes &mdash; classic arched panels, wavy panel, treat wall panel, and our metal hoop frame, or a garland running straight across a wall with no backdrop. Paired with colours that complement your theme, venue, or personal style that bring your vision to life.'
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
        { h: 'Starting Package Includes', price: 'Starting at $350', items: [
          'One wooden backdrop of your choice from our available selection',
          'Organic balloon garland',
          'Balloon colours customized to your event&rsquo;s colour scheme',
          'Delivery to your event location, installation, and takedown after your event'
        ]},
        { h: 'Customize Your Setup', items: [
          'Custom vinyl decals, names, ages, sayings, logos &amp; graphics',
          'Additional backdrops to create a larger focal area',
          'Additional footage of balloons',
          'Foil accents &amp; specialty balloons'
        ]},
        { h: 'Take It a Step Further', items: [
          'Custom character cutouts',
          'Themed props and decorative elements',
          'Specialty backdrop designs',
          'Fully custom installations designed around your theme'
        ]}
      ],
      note: 'Every setup can be customized to fit your event, theme, space, and vision.'
    },
    chipsHead: 'Good for',
    chips: ['Baby showers', 'Bridal showers', 'Birthdays', 'Gender reveals', 'Weddings', 'Graduations', 'Corporate events', 'Photo backdrops'],
    photoDir: 'Assets/Gallery/Backdrop and Balloon Garland setup',
    photos: [
      { f: 'Cover.jpg', a: 'Balloon backdrop with organic garland at a Winnipeg celebration', tall: true },
      { f: 'Favorite.jpg', a: 'Pastel balloon garland and backdrop install in Winnipeg' },
      { f: 'IMG_5117.jpg', a: 'Balloon garland on a wavy-edge backdrop panel at an outdoor Winnipeg party' },
      { f: 'IMG_5149.jpg', a: 'Sage and cream balloon garland with two arched backdrop panels, Winnipeg' },
      { f: 'e1fae4bd-9f50-4d12-823b-21afb1c054d2.jpg', a: 'Pastel butterfly-themed balloon garland and backdrop with a custom sign, Winnipeg' }
    ],
    heroPhoto: { d: 'Assets/Gallery/Backdrop and Balloon Garland setup', f: 'IMG_3963.jpg', a: 'Balloon backdrop with a custom organic garland by Inflatable Decorations, Winnipeg' },
    quotes: [
      { p: 'We had the best experience from the quote to design to the day of set up. Our Baby Girl Shower had the extra wow we needed for making the room look better and for the best photo opportunities.', c: 'Kerri Hiebert', s: 'Google review' },
      { p: 'Jessica at Inflatable Decorations was excellent to work with. She did a balloon back drop for our high school safe grad and it was beautiful. Jessica was quick to respond to all communication, listened to what we wanted and came up with a beautiful design. She did all the set up and take down so it was extremely convenient and stress free for us. I would definitely use her again and would recommend her to anyone looking for balloon decorations.', c: 'Chloe Lawrence', s: 'Google review' },
    ],
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
    lede: 'Freestanding balloon columns that frame entrances, flank stages, highlight storefronts, or mark a photo area &mdash; completely customized to your colours, theme, and event.',
    svcName: 'Balloon Columns',
    prose: [
      { h: 'Structure Where You Need It', p: [
        'Balloon columns add height and structure without needing a wall or backdrop. They&rsquo;re perfect for open spaces, entrances, stages, storefronts, registration areas, and photo spots where you want your decor to make an impact.',
        'Columns are especially striking in pairs. Placing a matched set on either side of an entrance, stage, or focal point creates an instant frame and gives the space a polished, intentional look.'
      ]},
      { h: 'More Than Just a Spiral', p: [
        'Your balloon columns can be designed in a variety of styles to suit the look you&rsquo;re going for. Choose from classic spiral columns, helix spirals, organic style columns, or take things in a completely different direction with fun custom shapes such as milkshakes, ice cream cones, cacti, and more.',
        'For corporate events, columns can be customized with company colours, branded details and business logos for a polished and professional look. For birthdays, grand openings, themed parties, and celebrations, they can be made colourful, playful, and completely customized to your theme.'
      ]},
      { h: 'Sized &amp; Coloured for Your Event', p: [
        'Every column is made to order, so the height, colours, style, and accents can be customized to fit your event. Whether you need something sleek and branded or bold and playful, your columns are designed specifically for your space.'
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
        { h: 'What&rsquo;s Included', price: 'Starting at $140', items: [
          'Freestanding balloon columns customized to your colour palette',
          'Choice of column style and design',
          'Single columns or matched pairs',
          'Themed foil toppers and custom accents available',
          'Company logos and branded details available',
          'Delivery and removal included'
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
      { p: 'Jess killed it with the set up and take down. So effortless and easy to host when your vendors are 12/10. Everything was all set up for the time of our event and Jess came back after to take it all down so we did not have to lift a finger. She&rsquo;s your decor expert!', c: 'Celeste Petrick', s: 'Google review' }
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
    lede: 'Looking for a smaller amount of balloon decor or working with a tighter budget? Grab &amp; Go balloon garlands are a great option for smaller celebrations where a full delivery and installation may not be necessary.',
    svcName: 'Grab and Go Balloon Garlands',
    prose: [
      { h: 'Assembled and Ready for Pickup', p: [
        'Your garland is fully assembled in your chosen colours and ready for pickup, allowing you to handle the transportation and setup yourself. It&rsquo;s a good fit for smaller spaces, simpler celebrations, or events where you have limited setup time and are comfortable installing the garland yourself.'
      ]},
      { h: 'A Smaller, More Flexible Option', p: [
        'Grab &amp; Go garlands are ideal for birthdays, showers and other celebrations where you want a balloon focal point without a full balloon installation.',
        'They can work especially well in smaller spaces or for those looking to keep their decor budget more modest. Keep in mind that Grab &amp; Go garlands are still professionally assembled, but you&rsquo;ll be responsible for transporting and hanging the garland once you pick it up.'
      ]},
      { h: 'What to Expect', p: [
        'Each garland is made to order in your chosen colours and can be customized to suit your theme. Themed foil balloons and other specialty accents can be added for an additional cost.',
        'Your finished garland will be fully assembled and ready for pickup at your scheduled pickup time.',
        'Please make sure you have a vehicle large enough to safely transport your finished garland. Depending on the size of your garland, it may require a larger vehicle or additional space for transportation.',
        'If you&rsquo;d prefer to have everything taken care of for you, delivery and professional installation are also available with our <a href="balloon-garlands.html">full service balloon garland setups</a>.'
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
        { h: 'What&rsquo;s Included', price: 'Starting at $90', items: [
          'A garland made to order in your chosen colours',
          'Customized to suit your theme',
          'Fully assembled and ready at your scheduled pickup time',
          'Themed foil balloons and specialty accents available for an additional cost'
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
    lede: 'Want to add a little something special to a birthday without going all out with a full balloon setup? Balloon number stacks are the perfect way to add colour, personality and a wow factor without taking over the whole room.',
    svcName: 'Balloon Number Stacks and Bouquets',
    prose: [
      { h: 'Customized to Any Theme', p: [
        'Whether you&rsquo;re celebrating a first birthday, 30th, 50th or anything in between, number stacks can be completely customized to match any theme, colour palette or celebration. Choose from simple and classic designs or add themed foils, specialty balloons, florals, confetti and other details to make it uniquely yours.'
      ]},
      { h: 'Small Setup, Big Impact', p: [
        'Number stacks are especially popular for smaller birthdays, at home celebrations and intimate parties where you want some eye catching decor without needing a full balloon garland or backdrop.',
        'They typically stand approximately 3.5&ndash;5 feet tall, depending on the size, design and details added. They&rsquo;re large enough to make an impact in photos and give your celebration that extra special touch, while still being a manageable size for smaller spaces.'
      ]},
      { h: 'Made to Match Your Theme', p: [
        'From soft and simple to fun and colourful, your number stack can be designed around virtually any theme. Match your party colours, coordinate with your cake and decorations, or add custom themed balloons and accents to really bring the design together.'
      ]},
      { h: 'What to Expect', p: [
        'Because every number stack is made to order, there isn&rsquo;t a one size fits all package. Pricing and final design will depend on the number of foil balloons, overall size, level of detail and any specialty add ons you&rsquo;d like included.'
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
        { h: 'Your stack can be customized with options such as', price: 'Starting at $70', items: [
          'Your choice of colours and colour combinations',
          'Themed foil balloons',
          'Specialty 260 twisting balloons',
          'Custom vinyl sayings &amp; details',
          'Florals or other decorative accents',
          'Additional balloon clusters and details for extra height'
        ]}
      ],
      note: 'Whether you&rsquo;re looking for something simple or a more detailed themed design, we&rsquo;ll create a number stack that fits your celebration, your space and your budget.'
    },
    chipsHead: 'Good for',
    chips: ['First birthdays', 'Milestone birthdays', 'At-home celebrations', 'Anniversaries', 'Graduations', 'Retirement parties', 'Gift and cake tables', 'Company milestones'],
    photoDir: 'Assets/Gallery/Ballon Bouquets-Number Stacks',
    photos: [
      { f: 'Main2.jpg', a: 'Giant balloon number stack for a Winnipeg birthday celebration', tall: true },
      { f: 'Cover.jpg', a: 'Balloon number stack in custom colours, Winnipeg' },
      { f: 'IMG_5066.jpg', a: 'Golf-themed balloon number stack for a 30th birthday in Winnipeg' },
      { f: 'IMG_4655.jpg', a: 'Purple balloon number stack with custom printed name balloons, Winnipeg' },
      { f: 'IMG_4789.jpg', a: 'Sage green balloon number stack with floral accents, Winnipeg' }
    ],
    heroPhoto: { d: 'Assets/Gallery/Ballon Bouquets-Number Stacks', f: 'Cover.jpg', a: 'Giant balloon number stack built by Inflatable Decorations in Winnipeg' },
    quotes: [
      { p: 'We had an amazing experience using Inflatable Decorations for my son&rsquo;s first birthday party. We live 20 minutes outside of Winnipeg and a few other businesses I tried first, refused to set up outside the city, then I luckily came across Jessica on Instagram and she had no problem coming to set up at our house.', c: 'M McLeod', s: 'Google review' }
    ]
  }
];

/* 800px derivative for phones - the full-size files are 1350px wide and were
   being downloaded whole to render at ~342px on a 390px screen (3.3MB on the
   corporate page alone). Generated by scratchpad/mobile-derivatives.py. */
const w800 = f => f.slice(0, f.lastIndexOf('.')) + '-800.jpg';
const enc = p => p.split('/').map(encodeURIComponent).join('/');
const strip = s => s.replace(/&[a-z]+;/g, m => ({ '&amp;': '&', '&middot;': '·', '&rsquo;': '’', '&mdash;': '—' }[m] ?? m));

function page(d) {
  const url = `${ORIGIN}/${d.slug}.html`;
  const sibs = PAGES.filter(p => p.slug !== d.slug);
  const cls = ['svc-page', d.acc].filter(Boolean).join(' ');

  const shots = d.photos.map(ph =>
    `        <figure class="svc-shot${ph.tall ? ' svc-shot--tall' : ''}">
          <img loading="lazy" width="800" height="1000"
               src="${enc(ph.d || d.photoDir)}/${enc(ph.f)}"
               srcset="${enc(ph.d || d.photoDir)}/${enc(w800(ph.f))} 800w, ${enc(ph.d || d.photoDir)}/${enc(ph.f)} 1350w"
               sizes="(max-width: 560px) 92vw, (max-width: 900px) 46vw, 420px"
               alt="${ph.a}" />
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
        <img width="900" height="990" fetchpriority="high"
             src="${enc(d.heroPhoto.d)}/${enc(d.heroPhoto.f)}"
             srcset="${enc(d.heroPhoto.d)}/${enc(w800(d.heroPhoto.f))} 800w, ${enc(d.heroPhoto.d)}/${enc(d.heroPhoto.f)} 1350w"
             sizes="(max-width: 900px) 92vw, 480px"
             alt="${d.heroPhoto.a}" />
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

        <h3>${d.chipsHead}</h3>${d.chipsIntro ? `
        <p>${d.chipsIntro}</p>` : ''}
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

/* Structural self-check. Editing this file with a non-greedy regex over
   `key: [ ... ]` silently swallows sibling keys, because `chips` is a ONE-LINE
   array while the others are multi-line - the over-match ate `photoDir` and
   `photos` twice on 2026-08-11 and surfaced three steps later as an opaque
   "Cannot read properties of undefined". Fail here instead, naming the page
   and the key. Edit this file with bracket-balancing, not regex. */
const REQUIRED_KEYS = ['slug','title','desc','h1','lede','svcName','prose',
                       'includes','chips','photoDir','photos','heroPhoto','quotes'];
for (const d of PAGES) {
  const missing = REQUIRED_KEYS.filter(k => d[k] === undefined);
  if (missing.length) {
    console.error(`FATAL: page "${d.slug ?? '(unknown)'}" is missing: ${missing.join(', ')}`);
    console.error('  A key was probably clobbered by an over-greedy edit. Check git diff.');
    process.exit(1);
  }
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
