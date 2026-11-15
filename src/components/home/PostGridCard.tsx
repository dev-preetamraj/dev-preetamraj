import { Card, CardContent } from '@/components/ui/card';
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

const PostGridCard: FC<Props> = ({ blog }) => {
  const imageUrl = blog.featuredImage?.asset
    ? urlFor(blog.featuredImage).url()
    : null;

  return (
    <Card className='group relative flex flex-col overflow-hidden rounded-xl transition-all duration-base hover:-translate-y-1 hover:border-input hover:shadow-md'>
      <div className='relative aspect-video w-full overflow-hidden bg-muted'>
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={blog.featuredImage?.alt || blog.title}
            fill
            sizes='(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 350px'
            className='object-cover transition-transform duration-300 group-hover:scale-[1.02]'
          />
        ) : (
          <div
            className='flex h-full w-full items-center justify-center text-muted-foreground'
            aria-label={`${blog.title} (no featured image)`}
          >
            <PhotoIcon className='h-8 w-8' />
          </div>
        )}
      </div>
      <CardContent className='flex flex-1 flex-col gap-2 pt-5'>
        {blog.category && (
          <span className='inline-flex w-fit rounded-xs border border-border bg-muted px-2 py-0.5 font-mono text-micro text-muted-foreground'>
            {blog.category.name}
          </span>
        )}
        <h3 className='text-h4 text-foreground transition-colors group-hover:text-primary'>
          <Link
            href={`/blog/${blog.slug}`}
            className='line-clamp-2 after:absolute after:inset-0'
          >
            {blog.title}
          </Link>
        </h3>
        {blog.description && (
          <p className='line-clamp-2 text-small text-muted-foreground'>
            {blog.description}
          </p>
        )}
        <div className='mt-auto flex items-center gap-4 pt-1 font-mono text-caption text-muted-foreground'>
          <span className='flex items-center gap-1.5'>
            <CalendarIcon className='h-3.5 w-3.5' />
            {formatPostDate(blog.publishedAt ?? blog._createdAt)}
          </span>
          <span className='flex items-center gap-1.5'>
            <EyeIcon className='h-3.5 w-3.5' />
            {formatViews(blog.views)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default PostGridCard;
