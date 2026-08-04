# Build scripts

Both are run from the **site root**, not from this folder.

## `gen-service-pages.mjs`
Generates the six service pages from one shared template:
`corporate-events` · `balloon-arches` · `balloon-garlands` · `balloon-columns` ·
`grab-and-go-garlands` · `balloon-number-stacks`.

    node Tools/gen-service-pages.mjs

Edit the copy/photos in the `PAGES` array at the top — never hand-edit the
generated `.html` files, they get overwritten. The script asserts every title is
50–60 rendered chars and every meta description 140–160, and prints a per-page
pass/fail table.

Structure is shared on purpose: nav, footer and section order stay locked across
all six pages so they cannot drift apart.

## `gen-sitemap.mjs`
Rebuilds `sitemap.xml`.

    node Tools/gen-sitemap.mjs 2026-08-04

Takes the date as an argument so runs are reproducible. Homepage images are read
from the inline `IMAGES` array in `index.html`, and service-page images from each
page's own `<img>` tags — so the sitemap can never drift from what the pages
actually render.

**Re-run this after adding gallery tiles or changing service-page photos.**
