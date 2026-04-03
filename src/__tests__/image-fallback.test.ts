import { describe, expect, it } from 'vitest';

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1549558549-415fe4c37b60';

type SanityImage = {
  asset?: { _ref: string };
  alt?: string;
  _type: 'image';
} | null;

function resolveImageUrl(featuredImage: SanityImage): string {
  return featuredImage?.asset ? 'sanity-url-would-go-here' : FALLBACK_IMAGE;
}

describe('Image fallback pattern', () => {
  it('returns fallback when featuredImage is null', () => {
    expect(resolveImageUrl(null)).toBe(FALLBACK_IMAGE);
  });

  it('returns fallback when featuredImage has no asset', () => {
    expect(resolveImageUrl({ _type: 'image' })).toBe(FALLBACK_IMAGE);
  });

  it('returns sanity URL when featuredImage has asset', () => {
    expect(
      resolveImageUrl({
        _type: 'image',
        asset: { _ref: 'image-abc-123' },
      })
    ).toBe('sanity-url-would-go-here');
  });
});
