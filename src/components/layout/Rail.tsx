import { rankPosts } from '@/lib/ranking';
import { cn } from '@/lib/utils';
import {
  FEATURED_PROJECTS_QUERY,
  POPULAR_POSTS_QUERY,
  PopularPostLink,
  POSTS_QUERY,
  PostListItem,
  ProjectLink,
  sanityFetch,
} from '@/sanity/lib/queries';
import ListRow, { RowList } from './ListRow';
import { ViewCount } from './Meta';
import Section from './Section';
import WorkTogetherCta from './WorkTogetherCta';

export type RailOptions = {
  /** Most Read posts (default on). */
  mostRead?: boolean;
  /** Featured projects (off on /portfolio, which lists them itself). */
  projects?: boolean;
  /** Work-together CTA (off on /contact, which is the pitch itself). */
  cta?: boolean;
};

// Wall-clock read lives outside the component so render stays pure; ranking takes it as `nowMs`.
const currentTimeMs = () => Date.now();

/** Most-read posts, never repeating the post featured on the home page. */
export const MostRead = async ({ limit = 4 }: { limit?: number }) => {
  const [popularPosts, posts] = await Promise.all([
    sanityFetch<PopularPostLink[]>(POPULAR_POSTS_QUERY),
    // Same query + ranking as the home page, only to know which post is
    // featured there (request is deduped).
    sanityFetch<PostListItem[]>(POSTS_QUERY),
  ]);
  const featuredId = rankPosts(posts ?? [], currentTimeMs())[0]?._id;
  const items = (popularPosts ?? [])
    .filter((p) => p._id !== featuredId)
    .slice(0, limit);
  if (!items.length) return null;

  return (
    <Section variant='rail' title='Most read'>
      <RowList as='ol' variant='compact'>
        {items.map((p) => (
          <ListRow
            key={p._id}
            variant='compact'
            href={`/blog/${p.slug}`}
            title={p.title}
            trailing={<ViewCount views={p.views} />}
          />
        ))}
      </RowList>
    </Section>
  );
};

const FeaturedProjects = async () => {
  const projects = await sanityFetch<ProjectLink[]>(FEATURED_PROJECTS_QUERY);
  if (!projects?.length) return null;

  return (
    <Section variant='rail' title='Projects'>
      <RowList variant='compact'>
        {projects.slice(0, 4).map((p) => (
          <ListRow
            key={p._id}
            variant='compact'
            href={`/portfolio/${p.slug}`}
            title={p.title}
          />
        ))}
      </RowList>
    </Section>
  );
};

/**
 * The discovery blocks of the `index` PageLayout. Which blocks show is
 * decided by the page through PageLayout's `rail` prop - never by the
 * pathname.
 *
 * One block grid, two placements:
 *  - `side`: a sticky column beside the main column from xl (stacks under
 *    the content below xl).
 *  - `inline`: always under the content, full width (short pages).
 * The groups sit in an auto-fit grid of >= 16rem tracks, so a narrow side
 * column is one stack while a full-width placement becomes 2-3 compact
 * columns - rows never stretch across the page with counts flung to the
 * far edge.
 */
const Rail = ({
  mostRead = true,
  projects = true,
  cta = true,
  placement = 'side',
}: RailOptions & { placement?: 'side' | 'inline' }) => (
  <aside
    aria-label='More from the site'
    className={cn(
      'w-full min-w-0',
      placement === 'side' &&
        'shrink-0 xl:sticky xl:top-24 xl:w-64 xl:self-start 2xl:w-80'
    )}
  >
    <div className='grid grid-cols-[repeat(auto-fit,minmax(16rem,1fr))] items-start gap-x-8 gap-y-10'>
      {mostRead && <MostRead />}
      {projects && <FeaturedProjects />}
      {cta && <WorkTogetherCta />}
    </div>
  </aside>
);

export default Rail;
