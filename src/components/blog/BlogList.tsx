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
    <div>
      {posts.map((post) => (
        <div key={post._id} className='border-b pb-4 mb-4'>
          <Link
            href={{
              pathname: `/blog/${post.slug.current}`,
              // query: { id: post._id },
            }}
            className='text-xl md:text-2xl text-primary font-semibold'
          >
            {post.title}
          </Link>
          <div className='flex items-center space-x-2'>
            <div>
              <p className='text-sm'>{post.description}</p>
            </div>
            <Image
              className='object-cover object-left lg:object-center'
              src={urlForImage(post.mainImage).url()}
              alt={post.author.name}
              height={200}
              width={200}
            />
          </div>
          <div className='flex items-center space-x-4'>
            <div className='flex items-center space-x-2'>
              <CalendarDaysIcon className='h-4 w-4' />
              <p className='text-sm'>
                {new Date(post._createdAt).toLocaleDateString('en-In', {
                  timeZone: 'Asia/Kolkata',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            </div>
            <p>Tags</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BlogList;
