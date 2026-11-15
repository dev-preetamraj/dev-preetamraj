import { formatPostDate } from '@/lib/utils';
import { PostListItem } from '@/sanity/lib/queries';
import Link from 'next/link';
import { FC } from 'react';

type Props = {
  blogs: PostListItem[];
};

/**
 * Text-only list of recent posts: date, title + one-line summary, category.
 * Replaces the image card grid on the home page to cut visual weight.
 */
const LatestPostsList: FC<Props> = ({ blogs }) => (
  <ul className='flex flex-col divide-y divide-border'>
    {blogs.map((blog) => (
      <li
        key={blog._id}
        className='group relative flex flex-col gap-1 py-5 first:pt-0 last:pb-0 lg:flex-row lg:items-baseline lg:gap-8'
      >
        <time
          dateTime={blog.publishedAt ?? blog._createdAt}
          className='shrink-0 font-mono text-caption text-muted-foreground lg:w-24'
        >
          {formatPostDate(blog.publishedAt ?? blog._createdAt)}
        </time>
        <div className='min-w-0 flex-1'>
          <h3 className='text-body font-medium text-foreground transition-colors group-hover:text-primary'>
            <Link
              href={`/blog/${blog.slug}`}
              className='line-clamp-2 after:absolute after:inset-0'
            >
              {blog.title}
            </Link>
          </h3>
          {blog.description && (
            <p className='mt-1 line-clamp-1 text-small text-muted-foreground'>
              {blog.description}
            </p>
          )}
        </div>
        {blog.category && (
          <span className='hidden shrink-0 font-mono text-caption text-muted-foreground lg:block'>
            {blog.category.name}
          </span>
        )}
      </li>
    ))}
  </ul>
);

export default LatestPostsList;
