import { describe, expect, test } from 'bun:test';

import { formatDate, toISODate } from '../format-date';

describe('formatDate', () => {
  test('formats a normal date in the short day-first form', () => {
    expect(formatDate('2026-07-13T10:00:00Z')).toBe('13 Jul 2026');
  });

  test('uses IST, so a late-UTC instant rolls over to the next day', () => {
    // 20:00 UTC on 31 Dec is 01:30 IST on 1 Jan.
    expect(formatDate('2025-12-31T20:00:00Z')).toBe('1 Jan 2026');
    // 18:29 UTC is still 23:59 IST the same day.
    expect(formatDate('2025-12-31T18:29:00Z')).toBe('31 Dec 2025');
  });

  test('accepts Date and epoch-ms input', () => {
    const ms = Date.UTC(2026, 6, 13, 10);
    expect(formatDate(new Date(ms))).toBe('13 Jul 2026');
    expect(formatDate(ms)).toBe('13 Jul 2026');
  });

  test('returns an empty string for missing or invalid input', () => {
    expect(formatDate('not a date')).toBe('');
    expect(formatDate('')).toBe('');
    expect(formatDate(null)).toBe('');
    expect(formatDate(undefined)).toBe('');
    expect(formatDate(new Date(Number.NaN))).toBe('');
  });
});

describe('toISODate', () => {
  test('returns ISO for valid input and empty string for invalid', () => {
    expect(toISODate('2026-07-13T10:00:00Z')).toBe('2026-07-13T10:00:00.000Z');
    expect(toISODate('nope')).toBe('');
  });
});
