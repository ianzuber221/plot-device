import Database from "better-sqlite3"
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dataDir = path.resolve(__dirname, "../data")
const dbPath = path.join(dataDir, "plot-device.sqlite")

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true })
}

export const db = new Database(dbPath)
db.pragma("journal_mode = WAL")
db.pragma("foreign_keys = ON")

export function migrate() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS books (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      author TEXT NOT NULL,
      status TEXT NOT NULL CHECK(status IN ('want', 'reading', 'done')),
      rating INTEGER CHECK(rating IS NULL OR (rating >= 1 AND rating <= 5)),
      notes TEXT DEFAULT '',
      cover_tone TEXT NOT NULL DEFAULT '#C9A9A6',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS quotes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      book_id INTEGER NOT NULL REFERENCES books(id) ON DELETE CASCADE,
      text TEXT NOT NULL,
      page TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS tags (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE
    );

    CREATE TABLE IF NOT EXISTS quote_tags (
      quote_id INTEGER NOT NULL REFERENCES quotes(id) ON DELETE CASCADE,
      tag_id INTEGER NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
      PRIMARY KEY (quote_id, tag_id)
    );
  `)
}

export function seedIfEmpty() {
  const count = db.prepare("SELECT COUNT(*) AS c FROM books").get() as {
    c: number
  }
  if (count.c > 0) return

  const insertBook = db.prepare(`
    INSERT INTO books (title, author, status, rating, notes, cover_tone)
    VALUES (@title, @author, @status, @rating, @notes, @cover_tone)
  `)
  const insertQuote = db.prepare(`
    INSERT INTO quotes (book_id, text, page) VALUES (?, ?, ?)
  `)
  const insertTag = db.prepare(`INSERT INTO tags (name) VALUES (?)`)
  const linkTag = db.prepare(
    `INSERT INTO quote_tags (quote_id, tag_id) VALUES (?, ?)`,
  )

  const tx = db.transaction(() => {
    const books = [
      {
        title: "The House in the Cerulean Sea",
        author: "TJ Klune",
        status: "done",
        rating: 5,
        notes: "Soft found family. Cried on the ferry.",
        cover_tone: "#7EB6D9",
      },
      {
        title: "Bunny",
        author: "Mona Awad",
        status: "reading",
        rating: null,
        notes: "Workshop horror but make it fashion.",
        cover_tone: "#E8A0BF",
      },
      {
        title: "Piranesi",
        author: "Susanna Clarke",
        status: "want",
        rating: null,
        notes: "Halls. Tides. Quiet awe.",
        cover_tone: "#B7C4A1",
      },
      {
        title: "Normal People",
        author: "Sally Rooney",
        status: "done",
        rating: 4,
        notes: "Dialogue that feels like eavesdropping.",
        cover_tone: "#C9A9A6",
      },
      {
        title: "A Psalm for the Wild-Built",
        author: "Becky Chambers",
        status: "reading",
        rating: null,
        notes: "Tea. Robots. Permission to rest.",
        cover_tone: "#D4C48A",
      },
    ] as const

    for (const book of books) {
      const info = insertBook.run(book)
      const bookId = Number(info.lastInsertRowid)
      if (book.title.includes("Cerulean")) {
        const q = insertQuote.run(
          bookId,
          "I am but paper. Brittle and thin.",
          "214",
        )
        const tagId = Number(insertTag.run("found-family").lastInsertRowid)
        linkTag.run(Number(q.lastInsertRowid), tagId)
      }
      if (book.title === "Bunny") {
        const q = insertQuote.run(
          bookId,
          "We call them Bunnies and we love them and we hate them.",
          "12",
        )
        let tag = db.prepare("SELECT id FROM tags WHERE name = ?").get("camp") as
          | { id: number }
          | undefined
        if (!tag) {
          tag = { id: Number(insertTag.run("camp").lastInsertRowid) }
        }
        linkTag.run(Number(q.lastInsertRowid), tag.id)
      }
    }

    insertTag.run("soft-sci-fi")
    insertTag.run("litfic")
  })

  tx()
}
