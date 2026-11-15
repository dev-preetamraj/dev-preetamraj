import WorkTogetherCta from '@/components/global/WorkTogetherCta';
import { rankPosts } from '@/lib/ranking';
import { formatViews } from '@/lib/utils';
import {
  FEATURED_PROJECTS_QUERY,
  POPULAR_POSTS_QUERY,
  PopularPostLink,
  POSTS_QUERY,
  PostListItem,
  ProjectLink,
  sanityFetch,
} from '@/sanity/lib/queries';
import { ArrowUpRight, Eye } from 'lucide-react';
import Link from 'next/link';
import { FC, ReactNode } from 'react';

type Item = {
  _id: string;
  title: string;
  href: string;
  meta?: ReactNode;
};

const SidebarSection: FC<{
  title: string;
  children: ReactNode;
}> = ({ title, children }) => (
  <section className='flex flex-col gap-3'>
    <h2 className='text-eyebrow text-muted-foreground'>{title}</h2>
    {children}
  </section>
);

const LinkList: FC<{ items: Item[] }> = ({ items }) => (
  <ol className='flex flex-col'>
    {items.map((item) => (
      <li key={item._id} className='group'>
        <Link href={item.href} className='flex items-center gap-3 py-2'>
          <span className='line-clamp-1 flex-1 text-small text-muted-foreground transition-colors group-hover:text-foreground'>
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
  const [popularPosts, projects, posts] = await Promise.all([
    sanityFetch<PopularPostLink[]>(POPULAR_POSTS_QUERY),
    sanityFetch<ProjectLink[]>(FEATURED_PROJECTS_QUERY),
    // Same query + ranking as the home page, only to know which post is
    // featured there so Most Read never repeats it (request is deduped).
    sanityFetch<PostListItem[]>(POSTS_QUERY),
  ]);
  const featuredId = rankPosts(posts ?? [], now)[0]?._id;
  const mostRead = (popularPosts ?? [])
    .filter((p) => p._id !== featuredId)
    .slice(0, 4);

  return (
    <aside className='w-full md:w-[380px] lg:w-[600px] xl:w-64 2xl:w-80 h-full sticky top-20'>
      <div className='flex flex-col gap-12'>
        {mostRead.length > 0 && (
          <SidebarSection title='Most read'>
            <LinkList
              items={mostRead.map((p) => ({
                _id: p._id,
                title: p.title,
                href: `/blog/${p.slug}`,
                meta: (
                  <span className='flex shrink-0 items-center gap-1 font-mono text-micro text-muted-foreground'>
                    <Eye className='h-3 w-3' />
                    {formatViews(p.views)}
                  </span>
                ),
              }))}
            />
          </SidebarSection>
        )}

        {projects && projects.length > 0 && (
          <SidebarSection title='Projects'>
            <LinkList
              items={projects.slice(0, 4).map((p) => ({
                _id: p._id,
                title: p.title,
                href: `/portfolio/${p.slug}`,
              }))}
            />
          </SidebarSection>
        )}

        <WorkTogetherCta />
      </div>
    </aside>
  );
};

export default Rightbar;
