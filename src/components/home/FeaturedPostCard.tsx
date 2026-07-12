import { Card } from '@/components/ui/card';
import { formatPostDate, formatViews } from '@/lib/utils';
import { urlFor } from '@/sanity/lib/image';
import { PostListItem } from '@/sanity/lib/queries';
import { EyeIcon, PhotoIcon } from '@heroicons/react/24/outline';
import { CalendarIcon } from '@radix-ui/react-icons';
import { ArrowUpRight } from 'lucide-react';
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
    <Card className='group relative flex flex-col gap-5 rounded-2xl border-primary/25 bg-gradient-to-br from-primary/[0.08] via-primary/[0.03] to-transparent p-4 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/[0.06] sm:flex-row sm:items-center sm:gap-6 sm:p-5'>
      <div className='relative aspect-video w-full shrink-0 overflow-hidden rounded-xl bg-muted ring-1 ring-border/60 sm:w-1/2'>
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={blog.featuredImage?.alt || blog.title}
            fill
            sizes='(max-width: 640px) 100vw, (max-width: 1280px) 45vw, 340px'
            className='object-cover transition-transform duration-300 group-hover:scale-[1.02]'
          />
        ) : (
          <div
            className='flex h-full w-full items-center justify-center text-muted-foreground'
            aria-label={`${blog.title} (no featured image)`}
          >
            <PhotoIcon className='h-10 w-10' />
          </div>
        )}
      </div>
      <div className='flex flex-1 flex-col gap-3'>
        {blog.category && (
          <span className='inline-flex w-fit rounded-md bg-primary/10 px-2.5 py-0.5 font-mono text-[11px] font-medium text-primary ring-1 ring-primary/20'>
            {blog.category.name}
          </span>
        )}
        <h3 className='flex items-start gap-2 text-lg font-bold leading-snug text-foreground transition-colors group-hover:text-primary md:text-xl'>
          <Link
            href={`/blog/${blog.slug}`}
            className='line-clamp-2 after:absolute after:inset-0'
          >
            {blog.title}
          </Link>
          <ArrowUpRight className='mt-1 h-5 w-5 shrink-0 text-muted-foreground transition-colors group-hover:text-primary' />
        </h3>
        {blog.description && (
          <p className='line-clamp-2 text-sm leading-6 text-muted-foreground'>
            {blog.description}
          </p>
        )}
        <div className='flex items-center gap-4 text-sm text-muted-foreground'>
          <span className='flex items-center gap-1.5'>
            <CalendarIcon className='h-4 w-4' />
            {formatPostDate(blog.publishedAt ?? blog._createdAt)}
          </span>
          <span className='flex items-center gap-1.5'>
            <EyeIcon className='h-4 w-4' />
            {formatViews(blog.views)}
          </span>
        </div>
      </div>
    </Card>
  );
};

export default FeaturedPostCard;
