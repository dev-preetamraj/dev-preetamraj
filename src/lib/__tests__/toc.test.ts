import { describe, expect, test } from 'bun:test';

import { buildToc, slugifyHeading, tocIdsByKey } from '../toc';

const heading = (style: string, text: string, key: string) => ({
  _type: 'block',
  _key: key,
  style,
  children: [{ _type: 'span', text }],
});

describe('slugifyHeading', () => {
  test('lowercases and joins words with dashes', () => {
    expect(slugifyHeading('It Always Starts Innocent')).toBe(
      'it-always-starts-innocent'
    );
  });

  test('drops punctuation and accents', () => {
    expect(slugifyHeading("What's `new`, café?")).toBe('what-s-new-cafe');
  });

  test('falls back to "section" when nothing is left', () => {
    expect(slugifyHeading('!!!')).toBe('section');
  });
});

describe('buildToc', () => {
  test('collects h2/h3 in order and treats content h1 as level 2', () => {
    const toc = buildToc([
      heading('h1', 'Intro', 'a'),
      heading('normal', 'Body text', 'b'),
      heading('h3', 'Detail', 'c'),
      heading('h4', 'Too deep', 'd'),
      heading('h2', 'Next', 'e'),
    ]);
    expect(toc.map((t) => [t.id, t.level])).toEqual([
      ['intro', 2],
      ['detail', 3],
      ['next', 2],
    ]);
  });

  test('dedupes repeated headings with a numeric suffix', () => {
    const toc = buildToc([
      heading('h2', 'Example', 'a'),
      heading('h2', 'Example', 'b'),
      heading('h3', 'Example', 'c'),
    ]);
    expect(toc.map((t) => t.id)).toEqual(['example', 'example-2', 'example-3']);
  });

  test('skips empty headings, non-blocks and missing input', () => {
    expect(
      buildToc([heading('h2', '   ', 'a'), { _type: 'image', _key: 'b' }, null])
    ).toEqual([]);
    expect(buildToc(undefined)).toEqual([]);
  });

  test('joins multi-span text and maps keys to ids', () => {
    const toc = buildToc([
      {
        _type: 'block',
        _key: 'k1',
        style: 'h2',
        children: [{ text: 'Hello ' }, { text: 'World' }],
      },
    ]);
    expect(toc[0]).toEqual({
      key: 'k1',
      id: 'hello-world',
      text: 'Hello World',
      level: 2,
    });
    expect(tocIdsByKey(toc).get('k1')).toBe('hello-world');
  });
});
