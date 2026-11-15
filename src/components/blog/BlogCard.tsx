import Chip from '@/components/layout/Chip';
import ListRow from '@/components/layout/ListRow';
import { MetaItem, ViewCount } from '@/components/layout/Meta';
import { formatDate, toISODate } from '@/lib/format-date';
import { PostListItem } from '@/sanity/lib/queries';
import { CalendarIcon } from 'lucide-react';
import { FC } from 'react';

type Props = {
  blog: PostListItem;
  /** Heading level of the title (h2 on list pages, h3 under a Section). */
  titleAs?: 'h2' | 'h3';
};

/**
 * One post in any post list (blog, category, tag, home "Latest"): the
 * shared ListRow with date, category chip and views - so a post looks the
 * same everywhere it is listed.
 */
const BlogCard: FC<Props> = ({ blog, titleAs = 'h2' }) => {
  const published = blog.publishedAt ?? blog._createdAt;
  return (
    <ListRow
      href={`/blog/${blog.slug}`}
      title={blog.title}
      titleAs={titleAs}
      description={blog.description}
      meta={
        <>
          <MetaItem icon={CalendarIcon}>
            <time dateTime={toISODate(published)}>{formatDate(published)}</time>
          </MetaItem>
          {blog.category && (
            <Chip href={`/categories/${blog.category.slug}`}>
              {blog.category.name}
            </Chip>
          )}
          <ViewCount views={blog.views} />
        </>
      }
    />
  );
};

export default BlogCard;
