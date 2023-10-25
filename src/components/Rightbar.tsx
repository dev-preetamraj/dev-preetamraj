import { cn } from '@/lib/utils';
import Link from 'next/link';
import { buttonVariants } from './ui/button';

const tags = [
  {
    id: 1,
    title: 'Python',
    slug: 'python',
  },
  {
    id: 2,
    title: 'ReactJS',
    slug: 'react-js',
  },
  {
    id: 3,
    title: 'NextJS',
    slug: 'next-js',
  },
  {
    id: 4,
    title: 'Django Rest Framework',
    slug: 'django-rest-framework',
  },
  {
    id: 5,
    title: 'Django',
    slug: 'django',
  },
  {
    id: 6,
    title: 'AWS',
    slug: 'aws',
  },
];

const recentPosts = [
  {
    id: 1,
    title: 'What is WebRTC',
  },
  {
    id: 2,
    title: 'What is virtual environment',
  },
];

const Rightbar = () => {
  return (
    <div className='w-full md:w-[380px] lg:w-[600px] xl:w-72 2xl:w-96 h-full'>
      <div className='flex flex-col space-y-10'>
        <div className='border-l pl-4 py-4 flex flex-col space-y-4'>
          <h1 className='text-lg text-foreground'>Recently Updated</h1>
          <div className='flex flex-col space-y-2'>
            {recentPosts.map((post) => (
              <Link
                href='#'
                className='truncate text-sm hover:text-primary hover:underline hover:underline-offset-2'
                key={post.id}
              >
                {post.title}
              </Link>
            ))}
          </div>
        </div>

        <div className='border-l pl-4 py-4 flex flex-col space-y-4'>
          <h1 className='text-lg text-foreground'>Trending Tags</h1>
          <div className='flex flex-wrap gap-2'>
            {tags.map((tag) => (
              <Link
                key={tag.id}
                href={`/tags/${tag.slug}`}
                className={cn(
                  buttonVariants({
                    variant: 'ghost',
                    className: 'px-4 py-1 border text-sm rounded-full',
                  })
                )}
              >
                {tag.title}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Rightbar;
