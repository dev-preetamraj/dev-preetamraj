import { buttonVariants } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { urlFor } from '@/sanity/lib/image';
import { ProjectListItem } from '@/sanity/lib/queries';
import { PhotoIcon } from '@heroicons/react/24/outline';
import { GitHubLogoIcon } from '@radix-ui/react-icons';
import { ArrowUpRight, Globe, Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { FC } from 'react';

type Props = {
  project: ProjectListItem;
};

const FeaturedProjectCard: FC<Props> = ({ project }) => {
  const imageUrl = project.featuredImage?.asset
    ? urlFor(project.featuredImage).url()
    : null;

  return (
    <Card className='group relative flex flex-col gap-5 rounded-2xl border-primary/25 bg-gradient-to-br from-primary/[0.08] via-primary/[0.03] to-transparent p-4 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/[0.06] sm:flex-row sm:gap-6 sm:p-5'>
      <div className='relative aspect-video w-full shrink-0 overflow-hidden rounded-xl bg-muted ring-1 ring-border/60 sm:w-1/2'>
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={project.featuredImage?.alt || project.title}
            fill
            sizes='(max-width: 640px) 100vw, (max-width: 1280px) 45vw, 420px'
            className='object-cover transition-transform duration-300 group-hover:scale-[1.02]'
            priority
          />
        ) : (
          <div
            className='flex h-full w-full items-center justify-center text-muted-foreground'
            aria-label={`${project.title} (no featured image)`}
          >
            <PhotoIcon className='h-10 w-10' />
          </div>
        )}
      </div>

      <div className='flex flex-1 flex-col gap-3'>
        <div className='flex flex-wrap items-center gap-2'>
          <span className='inline-flex items-center gap-1 rounded-full bg-primary px-2.5 py-0.5 text-[11px] font-semibold text-primary-foreground'>
            <Star className='h-3 w-3 fill-current' />
            Featured
          </span>
          {project.category && (
            <span className='inline-flex rounded-md bg-primary/10 px-2 py-0.5 font-mono text-[11px] font-medium text-primary ring-1 ring-primary/20'>
              {project.category.name}
            </span>
          )}
        </div>

        <h3 className='flex items-start gap-2 text-lg font-bold leading-snug text-foreground transition-colors group-hover:text-primary md:text-xl'>
          <Link
            href={`/portfolio/${project.slug}`}
            className='line-clamp-2 after:absolute after:inset-0'
          >
            {project.title}
          </Link>
          <ArrowUpRight className='mt-1 h-5 w-5 shrink-0 text-muted-foreground transition-colors group-hover:text-primary' />
        </h3>

        {project.description && (
          <p className='line-clamp-3 text-sm leading-6 text-muted-foreground'>
            {project.description}
          </p>
        )}

        {project.tags && project.tags.length > 0 && (
          <div className='flex flex-wrap gap-1.5'>
            {project.tags.slice(0, 5).map((tag) => (
              <span
                key={tag.slug}
                className='rounded-full border border-border/60 px-2 py-0.5 text-[11px] text-muted-foreground'
              >
                {tag.name}
              </span>
            ))}
          </div>
        )}

        {(project.liveUrl || project.githubUrl) && (
          <div className='relative z-10 mt-1 flex flex-wrap gap-2'>
            {project.liveUrl && (
              <Link
                href={project.liveUrl}
                target='_blank'
                rel='noopener noreferrer'
                className={cn(buttonVariants({ size: 'sm' }), 'gap-1.5')}
              >
                <Globe className='h-4 w-4' />
                Live
              </Link>
            )}
            {project.githubUrl && (
              <Link
                href={project.githubUrl}
                target='_blank'
                rel='noopener noreferrer'
                className={cn(
                  buttonVariants({ size: 'sm', variant: 'outline' }),
                  'gap-1.5'
                )}
              >
                <GitHubLogoIcon className='h-4 w-4' />
                Code
              </Link>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

export default FeaturedProjectCard;
