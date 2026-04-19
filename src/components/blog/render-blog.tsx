import { urlFor } from '@/sanity/lib/image';
import Image from 'next/image';
import Link from 'next/link';
import type { BlogBySlugQueryResult } from '../../../sanity.types';
import RenderPortableText from '../global/render-portable-text';

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1549558549-415fe4c37b60';

type Props = {
  blog: NonNullable<BlogBySlugQueryResult>;
};

const RenderBlog = ({ blog }: Props) => {
  const imageUrl = blog.featuredImage?.asset
    ? urlFor(blog.featuredImage).width(1200).url()
    : FALLBACK_IMAGE;

  return (
    <div>
      <section className='space-y-2 border border-primary/10 mb-10'>
        <div className='relative flex flex-col xl:flex-row justify-between'>
          <div className='absolute top-0 w-full h-full opacity-10 blur-sm'>
            <Image
              className='object-cover object-center mx-auto'
              src={imageUrl}
              alt={blog.featuredImage?.alt || blog?.title || 'Featured Image'}
              fill
              sizes='(max-width: 768px) 100vw, calc(100vw - 350px)'
              priority
            />
          </div>

          <section className='p-5 bg-primary/10 w-full z-10'>
            <div>
              <h1 className='text-4xl font-extrabold'>{blog?.title}</h1>
              <p>
                {new Date(blog?._createdAt ?? '').toLocaleDateString('en-US', {
                  timeZone: 'Asia/Kolkata',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            </div>

            <div>
              <h2 className='italic line-clamp-2 pt-10'>{blog?.description}</h2>
              <div className='flex items-center justify-end mt-auto space-x-2'>
                {blog?.category && (
                  <Link
                    href={`/categories/${blog.category.slug?.current}`}
                    className='bg-muted text-white px-3 py-1 rounded-full text-sm font-semibold mt-4'
                  >
                    {blog.category.name}
                  </Link>
                )}
              </div>
            </div>
          </section>
        </div>
      </section>

      {blog.content && <RenderPortableText value={blog.content} />}
    </div>
  );
};

export default RenderBlog;
