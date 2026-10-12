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

## Festival bundles

`BundlesBanner` appears above the individual offering filters and links to the
public `/bundles` page. The workshop page does not fetch the bundle catalog.
Search, format, day, sorting, availability, and the result count continue to
apply only to individual offerings.

Bundles can contain presentations, workshops, or both. The shared user-facing
name is «بسته‌ها» throughout the interface. Member formats
retain «ارائه» for `TALK` and «کارگاه» for `WORKSHOP`, without implying that
every bundle contains workshops. Header navigation, the landing hero and bundle
section, and the Footer also link to `/bundles`.

`Bundles/Bundles.tsx` provides the shared Header and Footer, a back link to
`/workshops`, a page heading, and introductory copy. Its `BundlesList` fetches
the separate bundles API. Loading and failure states remain visible, with a
retry action on failure. An empty response shows an invitation and link to
choose individual offerings.

`BundleCard` keeps the existing Persian RTL, Vazirmatn, navy/orange palette, and
rounded surfaces, with white member content beside a navy price panel on wide
screens. Below the large breakpoint, price and actions stack below the members.
Each entire member row links to its details and shows its format plus start/end
schedule. The panel emphasizes the fixed total and, only when positive, the
actual `original_price - price` savings beside the crossed-out separate-purchase
price. It shows the backend's availability reason and disables adding
unavailable bundles.

Authenticated actions add or remove the whole bundle. The same card is reused
as one cart row; member presentations remain linked for inspection, and removal
always removes the whole bundle. After a successful mutation, the cart refreshes
both presentations and bundle selections, and discovery reloads availability.
See [bundle integration notes](../../core/bundles/README.md) for API and pricing
assumptions.
