# Workshops route handoff

The `/workshops` redesign follows the existing Home implementation: Persian RTL,
Vazirmatn, the shared navy/orange/blue palette, bold headings,
light catalog surfaces, rounded controls, and existing illustrations. The visual
references remain `Home/components/HeroSection.tsx`, `ProgramsSection.tsx`,
`PathwaysSection.tsx`, `src/index.css`, and the shared Header and Footer.

## API data

The catalog uses the presentations API in development and production.
`workshops.adapter.ts` converts API records to the catalog view and formats dates
and times for `Asia/Tehran`. Cards link to program details and use the
authenticated cart actions.

## Image replacement

Cards show API artwork when supplied. Without artwork, a compact format icon
replaces the former repeated illustration panels, keeping subjects and presenters
prominent. The adapter retains its fallback image for other consumers.
Alternative text describes the presentation associated with actual artwork.

## Catalog refinement

The opening uses a conversational invitation and the existing home-page penguin.
The three-column catalog stays familiar, with a warm orange tint for workshops,
presenters directly below titles, translated level tags, and compact logistics.
Attendance appears once and only when explicitly supplied by an attendance tag;
cards do not infer a venue from the absence of an online tag.

Search, format choices, and day tabs stay visible on mobile. The filter disclosure
holds sorting and availability controls; these remain visible on desktop.
There is no reset/remove-filters button, including in filtered empty states.
A live result count confirms search/filter changes. Registration and cart behavior
are preserved.
