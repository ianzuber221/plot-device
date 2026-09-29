# Plot Device — Reading Journal

Reading journal with a tiny Express + SQLite API. Full-stack portfolio piece with real CRUD surface area.

## Run

```bash
npm install
npm run dev
```

This starts the API (`:8787`) and Vite (`:5175`) together.

## Env

Copy `.env.example` if you want to override ports / API URL:

```bash
cp .env.example .env
```

## What ships

- SQL schema: `books`, `quotes`, `tags`, `quote_tags`
- Seed books + sample quotes/tags
- Library list UI (loading / empty / error)
- `GET /api/books`, `GET /api/books/:id`, `GET /api/tags`

## YOUR FEATURE

**Start here → [`YOUR_FEATURE.md`](./YOUR_FEATURE.md)**

Full beginner checklist: goal, files, numbered steps, hints, acceptance criteria, demo script, stretch.

In short: POST/PATCH/DELETE books, status flow want → reading → done, quote tags via `quote_tags`. Search for `TODO(your-name)` (each comment references a step number).

## SQLite notes

Uses `better-sqlite3`. DB file: `data/plot-device.sqlite` (auto-created, gitignored). If native install ever fails on a machine, swap to `sql.js` with the same schema.

## Rename checklist

1. `src/config/site.ts`
2. `index.html` title + meta
3. `public/favicon.svg`
4. Optional `package.json` name
5. GitHub / Vercel display name

Visible branding should read from `siteConfig` only.

## Resume line

**Plot Device** — Reading Journal (React, Express, SQLite / better-sqlite3)

## License

MIT
