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
  head: {
    eyebrow: "Inquiry & Booking",
    title: "Tell us about your event",
    intro: "Share the details and a few inspiration photos — the more you tell us, the better we can match your vibe. We reply within 24 hours."
  },
  groups: [
    { legend: "Your details", fields: [
      { id: "name", type: "text", label: "Name", required: true, autocomplete: "name" },
      { id: "email", type: "email", label: "Email", placeholder: "you@example.com" },
      { id: "phone", type: "phone", label: "Phone number", required: true, placeholder: "(204) 000-0000" },
      { id: "contact_method", type: "radio", label: "Preferred contact method", options: ["Email", "Text message"] },
      { id: "referral", type: "select", label: "How did you hear about us?", options: ["Instagram", "Facebook", "Word of mouth / referral", "Saw balloons at an event", "Local business / community group", "Other"] }
    ]},
    { legend: "Your event", fields: [
      { id: "category", type: "select", label: "Event type", options: ["Bridal shower", "Engagement party", "Birthday", "Baby shower", "Gender reveal", "Grand opening", "Corporate event", "Graduation", "Other"] },
      { id: "date", type: "date", label: "Event date", required: true, notPast: true },
      { id: "start", type: "time", label: "Start time", required: true },
      { id: "end", type: "time", label: "End time", required: true, after: "start" },
      { id: "setup", type: "number", label: "How many hours for set up prior to event", required: true, placeholder: "e.g. 2" },
      { id: "address", type: "text", label: "Event address", required: true, autocomplete: "street-address" },
      { id: "setup_location", type: "select", label: "Setup location", options: ["Private residence — indoors", "Private residence — outdoors", "Indoor event space", "Outdoor event space"] },
      { id: "theme", type: "text", label: "Theme / colour scheme", placeholder: "e.g. sage green & cream" },
      { id: "services", type: "checkbox", label: "Services you're looking for", options: ["Single arch backdrop with balloon garland (Starting at $350)", "Multiple backdrops with balloon garlands", "Custom welcome sign & easel rental (from $90)", "Circle / hoop backdrop with balloon garland", "Grab & go balloon garland (from $90, pickup)", "Balloon number stack / bouquet (from $60)", "Balloon columns (from $140)", "Other"] },
      { id: "addons", type: "checkbox", label: "Additional add-ons", hint: "Add-ons pair with a setup — select a service above first.", requiresAnyOf: "services", options: ["Custom vinyl decal writing / logos", "Floral additions to balloon garland", "Character cut-out rentals", "Themed foil balloons"] },
      { id: "budget", type: "select", label: "Budget range", required: true, options: ["$355–$500", "$500–$650", "$650–$800", "$800–$1000", "$1000+", "Other"] },
      { id: "notes", type: "textarea", label: "Anything else we should know?", placeholder: "Venue quirks, must-have colours, timing constraints…" },
      { id: "photos", type: "file", label: "Inspiration photos" }
    ]}
  ]
};
