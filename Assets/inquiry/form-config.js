/* Inflatable Decorations — inquiry form config.
   endpoint = the Apps Script /exec URL (set after backend deploy). */
window.FJ_FORM_CONFIG = {
  clientId: "inflatable-decorations",
  endpoint: "https://script.google.com/macros/s/AKfycbwIgtrzNwVmjNlKZudijALNxSHJkqzzR623f9FCu_nRdZrh9Z5soQTNuTHSDEstdf0C/exec",
  successRedirect: "thank-you.html",
  brand: {
    "--fj-paper": "#FFFFFF",
    "--fj-paper-2": "#FFF1E0",
    "--fj-ink": "#2D1B3D",
    "--fj-muted": "#7A6E86",
    "--fj-accent": "#FF5FA2",
    "--fj-on-accent": "#FFFFFF",
    "--fj-rule": "#FFE0EC",
    "--fj-rule-2": "#FFC2D6",
    "--fj-success": "#3F9D6E",
    "--fj-font-display": '"Caprasimo", "Fraunces", Georgia, serif',
    "--fj-font-body": '"DM Sans", system-ui, sans-serif'
  },
    // Rendered as STATIC HTML in inquiry.html instead of injected here, so the page
  // has a real h1 and real copy without JavaScript. Blank on purpose — leaving a
  // title here would emit a second h1 at runtime.
  head: { eyebrow: "", title: "", intro: "" },
  groups: [
    { legend: "Your details", fields: [
      { id: "name", type: "text", label: "Name", required: true, autocomplete: "name" },
      { id: "email", type: "email", label: "Email", placeholder: "you@example.com" },
      { id: "phone", type: "phone", label: "Phone number", required: true, placeholder: "(204) 000-0000" },
      { id: "contact_method", type: "radio", label: "Preferred contact method", options: ["Email", "Text message"] },
      { id: "referral", type: "select", label: "How did you hear about us?", options: ["Instagram", "Facebook", "Google search", "Website", "Word of mouth / referral", "Saw balloons at an event", "Local business / community group", "Other"] }
    ]},
    { legend: "Your event", fields: [
      /* Order is deliberate (2026-08-04): corporate intents lead. She pivoted to
         corporate 2026-07-31 and these were buried 6th/7th of 9, behind gender
         reveal. Personal events stay fully visible below — they're still most of
         her volume and keep review velocity up between corporate jobs. */
      { id: "category", type: "select", label: "Event type", options: ["Corporate event", "Grand opening", "Birthday", "Bridal shower", "Baby shower", "Engagement party", "Gender reveal", "Graduation", "Other"] },
      { id: "date", type: "date", label: "Event date", required: true, notPast: true },
      { id: "start", type: "time", label: "Start time", required: true },
      { id: "end", type: "time", label: "End time", required: true, after: "start" },
      { id: "setup", type: "number", label: "How many hours for set up prior to event", required: true, placeholder: "e.g. 2" },
      { id: "address", type: "text", label: "Event address", required: true, autocomplete: "street-address" },
      { id: "setup_location", type: "select", label: "Setup location", options: ["Private residence — indoors", "Private residence — outdoors", "Indoor event space", "Outdoor event space"] },
      { id: "theme", type: "text", label: "Theme / colour scheme", placeholder: "e.g. sage green & cream" },
      { id: "services", type: "checkbox", label: "Services you're looking for", options: ["Single arch backdrop with balloon garland (Starting at $350)", "Multiple backdrops with balloon garlands", "Custom welcome sign & easel rental (from $90)", "Circle / hoop backdrop with balloon garland", "Walkthrough balloon arch", "Grab & go balloon garland (from $90, pickup)", "Balloon number stack / bouquet (from $70)", "Balloon columns (from $140)", "Other"] },
      { id: "addons", type: "checkbox", label: "Additional add-ons", hint: "Add-ons pair with a setup — select a service above first.", requiresAnyOf: "services", options: ["Custom vinyl decal writing / logos", "Floral additions to balloon garland", "Character cut-out rentals", "Themed foil balloons"] },
      /* The old top band was "$1000+" — it anchored her as a sub-$1k shop and dumped
         every corporate lead into the same bucket as a $400 birthday. Split into three
         (2026-08-04). First four labels left VERBATIM so historical submissions stay
         comparable; only the old top band was replaced. */
      { id: "budget", type: "select", label: "Budget range", required: true, options: ["$355–$500", "$500–$650", "$650–$800", "$800–$1000", "$1000–$2000", "$2000–$5000", "$5000+", "Other"] },
      { id: "notes", type: "textarea", label: "Anything else we should know?", placeholder: "Venue quirks, must-have colours, timing constraints…" },
      { id: "photos", type: "file", label: "Inspiration photos" }
    ]}
  ]
};
