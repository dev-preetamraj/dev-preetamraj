import { getBlogBySlug } from '@/actions/blog';
import RenderMarkdown from '@/components/render-markdown';
import Image from 'next/image';
import Link from 'next/link';
import { FC } from 'react';

type Props = {
  params: {
    slug: string;
  };
};

const BlogPost: FC<Props> = async ({ params: { slug } }) => {
  const { data: blog } = await getBlogBySlug(slug);

  return (
    <div>
      <section className='space-y-2 border border-primary/10 mb-10'>
        <div className='relative flex flex-col xl:flex-row justify-between'>
          <div className='absolute top-0 w-full h-full opacity-10 blur-sm'>
            <Image
              className='object-cover object-center mx-auto'
              src={blog?.featuredImage ?? ''}
              alt={blog?.title ?? 'Featured Image'}
              fill
            />
          </div>

          <section className='p-5 bg-primary/10 w-full z-10'>
            <div>
              <h1 className='text-4xl font-extrabold'>{blog?.title}</h1>
              <p>
                {new Date(blog?.createdAt ?? '').toLocaleDateString('en-US', {
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
                <Link
                  href={`/categories/${blog?.category?.name}`}
                  className='bg-muted text-white px-3 py-1 rounded-full text-sm font-semibold mt-4'
                >
                  {blog?.category?.name}
                </Link>
              </div>
            </div>
          </section>
        </div>
      </section>

      <RenderMarkdown content={blog?.content ?? ''} />
    </div>
  );
};

export default BlogPost;
