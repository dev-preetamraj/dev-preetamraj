import { formatViews } from '@/lib/utils';
import { urlFor } from '@/sanity/lib/image';
import { PostListItem } from '@/sanity/lib/queries';
import { EyeIcon, PhotoIcon, TagIcon } from '@heroicons/react/24/outline';
import { CalendarIcon } from '@radix-ui/react-icons';
import Image from 'next/image';
import Link from 'next/link';
import { FC } from 'react';

type Props = {
  blog: PostListItem;
};

const IMAGE_CLASSES =
  'aspect-square object-cover h-28 w-28 sm:aspect-video sm:w-48 sm:h-auto md:aspect-square md:h-28 md:w-28 lg:aspect-video lg:w-80 lg:h-auto xl:aspect-square xl:h-28 xl:w-28 2xl:aspect-video 2xl:w-80 2xl:h-auto';

const BlogCard: FC<Props> = ({ blog }) => {
  const imageUrl = blog.featuredImage?.asset
    ? urlFor(blog.featuredImage).url()
    : null;

  return (
    <div className='group relative flex items-center w-full space-x-4 border-b border-border pb-4'>
      <div className='space-y-2 w-full'>
        {/* Single-author blog: no per-card author row. Title is foreground,
            primary only on hover, like the home Latest list; the link's
            ::after stretches over the whole card. */}
        <h2 className='text-h4 text-foreground transition-colors group-hover:text-primary'>
          <Link
            href={{
              pathname: `/blog/${blog?.slug}`,
            }}
            className='line-clamp-2 after:absolute after:inset-0'
          >
            {blog.title}
          </Link>
        </h2>
        <p className='text-small text-muted-foreground line-clamp-2'>
          {blog.description ||
            'Lorem ipsum dolor sit amet consectetur adipisicing elit. Laudantium ab odio optio at deleniti pariatur porro magnam facere culpa ipsam veniam autem accusantium, corrupti voluptates iusto voluptatem assumenda illum? Esse?'}
        </p>
        <div className='flex items-center space-x-4 text-small text-muted-foreground'>
          <div className='flex items-center space-x-2'>
            <CalendarIcon className='h-4 w-4' />
            <span>
              {new Date(
                blog?.publishedAt ?? blog?._createdAt,
              ).toLocaleDateString('en-IN', {
                timeZone: 'Asia/Kolkata',
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
          </div>
          <div className='hidden md:flex items-center space-x-2'>
            <TagIcon className='h-4 w-4' />
            <span>{blog?.category?.name}</span>
          </div>
          <div className='flex items-center space-x-2'>
            <EyeIcon className='h-4 w-4' />
            <span>{formatViews(blog?.views)}</span>
          </div>
        </div>
      </div>
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={blog.title}
          height={400}
          width={400}
          className={IMAGE_CLASSES}
        />
      ) : (
        <div
          className={`${IMAGE_CLASSES} flex shrink-0 items-center justify-center bg-muted text-muted-foreground`}
          aria-label={`${blog.title} (no featured image)`}
        >
          <PhotoIcon className='h-8 w-8' />
        </div>
      )}
    </div>
  );
};

export default BlogCard;
