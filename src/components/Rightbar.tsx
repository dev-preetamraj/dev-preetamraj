import { cn } from '@/lib/utils';
import { groq } from 'next-sanity';
import Link from 'next/link';
import { client } from '../../sanity/lib/client';
import { buttonVariants } from './ui/button';

const projectQuery = groq`
  *[_type=='project'] {
    _id,
    title,
    slug,
    _createdAt
  } | order(_createdAt desc)
`;

const postQuery = groq`
  *[_type=='post'] {
    _id,
    title,
    slug,
    _createdAt
  } | order(_createdAt desc)
`;

const categoryQuery = groq`
  *[_type=='category'] {
    _id,
    title,
    slug,
    _createdAt
  } | order(_createdAt desc)
`;

const Rightbar = async () => {
  const recentPosts: Post[] = await client.fetch(postQuery);
  const projects: Project[] = await client.fetch(projectQuery);
  const categories: Category[] = await client.fetch(categoryQuery);
  return (
    <div className='w-full md:w-[380px] lg:w-[600px] xl:w-72 2xl:w-96 h-full sticky top-20'>
      <div className='flex flex-col space-y-10'>
        <div className='border-l pl-4 py-4 flex flex-col space-y-4'>
          <h1 className='text-lg text-foreground'>Featured Projects</h1>
          <div className='flex flex-col space-y-2'>
            {projects.map((project) => (
              <Link
                href={`/portfolio/${project.slug.current}`}
                className='truncate text-sm hover:text-primary hover:underline hover:underline-offset-2'
                key={project._id}
              >
                {project.title}
              </Link>
            ))}
          </div>
        </div>

        <div className='border-l pl-4 py-4 flex flex-col space-y-4'>
          <h1 className='text-lg text-foreground'>Recently Updated</h1>
          <div className='flex flex-col space-y-2'>
            {recentPosts.map((post) => (
              <Link
                href={`/blog/${post.slug.current}`}
                className='truncate text-sm hover:text-primary hover:underline hover:underline-offset-2'
                key={post._id}
              >
                {post.title}
              </Link>
            ))}
          </div>
        </div>

        <div className='border-l pl-4 py-4 flex flex-col space-y-4'>
          <h1 className='text-lg text-foreground'>Trending Categories</h1>
          <div className='flex flex-wrap gap-2'>
            {categories.map((category) => (
              <Link
                key={category._id}
                href={`/categories/${category.slug.current}`}
                className={cn(
                  buttonVariants({
                    variant: 'ghost',
                    className: 'px-4 py-1 border text-sm rounded-full',
                  })
                )}
              >
                {category.title}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Rightbar;
