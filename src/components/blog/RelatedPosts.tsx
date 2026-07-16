import SectionHeading from '@/components/global/SectionHeading';
import { formatPostDate, formatViews } from '@/lib/utils';
import { urlFor } from '@/sanity/lib/image';
import { PostListItem } from '@/sanity/lib/queries';
import { EyeIcon, PhotoIcon } from '@heroicons/react/24/outline';
import { CalendarIcon } from '@radix-ui/react-icons';
import Image from 'next/image';
import Link from 'next/link';
import { FC } from 'react';

type Props = {
  posts: PostListItem[];
};

const RelatedPosts: FC<Props> = ({ posts }) => {
  if (!posts.length) return null;

  return (
    <section className='space-y-5'>
      <SectionHeading index='01' title='Keep reading' />
      <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
        {posts.map((post) => {
          const imageUrl = post.featuredImage?.asset
            ? urlFor(post.featuredImage).width(320).height(240).url()
            : null;

          return (
            <Link
              key={post._id}
              href={`/blog/${post.slug}`}
              className='group flex gap-4 rounded-xl border border-border/60 bg-card/40 p-3 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:bg-card hover:shadow-md hover:shadow-primary/[0.05]'
            >
              <div className='relative aspect-[4/3] w-28 shrink-0 overflow-hidden rounded-lg bg-muted sm:w-32'>
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt={post.featuredImage?.alt || post.title}
                    fill
                    sizes='128px'
                    className='object-cover transition-transform duration-300 group-hover:scale-[1.03]'
                  />
                ) : (
                  <div
                    className='flex h-full w-full items-center justify-center text-muted-foreground'
                    aria-label={`${post.title} (no featured image)`}
                  >
                    <PhotoIcon className='h-6 w-6' />
                  </div>
                )}
              </div>

              <div className='flex min-w-0 flex-col gap-1.5 py-0.5'>
                {post.category && (
                  <span className='font-mono text-[11px] font-medium text-primary'>
                    {post.category.name}
                  </span>
                )}
                <h3 className='line-clamp-2 text-sm font-semibold leading-snug text-foreground transition-colors group-hover:text-primary'>
                  {post.title}
                </h3>
                <div className='mt-auto flex items-center gap-3 pt-0.5 text-xs text-muted-foreground'>
                  <span className='flex items-center gap-1'>
                    <CalendarIcon className='h-3 w-3' />
                    {formatPostDate(post.publishedAt ?? post._createdAt)}
                  </span>
                  <span className='flex items-center gap-1'>
                    <EyeIcon className='h-3 w-3' />
                    {formatViews(post.views)}
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default RelatedPosts;
