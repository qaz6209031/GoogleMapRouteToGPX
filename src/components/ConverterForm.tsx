"use client";

import { useState } from "react";
import { trackEvent } from "@/lib/analytics";
import { classifyConversionError } from "@/lib/conversion-error";
import { isGoogleMapsUrl, isShortUrl } from "@/lib/google-hosts";
import type { Dictionary } from "@/i18n/dictionary";

interface Stats {
  distanceKm: number;
  waypointCount: number;
  warnings?: string[];
}

type Step =
  | "idle"
  | "resolving"
  | "routing"
  | "done"
  | "error";

export default function ConverterForm({ dict }: { dict: Dictionary["converterForm"] }) {
  const STEP_LABELS: Record<Step, string> = dict.stepLabels;

  const [url, setUrl] = useState("");
  const [step, setStep] = useState<Step>("idle");
  const [error, setError] = useState("");
  const [gpxData, setGpxData] = useState("");
  const [stats, setStats] = useState<Stats | null>(null);

  async function postJson(
    path: string,
    body: unknown
  ): Promise<{ ok: boolean; status?: number; data: { error?: string } & Record<string, unknown> }> {
    let res: Response;
    try {
      res = await fetch(path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    } catch {
      // The request itself failed (offline, DNS, CORS, etc.) — there's no
      // response or status to report.
      return { ok: false, data: { error: dict.networkError } };
    }
    try {
      // API error messages (and conversion warnings) intentionally remain English.
      const data = await res.json();
      return { ok: res.ok, status: res.status, data };
    } catch {
      // Got a response but couldn't parse it as JSON (e.g. a non-JSON error
      // page) — keep the status so classification isn't treated as "network".
      return {
        ok: false,
        status: res.status,
        data: { error: dict.nonJsonError },
      };
    }
  }

  function failConversion(status: number | undefined, message: string | undefined) {
    trackEvent("conversion_error", {
      reason: classifyConversionError({ status, message }),
    });
    setError(message || dict.conversionFailedFallback);
    setStep("error");
  }

  async function handleConvert() {
    if (!url.trim()) return;

    if (!isGoogleMapsUrl(url.trim())) {
      setError(dict.invalidUrlError);
      setStep("error");
      trackEvent("conversion_error", { reason: "invalid_url" });
      return;
    }

    setError("");
    setGpxData("");
    setStats(null);

    let resolvedUrl = url.trim();

    if (isShortUrl(resolvedUrl)) {
      setStep("resolving");
      const resolved = await postJson("/api/resolve-url", { url: resolvedUrl });
      if (!resolved.ok) {
        failConversion(resolved.status, resolved.data.error);
        return;
      }
      resolvedUrl = resolved.data.url as string;
    }

    setStep("routing");

    const converted = await postJson("/api/convert", { url: resolvedUrl });
    if (!converted.ok) {
      failConversion(converted.status, converted.data.error);
      return;
    }

    setGpxData(converted.data.gpx as string);
    setStats(converted.data.stats as Stats);
    setStep("done");
    trackEvent("route_conversion");
  }

  function handleDownload() {
    if (!gpxData) return;
    const blob = new Blob([gpxData], { type: "application/gpx+xml" });
    const objectUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = objectUrl;
    a.download = "route.gpx";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    trackEvent("gpx_download");
    // Delay revocation so Firefox has time to start the download before the blob URL dies.
    setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
  }

  function handleReset() {
    setUrl("");
    setStep("idle");
    setError("");
    setGpxData("");
    setStats(null);
  }

  const isLoading = !["idle", "done", "error"].includes(step);

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="glass-card rounded-2xl shadow-xl p-6 sm:p-8">
        {/* Input area */}
        <div className="space-y-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg
                className="w-5 h-5 text-zinc-400"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m9.86-2.688a4.5 4.5 0 00-1.242-7.244l-4.5-4.5a4.5 4.5 0 00-6.364 6.364L4.757 8.25"
                />
              </svg>
            </div>
            <input
              id="maps-url"
              type="url"
              placeholder={dict.placeholder}
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                if (step === "error") setStep("idle");
              }}
              onKeyDown={(e) => e.key === "Enter" && handleConvert()}
              disabled={isLoading}
              className="w-full pl-12 pr-4 py-4 rounded-xl border border-zinc-200 bg-white text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 disabled:opacity-50 transition-all text-sm"
            />
          </div>

          <button
            onClick={handleConvert}
            disabled={isLoading || !url.trim()}
            className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30 active:scale-[0.99]"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                {dict.convertingButton}
              </span>
            ) : (
              dict.convertButton
            )}
          </button>
        </div>

        {/* Progress */}
        {isLoading && (
          <div className="mt-5 flex items-center gap-3">
            <div className="flex gap-1">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse-slow" />
              <span
                className="w-2 h-2 rounded-full bg-blue-500 animate-pulse-slow"
                style={{ animationDelay: "0.3s" }}
              />
              <span
                className="w-2 h-2 rounded-full bg-blue-500 animate-pulse-slow"
                style={{ animationDelay: "0.6s" }}
              />
            </div>
            <span className="text-sm text-zinc-500">
              {STEP_LABELS[step]}
            </span>
          </div>
        )}

        {/* Error */}
        {step === "error" && error && (
          <div className="mt-5 p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3">
            <svg
              className="w-5 h-5 text-red-500 mt-0.5 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
              />
            </svg>
            <span className="text-sm text-red-700">
              {error}
            </span>
          </div>
        )}

        {/* Success */}
        {step === "done" && stats && (
          <div className="mt-6 space-y-5">
            {/* Success banner */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50 border border-emerald-200">
              <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                <svg
                  className="w-4.5 h-4.5 text-emerald-600"
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
              <span className="text-sm font-medium text-emerald-800">
                {dict.successBanner}
              </span>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-3">
              <StatCard
                icon={
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18" />
                  </svg>
                }
                label={dict.distanceLabel}
                value={`${stats.distanceKm} km`}
              />
              <StatCard
                icon={
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                }
                label={dict.waypointsLabel}
                value={`${stats.waypointCount}`}
              />
            </div>

            {/* Warnings */}
            {stats.warnings && stats.warnings.length > 0 && (
              <div className="space-y-1">
                {stats.warnings.map((warning, i) => (
                  <p key={i} className="text-xs text-amber-600">
                    {warning}
                  </p>
                ))}
              </div>
            )}

            {/* Action buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleDownload}
                className="flex-1 py-3.5 px-6 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-semibold transition-all shadow-lg shadow-emerald-600/20 hover:shadow-emerald-600/30 active:scale-[0.99] flex items-center justify-center gap-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                  />
                </svg>
                {dict.downloadButton}
              </button>
              <button
                onClick={handleReset}
                className="px-4 py-3.5 rounded-xl border border-zinc-200 text-zinc-600 hover:bg-zinc-100 transition-colors text-sm font-medium"
              >
                {dict.newButton}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="bg-zinc-50 rounded-xl p-3.5 text-center border border-zinc-100">
      <div className="flex items-center justify-center gap-1.5 text-zinc-400 mb-1">
        {icon}
        <span className="text-[11px] font-medium uppercase tracking-wider">
          {label}
        </span>
      </div>
      <div className="text-lg font-bold text-zinc-900">
        {value}
      </div>
    </div>
  );
}
