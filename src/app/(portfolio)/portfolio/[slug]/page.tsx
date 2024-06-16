import { getPortfolioBySlug } from '@/actions/portfolio';
import DeletePortfolioAlertDialog from '@/components/portfolio/delete-portfolio-alert-dialog';
import RenderMarkdown from '@/components/render-markdown';
import { buttonVariants } from '@/components/ui/button';
import { currentUser } from '@clerk/nextjs/server';
import { GitHubLogoIcon } from '@radix-ui/react-icons';
import { EditIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { FC } from 'react';

type Props = {
  params: {
    slug: string;
  };
};

const ProjectDetailsPage: FC<Props> = async ({ params: { slug } }) => {
  const user = await currentUser();
  const role = user?.privateMetadata.role;
  const { data: project } = await getPortfolioBySlug(slug);

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
                <div className='w-full flex items-center justify-between'>
                  <h1 className='text-2xl md:text-3xl xl:text-4xl font-extrabold'>
                    {project?.title}
                  </h1>
                  {role === 'admin' && (
                    <div className='flex items-center space-x-4'>
                      <Link href={`/portfolio/create/${project?._id}`}>
                        <EditIcon className='w-4 h-4' />
                      </Link>
                      <DeletePortfolioAlertDialog portfolioId={project?._id!} />
                    </div>
                  )}
                </div>
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

export default ProjectDetailsPage;
