'use client';

import { useCallback } from 'react';

import { useInfiniteScroll } from '@/hooks/use-infinite-scroll';
import {
  POSTS_BATCH_SIZE,
  POSTS_INITIAL_BATCH_SIZE,
} from '@/lib/constants';
import { PostListItem } from '@/sanity/lib/queries';
import BlogCard from './BlogCard';

type Props = {
  /** Full list, already sorted server-side by the active mode. */
  blogs: PostListItem[];
};

const BlogListInfinite = ({ blogs }: Props) => {
  // "Top ranking" scores the whole set, so the server sorts once and batches
  // are revealed from that in-memory list rather than re-fetched per scroll.
  const fetchPage = useCallback(
    (start: number, end: number) => Promise.resolve(blogs.slice(start, end)),
    [blogs],
  );

  const { items, containerRef } = useInfiniteScroll<PostListItem>({
    initialItems: blogs.slice(0, POSTS_INITIAL_BATCH_SIZE),
    totalCount: blogs.length,
    batchSize: POSTS_BATCH_SIZE,
    getKey: (blog) => blog._id,
    fetchPage,
  });

  return (
    <div ref={containerRef} className='space-y-4'>
      {items.map((blog) => (
        <BlogCard key={blog._id} blog={blog} />
      ))}
    </div>
  );
};

export default BlogListInfinite;
