import { IPortfolio } from '@/models/portfolio';
import { GitHubLogoIcon } from '@radix-ui/react-icons';
import { GithubIcon, LinkIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import RenderMarkdown from '../global/render-markdown';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';

type Props = {
  project: Partial<IPortfolio> | null;
};

const RenderPortfolio = ({ project }: Props) => {
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

export default RenderPortfolio;
