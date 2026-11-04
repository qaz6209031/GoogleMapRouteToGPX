"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import DonateLinks from "@/components/DonateLinks";
import {
  Closure,
  Download,
  FinishFlag,
  RouteLine,
  StartRing,
  Tick,
  Warning,
} from "@/components/sheet/symbols";
import { trackEvent } from "@/lib/analytics";
import { classifyConversionError } from "@/lib/conversion-error";
import { isGoogleMapsUrl, isShortUrl } from "@/lib/google-hosts";
import { parseGpxTrack, projectRoute, type Point } from "@/lib/route-shape";
import type { Dictionary } from "@/i18n/dictionary";

interface Stats {
  distanceKm: number;
  waypointCount: number;
  warnings?: string[];
}

type Step = "idle" | "resolving" | "routing" | "done" | "error";

/** Map box the route is drawn into; the SVG scales it to the column. */
const MAP_W = 800;
const MAP_H = 600;
const MAP_PAD = 64;

const SAMPLE_ROUTE =
  "M118 438C188 468 204 366 284 352S404 398 432 314S470 196 560 204S690 282 700 362S652 470 594 484";

export default function ConverterForm({
  dict,
  donate,
  donateLinks,
  children,
}: {
  dict: Dictionary["converterForm"];
  donate: Dictionary["donate"];
  donateLinks: Dictionary["donateLinks"];
  /** The sheet's headline block, set above the legend box. */
  children: ReactNode;
}) {
  const [url, setUrl] = useState("");
  const [step, setStep] = useState<Step>("idle");
  const [error, setError] = useState("");
  const [gpxData, setGpxData] = useState("");
  const [stats, setStats] = useState<Stats | null>(null);
  const [routeKey, setRouteKey] = useState(0);

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

  async function handleConvert(e?: React.FormEvent) {
    e?.preventDefault();

    if (!url.trim() || !isGoogleMapsUrl(url.trim())) {
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
    setRouteKey((k) => k + 1);
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

  const isLoading = step === "resolving" || step === "routing";
  const track = useMemo(() => (gpxData ? parseGpxTrack(gpxData) : []), [gpxData]);
  const shape = useMemo(() => projectRoute(track, MAP_W, MAP_H, MAP_PAD), [track]);

  return (
    <div className="relative grid gap-10 lg:grid-cols-[minmax(0,35rem)_minmax(0,1fr)] lg:gap-12">
      <div className="flex flex-col">
        {children}

        <section
          aria-labelledby="legend-title"
          className="mt-8 border-[1.5px] border-ink bg-paper"
        >
          <div className="flex items-center justify-between gap-4 border-b-[1.5px] border-ink px-4 py-2.5 sm:px-5">
            <h2
              id="legend-title"
              className="font-lettering text-[14px] font-bold uppercase tracking-[0.16em]"
            >
              {dict.legendTitle}
            </h2>
            <RouteLine className="h-3 w-9" />
          </div>

          <div className="px-4 py-4 sm:px-5 sm:py-5">
            {step !== "done" && (
              <form
                onSubmit={handleConvert}
                className="flex flex-col gap-1.5 border-[1.5px] border-ink bg-white p-1.5 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-route sm:flex-row"
              >
                <input
                  id="maps-url"
                  type="url"
                  inputMode="url"
                  autoComplete="off"
                  aria-label={dict.placeholder}
                  placeholder={dict.placeholder}
                  value={url}
                  onChange={(e) => {
                    setUrl(e.target.value);
                    if (step === "error") setStep("idle");
                  }}
                  disabled={isLoading}
                  className="h-12 min-w-0 flex-1 bg-transparent px-3 text-base text-ink placeholder:text-ink-soft focus-visible:outline-none disabled:opacity-60"
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="h-12 shrink-0 bg-route px-6 font-lettering text-[19px] font-bold uppercase tracking-[0.06em] text-white transition-colors hover:bg-route-deep disabled:cursor-wait disabled:bg-route-deep"
                >
                  {isLoading ? dict.convertingButton : dict.convertButton}
                </button>
              </form>
            )}

            <p className="sr-only" aria-live="polite">
              {step === "error" ? dict.stepLabels.error : dict.stepLabels[step]}
            </p>

            {step === "error" && error && (
              <div
                role="alert"
                className="mt-4 flex items-start gap-3 border-[1.5px] border-closure bg-white px-4 py-3"
              >
                <Closure className="mt-0.5 h-5 w-5 shrink-0 text-closure" />
                <p className="text-[15px] leading-relaxed text-ink">{error}</p>
              </div>
            )}

            {step === "done" && stats && (
              <div className="space-y-4">
                <p className="mt-4 flex items-center gap-2 font-lettering text-[19px] font-bold uppercase tracking-[0.04em]">
                  <Tick className="h-5 w-5 text-route" />
                  {dict.successBanner}
                </p>

                <dl className="grid grid-cols-2 border-y-[1.5px] border-ink">
                  <div className="py-3 pr-4">
                    <dt className="font-lettering text-[13px] font-semibold uppercase tracking-[0.14em] text-ink-soft">
                      {dict.distanceLabel}
                    </dt>
                    <dd className="mt-1 font-lettering text-[30px] font-bold leading-none tabular-nums">
                      {stats.distanceKm} km
                    </dd>
                  </div>
                  <div className="border-l border-ink/30 py-3 pl-4">
                    <dt className="font-lettering text-[13px] font-semibold uppercase tracking-[0.14em] text-ink-soft">
                      {dict.waypointsLabel}
                    </dt>
                    <dd className="mt-1 font-lettering text-[30px] font-bold leading-none tabular-nums">
                      {stats.waypointCount}
                    </dd>
                  </div>
                </dl>

                {stats.warnings && stats.warnings.length > 0 && (
                  <ul className="space-y-1.5">
                    {stats.warnings.map((warning, i) => (
                      <li key={i} className="flex items-start gap-2 text-[14px] leading-snug text-ink-soft">
                        <Warning className="mt-px h-4 w-4 shrink-0 text-ink" />
                        {warning}
                      </li>
                    ))}
                  </ul>
                )}

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleDownload}
                    className="flex h-12 flex-1 items-center justify-center gap-2 bg-route px-6 font-lettering text-[19px] font-bold uppercase tracking-[0.06em] text-white transition-colors hover:bg-route-deep"
                  >
                    <Download className="h-5 w-5" />
                    {dict.downloadButton}
                  </button>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="h-12 border-[1.5px] border-ink px-5 font-lettering text-[16px] font-semibold uppercase tracking-[0.08em] transition-colors hover:bg-land"
                  >
                    {dict.newButton}
                  </button>
                </div>

                <div className="border-t-[1.5px] border-dashed border-ink/50 pt-4">
                  <p className="font-lettering text-[17px] font-bold uppercase tracking-[0.03em]">
                    {donate.heading}
                  </p>
                  <p className="mt-1 text-[14px] leading-relaxed text-ink-soft">{donate.description}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <DonateLinks dict={donateLinks} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>

      <RouteMap key={routeKey} dict={dict.map} shape={step === "done" ? shape : null} distanceKm={stats?.distanceKm} />
    </div>
  );
}

function RouteMap({
  dict,
  shape,
  distanceKm,
}: {
  dict: Dictionary["converterForm"]["map"];
  shape: ReturnType<typeof projectRoute>;
  distanceKm?: number;
}) {
  const pathRef = useRef<SVGPathElement>(null);
  const [sampleTicks, setSampleTicks] = useState<Point[]>([]);

  useEffect(() => {
    if (shape || !pathRef.current) return;
    const path = pathRef.current;
    const length = path.getTotalLength();
    const ticks: Point[] = [];
    for (let i = 1; i < 8; i++) {
      const p = path.getPointAtLength((length * i) / 8);
      ticks.push({ x: p.x, y: p.y });
    }
    setSampleTicks(ticks);
  }, [shape]);

  const d = shape ? shape.d : SAMPLE_ROUTE;
  const start = shape ? shape.start : { x: 118, y: 438 };
  const end = shape ? shape.end : { x: 594, y: 484 };
  const ticks = shape ? shape.ticks : sampleTicks;
  const label = shape
    ? dict.routeAlt.replace("{km}", String(distanceKm ?? ""))
    : dict.sampleAlt;

  return (
    <figure className="relative sm:h-[26rem] lg:h-auto lg:min-h-[30rem]">
      <div className="relative -mx-4 h-[20rem] sm:absolute sm:inset-0 sm:mx-0 sm:h-auto">
      <svg
        role="img"
        aria-label={label}
        viewBox={`0 0 ${MAP_W} ${MAP_H}`}
        preserveAspectRatio="xMidYMid meet"
        className="absolute inset-0 h-full w-full"
      >
        <path
          d={d}
          pathLength={1}
          className="route-draw"
          fill="none"
          stroke="var(--color-paper)"
          strokeWidth={13}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={0.9}
        />
        <path
          ref={pathRef}
          d={d}
          pathLength={1}
          className="route-draw"
          fill="none"
          stroke="var(--color-route)"
          strokeWidth={6}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <g className="route-after">
          {ticks.map((t, i) => (
            <circle key={i} cx={t.x} cy={t.y} r={3.2} fill="var(--color-paper)" />
          ))}
          <path
            d={`M${end.x} ${end.y}V${end.y - 38}l22 9-22 9`}
            fill="var(--color-ink)"
            stroke="var(--color-ink)"
            strokeWidth={3}
            strokeLinejoin="round"
          />
        </g>
        <circle cx={start.x} cy={start.y} r={10} fill="var(--color-paper)" stroke="var(--color-ink)" strokeWidth={3.5} />

        {shape && (
          <g className="route-after" transform={`translate(${MAP_PAD} ${MAP_H - 30})`}>
            {[0, 1, 2, 3].map((i) => (
              <rect
                key={i}
                x={(shape.scaleWidth / 4) * i}
                y={0}
                width={shape.scaleWidth / 4}
                height={8}
                fill={i % 2 === 0 ? "var(--color-ink)" : "var(--color-paper)"}
                stroke="var(--color-ink)"
                strokeWidth={1.5}
              />
            ))}
            <text
              x={shape.scaleWidth + 10}
              y={8}
              fill="var(--color-ink)"
              style={{ font: "600 15px var(--font-lettering)", letterSpacing: "0.08em" }}
            >
              {shape.scaleKm} km
            </text>
          </g>
        )}
      </svg>
      </div>

      <figcaption className="mt-3 w-fit border-[1.5px] border-ink bg-paper px-4 py-3 sm:absolute sm:bottom-0 sm:right-0 sm:mt-0 lg:bottom-auto lg:top-0">
        <ul className="grid grid-cols-[2.25rem_auto] justify-start items-center gap-x-3 gap-y-2 font-lettering text-[14px] font-semibold uppercase tracking-[0.1em]">
          <li className="contents">
            <RouteLine className="h-3 w-9" />
            <span>{shape ? dict.yourRoute : dict.sampleLabel}</span>
          </li>
          <li className="contents">
            <StartRing className="mx-auto h-5 w-5" />
            <span>{dict.start}</span>
          </li>
          <li className="contents">
            <FinishFlag className="mx-auto h-5 w-5" />
            <span>{dict.finish}</span>
          </li>
        </ul>
        {shape && (
          <p className="mt-2 max-w-[15rem] border-t border-ink/30 pt-2 text-[12px] leading-snug text-ink-soft">
            {dict.caption}
          </p>
        )}
      </figcaption>
    </figure>
  );
}
