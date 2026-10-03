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

Cards use API artwork when supplied and existing fallback illustrations otherwise.
Alternative text describes the program associated with the image.
