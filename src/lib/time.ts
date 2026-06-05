/**
 * Global time-formatting utilities.
 *
 * Durations are stored in Sanity as a whole number of SECONDS. These helpers
 * convert that canonical value into clean, colon-delimited display strings —
 * never the legacy prime/apostrophe ("4'30") notation.
 */

/**
 * Format a total number of seconds as a clean colon-delimited time string.
 *
 *   270   -> "4:30"      (4 minutes, 30 seconds)
 *   900   -> "15:00"     (15 minutes)
 *   65    -> "1:05"
 *   4920  -> "1:22:00"   (82 minutes -> 1 hour 22 minutes)
 *
 * Minutes and (when present) seconds are zero-padded to two digits. Hours are
 * only included when the duration reaches an hour or more.
 *
 * Returns `null` for missing or invalid input so callers can omit the field.
 */
export function formatDuration(totalSeconds: number | null | undefined): string | null {
  if (typeof totalSeconds !== "number" || !Number.isFinite(totalSeconds) || totalSeconds < 0) {
    return null;
  }

  const whole = Math.round(totalSeconds);
  const hours = Math.floor(whole / 3600);
  const minutes = Math.floor((whole % 3600) / 60);
  const seconds = whole % 60;

  const pad = (n: number) => n.toString().padStart(2, "0");

  if (hours > 0) {
    return `${hours}:${pad(minutes)}:${pad(seconds)}`;
  }
  return `${minutes}:${pad(seconds)}`;
}
