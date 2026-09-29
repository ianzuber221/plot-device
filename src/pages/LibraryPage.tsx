import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { AppNav } from "../components/AppNav"
import { BookRow, EmptyState, ErrorState, LoadingState } from "../components/ui"
import { siteConfig } from "../config/site"
import { fetchBooks, type Book, type BookStatus } from "../lib/api"

const STATUSES: { id: BookStatus | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "want", label: "Want" },
  { id: "reading", label: "Reading" },
  { id: "done", label: "Done" },
]

export function LibraryPage() {
  const [status, setStatus] = useState<BookStatus | "all">("all")
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    fetchBooks(status === "all" ? undefined : status)
      .then((data) => {
        if (!cancelled) setBooks(data)
      })
      .catch((err: Error) => {
        if (!cancelled) setError(err.message)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [status])

  return (
    <div className="page">
      <AppNav />
      <section className="hero">
        <div className="hero__atmosphere" aria-hidden />
        <p className="hero__brand">{siteConfig.name}</p>
        <h1 className="hero__headline">{siteConfig.tagline}</h1>
        <p className="hero__support">{siteConfig.description}</p>
        <div className="hero__cta">
          <Link className="btn btn--primary" to="/new">
            Log a book
          </Link>
        </div>
      </section>

      <section className="section">
        <div className="section__head">
          <h2>Library</h2>
          <p>
            Seed data + list API are live. Remaining CRUD is{" "}
            <code>YOUR_FEATURE.md</code>.
          </p>
        </div>

        <div className="filter-row">
          {STATUSES.map((s) => (
            <button
              key={s.id}
              type="button"
              className={status === s.id ? "chip chip--active" : "chip"}
              onClick={() => setStatus(s.id)}
            >
              {s.label}
            </button>
          ))}
        </div>

        {loading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState message={error} />
        ) : books.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="book-list">
            {books.map((book) => (
              <BookRow key={book.id} book={book} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
