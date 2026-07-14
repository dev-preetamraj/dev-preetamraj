import { describe, expect, test } from 'bun:test';
import type { PortableTextBlock } from '@portabletext/types';

import {
  SECONDS_PER_CODE_LINE,
  SECONDS_PER_IMAGE,
  WORDS_PER_MINUTE,
  countCodeLines,
  countImages,
  countWords,
  readingTimeMinutes,
} from '../reading-time';

const block = (...texts: string[]): PortableTextBlock =>
  ({
    _type: 'block',
    children: texts.map((text) => ({ _type: 'span', text })),
  }) as unknown as PortableTextBlock;

const words = (n: number): PortableTextBlock =>
  block(Array.from({ length: n }, (_, i) => `w${i}`).join(' '));

const code = (source: string): PortableTextBlock =>
  ({ _type: 'code', code: source }) as unknown as PortableTextBlock;

const image = (): PortableTextBlock =>
  ({ _type: 'image' }) as unknown as PortableTextBlock;

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
    expect(countWords([block('only these two'), image(), code('a b c')])).toBe(3);
  });
});

describe('countCodeLines', () => {
  test('returns 0 when there are no code blocks', () => {
    expect(countCodeLines([block('just prose')])).toBe(0);
  });

  test('counts non-blank lines and skips blank ones', () => {
    expect(countCodeLines([code('const a = 1;\n\nreturn a;\n')])).toBe(2);
  });

  test('sums across multiple code blocks', () => {
    expect(countCodeLines([code('a\nb'), block('x'), code('c')])).toBe(3);
  });
});

describe('countImages', () => {
  test('counts only top-level image blocks', () => {
    expect(countImages([image(), block('x'), image(), code('y')])).toBe(2);
  });
});

describe('readingTimeMinutes', () => {
  test('empty content reads as 0 minutes', () => {
    expect(readingTimeMinutes([])).toBe(0);
  });

  test('rounds to at least 1 minute', () => {
    expect(readingTimeMinutes([block('a few words')])).toBe(1);
  });

  test('rounds prose to the nearest minute', () => {
    expect(readingTimeMinutes([words(WORDS_PER_MINUTE * 3)])).toBe(3);
    expect(readingTimeMinutes([words(WORDS_PER_MINUTE * 3 + WORDS_PER_MINUTE / 2)])).toBe(4);
  });

  test('adds code-block time on top of prose', () => {
    const lines = (60 / SECONDS_PER_CODE_LINE) * 2; // exactly 2 minutes of code
    const source = Array.from({ length: lines }, (_, i) => `line${i}`).join('\n');
    expect(readingTimeMinutes([words(WORDS_PER_MINUTE), code(source)])).toBe(3);
  });

  test('adds image dwell time', () => {
    const imgs = Array.from({ length: 60 / SECONDS_PER_IMAGE }, image); // 1 minute
    expect(readingTimeMinutes([words(WORDS_PER_MINUTE), ...imgs])).toBe(2);
  });

  test('a short code snippet alone still reads as at least 1 minute', () => {
    expect(readingTimeMinutes([code('console.log(1);')])).toBe(1);
  });
});
