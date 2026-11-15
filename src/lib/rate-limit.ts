import { isIP } from 'node:net';

/** Only consume the platform-overwritten header, never client-supplied proxy headers. */
export function trustedClientIp(vercel: boolean, forwarded: string | null): string {
  const ip = forwarded?.split(',')[0].trim() ?? '';
  return vercel && isIP(ip) ? ip : 'unknown';
}

export function slotAvailable(usedAt: number, now: number, windowMs: number): boolean {
  return Number.isFinite(usedAt) && now - usedAt >= windowMs;
}

/** Bound both the offset and batch size before passing ranges to GROQ. */
export function commentPageRange(start: number, end: number) {
  if (!Number.isSafeInteger(start) || !Number.isSafeInteger(end) ||
      start < 0 || start > 10_000 || end <= start) return null;
  return { start, end: Math.min(end, start + 50, 10_050) };
}
