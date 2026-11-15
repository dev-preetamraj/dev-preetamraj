import Prose from '@/components/layout/article/Prose';
import { MetaItem, ViewCount } from '@/components/layout/Meta';
import PageLayout from '@/components/layout/PageLayout';
import { formatDate, toISODate } from '@/lib/format-date';
import { readingTimeMinutes } from '@/lib/reading-time';
import { buildToc } from '@/lib/toc';
import { Post } from '@/sanity/lib/queries';
import { CalendarIcon, ClockIcon } from 'lucide-react';
import { ReactNode } from 'react';

type Props = {
  blog: Post;
  /** Canonical URL (copy-link button). */
  url: string;
  /** Comments, related posts... after the article body. */
  footer?: ReactNode;
};

/** A blog post on the `article` PageLayout. */
const RenderBlog = ({ blog, url, footer }: Props) => {
  const readingTime = readingTimeMinutes(blog.content);
  const published = blog.publishedAt ?? blog._createdAt;
  const date = formatDate(published);
  const content = blog.content ?? [];

  const meta = (
    <>
      {date && (
        <MetaItem icon={CalendarIcon}>
          <time dateTime={toISODate(published)}>{date}</time>
        </MetaItem>
      )}
      {readingTime > 0 && (
        <MetaItem icon={ClockIcon} title='Estimated reading time'>
          {readingTime} min read
        </MetaItem>
      )}
      <ViewCount views={blog.views} label />
    </>
  );

  // Category + tags link to their listings (Topics dedupes and hashes).
  const topics = { category: blog.category, tags: blog.tags, linked: true };

  return (
    <PageLayout
      variant='article'
      header={{
        eyebrow: blog.category?.name ?? 'The Blog',
        eyebrowHref: blog.category
          ? `/categories/${blog.category.slug}`
          : undefined,
        title: blog.title,
        meta,
        lead: blog.description,
      }}
      toc={buildToc(content)}
      aside={{ meta, topics, url }}
      footer={footer}
    >
      <Prose value={content} />
    </PageLayout>
  );
};

export default RenderBlog;
