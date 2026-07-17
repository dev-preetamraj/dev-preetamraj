import WorkTogetherCta from '@/components/global/WorkTogetherCta';
import { rankCategories, trendingWindowSince } from '@/lib/ranking';
import { formatViews } from '@/lib/utils';
import {
  CategoryStat,
  FEATURED_PROJECTS_QUERY,
  POPULAR_POSTS_QUERY,
  PopularPostLink,
  ProjectLink,
  sanityFetch,
  TRENDING_CATEGORY_STATS_QUERY,
} from '@/sanity/lib/queries';
import { ArrowUpRight, Eye, FlameIcon, FolderGit2, Hash } from 'lucide-react';
import Link from 'next/link';
import { FC, ReactNode } from 'react';

type Item = {
  _id: string;
  title: string;
  href: string;
  meta?: ReactNode;
};

const SidebarSection: FC<{
  icon: ReactNode;
  title: string;
  children: ReactNode;
}> = ({ icon, title, children }) => (
  <section className='flex flex-col gap-4'>
    <div className='flex items-center gap-2.5'>
      <span className='flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/20'>
        {icon}
      </span>
      <h2 className='text-sm font-semibold tracking-wide text-foreground'>
        {title}
      </h2>
    </div>
    {children}
  </section>
);

const LinkList: FC<{ items: Item[] }> = ({ items }) => (
  <ol className='flex flex-col'>
    {items.map((item, index) => (
      <li
        key={item._id}
        className='group border-b border-border/60 last:border-b-0'
      >
        <Link href={item.href} className='flex items-center gap-3 py-2.5'>
          <span className='font-mono text-[11px] font-medium text-muted-foreground/70 transition-colors group-hover:text-primary'>
            {String(index + 1).padStart(2, '0')}
          </span>
          <span className='line-clamp-1 flex-1 text-sm text-muted-foreground transition-colors group-hover:text-foreground'>
            {item.title}
          </span>
          {item.meta ?? (
            <ArrowUpRight className='h-3.5 w-3.5 shrink-0 -translate-x-1 text-primary opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100' />
          )}
        </Link>
      </li>
    ))}
  </ol>
);

const Rightbar = async () => {
  const now = Date.now();
  const [popularPosts, projects, categoryStats] = await Promise.all([
    sanityFetch<PopularPostLink[]>(POPULAR_POSTS_QUERY),
    sanityFetch<ProjectLink[]>(FEATURED_PROJECTS_QUERY),
    sanityFetch<CategoryStat[]>(TRENDING_CATEGORY_STATS_QUERY, {
      since: trendingWindowSince(now),
    }),
  ]);
  const categories = rankCategories(categoryStats, 8);

  return (
    <aside className='w-full md:w-[380px] lg:w-[600px] xl:w-64 2xl:w-80 h-full sticky top-20'>
      <div className='flex flex-col gap-10'>
        {popularPosts && popularPosts.length > 0 && (
          <SidebarSection
            icon={<FlameIcon className='h-3.5 w-3.5' />}
            title='Most Read'
          >
            <LinkList
              items={popularPosts.map((p) => ({
                _id: p._id,
                title: p.title,
                href: `/blog/${p.slug}`,
                meta: (
                  <span className='flex shrink-0 items-center gap-1 text-[11px] text-muted-foreground/70'>
                    <Eye className='h-3 w-3' />
                    {formatViews(p.views)}
                  </span>
                ),
              }))}
            />
          </SidebarSection>
        )}

        {projects && projects.length > 0 && (
          <SidebarSection
            icon={<FolderGit2 className='h-3.5 w-3.5' />}
            title='Featured Projects'
          >
            <LinkList
              items={projects.map((p) => ({
                _id: p._id,
                title: p.title,
                href: `/portfolio/${p.slug}`,
              }))}
            />
          </SidebarSection>
        )}

        {categories && categories.length > 0 && (
          <SidebarSection
            icon={<Hash className='h-3.5 w-3.5' />}
            title='Trending Categories'
          >
            <div className='flex flex-wrap gap-2'>
              {categories.map((category) => (
                <Link
                  key={category._id}
                  href={`/categories/${category.slug}`}
                  className='group inline-flex items-center gap-1.5 rounded-full border border-border/60 px-3 py-1 text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary'
                >
                  {category.name}
                  <span className='font-mono text-[11px] text-muted-foreground/70 transition-colors group-hover:text-primary'>
                    {category.postCount}
                  </span>
                </Link>
              ))}
            </div>
          </SidebarSection>
        )}

        <WorkTogetherCta />
      </div>
    </aside>
  );
};

export default Rightbar;
