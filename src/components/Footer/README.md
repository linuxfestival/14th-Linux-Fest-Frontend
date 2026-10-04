# Footer

The shared footer preserves the existing topic groups, labels, session destinations, social destinations. Its purpose is to close public pages with clear organizer/sponsor attribution and usable topic browsing.

## Attribution and layout

The organizer is the Computer Engineering Scientific Association of Amirkabir University of Technology. The current sponsor is System Group (همکاران سیستم). The footer displays the official System Group logo at `src/assets/systemgroup.svg`, sourced from https://www.systemgroup.net/wp-content/themes/sg/dist/images/logo.svg. The old project notes misidentified the original sponsor artwork as Divar; the official logo confirms it is System Group’s mark. The trust-seal link and its image file were removed at the owner’s request. Organizer marks have a light backing for visibility.

On phones, organizer information precedes two topic columns, with the third topic spanning both columns. At the small breakpoint, all three topics share a row. On desktop, organizer information and the topic row sit beside each other. DOM and keyboard order preserve the original sequence. All footer links have at least 44px target height, and social controls are 44px square. Mixed-language link labels use bidirectional isolation.

Home and WorkshopsList render Footer after their main landmark; other active public-page mounts already did so. Footer has a named navigation region. Images reserve their rendered dimensions and load lazily. Social feedback uses color rather than translation.

## Technical audit — 2026-10-05

The measurements below record the earlier compact-layout pass, before the sponsor image was restored and the trust seal removed.

| Dimension | Score / 4 | Evidence |
| --- | --- | --- |
| Accessibility | 3 | Named links, descriptive image alternatives, visible 2px keyboard focus, footer outside main, strong existing text contrast. Full assistive-technology testing remains unperformed. |
| Performance | 3 | Lazy images with reserved dimensions; no added dependency or animation. The trust-seal image was subsequently removed. |
| Responsive design | 4 | Examined 320, 390, 768, 941 and 1440px widths without footer overflow; all link targets at least 44px tall. CSS 200% zoom did not overflow. |
| Theming | 3 | Layout and text use existing tokens. Legacy social SVG artwork retains literal gradient colors. No alternate product theme is established. |
| Implementation integrity | 4 | Accurate footer attribution, preserved destinations, semantic structure; detector returned no findings across changed components. |
| Total | **17/20 — Good** | Scoped implementation audit, not accessibility certification. |

### Measurements

| Width | Footer height |
| --- | --- |
| 320px | 725px |
| 390px | 713px |
| 768px | 541px |
| 941px | 541px |
| 1440px | 405px |

Measured with headless Chromium and fallback fonts after external Google Fonts requests stalled. All footer images loaded. The preceding critique measured the old footer at 943px on a 390px phone and 471px on a 1440px desktop; font conditions may differ, so comparisons are approximate. Keyboard Tab advanced from the university link to Telegram with a solid 2px focus outline. Home, WorkshopsList and FAQ each rendered one footer outside main. No physical-device, Safari, screen-reader, remote-destination or session-availability verification was performed.

### Remaining findings

- **P3 / Theming — `src/components/Icons/`:** Social artwork contains literal gradient colors. This is acceptable inherited branding for the existing theme, but an alternate theme would need deliberate icon treatment. Suggested follow-up, if another theme is introduced: `$impeccable colorize footer`.

The request explicitly excluded navigation improvements, so existing duplicated session destinations remain. The separate home sponsor section retains its existing asset; that image was misidentified as Divar in the initial critique.

Production build, scoped ESLint, whitespace validation and the Impeccable detector passed. Vite emitted existing mixed static/dynamic-import warnings. Temporary headless browser was closed; the existing development server was retained.
