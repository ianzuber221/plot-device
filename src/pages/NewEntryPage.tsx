/**
 * YOUR FEATURE — Add / edit entries + status flow + quote tags
 *
 * Full checklist: YOUR_FEATURE.md (steps 1–6).
 * This form is incomplete on purpose — wire createBook (step 2) after the API (step 1).
 */

import { useState } from "react"
import type { FormEvent } from "react"
import { AppNav } from "../components/AppNav"
import { siteConfig } from "../config/site"
import { createBook, type BookStatus } from "../lib/api"

export function NewEntryPage() {
  const [title, setTitle] = useState("")
  const [author, setAuthor] = useState("")
  const [status, setStatus] = useState<BookStatus>("want")
  const [notes, setNotes] = useState("")
  const [message, setMessage] = useState<string | null>(null)

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    // TODO(your-name): Step 2 — after createBook succeeds, navigate to "/" (useNavigate).
    try {
      await createBook({ title, author, status, notes })
      setMessage("Saved — but wait, createBook still throws until you implement it.")
    } catch (err) {
      setMessage(
        err instanceof Error
          ? err.message
          : "Not wired yet — implement the API + createBook helper.",
      )
    }
  }

  return (
    <div className="page">
      <AppNav />
      <section className="section">
        <div className="section__head">
          <p className="eyebrow">{siteConfig.name}</p>
          <h1>Add entry</h1>
          <p>Status flow: want → reading → done. Quotes + tags come next.</p>
        </div>

        <form className="entry-form" onSubmit={onSubmit}>
          <label className="field">
            <span>Title</span>
            <input
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What are you reading?"
            />
          </label>
          <label className="field">
            <span>Author</span>
            <input
              required
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Who wrote it?"
            />
          </label>
          <label className="field">
            <span>Status</span>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as BookStatus)}
            >
              <option value="want">Want</option>
              <option value="reading">Reading</option>
              <option value="done">Done</option>
            </select>
          </label>
          <label className="field">
            <span>Notes</span>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              placeholder="First impressions, spice level, why you picked it up…"
            />
          </label>
          <button type="submit" className="btn btn--primary">
            Save entry
          </button>
          {message && <p className="status-msg">{message}</p>}
        </form>

        <div className="todo-callout">
          <strong>Your feature</strong>
          <p>
            Follow <code>YOUR_FEATURE.md</code> steps 1–6. Search{" "}
            <code>TODO(your-name)</code> for the exact spots.
          </p>
        </div>
      </section>
    </div>
  )
}
