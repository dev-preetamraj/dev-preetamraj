import SectionHeading from '@/components/global/SectionHeading';
import { AUTHOR_NAME } from '@/lib/seo';
import { formatPostDate, formatViews } from '@/lib/utils';
import { PostListItem } from '@/sanity/lib/queries';
import Link from 'next/link';
import { FC } from 'react';

type Props = {
  posts: PostListItem[];
};

/** Stable 7-char hex from the post id, styled as a commit hash. */
function commitHash(id: string): string {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return h.toString(16).padStart(7, '0').slice(0, 7);
}

const RelatedPosts: FC<Props> = ({ posts }) => {
  if (!posts.length) return null;

  return (
    <section className='space-y-5'>
      <SectionHeading index='01' title='Keep reading' />
      <div className='rounded-xl border border-border bg-card/50 p-4 font-mono sm:p-5'>
        <p className='mb-4 text-sm text-muted-foreground'>
          <span className='text-primary'>➜</span> ~{' '}
          <span className='text-sky-600 dark:text-sky-400'>git</span> log
          --oneline related/
        </p>
        <ul>
          {posts.map((post, i) => (
            <li key={post._id}>
              <Link
                href={`/blog/${post.slug}`}
                className='group grid grid-cols-[20px_1fr] rounded-md px-2 py-1.5 transition-colors hover:bg-foreground/[0.03]'
              >
                <span className='relative' aria-hidden>
                  <span className='absolute left-[3px] top-[6px] h-[9px] w-[9px] rounded-full bg-primary shadow-[0_0_0_3px_rgba(34,197,94,0.15)]' />
                  {i < posts.length - 1 && (
                    <span className='absolute -bottom-[9px] left-[7px] top-[13px] w-0.5 bg-foreground/15' />
                  )}
                </span>
                <span className='min-w-0'>
                  <span className='flex items-baseline gap-2.5'>
                    <span className='shrink-0 text-sm text-amber-500 dark:text-amber-400'>
                      {commitHash(post._id)}
                    </span>
                    <span className='truncate font-sans text-sm font-semibold text-foreground transition-colors group-hover:text-primary'>
                      {post.title}
                    </span>
                  </span>
                  <span className='mt-0.5 block truncate text-xs text-muted-foreground'>
                    Author: {AUTHOR_NAME} ·{' '}
                    {formatPostDate(post.publishedAt ?? post._createdAt)} ·{' '}
                    {formatViews(post.views)} views
                    {post.category && (
                      <>
                        {' · '}
                        <span className='text-sky-600 dark:text-sky-400'>
                          {post.category.slug}
                        </span>
                      </>
                    )}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default RelatedPosts;
