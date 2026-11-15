import { formatViews } from '@/lib/utils';
import { PostListItem } from '@/sanity/lib/queries';
import { EyeIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { FC } from 'react';

type Props = {
  blogs: PostListItem[];
};

const PopularPosts: FC<Props> = ({ blogs }) => (
  <ol className='flex flex-col divide-y divide-border overflow-hidden rounded-xl border border-border bg-card'>
    {blogs.map((blog, index) => (
      <li key={blog._id} className='group'>
        <Link
          href={`/blog/${blog.slug}`}
          className='flex items-center gap-4 px-4 py-3 transition-colors hover:bg-accent'
        >
          <span className='font-mono text-small text-muted-foreground'>
            {String(index + 1).padStart(2, '0')}
          </span>
          <span className='line-clamp-1 flex-1 text-small font-medium text-foreground transition-colors group-hover:text-primary'>
            {blog.title}
          </span>
          <span className='flex shrink-0 items-center gap-1.5 font-mono text-caption text-muted-foreground'>
            <EyeIcon className='h-3.5 w-3.5' />
            {formatViews(blog.views)}
          </span>
        </Link>
      </li>
    ))}
  </ol>
);

export default PopularPosts;
