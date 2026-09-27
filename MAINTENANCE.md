# Maintenance notes

Things on this site that look removable but are not.

## Do not remove the Search Console verification meta tag

`<meta name="google-site-verification">` in `index.html`. Deleting it un-verifies the
property, and all Search Console history for the domain goes with it.

## Do not add `aggregateRating` or `Review` structured data

It is absent deliberately. Google's review-snippet guidelines state that when the
entity being reviewed controls the reviews about itself, pages using `LocalBusiness`
or any `Organization` type are **ineligible** for the star review feature — and
separately, that you must not aggregate ratings from other websites. These reviews come
from her Google listing, so the markup earns no stars and breaks two guidelines at once.

Her stars already show in the map pack, served natively from the Google Business
Profile, with no markup at all.

## Keep the two contact links stacked, not inline

In the contact section, the email and text links are stacked deliberately. Inline with
a separator, the second link lands around x=343 at a 390px viewport, and the fixed
`.scroll-top` button sits at x=332 with `z-index: 90` — it covers the link. Every
measured layout check still passed, because nothing was overflowing; the element was
simply on top. `document.elementFromPoint()` at the link's own centre returned the
button, not the link.

If you ever put them back on one line, verify with `elementFromPoint` at 390px, not by
looking at a screenshot.

## The nav is identical across all pages

Same markup, same order, same labels, on every page. If you add or rename a nav item,
do it on all of them in the same change — a nav that differs page to page is the
fastest way to make a small site feel broken.

## Reviews are quoted verbatim

Every quote and name on this site is a real Google review, copied character for
character. Before changing one, diff it against the live Google listing, and match each
name to **its own** review — confirming that the right *number* of quotes are present
is not the same check.
