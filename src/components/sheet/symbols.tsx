/**
 * Map-key symbols for the cycle map sheet. One stroke family: 1.75 on a
 * 24 grid, ink for structure and route magenta for anything that is "the
 * route". All decorative; the text beside each symbol carries the meaning.
 */

type SymbolProps = { className?: string };

const base = {
  "aria-hidden": true,
  focusable: false,
  viewBox: "0 0 24 24",
  fill: "none",
  strokeWidth: 1.75,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

export function StartRing({ className }: SymbolProps) {
  return (
    <svg {...base} className={className}>
      <circle cx="12" cy="12" r="6.5" fill="var(--color-paper)" stroke="var(--color-ink)" strokeWidth={2.5} />
    </svg>
  );
}

export function ViaPoint({ className }: SymbolProps) {
  return (
    <svg {...base} className={className}>
      <circle cx="12" cy="12" r="5" fill="var(--color-route)" stroke="var(--color-paper)" strokeWidth={2} />
    </svg>
  );
}

export function FinishFlag({ className }: SymbolProps) {
  return (
    <svg {...base} className={className}>
      <path d="M7 21V3.5l11 4.5-11 4.5" fill="var(--color-ink)" stroke="var(--color-ink)" strokeWidth={2} />
    </svg>
  );
}

export function RouteLine({ className }: SymbolProps) {
  return (
    <svg {...base} viewBox="0 0 36 12" className={className}>
      <path d="M2 6h32" stroke="var(--color-route)" strokeWidth={5} />
    </svg>
  );
}

export function Warning({ className }: SymbolProps) {
  return (
    <svg {...base} className={className}>
      <path d="M12 3.5 21.5 20h-19Z" fill="var(--color-paper)" stroke="currentColor" />
      <path d="M12 9.5v4.5M12 17v.01" stroke="currentColor" strokeWidth={2} />
    </svg>
  );
}

export function Closure({ className }: SymbolProps) {
  return (
    <svg {...base} className={className}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" />
      <path d="M7 12h10" stroke="currentColor" strokeWidth={2.5} />
    </svg>
  );
}

export function Tick({ className }: SymbolProps) {
  return (
    <svg {...base} className={className}>
      <path d="m5.5 12.5 4 4 9-9.5" stroke="currentColor" strokeWidth={2.25} />
    </svg>
  );
}

export function Download({ className }: SymbolProps) {
  return (
    <svg {...base} className={className}>
      <path d="M12 3.5v12m0 0-5-5m5 5 5-5M4 20.5h16" stroke="currentColor" strokeWidth={2.25} />
    </svg>
  );
}

/** Site mark: a start ring, a route stroke, and a finish flag. */
export function SiteMark({ className }: SymbolProps) {
  return (
    <svg aria-hidden="true" focusable="false" viewBox="0 0 28 28" fill="none" className={className}>
      <circle cx="6.5" cy="21" r="4" fill="var(--color-paper)" stroke="var(--color-ink)" strokeWidth={2.25} />
      <path d="M8.5 17.5C12 7 16 23 21 8" stroke="var(--color-route)" strokeWidth={3} strokeLinecap="round" />
      <path d="M21 8V1.75l5 2.25-5 2.25" fill="var(--color-ink)" stroke="var(--color-ink)" strokeWidth={1.5} strokeLinejoin="round" />
    </svg>
  );
}

/* ---- Feature legend symbols, in the order of dict.features.items ---- */

/** No account: an open field gate. */
function OpenGate({ className }: SymbolProps) {
  return (
    <svg {...base} viewBox="0 0 40 40" className={className}>
      <path d="M6 8v26M34 8v26" stroke="var(--color-ink)" strokeWidth={2.5} />
      <path d="M6 14l13-8M6 24l13-8M6 14v10M19 6v10" stroke="var(--color-ink)" />
      <path d="M22 30h12" stroke="var(--color-route)" strokeWidth={3} />
    </svg>
  );
}

/** Exact route: a route stroke joining a start ring to a finish flag. */
function ExactRoute({ className }: SymbolProps) {
  return (
    <svg {...base} viewBox="0 0 40 40" className={className}>
      <path d="M9 31C14 14 24 34 30 12" stroke="var(--color-route)" strokeWidth={3.5} />
      <circle cx="9" cy="31" r="4" fill="var(--color-paper)" stroke="var(--color-ink)" strokeWidth={2.25} />
      <path d="M30 12V3.5l7 3-7 3" fill="var(--color-ink)" stroke="var(--color-ink)" strokeWidth={1.5} />
    </svg>
  );
}

/** All travel modes: three road classes, as a map key draws them. */
function RoadClasses({ className }: SymbolProps) {
  return (
    <svg {...base} viewBox="0 0 40 40" className={className}>
      <path d="M4 10h32" stroke="var(--color-ink)" strokeWidth={4} />
      <path d="M4 10h32" stroke="var(--color-paper)" strokeWidth={1.5} />
      <path d="M4 20h32" stroke="var(--color-ink)" strokeDasharray="5 4" />
      <path d="M4 30h32" stroke="var(--color-route)" strokeWidth={3} strokeDasharray="0.1 5" />
    </svg>
  );
}

/** Universal compatibility: a bike computer head unit. */
function HeadUnit({ className }: SymbolProps) {
  return (
    <svg {...base} viewBox="0 0 40 40" className={className}>
      <rect x="10" y="4" width="20" height="30" rx="4" stroke="var(--color-ink)" strokeWidth={2.25} />
      <rect x="14" y="9" width="12" height="14" rx="1" fill="var(--color-land)" stroke="var(--color-ink)" />
      <path d="M16 20c2-5 5 1 8-6" stroke="var(--color-route)" strokeWidth={2} />
      <path d="M17 28h6M14 37h12" stroke="var(--color-ink)" />
    </svg>
  );
}

/** Trusted by thousands: a town symbol, settlement dots inside a ring. */
export function Town({ className }: SymbolProps) {
  return (
    <svg {...base} viewBox="0 0 40 40" className={className}>
      <circle cx="20" cy="20" r="14" stroke="var(--color-ink)" strokeWidth={2.25} />
      {[
        [15, 15],
        [22, 13],
        [26, 21],
        [18, 22],
        [13, 26],
        [23, 28],
      ].map(([x, y]) => (
        <rect key={`${x}-${y}`} x={x - 1.75} y={y - 1.75} width="3.5" height="3.5" fill="var(--color-ink)" stroke="none" />
      ))}
    </svg>
  );
}

/** All URL formats: a junction where several roads meet. */
function Junction({ className }: SymbolProps) {
  return (
    <svg {...base} viewBox="0 0 40 40" className={className}>
      <path d="M20 20 6 8M20 20l15-9M20 20v16M20 20 4 27" stroke="var(--color-ink)" strokeWidth={2.25} />
      <path d="M20 20l15-9" stroke="var(--color-route)" strokeWidth={3} />
      <circle cx="20" cy="20" r="3.5" fill="var(--color-paper)" stroke="var(--color-ink)" strokeWidth={2} />
    </svg>
  );
}

export const FEATURE_SYMBOLS = [OpenGate, ExactRoute, RoadClasses, HeadUnit, Town, Junction];
