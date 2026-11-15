import { urlFor } from '@/sanity/lib/image';
import { Project } from '@/sanity/lib/queries';
import { GitHubLogoIcon } from '@radix-ui/react-icons';
import { GithubIcon, LinkIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import RenderPortableText from '../global/render-portable-text';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';

type Props = {
  project: Project | null;
};

const RenderPortfolio = ({ project }: Props) => {
  return (
    <div className='w-full'>
      <section className='space-y-2 border border-border mb-10'>
        <div className='relative flex flex-col xl:flex-row justify-between'>
          <div className='absolute top-0 w-full h-full opacity-10 blur-sm'>
            <Image
              className='object-cover object-center mx-auto'
              src={
                project?.featuredImage
                  ? urlFor(project.featuredImage).url()
                  : ''
              }
              alt={project?.title ?? 'Featured Image'}
              fill
              sizes='100vw'
              priority
            />
          </div>

          <section className='p-5 bg-muted w-full z-10'>
            <div className='flex flex-col 2xl:flex-row justify-between gap-y-5'>
              <div className='space-y-2 w-full'>
                <h1 className='text-h1 text-foreground'>{project?.title}</h1>
                <p className='text-small text-muted-foreground'>
                  {new Date(project?._createdAt ?? '').toLocaleDateString(
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
              <p className='text-lead text-muted-foreground line-clamp-2 pt-10 max-w-measure'>
                {project?.description}
              </p>
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
      <RenderPortableText value={project?.content ?? []} />
    </div>
  );
};

export default RenderPortfolio;
