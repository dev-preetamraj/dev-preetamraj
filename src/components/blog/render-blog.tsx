import { readingTimeMinutes } from '@/lib/reading-time';
import { formatViews } from '@/lib/utils';
import { urlFor } from '@/sanity/lib/image';
import { Post } from '@/sanity/lib/queries';
import { ClockIcon, EyeIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import Link from 'next/link';
import RenderPortableText from '../global/render-portable-text';

type Props = {
  blog: Post;
};

const RenderBlog = ({ blog }: Props) => {
  const readingTime = readingTimeMinutes(blog?.content);

  return (
    <div id='article-body'>
      {/* Same column as the prose: max-w-measure is 36em, so the header uses
          the article font size to resolve the em to the same width. */}
      <section className='max-w-measure text-[length:var(--text-article-size)] space-y-2 border border-border mb-10'>
        <div className='relative flex flex-col xl:flex-row justify-between'>
          {blog?.featuredImage?.asset && (
            <div className='absolute top-0 w-full h-full opacity-10 blur-sm'>
              <Image
                className='object-cover object-center mx-auto'
                src={urlFor(blog.featuredImage).url()}
                alt={blog?.title ?? 'Featured Image'}
                fill
                sizes='(min-width: 768px) 75vw, 100vw'
                priority
              />
            </div>
          )}

          <section className='p-6 md:p-8 bg-muted/60 w-full z-10'>
            <div className='space-y-3'>
              <h1 className='text-h1 text-foreground'>{blog?.title}</h1>
              <div className='flex flex-wrap items-center gap-x-4 gap-y-1 text-small text-muted-foreground'>
                <p>
                  {new Date(
                    blog?.publishedAt ?? blog?._createdAt,
                  ).toLocaleDateString('en-US', {
                    timeZone: 'Asia/Kolkata',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
                <span className='flex items-center gap-1' title='Views'>
                  <EyeIcon className='h-4 w-4' />
                  {formatViews(blog?.views)}
                </span>
                {readingTime > 0 && (
                  <span
                    className='flex items-center gap-1'
                    title='Estimated reading time'
                  >
                    <ClockIcon className='h-4 w-4' />
                    {readingTime} min read
                  </span>
                )}
              </div>
            </div>

            <div>
              <p className='mt-6 text-lead text-muted-foreground line-clamp-3'>
                {blog?.description}
              </p>
              <div className='mt-6 flex items-center justify-end space-x-2'>
                {blog?.category && (
                  <Link
                    href={`/categories/${blog.category.slug}`}
                    className='inline-flex rounded-xs border border-border bg-muted px-2 py-0.5 font-mono text-micro text-muted-foreground transition-colors hover:text-foreground'
                  >
                    {blog.category.name}
                  </Link>
                )}
              </div>
            </div>
          </section>
        </div>
      </section>

      <RenderPortableText value={blog?.content ?? []} />
    </div>
  );
};

export default RenderBlog;
