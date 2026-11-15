import { describe, expect, test } from 'bun:test';

import { commentPageRange, slotAvailable, trustedClientIp } from '../rate-limit';

describe('comment rate limit helpers', () => {
  test('slots stay occupied until the full sliding window has elapsed', () => {
    expect(slotAvailable(1000, 1099, 100)).toBe(false);
    expect(slotAvailable(1000, 1100, 100)).toBe(true);
    expect(slotAvailable(1000, 999, 100)).toBe(false);
    expect(slotAvailable(NaN, 1100, 100)).toBe(false);
  });
  test('unknown or untrusted proxy identity shares the fallback bucket', () => {
    expect(trustedClientIp(false, '192.0.2.1')).toBe('unknown');
    expect(trustedClientIp(true, null)).toBe('unknown');
    expect(trustedClientIp(true, 'garbage')).toBe('unknown');
    expect(trustedClientIp(true, '192.0.2.1, 10.0.0.1')).toBe('192.0.2.1');
  });
  test('pagination rejects invalid offsets and caps page size', () => {
    for (const [start, end] of [[-1, 10], [0.5, 10], [0, Infinity], [NaN, 10], [10, 10], [10, 9], [10001, 10002]]) {
      expect(commentPageRange(start, end)).toBeNull();
    }
    expect(commentPageRange(0, 100000)).toEqual({ start: 0, end: 50 });
    expect(commentPageRange(10, 20)).toEqual({ start: 10, end: 20 });
  });
});
