"use client";

import { useState } from "react";
import { trackEvent } from "@/lib/analytics";

type Status = "idle" | "sending" | "sent" | "error";

const RATING_LABELS = ["Poor", "Fair", "Good", "Great", "Excellent"];

export default function FeedbackForm() {
  const [rating, setRating] = useState<number | null>(null);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  const canSubmit =
    status !== "sending" && (rating !== null || message.trim() !== "");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;

    setStatus("sending");
    setError("");

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, message, email, website }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setStatus("sent");
      trackEvent("feedback_submit");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not send feedback");
      setStatus("error");
    }
  }

  function handleReset() {
    setRating(null);
    setMessage("");
    setEmail("");
    setStatus("idle");
    setError("");
  }

  if (status === "sent") {
    return (
      <div className="glass-card rounded-2xl p-6 sm:p-8 text-center">
        <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-6 h-6 text-emerald-600"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.5 12.75l6 6 9-13.5"
            />
          </svg>
        </div>
        <h3 className="font-semibold text-zinc-900 mb-1.5">
          Thanks for your feedback!
        </h3>
        <p className="text-sm text-zinc-500 mb-5">
          Every message is read and helps make MapsToGPX better.
        </p>
        <button
          onClick={handleReset}
          className="px-4 py-2 rounded-lg border border-zinc-200 text-zinc-600 hover:bg-zinc-100 transition-colors text-sm font-medium"
        >
          Send more feedback
        </button>
      </div>
    );
  }

  const shownRating = hoverRating ?? rating;

  return (
    <form
      onSubmit={handleSubmit}
      className="glass-card rounded-2xl p-6 sm:p-8 space-y-5"
    >
      {/* Rating */}
      <div>
        <label className="block text-sm font-medium text-zinc-700 mb-2">
          How was your experience?{" "}
          <span className="font-normal text-zinc-400">(optional)</span>
        </label>
        <div className="flex items-center gap-3">
          <div
            className="flex gap-1"
            onMouseLeave={() => setHoverRating(null)}
          >
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                aria-label={`${value} star${value > 1 ? "s" : ""}`}
                aria-pressed={rating === value}
                onClick={() => setRating(rating === value ? null : value)}
                onMouseEnter={() => setHoverRating(value)}
                className="p-1 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
              >
                <svg
                  className={`w-7 h-7 transition-colors ${
                    shownRating !== null && value <= shownRating
                      ? "text-amber-400"
                      : "text-zinc-200"
                  }`}
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                </svg>
              </button>
            ))}
          </div>
          {shownRating !== null && (
            <span className="text-sm text-zinc-500">
              {RATING_LABELS[shownRating - 1]}
            </span>
          )}
        </div>
      </div>

      {/* Message */}
      <div>
        <label
          htmlFor="feedback-message"
          className="block text-sm font-medium text-zinc-700 mb-2"
        >
          What could be better?{" "}
          <span className="font-normal text-zinc-400">
            (bugs, routes that didn&apos;t convert, feature ideas)
          </span>
        </label>
        <textarea
          id="feedback-message"
          rows={4}
          maxLength={2000}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Tell us what you think..."
          className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-white text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all text-sm resize-y"
        />
      </div>

      {/* Email */}
      <div>
        <label
          htmlFor="feedback-email"
          className="block text-sm font-medium text-zinc-700 mb-2"
        >
          Email{" "}
          <span className="font-normal text-zinc-400">
            (optional, only if you&apos;d like a reply)
          </span>
        </label>
        <input
          id="feedback-email"
          type="email"
          maxLength={320}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-white text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all text-sm"
        />
      </div>

      {/* Honeypot: hidden from users, catches bots that fill every field */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
        className="hidden"
      />

      {status === "error" && error && (
        <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={!canSubmit}
        className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30 active:scale-[0.99]"
      >
        {status === "sending" ? "Sending..." : "Send Feedback"}
      </button>
    </form>
  );
}
