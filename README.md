# Ripples

Ripples is a public movement, network and media ecosystem where the currency is usefulness.

The permanent homepage explains what Ripples believes, how the podcast, social conversations, network and website reinforce one another, and how people can participate.

## Canonical architecture

`benmkhodeir-ctrl/Ripples` on GitHub is the sole editable source of truth.

Production flow:

`GitHub main → Cloudflare Pages → https://jointheripple.com.au`

The former Sites project is retired from the development and deployment workflow.

## Stack

- Astro static site
- Markdown content collections
- GitHub source control
- Cloudflare Pages project `ripples`
- Cloudflare Worker `ripples-forms`
- D1 database `ripples-submissions`
- Cloudflare Email Routing and email binding
- no CMS

## Local development

```sh
npm install
npm run dev
```

Production build:

```sh
npm run build
```

The static site is written to `dist/`.

## Deployment

1. Make the approved change in this repository.
2. Run `npm run build` and verify the affected routes.
3. Commit the exact source to `main`.
4. Cloudflare Pages builds and deploys the commit automatically.
5. Verify the deployment and the relevant page at `https://jointheripple.com.au`.

Do not create or maintain a separate editable deployment copy.

## Content structure

Content lives in `src/content/` and is validated by `src/content.config.ts`.

- `people/` supports introductions, help offered, common questions, curiosity, learning, help needed, preferred interactions and secondary work context.
- `ideas/` supports Better Questions, What We Learned, Worth Passing On, essays, observations, conversations and recommendations.
- `episodes/` supports podcast guests, conversation summaries, dates, artwork and audio links.
- `events/` supports upcoming and past gatherings, locations and booking links.

Only publish real, approved material. Do not add fictional people, episodes, events or editorial inventory.

## Publishing

### Person

Create `src/content/people/name-slug.md`, complete the schema fields and set `published: true` only after the person has consented and reviewed the profile. Lead with usefulness and curiosity. Keep employment context secondary. Never publish a submitted email address.

### Idea

Create `src/content/ideas/article-slug.md` with its title, description, date, format and author. Set `draft: false` when approved.

### Podcast episode

Create `src/content/episodes/episode-slug.md`. Add the guest, description, publication date and approved audio and artwork, then set `draft: false`.

### Event

Create `src/content/events/event-slug.md`. Add the date, location, status and optional booking URL, then set `draft: false`.

## Brand assets

Approved web masters are in `public/assets/`. The source masters and complete brand guide remain in Google Drive under `RIPPLES/00 Brand Source` and `RIPPLES/01 Logo Masters`.

Brand colours and type roles are defined in `src/styles/global.css`. Use EB Garamond for editorial expression and Inter for body and utility. Do not redraw the mark or turn the visual language into a bullseye, splash, water-droplet logo or generic technology diagram.

## Forms and submissions

The Join and Contact forms submit to the `ripples-forms` Cloudflare Worker at `https://forms.jointheripple.com.au`.

The Worker validates and rate-limits requests, stores them in the `ripples-submissions` D1 database and sends a notification through its email binding. The browser never exposes the destination inbox.

Worker source and the database schema are in `workers/`. When changing form fields, update the page, Worker validation, database schema and Privacy Policy together. Test submission, storage, notification and confirmation end to end.

Do not publish a profile directly from a submission. Obtain the participant’s approval for the edited public profile first.

Cloudflare Email Routing forwards `hello@`, `join@` and `privacy@jointheripple.com.au` to the operating inbox. Routing provides inbound forwarding only; it is not a hosted outbound mailbox.

## Governance

Before changing positioning, philosophy, navigation, editorial purpose, profile culture or the visual system, reconcile the authoritative Brand & Content HQ sources. Current corrections and live evidence outrank older material.

See `00 — Product & Infrastructure Source of Truth.md` for the current operational record.
