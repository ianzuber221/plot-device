# YOUR FEATURE — Plot Device (Reading Journal)

**Feature to implement.** The library list, SQLite schema, and GET routes already work. Own the write paths so someone can add books, move them through want → reading → done, delete them, and tag quotes.

---

## Goal

Ship full CRUD for books plus quote tagging against a tiny Express + SQLite API. Resume-friendly: *“Designed a SQLite schema (books/quotes/tags) and CRUD API for a reading journal.”*

---

## Files to open

| Path | Why |
| --- | --- |
| `server/index.ts` | POST / PATCH / DELETE stubs that return 501 |
| `server/db.ts` | Schema + seed — read this before writing SQL |
| `src/lib/api.ts` | `createBook` / `updateBook` client stubs |
| `src/pages/NewEntryPage.tsx` | Add-entry form waiting on the API |
| `src/pages/LibraryPage.tsx` | List + status filter chips (GET already works) |
| `src/components/ui.tsx` | `BookRow` — good place for status advance / delete |

Search for `TODO(your-name)` — each comment maps to a step below.

---

## Step-by-step tasks

1. **POST create book (API)** — In `server/index.ts`, implement `POST /api/books`. Read `title`, `author`, `status`, optional `rating` / `notes` / `cover_tone` from `req.body`. `INSERT` into `books` (see columns in `server/db.ts`). Return the new row as JSON with status `201`.

2. **Wire `createBook` + the form** — In `src/lib/api.ts`, `POST` to `/api/books` and return the JSON (throw a clear error if `!res.ok`). In `NewEntryPage`, after a successful `createBook`, navigate home (`/`) so the library refreshes.

3. **PATCH update book (API + client)** — Implement `PATCH /api/books/:id` to update `status`, `notes`, and/or `rating`, and set `updated_at`. Wire `updateBook(id, payload)` in `api.ts` the same way as create.

4. **Status flow in the UI** — On the library (or book row), let the reader advance **want → reading → done** (and maybe step backward). Call `updateBook` and refresh the list. Status filter chips on `LibraryPage` already hit `GET /api/books?status=…`.

5. **DELETE book** — Implement `DELETE /api/books/:id`. Quotes cascade via FK (`ON DELETE CASCADE` in the schema). Add a client helper (e.g. `deleteBook`) and a delete control in the UI.

6. **Quotes + tags** — Implement `POST /api/books/:id/quotes` with body `{ text, page?, tags?: string[] }`. Insert the quote, upsert tag names into `tags`, link rows in `quote_tags`. Add a small UI to attach a quote (detail page or expand on a row — your call).

---

## Implementation notes

- `db.prepare(...).run(...)` / `.get(...)` / `.all(...)` — same style as the shipped GET handlers.
- Foreign keys are on (`db.pragma("foreign_keys = ON")`). Deleting a book cleans up its quotes.
- `GET /api/tags` already lists tags — useful when building a tag picker.
- Seed data in `seedIfEmpty()` shows example inserts for books, quotes, tags, and `quote_tags`.
- `VITE_API_URL` defaults to `http://127.0.0.1:8787` — keep API + Vite running via `npm run dev`.
- Valid statuses: `'want' | 'reading' | 'done'` (enforced by a CHECK constraint).

---

## Acceptance criteria

You're done when…

- [ ] Submitting **Add entry** creates a book that appears in the library after navigate/refresh
- [ ] PATCH can change a book’s status (want → reading → done) from the UI
- [ ] DELETE removes a book from the DB and the list
- [ ] Adding a quote with tags writes to `quotes`, `tags`, and `quote_tags` (verify with a DB viewer or a GET that returns quotes)
- [ ] Failed requests show a readable error in the UI (not a silent fail)
- [ ] Restarting the server keeps your data (`data/plot-device.sqlite`)

---

## Demo script

1. “Plot Device is a reading journal with Express and SQLite — schema for books, quotes, and tags.”
2. “I can log a new book from this form; it POSTs to the API and shows up in the library.”
3. “Status moves want → reading → done with a PATCH — here’s one advancing live.”
4. “I can delete a title; quotes cascade because of the foreign key.”
5. “Quotes can carry tags through a join table — useful for searching themes later.”

---

## Stretch

- Book detail route that loads `GET /api/books/:id` (quotes included) and hosts the quote form.
- Filter or search library by tag; star ratings editable inline.
