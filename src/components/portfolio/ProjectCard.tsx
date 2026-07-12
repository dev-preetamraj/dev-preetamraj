import { Card, CardContent } from '@/components/ui/card';
import { urlFor } from '@/sanity/lib/image';
import { ProjectListItem } from '@/sanity/lib/queries';
import { PhotoIcon } from '@heroicons/react/24/outline';
import { GitHubLogoIcon } from '@radix-ui/react-icons';
import { ArrowUpRight, Globe } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { FC } from 'react';

type Props = {
  project: ProjectListItem;
};

const ProjectCard: FC<Props> = ({ project }) => {
  const imageUrl = project.featuredImage?.asset
    ? urlFor(project.featuredImage).url()
    : null;

  return (
    <Card className='group relative flex flex-col overflow-hidden rounded-2xl border-border/70 bg-gradient-to-b from-card to-muted/20 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/[0.06]'>
      <div className='relative aspect-video w-full overflow-hidden bg-muted'>
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={project.featuredImage?.alt || project.title}
            fill
            sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px'
            className='object-cover transition-transform duration-300 group-hover:scale-[1.02]'
          />
        ) : (
          <div
            className='flex h-full w-full items-center justify-center text-muted-foreground'
            aria-label={`${project.title} (no featured image)`}
          >
            <PhotoIcon className='h-8 w-8' />
          </div>
        )}

        {(project.liveUrl || project.githubUrl) && (
          <div className='absolute right-3 top-3 z-10 flex gap-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100'>
            {project.liveUrl && (
              <Link
                href={project.liveUrl}
                target='_blank'
                rel='noopener noreferrer'
                aria-label={`${project.title} live site`}
                className='flex h-8 w-8 items-center justify-center rounded-lg bg-background/80 text-foreground backdrop-blur ring-1 ring-border/60 transition-colors hover:bg-primary hover:text-primary-foreground'
              >
                <Globe className='h-4 w-4' />
              </Link>
            )}
            {project.githubUrl && (
              <Link
                href={project.githubUrl}
                target='_blank'
                rel='noopener noreferrer'
                aria-label={`${project.title} source code`}
                className='flex h-8 w-8 items-center justify-center rounded-lg bg-background/80 text-foreground backdrop-blur ring-1 ring-border/60 transition-colors hover:bg-primary hover:text-primary-foreground'
              >
                <GitHubLogoIcon className='h-4 w-4' />
              </Link>
            )}
          </div>
        )}
      </div>

      <CardContent className='flex flex-1 flex-col gap-2 pt-5'>
        {project.category && (
          <span className='inline-flex w-fit rounded-md bg-primary/10 px-2 py-0.5 font-mono text-[11px] font-medium text-primary ring-1 ring-primary/20'>
            {project.category.name}
          </span>
        )}
        <h3 className='flex items-start gap-2 text-base font-semibold leading-snug text-foreground transition-colors group-hover:text-primary'>
          <Link
            href={`/portfolio/${project.slug}`}
            className='line-clamp-2 after:absolute after:inset-0'
          >
            {project.title}
          </Link>
          <ArrowUpRight className='mt-0.5 h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary' />
        </h3>
        {project.description && (
          <p className='line-clamp-2 text-sm leading-6 text-muted-foreground'>
            {project.description}
          </p>
        )}
        {project.tags && project.tags.length > 0 && (
          <div className='mt-auto flex flex-wrap gap-1.5 pt-2'>
            {project.tags.slice(0, 4).map((tag) => (
              <span
                key={tag.slug}
                className='rounded-full border border-border/60 px-2 py-0.5 text-[11px] text-muted-foreground'
              >
                {tag.name}
              </span>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProjectCard;
