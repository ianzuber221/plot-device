import express from "express"
import cors from "cors"
import { db, migrate, seedIfEmpty } from "./db.ts"

migrate()
seedIfEmpty()

const app = express()
const PORT = Number(process.env.PORT) || 8787

app.use(cors())
app.use(express.json())

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "plot-device" })
})

/** Shipped: list books (optionally filter by status). */
app.get("/api/books", (req, res) => {
  const status = req.query.status as string | undefined
  const books =
    status && ["want", "reading", "done"].includes(status)
      ? db
          .prepare(
            `SELECT * FROM books WHERE status = ? ORDER BY updated_at DESC`,
          )
          .all(status)
      : db.prepare(`SELECT * FROM books ORDER BY updated_at DESC`).all()
  res.json(books)
})

app.get("/api/books/:id", (req, res) => {
  const book = db
    .prepare(`SELECT * FROM books WHERE id = ?`)
    .get(Number(req.params.id))
  if (!book) {
    res.status(404).json({ error: "Book not found" })
    return
  }
  const quotes = db
    .prepare(`SELECT * FROM quotes WHERE book_id = ? ORDER BY id DESC`)
    .all(Number(req.params.id))
  res.json({ ...book, quotes })
})

/**
 * TODO(your-name): Step 1 — Implement create book
 * Body: { title, author, status, rating?, notes?, cover_tone? }
 * INSERT into books (see server/db.ts); return 201 + the new row.
 */
app.post("/api/books", (_req, res) => {
  res.status(501).json({
    error: "Not implemented",
    hint: "YOUR_FEATURE.md step 1 — INSERT into books",
  })
})

/**
 * TODO(your-name): Step 3 — Implement update book (status / notes / rating; touch updated_at)
 * Status flow: want → reading → done (UI is step 4).
 */
app.patch("/api/books/:id", (_req, res) => {
  res.status(501).json({
    error: "Not implemented",
    hint: "YOUR_FEATURE.md step 3 — UPDATE books SET …",
  })
})

/**
 * TODO(your-name): Step 5 — Implement delete book (quotes cascade via FK)
 */
app.delete("/api/books/:id", (_req, res) => {
  res.status(501).json({
    error: "Not implemented",
    hint: "YOUR_FEATURE.md step 5 — DELETE FROM books WHERE id = ?",
  })
})

/** Shipped sample: list tags */
app.get("/api/tags", (_req, res) => {
  res.json(db.prepare(`SELECT * FROM tags ORDER BY name`).all())
})

/**
 * TODO(your-name): Step 6 — Add quote to a book + attach tags
 * Suggested: POST /api/books/:id/quotes { text, page?, tags?: string[] }
 * Insert quote, upsert tags, link via quote_tags (see seedIfEmpty for the pattern).
 */
app.post("/api/books/:id/quotes", (_req, res) => {
  res.status(501).json({
    error: "Not implemented",
    hint: "YOUR_FEATURE.md step 6 — quotes + tags + quote_tags",
  })
})

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Plot Device API on http://0.0.0.0:${PORT}`)
})
