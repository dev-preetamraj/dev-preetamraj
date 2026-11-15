import { cn } from '@/lib/utils';
import { ArrowUpRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { ComponentType, ElementType, ReactNode } from 'react';
import { MetaRow } from './Meta';
import { ICON, LINK } from './roles';

type IconType = ComponentType<{ className?: string; 'aria-hidden'?: boolean }>;

type Media = {
  src: string;
  /** Next/Image sizes for the column the card sits in. */
  sizes: string;
  priority?: boolean;
};

type Props = {
  title: ReactNode;
  titleAs?: ElementType;
  /** Link target. The title link stretches over the whole card. */
  href?: string;
  external?: boolean;
  /** Set false when the card holds its own links (title still links). */
  stretch?: boolean;
  /**
   * `featured` = larger title; media beside the text once the CARD is at
   * least 40rem wide (container query, .card-featured in globals.css), in
   * two equal columns with a fixed 16:9 media box. Stacked otherwise.
   */
  size?: 'default' | 'featured';
  /** Decorative cover image (alt=""); the title carries the meaning. */
  media?: Media;
  /** Small icon tile before the title. */
  icon?: IconType;
  /** Chips/labels row above the title. */
  eyebrow?: ReactNode;
  /** Right side of the title line (badge, count). */
  aside?: ReactNode;
  description?: ReactNode;
  /** Clamp the description; `none` shows it in full. */
  lines?: 2 | 3 | 'none';
  /** Mono meta row (date, views). */
  meta?: ReactNode;
  /** Free content under the description (chip rows, link lists). */
  children?: ReactNode;
  /** Actions pinned to the bottom (buttons). */
  footer?: ReactNode;
  /** Span every column of the surrounding Grid. */
  span?: 'full';
};

const CLAMP = { 2: 'line-clamp-2', 3: 'line-clamp-3', none: '' } as const;

/**
 * The one content card: projects, related posts, featured post, about
 * highlights/skills, contact channels, categories, the work-together CTA.
 * The outer wrapper is the grid item (span) and the size container that
 * decides the featured orientation.
 */
const Card = ({
  title,
  titleAs: Title = 'h3',
  href,
  external = false,
  stretch = true,
  size = 'default',
  media,
  icon: Icon,
  eyebrow,
  aside,
  description,
  lines = 2,
  meta,
  children,
  footer,
  span,
}: Props) => {
  const featured = size === 'featured' && Boolean(media);
  const interactive = Boolean(href && stretch);
  const linkProps = external
    ? { target: '_blank', rel: 'noopener noreferrer' }
    : {};

  const titleNode = href ? (
    <Link
      href={href}
      {...linkProps}
      className={
        stretch
          ? 'after:absolute after:inset-0 after:rounded-xl focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-ring'
          : LINK.content
      }
    >
      {title}
    </Link>
  ) : (
    title
  );

  return (
    <div
      className={cn('cq-container min-w-0', span === 'full' && 'col-span-full')}
    >
      <article
        className={cn(
          'group relative h-full min-w-0 overflow-hidden rounded-xl border border-border bg-card text-card-foreground',
          featured ? 'card-featured' : 'flex flex-col',
          interactive &&
            'transition-all duration-base hover:-translate-y-0.5 hover:border-input hover:shadow-md motion-reduce:transition-none motion-reduce:hover:translate-y-0'
        )}
      >
        {media && (
          <div
            className={cn(
              'relative aspect-video w-full shrink-0 overflow-hidden bg-muted',
              featured && 'rounded-lg ring-1 ring-border'
            )}
          >
            <Image
              src={media.src}
              alt=''
              fill
              sizes={media.sizes}
              priority={media.priority}
              className='object-cover'
            />
          </div>
        )}

        <div
          className={cn(
            'flex min-w-0 flex-1 flex-col gap-3',
            !featured && 'p-5'
          )}
        >
          {eyebrow && <div className='flex flex-wrap gap-1.5'>{eyebrow}</div>}

          <div className='flex items-start gap-3'>
            {Icon && (
              <span className='flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border bg-muted text-foreground'>
                <Icon className={ICON.tile} aria-hidden />
              </span>
            )}
            <Title
              className={cn(
                'min-w-0 flex-1 text-foreground',
                Icon && 'self-center',
                size === 'featured' ? 'text-h3' : 'text-h4',
                interactive && LINK.contentGroup
              )}
            >
              {titleNode}
            </Title>
            {aside && (
              <div
                className={cn(
                  'flex shrink-0 items-center gap-2',
                  Icon ? 'self-center' : 'pt-0.5'
                )}
              >
                {aside}
              </div>
            )}
            {interactive && (
              <ArrowUpRight
                aria-hidden
                className={cn(
                  ICON.action,
                  'text-muted-foreground',
                  LINK.contentGroup,
                  Icon ? 'self-center' : size === 'featured' ? 'mt-2' : 'mt-1'
                )}
              />
            )}
          </div>

          {description && (
            <p className={cn('text-small text-muted-foreground', CLAMP[lines])}>
              {description}
            </p>
          )}
          {children}
          {meta && (
            <div className='mt-auto'>
              <MetaRow>{meta}</MetaRow>
            </div>
          )}
          {footer && (
            <div className='relative z-10 mt-auto flex flex-wrap items-center gap-2 pt-1'>
              {footer}
            </div>
          )}
        </div>
      </article>
    </div>
  );
};

export default Card;
