# samuellittlefield.com

Portfolio site. Next.js (App Router), static pages, deployed on Vercel.

## Editing content

All copy lives in `lib/projects.ts`: one entry per project, with its homepage summary and its case-study sections. Anything in `[BRACKETS]` is a placeholder still to be written. Homepage-only copy (headline, About) is in `app/page.tsx`.

Screenshots live in `public/work/<slug>.jpg` (2560x1600).

## Structure

- `app/page.tsx`: homepage
- `app/work/[slug]/page.tsx`: case-study template, one static page per project
- `components/`: masthead, framed screenshots ("plates"), and the block renderer for case-study sections
- `app/globals.css`: the whole visual system (paper, ink, one green accent; Newsreader and IBM Plex Mono)

`/circlesnap` is proxied to the sandbox deployment via `vercel.json`.

## Run locally

```bash
npm install
npm run dev
```
