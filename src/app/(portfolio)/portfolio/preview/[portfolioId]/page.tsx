import { getPortfolioById } from '@/actions/portfolio';
import RenderMarkdown from '@/components/render-markdown';
import { buttonVariants } from '@/components/ui/button';
import { GitHubLogoIcon } from '@radix-ui/react-icons';
import markdownit from 'markdown-it';
import Image from 'next/image';
import Link from 'next/link';

type Props = {
  params: {
    portfolioId: string;
  };
};

const PreviewPortfolioPage = async ({ params: { portfolioId } }: Props) => {
  const { data: project } = await getPortfolioById(portfolioId);
  const md = markdownit();
  return (
    <div>
      <section className='space-y-2 border border-primary/10 mb-10'>
        <div className='relative flex flex-col xl:flex-row justify-between'>
          <div className='absolute top-0 w-full h-full opacity-10 blur-sm'>
            <Image
              className='object-cover object-center mx-auto'
              src={project?.featuredImage!}
              alt={project?.title!}
              fill
            />
          </div>

          <section className='p-5 bg-primary/10 w-full z-10'>
            <div className='flex flex-col 2xl:flex-row justify-between gap-y-5'>
              <div className='space-y-2 w-full'>
                <h1 className='text-2xl md:text-3xl xl:text-4xl font-extrabold'>
                  {project?.title}
                </h1>
                <p>
                  {new Date(project?.createdAt ?? '').toLocaleDateString(
                    'en-US',
                    {
                      timeZone: 'Asia/Kolkata',
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    }
                  )}
                </p>
              </div>
            </div>

            <div>
              <h2 className='italic line-clamp-2 pt-10'>
                {project?.description}
              </h2>
              <div className='flex items-center justify-end mt-auto space-x-2'>
                <Link
                  href={project?.githubUrl ?? '#'}
                  target='_blank'
                  className={buttonVariants({
                    variant: 'default',
                    className: 'flex items-center space-x-2',
                  })}
                >
                  <GitHubLogoIcon className='h-4 w-4' />
                  <span>Github</span>
                </Link>
              </div>
            </div>
          </section>
        </div>
      </section>
      <RenderMarkdown content={project?.content ?? ''} />
    </div>
  );
};

export default PreviewPortfolioPage;
