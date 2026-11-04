"use client";

import { useState } from "react";
import { trackEvent } from "@/lib/analytics";
import type { Dictionary } from "@/i18n/dictionary";
import { Closure, Tick } from "@/components/sheet/symbols";

type Status = "idle" | "sending" | "sent" | "error";

export default function FeedbackForm({ dict }: { dict: Dictionary["feedbackForm"] }) {
  const RATING_LABELS = dict.ratingLabels;
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
    if (status === "sending") return;
    if (!canSubmit) {
      setError(dict.emptyError);
      setStatus("error");
      return;
    }

    setStatus("sending");
    setError("");

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, message, email, website }),
      });
      // API error messages (and conversion warnings) intentionally remain English.
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setStatus("sent");
      trackEvent("feedback_submit");
    } catch (e) {
      setError(e instanceof Error ? e.message : dict.errorFallback);
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
      <div className="px-5 py-8 text-center sm:px-8">
        <span className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-ink text-paper">
          <Tick className="h-6 w-6" />
        </span>
        <h3 className="font-lettering text-[22px] font-bold uppercase tracking-[0.03em]">
          {dict.thanksHeading}
        </h3>
        <p className="mt-1.5 text-[15px] text-ink-soft">{dict.thanksSubtext}</p>
        <button
          type="button"
          onClick={handleReset}
          className="mt-5 h-11 border-[1.5px] border-ink px-5 font-lettering text-[16px] font-semibold uppercase tracking-[0.08em] transition-colors hover:bg-land"
        >
          {dict.sendMoreButton}
        </button>
      </div>
    );
  }

  const shownRating = hoverRating ?? rating;
  const labelClass =
    "mb-2 block font-lettering text-[15px] font-semibold uppercase tracking-[0.1em] text-ink";
  const hintClass = "font-maptext text-[14px] font-normal normal-case tracking-normal text-ink-soft";
  const fieldClass =
    "w-full border-[1.5px] border-ink bg-white px-3.5 py-3 text-base text-ink placeholder:text-ink-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-route";

  return (
    <form onSubmit={handleSubmit} className="space-y-6 px-5 py-6 sm:px-8 sm:py-8">
      <fieldset>
        <legend className={labelClass}>
          {dict.ratingQuestion} <span className={hintClass}>{dict.optionalHint}</span>
        </legend>
        <div className="flex items-center gap-3">
          <div className="flex gap-0.5" onMouseLeave={() => setHoverRating(null)}>
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                aria-label={(value > 1 ? dict.starAriaLabelMany : dict.starAriaLabelOne).replace(
                  "{n}",
                  String(value)
                )}
                aria-pressed={rating === value}
                onClick={() => setRating(rating === value ? null : value)}
                onMouseEnter={() => setHoverRating(value)}
                className="p-1"
              >
                <svg
                  aria-hidden="true"
                  className={`h-7 w-7 transition-colors ${
                    shownRating !== null && value <= shownRating
                      ? "fill-route stroke-route"
                      : "fill-paper stroke-ink-soft"
                  }`}
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  strokeLinejoin="round"
                >
                  <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                </svg>
              </button>
            ))}
          </div>
          {shownRating !== null && (
            <span className="font-lettering text-[15px] font-semibold uppercase tracking-[0.1em] text-ink-soft">
              {RATING_LABELS[shownRating - 1]}
            </span>
          )}
        </div>
      </fieldset>

      <div>
        <label htmlFor="feedback-message" className={labelClass}>
          {dict.messageLabel} <span className={hintClass}>{dict.messageHint}</span>
        </label>
        <textarea
          id="feedback-message"
          rows={4}
          maxLength={2000}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={dict.messagePlaceholder}
          className={`${fieldClass} resize-y`}
        />
      </div>

      <div>
        <label htmlFor="feedback-email" className={labelClass}>
          {dict.emailLabel} <span className={hintClass}>{dict.emailHint}</span>
        </label>
        <input
          id="feedback-email"
          type="email"
          maxLength={320}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={dict.emailPlaceholder}
          className={fieldClass}
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
        <div role="alert" className="flex items-start gap-3 border-[1.5px] border-closure bg-white px-4 py-3">
          <Closure className="mt-0.5 h-5 w-5 shrink-0 text-closure" />
          <p className="text-[15px] text-ink">{error}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="h-12 w-full bg-route px-6 font-lettering text-[19px] font-bold uppercase tracking-[0.06em] text-white transition-colors hover:bg-route-deep disabled:cursor-wait disabled:bg-route-deep"
      >
        {status === "sending" ? dict.sendingButton : dict.sendButton}
      </button>
    </form>
  );
}
