export type BookStatus = "want" | "reading" | "done"

export type Book = {
  id: number
  title: string
  author: string
  status: BookStatus
  rating: number | null
  notes: string
  cover_tone: string
  created_at: string
  updated_at: string
}

export type Quote = {
  id: number
  book_id: number
  text: string
  page: string | null
  created_at: string
}

const API = import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8787"

export async function fetchBooks(status?: BookStatus): Promise<Book[]> {
  const url = status ? `${API}/api/books?status=${status}` : `${API}/api/books`
  const res = await fetch(url)
  if (!res.ok) throw new Error("Could not load books")
  return res.json()
}

export async function fetchBook(id: number): Promise<Book & { quotes: Quote[] }> {
  const res = await fetch(`${API}/api/books/${id}`)
  if (!res.ok) throw new Error("Book not found")
  return res.json()
}

export async function createBook(_payload: unknown): Promise<Book> {
  // TODO(your-name): Step 2 — POST /api/books, parse JSON, throw if !res.ok. Then NewEntryPage can navigate home.
  throw new Error("createBook not implemented — see YOUR_FEATURE.md step 2")
}

export async function updateBook(
  _id: number,
  _payload: Partial<Book>,
): Promise<Book> {
  // TODO(your-name): Step 3 — PATCH /api/books/:id for status / notes / rating.
  throw new Error("updateBook not implemented — see YOUR_FEATURE.md step 3")
}

export async function deleteBook(_id: number): Promise<void> {
  // TODO(your-name): Step 5 — DELETE /api/books/:id; throw if !res.ok.
  throw new Error("deleteBook not implemented — see YOUR_FEATURE.md step 5")
}
