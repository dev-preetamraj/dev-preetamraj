import { fetchTrendingBlogs } from '@/actions/blog';
import { fetchTrendingCategories } from '@/actions/categories';
import { fetchFeaturedProjects } from '@/actions/portfolio';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const Rightbar = async () => {
  const { data: recentBlogs } = await fetchTrendingBlogs();
  const { data: projects } = await fetchFeaturedProjects();
  const { data: categories } = await fetchTrendingCategories();
  return (
    <aside className='w-full md:w-[380px] lg:w-[600px] xl:w-72 2xl:w-96 h-full sticky top-20'>
      <div className='flex flex-col space-y-10'>
        <div className='border-l border-border pl-4 py-4 flex flex-col space-y-4'>
          <h1 className='text-lg text-foreground'>Featured Projects</h1>
          <div className='flex flex-col space-y-2'>
            {projects &&
              projects.map((project) => (
                <Link
                  href={`/portfolio/${project.slug}`}
                  className='truncate text-sm hover:text-primary hover:underline hover:underline-offset-2'
                  key={project._id}
                >
                  {project.title}
                </Link>
              ))}
          </div>
        </div>

        <div className='border-l border-border pl-4 py-4 flex flex-col space-y-4'>
          <h1 className='text-lg text-foreground'>Recently Updated</h1>
          <div className='flex flex-col space-y-2'>
            {recentBlogs &&
              recentBlogs.map((blog) => (
                <Link
                  href={`/blog/${blog.slug}`}
                  className='truncate text-sm hover:text-primary hover:underline hover:underline-offset-2'
                  key={blog._id}
                >
                  {blog.title}
                </Link>
              ))}
          </div>
        </div>

        <div className='border-l border-border pl-4 py-4 flex flex-col space-y-4'>
          <h1 className='text-lg text-foreground'>Trending Categories</h1>
          <div className='flex flex-wrap gap-2'>
            {categories?.map((category) => (
              <Link
                key={category._id}
                href={`/categories/${category.slug}`}
                className={cn(
                  buttonVariants({
                    variant: 'ghost',
                    className:
                      'px-4 py-1 border border-border text-sm rounded-full',
                  })
                )}
              >
                {category.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Rightbar;
