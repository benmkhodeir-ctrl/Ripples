# Ripples — Product & Infrastructure Source of Truth

**Last verified:** 14 September 2026  
**Status:** live; GitHub-connected Cloudflare Pages is the production host

## Product

Ripples is a public movement, network and media ecosystem built around useful interactions, better questions and ideas worth passing on.

The permanent homepage is the primary explanation and growth surface. It declares the belief, explains how the movement, podcast, network and platform connect, and invites visitors to participate. People, ideas and conversations provide evolving evidence beneath that proposition.

## Canonical source

- GitHub owner: `benmkhodeir-ctrl`
- Repository: `benmkhodeir-ctrl/Ripples`
- Production branch: `main`
- Repository role: sole editable source of truth

Do not create or maintain a separate editable copy in a hosting or website product.

## Website deployment

- Framework: Astro
- Output: static
- Build command: `npm run build`
- Build output: `dist`
- Cloudflare Pages project: `ripples`
- Pages hostname: `https://ripples-244.pages.dev`
- Production domain: `https://jointheripple.com.au`
- Automatic production deployments: GitHub pushes to `main`
- Preview deployments: enabled for non-production branches

Target architecture:

`GitHub main → Cloudflare Pages project ripples → jointheripple.com.au`

The previous Sites project is no longer part of the development or production workflow. GitHub `main` is the sole editable source, and Cloudflare Pages is the production host.

## Important directories

- `src/pages/` — website routes
- `src/layouts/` — shared layouts
- `src/styles/` — site styles
- `src/content/` — people, ideas, episodes and events
- `public/` — static assets and hosting rules
- `workers/` — form Worker source and D1 schema

## Current public routes

- `/` — permanent belief, explanation and participation homepage
- `/people/` — people directory
- `/people/[slug]/` — individual profiles
- `/ideas/` — ideas
- `/podcast/` — conversations
- `/events/` — events
- `/about/` — background
- `/join/` — participation form
- `/contact/` — contact form
- `/privacy/` and `/terms/`

## Forms and data

- Worker: `ripples-forms`
- Worker endpoint: `https://forms.jointheripple.com.au`
- Worker source: `workers/forms.js`
- D1 binding: `DB`
- D1 database: `ripples-submissions`
- D1 database ID: `fb3e16b8-1d44-4054-a971-36d9b0f3b12b`
- Schema: `workers/schema.sql`
- Email binding: `EMAIL`
- Allowed sender: `forms@jointheripple.com.au`
- Runtime variable: `NOTIFICATION_TO` where required by the deployed Worker

Submission flow:

`Join or Contact form → ripples-forms Worker → validation and rate limit → D1 storage → email notification → browser confirmation`

A change to a form, Worker, binding or schema requires an end-to-end test. Do not infer notification success merely from successful database storage.

## Email and DNS

Cloudflare Email Routing forwards:

- `hello@jointheripple.com.au`
- `join@jointheripple.com.au`
- `privacy@jointheripple.com.au`

Email-routing MX, SPF and DKIM records must be preserved during website DNS changes. Hosting changes must touch only the website records required for the Pages custom domain.

## Product decisions

- The homepage permanently leads with what Ripples believes and how it works. It will not become a chronological content feed.
- Podcast episodes begin the content journey; social conversations distribute and extend it; the website gathers the durable record and participation paths.
- New episodes, people, ideas and documented outcomes may appear on the homepage as evidence but do not replace the belief and participation structure.
- Ripples distinguishes the movement, podcast, network and platform while presenting them as one connected ecosystem.
- Joining means contributing what someone can help with, is curious about or could use help with. It is not a conventional referral club or lead database.
- There is currently no membership fee.
- Future claims must distinguish confirmed live features from intended development.
- Current social preview assets and metadata remain unchanged unless a new preview is explicitly requested.

## Publishing and verification

1. Install from the committed lockfile when dependencies are absent.
2. Run `npm run build`.
3. Confirm `dist/index.html` and expected routes are generated.
4. Check responsive layout, navigation, links, metadata and static assets.
5. Commit the exact approved source to `main`.
6. Confirm Cloudflare Pages deployed that commit successfully.
7. Verify the custom domain after cutover.
8. When forms change, verify validation, storage, notification and confirmation end to end.

## Known limitations

- Podcast, ideas and events collections are intentionally sparse while real material is developed.
- The homepage explains the intended content journey before the first podcast episodes are published.
- Form infrastructure is a separate Worker deployment and must be verified independently from the static site.
