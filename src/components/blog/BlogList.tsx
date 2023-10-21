import { CalendarDaysIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import Link from 'next/link';
import { FC } from 'react';
import { urlForImage } from '../../../sanity/lib/image';

type Props = {
  posts: Post[];
};

const BlogList: FC<Props> = ({ posts }) => {
  return (
    <div className='flex flex-col space-x-6'>
      {posts.map((post) => (
        <div key={post._id} className='border-b pb-4 mb-4 space-y-4'>
          <Link
            href={{
              pathname: `/blog/${post.slug.current}`,
              // query: { id: post._id },
            }}
            legacyBehavior
          >
            <div className='relative cursor-pointer group'>
              <Image
                className='aspect-video w-full h-64 object-cover group-hover:scale-105 duration-200'
                src={urlForImage(post.mainImage).url()}
                alt={post.author.name}
                height={1000}
                width={1000}
              />
              <div className='absolute bottom-0 flex flex-col sm:flex-row md:flex-col lg:flex-row sm:items-center sm:justify-between w-full p-4 backdrop-blur-md space-y-6 sm:space-y-0 md:space-y-6 lg:space-y-0 md:items-start'>
                <div className='space-y-2'>
                  <h1 className='text-lg sm:text-xl truncate'>{post.title}</h1>
                  <div className='flex items-center space-x-2'>
                    <CalendarDaysIcon className='h-4 w-4' />
                    <p className='text-sm font-light'>
                      {new Date(post._createdAt).toLocaleDateString('en-In', {
                        timeZone: 'Asia/Kolkata',
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
                <div className='flex'>
                  {post.categories.map((cat) => (
                    <Link
                      href={`/categories/${cat.title
                        .toLowerCase()
                        .replace(' ', '-')}`}
                      key={cat._id}
                      className='bg-primary/20 px-4 py-2 rounded-full'
                    >
                      {cat.title}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </Link>

          <div className='space-y-2'>
            <Link
              href={{
                pathname: `/blog/${post.slug.current}`,
                // query: { id: post._id },
              }}
              className='text-xl md:text-2xl text-primary font-semibold'
            >
              {post.title}
            </Link>
            <p className='text-sm font-thin line-clamp-2 text-justify'>
              {post.description ||
                'Lorem ipsum dolor sit amet consectetur adipisicing elit. Laudantium quaerat cum porro dolorum alias vero sapiente! Corrupti laborum unde magni? Lorem ipsum dolor sit amet consectetur adipisicing elit. Laudantium quaerat cum porro dolorum alias vero sapiente! Corrupti laborum unde magni? Lorem ipsum dolor sit amet consectetur adipisicing elit. Laudantium quaerat cum porro dolorum alias vero sapiente! Corrupti laborum unde magni?'}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BlogList;
