export type ConversionErrorReason =
  | "invalid_url"
  | "not_found"
  | "rate_limited"
  | "network"
  | "unknown";

export interface ConversionErrorInput {
  /** HTTP status of the failed response; omitted when the request itself didn't complete (e.g. offline). */
  status?: number;
  message?: string;
}

/** Messages /api/convert sends back for an address or route that couldn't be located. */
const NOT_FOUND_MESSAGES = [
  "Google could not find a route between these locations.",
];
const NOT_FOUND_PREFIXES = ["Could not find location:"];

/**
 * Classify a failed conversion into a coarse, analytics-safe reason code.
 * Never pass the raw URL, address, or full error message to analytics —
 * only the reason this function returns.
 */
export function classifyConversionError(
  input: ConversionErrorInput
): ConversionErrorReason {
  const { status, message = "" } = input;

  // No HTTP response at all means the request itself failed (offline, DNS,
  // CORS, etc.) — the server never had a chance to classify it.
  if (status === undefined) return "network";

  if (status === 429) return "rate_limited";
  // /api/resolve-url returns 502 when its own upstream fetch to the short
  // link failed or timed out.
  if (status === 502) return "network";

  if (status === 400) {
    if (
      NOT_FOUND_MESSAGES.includes(message) ||
      NOT_FOUND_PREFIXES.some((prefix) => message.startsWith(prefix))
    ) {
      return "not_found";
    }
    return "invalid_url";
  }

  return "unknown";
}
