/**
 * The printed ground of the map sheet: woodland tints and contour lines.
 * Purely decorative, generated deterministically at render time so the
 * sheet looks the same on every load and ships no client JS.
 */

type Hill = { cx: number; cy: number; r: number; rings: number; phase: number };
type Wood = { cx: number; cy: number; rx: number; ry: number; phase: number };

const HILLS: Hill[] = [
  { cx: 1080, cy: 260, r: 330, rings: 10, phase: 0.4 },
  { cx: 820, cy: 640, r: 240, rings: 7, phase: 2.1 },
  { cx: 1360, cy: 820, r: 220, rings: 6, phase: 4.3 },
  { cx: 380, cy: 760, r: 260, rings: 7, phase: 5.7 },
];

const WOODS: Wood[] = [
  { cx: 1210, cy: 360, rx: 150, ry: 88, phase: 1.3 },
  { cx: 700, cy: 790, rx: 190, ry: 64, phase: 3.2 },
  { cx: 1290, cy: 690, rx: 118, ry: 76, phase: 0.6 },
  { cx: 960, cy: 110, rx: 112, ry: 46, phase: 2.7 },
];

function ring(cx: number, cy: number, rx: number, ry: number, phase: number, j: number, steps: number) {
  let d = "";
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * Math.PI * 2;
    const k =
      1 +
      0.16 * Math.sin(t * 3 + phase + j * 0.3) +
      0.08 * Math.sin(t * 7 + phase * 1.7) +
      0.035 * Math.sin(t * 13 + j);
    const x = cx + Math.cos(t) * rx * k;
    const y = cy + Math.sin(t) * ry * k;
    d += `${i === 0 ? "M" : "L"}${Math.round(x)} ${Math.round(y)}`;
  }
  return `${d}Z`;
}

const WOOD_PATHS = WOODS.map((w) => ring(w.cx, w.cy, w.rx, w.ry, w.phase, 0, 40));

const CONTOURS = HILLS.flatMap((h) =>
  Array.from({ length: h.rings }, (_, i) => {
    const j = i + 1;
    const rr = (h.r * j) / h.rings;
    return {
      d: ring(h.cx, h.cy, rr * 1.25, rr * 0.85, h.phase, j, 64),
      index: j % 5 === 0,
    };
  }),
);

/** An unnamed stream; decorative like the rest of the ground, so it carries no label. */
const STREAM =
  "M560 900C640 812 760 770 812 700S930 590 1010 604 1150 668 1240 640 1380 560 1440 548";

export default function MapGround({
  className = "",
  variant = "full",
}: {
  className?: string;
  /** "quiet" is the lower-sheet ground: flipped, no woodland, lighter lines. */
  variant?: "full" | "quiet";
}) {
  const quiet = variant === "quiet";
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      className={className}
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
    >
      <g transform={quiet ? "translate(0 900) scale(1 -1)" : undefined} opacity={quiet ? 0.55 : 1}>
      {!quiet && WOOD_PATHS.map((d, i) => (
        <path key={`w${i}`} d={d} fill="var(--color-wood)" stroke="var(--color-wood-edge)" strokeWidth={1.5} />
      ))}
      <g fill="none" stroke="var(--color-contour)" opacity={0.72}>
        {CONTOURS.map((c, i) => (
          <path key={i} d={c.d} strokeWidth={c.index ? 1.7 : 0.9} />
        ))}
      </g>
      {!quiet && (
        <path d={STREAM} fill="none" stroke="var(--color-water)" strokeWidth={5} strokeLinecap="round" opacity={0.8} />
      )}
      </g>
    </svg>
  );
}
