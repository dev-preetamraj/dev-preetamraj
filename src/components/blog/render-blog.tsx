import { formatViews } from '@/lib/utils';
import { urlFor } from '@/sanity/lib/image';
import { Post } from '@/sanity/lib/queries';
import { EyeIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import Link from 'next/link';
import RenderPortableText from '../global/render-portable-text';

type Props = {
  blog: Post;
};

const RenderBlog = ({ blog }: Props) => {
  return (
    <div>
      <section className='space-y-2 border border-primary/10 mb-10'>
        <div className='relative flex flex-col xl:flex-row justify-between'>
          {blog?.featuredImage?.asset && (
            <div className='absolute top-0 w-full h-full opacity-10 blur-sm'>
              <Image
                className='object-cover object-center mx-auto'
                src={urlFor(blog.featuredImage).url()}
                alt={blog?.title ?? 'Featured Image'}
                fill
                sizes='100vw'
                priority
              />
            </div>
          )}

          <section className='p-5 bg-primary/10 w-full z-10'>
            <div>
              <h1 className='text-2xl md:text-3xl font-bold leading-tight'>
                {blog?.title}
              </h1>
              <div className='flex items-center gap-3'>
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
              </div>
            </div>

            <div>
              <h2 className='italic line-clamp-2 pt-10'>{blog?.description}</h2>
              <div className='flex items-center justify-end mt-auto space-x-2'>
                {blog?.category && (
                  <Link
                    href={`/categories/${blog.category.slug}`}
                    className='bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold mt-4'
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
