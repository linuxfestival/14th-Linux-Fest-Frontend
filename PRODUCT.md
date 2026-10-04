# Linux Fest

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Technology enthusiasts and geeks who want to participate in Linux Fest, from beginners through intermediate and advanced participants. Participation is not limited to university students or people already comfortable with Linux.

## Product Purpose

Linux Fest brings people together through workshops, conferences, and deep technical talks. The festival creates opportunities to talk, learn, and experiment, shows beginners the power of Linux, and introduces them to the open-source world.

The website supports discovering the event and its programs, registering for participation, and managing registrations and payments. Success means helping people find suitable sessions and participate in the festival.

## Positioning

A Linux and open-source festival organized by the Computer Engineering Scientific Association of Amirkabir University of Technology in Tehran. Its program combines hands-on learning with conferences and deeper technical discussion for people at different experience levels.

## Operating Context

The existing website serves Persian content with right-to-left reading and navigation. Technical names and some session titles use English. Program dates and times are formatted for Asia/Tehran.

The implemented participant journey includes browsing programs and presenter information, creating or accessing an account, verifying email, completing first-login information, adding programs to a cart, checking out, viewing payment results, and managing registered programs, billing history, and profile information.

These workflows are established by the current code; individual event offerings and registration availability depend on backend data.

## Capabilities and Constraints

- The existing web application uses React, TypeScript, Vite, Tailwind CSS, React Router, and Redux. The development command is `pnpm dev`; Vite is configured for `127.0.0.1:5173`.
- Program, presenter, FAQ, account, cart, and payment data are integrated with backend APIs. Preserve real availability, prices, capacity, registration status, and payment outcomes rather than inventing them in frontend copy.
- The API distinguishes workshops, talks, and packages. The festival's user-facing program also includes conferences and deep talks; do not assume these require separate API types without confirming the backend contract.
- The contest component exists, but its route is disabled. A contest is not a confirmed offering for this edition.
- Open decisions: the current edition's dates, schedule, venue details, program lineup, prices, and attendance format have not been confirmed during initialization. Existing static copy is not confirmation of these facts.

## Brand Commitments

- Product name: Linux Fest / لینوکس‌فست.
- Organizer: the Computer Engineering Scientific Association of Amirkabir University of Technology in Tehran.
- Sponsor for the current edition, as confirmed by the project owner during initialization: System Group (همکاران سیستم).
- The existing Divar (دیوار) sponsor references are outdated. Future sponsor work must use System Group and distinguish the sponsor from the organizer. Do not carry Divar forward as the current sponsor.

## Evidence on Hand

- Existing product copy and workflows are in `src/components/` and `src/routes.tsx`.
- Program and payment contracts are in `src/core/presentations/presentations.dto.ts` and `src/core/payment/payment.dto.ts`.
- University and association assets are available at `src/assets/aut.png` and `src/assets/anjoman.png`; Linux-related illustrations are in `src/assets/` and `src/assets/images/`.
- Outdated Divar references appear in `src/components/Home/components/SponsorsSection.tsx` and `src/components/Footer/Footer.tsx`, with artwork at `src/assets/sponsor.png`. This asset must not be relabeled as a System Group logo.
- System Group's approved logo and destination link have not been established during initialization.
- Event statistics, testimonials, and claims in existing copy have not been validated in this interview; do not treat them as verified proof for future claims.

## Product Principles

- Welcome beginners while keeping meaningful learning opportunities for intermediate and advanced participants.
- Connect program discovery to real participation, with clear registration and payment outcomes.
- Support conversation, hands-on experimentation, and exploration of Linux and open source.
- Keep organizer, sponsor, and current-edition facts accurate as the festival changes.

## Persian Language

- The owner-approved landing-page emphasis is learning from each other and community across skill levels. The hero's primary action is browsing offerings.
- The owner-authored voice reference is «لینوکس بهونه‌ست، از هم یاد می‌گیریم و دوست پیدا می‌کنیم.» Use natural conversational Persian for invitations, short familiar labels for actions, and clear, calm language for account, payment, and error states. Familiar colloquial forms are welcome; do not impose formal written Persian on this voice.
- Use «ارائه‌ها» as the collective user-facing name for offerings, including presentations and workshops. Do not call them «برنامه‌ها». Individual formats may still be named «ارائه» or «کارگاه» when the distinction matters.
- Account creation and registration for an offering are different actions: «ساخت حساب» and «ثبت‌نام» respectively. Browsing is «مشاهده ارائه‌ها».
- Follow [CONTENT.md](CONTENT.md) for Persian voice, terminology, writing conventions, and examples. These conventions are the baseline for future copy work; existing strings have not all been migrated.
