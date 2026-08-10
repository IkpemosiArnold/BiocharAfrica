# Data still needed from Biochar Solutions Africa

This list lives here, in a document that is never bundled into the site, rather
than inside the app. An earlier version rendered it on /impact behind a
`NODE_ENV === "development"` check. That kept it out of the prerendered HTML but
NOT out of the JavaScript bundle, where anyone could read it in devtools. For a
site being sent to management for review, that is not good enough.

## Numbers the impact page should carry

A serious buyer, a carbon auditor and an awards jury will all look for these.
None of them are invented anywhere on the site.

- Tonnes of CO2e sequestered to date
- Hectares under biochar application
- Number of farmers supplied or trained
- Measured yield delta from your own trial plots (vs. untreated control)
- Tonnes of biochar produced per year

## What the site claims today, and on whose authority

| Claim | Status |
|---|---|
| Carbon persists on a century-to-millennium scale | Settled property of biochar |
| Holds water in the pore network | Settled property of biochar |
| Buffers acidity in acidic soils | Settled property of biochar |
| "Up to 25% more yield" | Attributed in the copy as the company's own field observation, explicitly NOT as a controlled trial result |
| Bida / Jima / Suntale coordinates, 03.08.2026 | Verifiable, read from GPS stamps burned into your own field photographs |

## Also outstanding

- Team names, roles and portraits (there is no team section yet)
- Customer or partner testimonials
- Independent trial data to replace the self-reported yield figure
- A mail provider for the contact form: set `CONTACT_TO` and add the provider
  call in `app/api/contact/route.ts`. Until then the form returns 503 and falls
  back to a prefilled mailto rather than silently swallowing enquiries.
