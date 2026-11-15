import { formatPostDate, formatViews } from '@/lib/utils';
import { urlFor } from '@/sanity/lib/image';
import { PostListItem } from '@/sanity/lib/queries';
import { EyeIcon, PhotoIcon } from '@heroicons/react/24/outline';
import { CalendarIcon } from '@radix-ui/react-icons';
import Image from 'next/image';
import Link from 'next/link';
import { FC } from 'react';

type Props = {
  blog: PostListItem;
};

const FeaturedPostCard: FC<Props> = ({ blog }) => {
  const imageUrl = blog.featuredImage?.asset
    ? urlFor(blog.featuredImage).url()
    : null;

  return (
    // One calm row: small thumbnail + text. Deliberately quieter than the
    // hero so the page keeps a single focal point.
    <article className='group relative flex items-center gap-5 rounded-lg border border-border p-4 transition-colors hover:border-input'>
      <div className='relative hidden aspect-video w-44 shrink-0 overflow-hidden rounded-md bg-muted ring-1 ring-border lg:block'>
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={blog.featuredImage?.alt || blog.title}
            fill
            sizes='176px'
            className='object-cover'
          />
        ) : (
          <div
            className='flex h-full w-full items-center justify-center text-muted-foreground'
            aria-label={`${blog.title} (no featured image)`}
          >
            <PhotoIcon className='h-6 w-6' />
          </div>
        )}
      </div>
      <div className='flex min-w-0 flex-1 flex-col gap-1.5'>
        <p className='text-eyebrow text-muted-foreground'>
          Featured{blog.category ? ` · ${blog.category.name}` : ''}
        </p>
        <h3 className='text-h4 text-foreground transition-colors group-hover:text-primary'>
          <Link
            href={`/blog/${blog.slug}`}
            className='line-clamp-2 after:absolute after:inset-0'
          >
            {blog.title}
          </Link>
        </h3>
        {blog.description && (
          <p className='line-clamp-1 text-small text-muted-foreground'>
            {blog.description}
          </p>
        )}
        <div className='flex items-center gap-4 pt-0.5 font-mono text-caption text-muted-foreground'>
          <span className='flex items-center gap-1.5'>
            <CalendarIcon className='h-3.5 w-3.5' />
            {formatPostDate(blog.publishedAt ?? blog._createdAt)}
          </span>
          <span className='flex items-center gap-1.5'>
            <EyeIcon className='h-3.5 w-3.5' />
            {formatViews(blog.views)}
          </span>
        </div>
      </div>
    </article>
  );
};

export default FeaturedPostCard;
