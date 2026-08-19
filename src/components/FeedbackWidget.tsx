"use client";

import { FormEvent, useState } from "react";

const FEEDBACK_EMAIL = "qaz6209031@gmail.com";

export default function FeedbackWidget() {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState("Suggestion");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");

  function submitFeedback(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const subject = `[MapsToGPX Feedback] ${type}`;
    const body = [
      `Feedback type: ${type}`,
      email ? `Reply-to: ${email}` : "Reply-to: Not provided",
      "",
      message,
      "",
      `Page: ${window.location.href}`,
    ].join("\n");

    window.location.href = `mailto:${FEEDBACK_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 rounded-full bg-zinc-900 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-zinc-900/15 transition hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        aria-label="Send feedback"
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h8M8 14h5m8-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Feedback
      </button>

      {open && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center bg-zinc-950/35 p-4 backdrop-blur-[2px] sm:items-center" onMouseDown={() => setOpen(false)}>
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="feedback-title"
            onMouseDown={(event) => event.stopPropagation()}
            className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xl"
          >
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h2 id="feedback-title" className="text-lg font-semibold text-zinc-900">Send feedback</h2>
                <p className="mt-1 text-sm leading-relaxed text-zinc-500">Found a bug or have an idea? I’d love to hear it.</p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg p-1.5 text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-700"
                aria-label="Close feedback form"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>

            <form onSubmit={submitFeedback} className="space-y-4">
              <div>
                <label htmlFor="feedback-type" className="mb-1.5 block text-sm font-medium text-zinc-700">What kind of feedback?</label>
                <select
                  id="feedback-type"
                  value={type}
                  onChange={(event) => setType(event.target.value)}
                  className="w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-zinc-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option>Suggestion</option>
                  <option>Bug</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="feedback-message" className="mb-1.5 block text-sm font-medium text-zinc-700">Your feedback</label>
                <textarea
                  id="feedback-message"
                  required
                  rows={5}
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  placeholder="Tell me what worked, what didn’t, or what would make MapsToGPX better..."
                  className="w-full resize-none rounded-xl border border-zinc-200 px-3.5 py-3 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label htmlFor="feedback-email" className="mb-1.5 block text-sm font-medium text-zinc-700">Email <span className="font-normal text-zinc-400">(optional)</span></label>
                <input
                  id="feedback-email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-zinc-200 px-3.5 py-2.5 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <button
                type="submit"
                className="inline-flex w-full items-center justify-center rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Send feedback
              </button>
              <p className="text-center text-xs text-zinc-400">This preview opens your email app with the feedback prefilled.</p>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
