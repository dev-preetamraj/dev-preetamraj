import { TagIcon } from '@heroicons/react/24/outline';
import { CalendarIcon } from '@radix-ui/react-icons';
import Image from 'next/image';
import { FC } from 'react';
import { urlForImage } from '../../../sanity/lib/image';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Separator } from '../ui/separator';

type Props = {
  post: Post;
};

const BlogCard: FC<Props> = ({ post }) => {
  return (
    <div className='flex items-center w-full space-x-4 border-b pb-4'>
      <div className='space-y-2 w-full'>
        <div className='flex items-center space-x-2'>
          <Avatar className='w-5 h-5'>
            <AvatarImage
              src={urlForImage(post.author.image).url()}
              alt={post.author.name}
            />
            <AvatarFallback>PR</AvatarFallback>
          </Avatar>
          <p className='text-sm'>{post.author.name}</p>
        </div>
        <h1 className='text-lg font-bold text-primary line-clamp-2'>
          {post.title}
        </h1>
        <p className='text-sm font-light line-clamp-2'>
          {post.description ||
            'Lorem ipsum dolor sit amet consectetur adipisicing elit. Laudantium ab odio optio at deleniti pariatur porro magnam facere culpa ipsam veniam autem accusantium, corrupti voluptates iusto voluptatem assumenda illum? Esse?'}
        </p>
        <div className='flex items-center space-x-4'>
          <div className='flex items-center space-x-2'>
            <CalendarIcon className='h-4 w-4' />
            <span className='text-sm font-thin'>
              {new Date(post._createdAt).toLocaleDateString('en-IN', {
                timeZone: 'Asia/Kolkata',
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
          </div>
          <Separator orientation='vertical' className='hidden' />
          <div className='hidden md:flex items-center space-x-2'>
            <TagIcon className='h-4 w-4' />
            {post.categories.map((cat) => (
              <span key={cat._id} className='text-sm font-thin'>
                {cat.title}
              </span>
            ))}
          </div>
        </div>
      </div>
      <Image
        src={urlForImage(post.mainImage).url()}
        alt={post.title}
        height={400}
        width={400}
        className='aspect-square object-cover h-28 w-28 sm:aspect-video sm:w-48 sm:h-auto md:aspect-square md:h-28 md:w-28 lg:aspect-video lg:w-80 lg:h-auto xl:aspect-square xl:h-28 xl:w-28 2xl:aspect-video 2xl:w-80 2xl:h-auto'
      />
    </div>
  );
};

export default BlogCard;
