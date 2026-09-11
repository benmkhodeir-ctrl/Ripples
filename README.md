# Ripples

The first public version of Ripples: a network where the currency is usefulness.

## Local development

```sh
npm install
npm run dev
```

Create a production build with `npm run build`. The static site is written to `dist/`.

## Content structure

Content lives in `src/content/` and is validated by `src/content.config.ts`.

- `people/` supports introductions, help offered, common questions, curiosity, learning, help needed, preferred interactions and secondary work context.
- `ideas/` supports Better Questions, What We Learned, Worth Passing On, essays, observations, conversations and recommendations.
- `episodes/` supports podcast guests, conversation summaries, dates, artwork and audio links.
- `events/` supports upcoming and past gatherings, locations and booking links.

Only publish real, approved material. Do not add fictional people, episodes, events or editorial inventory.

## Add a person

Create `src/content/people/name-slug.md`, complete the schema fields and set `published: true` only after the person has consented and the profile has been reviewed. Lead with usefulness and curiosity. Keep employment context secondary. Never publish the submitted email address.

## Add an idea

Create `src/content/ideas/article-slug.md` with a title, description, publication date, format and author. Set `draft: false` when approved.

## Add a podcast episode

Create `src/content/episodes/episode-slug.md`. Add the guest, description, publication date and approved audio/artwork when available, then set `draft: false`.

## Add an event

Create `src/content/events/event-slug.md`. Set the date, location, status and optional booking URL, then set `draft: false` when public.

## Brand assets

Approved web masters are in `public/assets/`. The source masters and complete brand guide remain in Google Drive under `RIPPLES/00 Brand Source` and `RIPPLES/01 Logo Masters`.

Brand colours and type roles are defined in `src/styles/global.css`. Use EB Garamond for editorial expression and Inter for body and utility. Do not redraw the mark or turn the visual language into a bullseye, splash, water-droplet logo or generic technology diagram.

## Deployment

The site is an Astro static build. Hosting identity is stored in `.openai/hosting.json`. Push approved source to the connected repository and deploy the generated `dist/` output.

## Forms and submissions

The Join and Contact forms submit to the `ripples-forms` Cloudflare Worker at `forms.jointheripple.com.au`. The Worker validates and rate-limits requests, stores them in the `ripples-submissions` D1 database and sends a notification to the verified operating inbox. The browser never exposes the destination inbox.

Worker source and the database schema are kept in `workers/`. When changing form fields, update the page, Worker validation, database schema and Privacy Policy together. Do not publish a profile directly from a submission. Obtain the participant's approval for the edited public profile first.

Cloudflare Email Routing forwards `hello@`, `join@` and `privacy@jointheripple.com.au` to the operating inbox. Routing provides inbound forwarding only; it is not a hosted outbound mailbox.

## Governance

Before changing positioning, philosophy, navigation, editorial purpose, profile culture or the visual system, update or reconcile the authoritative Brand & Content HQ sources. Current corrections and live evidence outrank older material. This repository implements the source of truth; it does not replace it.
