import { describe, expect, it } from 'vitest';
import {
  blogBySlugQuery,
  blogSearchQuery,
  categoriesQuery,
  combinedSearchQuery,
  blogsQuery,
  portfoliosQuery,
  tagsQuery,
  trendingBlogsQuery,
} from '@/sanity/lib/queries';

describe('GROQ Queries', () => {
  it('blogsQuery filters by document type only', () => {
    expect(blogsQuery).toContain('_type == "blog"');
    expect(blogsQuery).not.toContain('isPublished');
  });

  it('blogsQuery orders by _createdAt desc', () => {
    expect(blogsQuery).toContain('order(_createdAt desc)');
  });

  it('blogsQuery dereferences category', () => {
    expect(blogsQuery).toContain('category->{');
  });

  it('blogBySlugQuery matches slug.current', () => {
    expect(blogBySlugQuery).toContain('slug.current == $slug');
  });

  it('blogBySlugQuery returns a single document [0]', () => {
    expect(blogBySlugQuery).toContain('[0]');
  });

  it('blogBySlugQuery dereferences tags', () => {
    expect(blogBySlugQuery).toContain('tags[]->{');
  });

  it('trendingBlogsQuery limits to 5', () => {
    expect(trendingBlogsQuery).toContain('[0...5]');
  });

  it('blogSearchQuery uses match operator for keyword search', () => {
    expect(blogSearchQuery).toContain('title match $keyword');
  });

  it('categoriesQuery fetches all categories', () => {
    expect(categoriesQuery).toContain('_type == "category"');
  });

  it('tagsQuery fetches all tags', () => {
    expect(tagsQuery).toContain('_type == "tag"');
  });

  it('portfoliosQuery filters by document type only', () => {
    expect(portfoliosQuery).toContain('_type == "portfolio"');
    expect(portfoliosQuery).not.toContain('isPublished');
  });

  it('combinedSearchQuery searches across all 4 types', () => {
    expect(combinedSearchQuery).toContain('"blogs"');
    expect(combinedSearchQuery).toContain('"projects"');
    expect(combinedSearchQuery).toContain('"categories"');
    expect(combinedSearchQuery).toContain('"tags"');
  });

  it('combinedSearchQuery uses keyword parameter', () => {
    expect(combinedSearchQuery).toContain('$keyword');
  });
});
