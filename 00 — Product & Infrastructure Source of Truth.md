# Ripples — Product & Infrastructure Source of Truth

Last verified: 14/09/2026

## Product

Ripples is a public movement, network and media ecosystem built around useful interactions, better questions and ideas worth passing on.

The permanent homepage is the primary explanation and growth surface. It declares the belief, explains how the movement, podcast, network and platform connect, and invites visitors to participate. People, ideas and conversations provide evolving evidence beneath that proposition.

## Source and deployment

- GitHub: benmkhodeir-ctrl/Ripples
- Production branch: main
- Framework: Astro static site
- Source pages: src/pages
- Shared layout: src/layouts/Base.astro
- Styles: src/styles
- Content collections: src/content
- Static assets: public
- Build output: dist
- Sites project: Ripples
- Production domain: https://jointheripple.com.au
- Sites project identifier is stored in .openai/hosting.json

## Current public routes

- / permanent belief, explanation and participation homepage
- /people/ people directory
- /people/[slug]/ individual profiles
- /ideas/ ideas
- /podcast/ conversations
- /events/ events
- /about/ background
- /join/ participation form
- /contact/ contact form
- /privacy/ and /terms/

## Forms and data

- Form handling source: workers/forms.js
- Database schema: workers/schema.sql
- The current form and submission workflow must be preserved when editorial pages change.
- End to end form delivery and notification behaviour should be reverified after any form or Worker change.

## Product decisions

- The homepage permanently leads with what Ripples believes and how it works. It will not become a chronological content feed.
- New podcast episodes, people, ideas and documented outcomes may appear on the homepage as evidence, but do not replace the belief and participation structure.
- Ripples distinguishes the movement, podcast, network and platform while presenting them as one connected ecosystem.
- Joining means contributing what someone can help with, is curious about or could use help with. It is not a conventional referral club or lead database.
- There is currently no membership fee.
- Future claims must distinguish confirmed live features from intended development.
- Current social preview assets and metadata remain unchanged unless a new preview is explicitly requested.

## Build and verification

1. Install from the committed lockfile when dependencies are absent.
2. Run npm run build.
3. Confirm dist/index.html and all expected routes are generated.
4. Check responsive layout, navigation, links, metadata and static assets.
5. When forms change, verify validation, submission, storage, notification and confirmation end to end.
6. Commit and push the exact source before saving and deploying a Sites version.

## Known limitations

- Podcast, ideas and events collections are intentionally sparse while real material is developed.
- The homepage explains the intended content journey before the first podcast episodes are published.
- Existing form infrastructure is separate from the static Astro build and requires its own end to end verification when modified.
