# FAQ surface

`FAQ.tsx` extends the existing visual system on `/faq`.
The agreed structure is about six or seven questions with their answers always visible.
It uses one RTL reading column, without search, accordion, sidebar or extra navigation.

## Presentation

The existing header and footer frame a compact heading and introduction.
A centered column (maximum 896px) contains a white surface with subtle row separators.
Each question is an `h2`; answers use 16px text with a 32px line height.
The page inherits Vazirmatn, navy, orange accents, pale ground and 12px surface corners.
Mobile spacing contracts; long words wrap and wide answer tables or code scroll locally.
Answer links are underlined and have a visible keyboard focus outline.

## Content and states

The existing `getFAQThunk` GET supplies the questions and HTML answers.
HTML rendering preserves the existing trusted-content assumption; no sanitizer was added.
Loading uses an announced skeleton with reduced-motion-safe animation.
Failure shows an inline alert and retry button; an empty response shows an honest empty state.
The live source currently returns HTTP 200 with `[]`; real answers must be published there.
No invented answers or production fixtures are shipped.

## Verification

Build and lint passed; the design detector reported no findings.
An intercepted temporary browser fixture checked seven visible answers at widths
320, 390, 768, 1024, 1440 and 1714px, plus retry and empty states, without overflow or browser errors.
Independent finish review approved shipping. No raster assets, global design changes or drift repair were needed.
