import { getPortfolioBySlug } from '@/actions/portfolio';
import DeletePortfolioAlertDialog from '@/components/portfolio/delete-portfolio-alert-dialog';
import RenderMarkdown from '@/components/render-markdown';
import { currentUser } from '@clerk/nextjs/server';
import { GitHubLogoIcon } from '@radix-ui/react-icons';
import { EditIcon, GithubIcon, LinkIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { FC } from 'react';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

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
    <div className='w-full'>
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
              <div className='flex items-center justify-end mt-auto space-x-4'>
                {project?.githubUrl && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link href={project?.githubUrl ?? '#'} target='_blank'>
                          <GitHubLogoIcon className='h-4 w-4' />
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Github</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}

                {project?.frontendGithubUrl && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link
                          href={project?.frontendGithubUrl ?? '#'}
                          target='_blank'
                        >
                          <GithubIcon className='h-4 w-4' />
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Github Frontend</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
                {project?.liveUrl && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link href={project?.liveUrl ?? '#'} target='_blank'>
                          <LinkIcon className='h-4 w-4' />
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Live</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
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
