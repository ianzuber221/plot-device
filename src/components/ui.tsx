import { siteConfig } from "../config/site"
import type { Book } from "../lib/api"

export function BookRow({ book }: { book: Book }) {
  return (
    <article className="book-row">
      <div
        className="book-row__spine"
        style={{ background: book.cover_tone }}
        aria-hidden
      />
      <div className="book-row__body">
        <h3>{book.title}</h3>
        <p className="book-row__author">{book.author}</p>
        <div className="book-row__meta">
          <span className={`status status--${book.status}`}>{book.status}</span>
          {book.rating ? <span>{book.rating}/5</span> : null}
        </div>
        {book.notes ? <p className="book-row__notes">{book.notes}</p> : null}
        {/* TODO(your-name): Step 4 — button(s) to advance status via updateBook; Step 5 — delete via deleteBook. */}
        {/* TODO(your-name): Step 6 — optional: form to POST a quote + tags for this book. */}
      </div>
    </article>
  )
}

export function EmptyState({ message }: { message?: string }) {
  return (
    <div className="empty-state" role="status">
      <div className="empty-state__mark" aria-hidden />
      <p className="empty-state__title">No titles here</p>
      <p>{message ?? siteConfig.mascots.empty}</p>
    </div>
  )
}

export function LoadingState() {
  return (
    <div className="loading-state" role="status">
      <div className="loading-state__mark" aria-hidden />
      <p>{siteConfig.mascots.loading}</p>
    </div>
  )
}

export function ErrorState({ message }: { message: string }) {
  return (
    <div className="error-state" role="alert">
      <p className="error-state__title">Something snagged</p>
      <p>{message}</p>
      <p className="error-state__hint">
        Is the API running? Try <code>npm run dev</code> (starts API + Vite).
      </p>
    </div>
  )
}
