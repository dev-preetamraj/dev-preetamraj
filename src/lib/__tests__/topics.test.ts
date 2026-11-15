import { describe, expect, test } from 'bun:test';

import { dedupeTopics, topicLabel } from '../topics';

const t = (name: string) => ({ name, slug: name.toLowerCase() });

describe('dedupeTopics', () => {
  test('category first, then tags in order', () => {
    expect(
      dedupeTopics(t('Clean Code'), [t('SOLID'), t('Testing')]).map(
        (x) => `${x.kind}:${x.name}`
      )
    ).toEqual(['category:Clean Code', 'tag:SOLID', 'tag:Testing']);
  });

  test('drops tags equal to the category, case-insensitively', () => {
    expect(
      dedupeTopics(t('Python'), [t('python'), t('LLM')]).map((x) => x.name)
    ).toEqual(['Python', 'LLM']);
    expect(
      dedupeTopics(t('Design Patterns'), [t(' design patterns ')]).length
    ).toBe(1);
  });

  test('drops repeated tags and blank names', () => {
    expect(
      dedupeTopics(null, [t('AI'), t('ai'), t('  '), t('LLM')]).map(
        (x) => x.name
      )
    ).toEqual(['AI', 'LLM']);
  });

  test('handles missing input', () => {
    expect(dedupeTopics(undefined, undefined)).toEqual([]);
  });
});

describe('topicLabel', () => {
  test('hashes tags only', () => {
    expect(topicLabel({ name: 'python', kind: 'tag' })).toBe('#python');
    expect(topicLabel({ name: 'Python', kind: 'category' })).toBe('Python');
  });
});
