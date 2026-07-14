import { describe, expect, test } from 'bun:test';
import type { PortableTextBlock } from '@portabletext/types';

import { WORDS_PER_MINUTE, countWords, readingTimeMinutes } from '../reading-time';

const block = (...texts: string[]): PortableTextBlock =>
  ({
    _type: 'block',
    children: texts.map((text) => ({ _type: 'span', text })),
  }) as unknown as PortableTextBlock;

const words = (n: number): PortableTextBlock =>
  block(Array.from({ length: n }, (_, i) => `w${i}`).join(' '));

describe('countWords', () => {
  test('returns 0 for empty or missing content', () => {
    expect(countWords(null)).toBe(0);
    expect(countWords(undefined)).toBe(0);
    expect(countWords([])).toBe(0);
  });

  test('counts words across children and blocks', () => {
    expect(countWords([block('one two', ' three'), block('four')])).toBe(4);
  });

  test('collapses irregular whitespace', () => {
    expect(countWords([block('  a   b\n\tc  ')])).toBe(3);
  });

  test('ignores non-block types (images, code)', () => {
    const image = { _type: 'image' } as unknown as PortableTextBlock;
    const code = { _type: 'code', code: 'a b c' } as unknown as PortableTextBlock;
    expect(countWords([block('only these two'), image, code])).toBe(3);
  });
});

describe('readingTimeMinutes', () => {
  test('empty content reads as 0 minutes', () => {
    expect(readingTimeMinutes([])).toBe(0);
  });

  test('rounds up to at least 1 minute', () => {
    expect(readingTimeMinutes([block('a few words')])).toBe(1);
  });

  test('rounds partial minutes up', () => {
    expect(readingTimeMinutes([words(WORDS_PER_MINUTE + 1)])).toBe(2);
  });

  test('scales with word count', () => {
    expect(readingTimeMinutes([words(WORDS_PER_MINUTE * 3)])).toBe(3);
  });
});
