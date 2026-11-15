import Card from '@/components/layout/Card';
import Chip from '@/components/layout/Chip';
import { Cluster } from '@/components/layout/Stack';
import { buttonVariants } from '@/components/ui/button';
import { dedupeTopics, topicLabel } from '@/lib/topics';
import { cn } from '@/lib/utils';
import { urlFor } from '@/sanity/lib/image';
import { ProjectListItem } from '@/sanity/lib/queries';
import { GithubIcon, Globe, Star } from 'lucide-react';
import Link from 'next/link';
import { FC } from 'react';

type Props = {
  project: ProjectListItem;
  /** Featured: larger title, image beside the text, Live/Code buttons. */
  featured?: boolean;
};

/** A project on the shared Card (portfolio grid and featured row). */
const ProjectCard: FC<Props> = ({ project, featured = false }) => {
  const imageUrl = project.featuredImage?.asset
    ? urlFor(project.featuredImage).width(960).url()
    : null;
  // Same topic rules as articles: no tag repeating the category, "#tag".
  const tags = dedupeTopics(project.category, project.tags)
    .filter((topic) => topic.kind === 'tag')
    .slice(0, featured ? 5 : 4);

  const eyebrow =
    featured || project.category ? (
      <>
        {featured && (
          <Chip tone='strong' icon={Star}>
            Featured
          </Chip>
        )}
        {project.category && <Chip>{project.category.name}</Chip>}
      </>
    ) : undefined;

  const actions =
    featured && (project.liveUrl || project.githubUrl) ? (
      <>
        {project.liveUrl && (
          <Link
            href={project.liveUrl}
            target='_blank'
            rel='noopener noreferrer'
            className={cn(buttonVariants({ size: 'sm' }), 'gap-1.5')}
          >
            <Globe aria-hidden className='h-4 w-4' />
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
            <GithubIcon aria-hidden className='h-4 w-4' />
            Code
          </Link>
        )}
      </>
    ) : undefined;

  return (
    <Card
      href={`/portfolio/${project.slug}`}
      title={project.title}
      size={featured ? 'featured' : 'default'}
      span={featured ? 'full' : undefined}
      media={
        imageUrl
          ? {
              src: imageUrl,
              sizes: featured
                ? '(max-width: 640px) 100vw, 480px'
                : '(max-width: 640px) 100vw, 420px',
              priority: featured,
            }
          : undefined
      }
      eyebrow={eyebrow}
      description={project.description}
      lines={featured ? 'none' : 2}
      footer={actions}
    >
      {tags.length > 0 && (
        <Cluster gap='xs'>
          {tags.map((tag) => (
            <Chip key={tag.slug}>{topicLabel(tag)}</Chip>
          ))}
        </Cluster>
      )}
    </Card>
  );
};

export default ProjectCard;
