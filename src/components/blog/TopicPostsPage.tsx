import BlogList from '@/components/blog/BlogList';
import PageLayout from '@/components/layout/PageLayout';
import { BreadcrumbTitle } from '@/components/layout/SiteShell';
import Text from '@/components/layout/Text';
import { plural } from '@/lib/utils';
import { PostListItem } from '@/sanity/lib/queries';

type Props = {
  eyebrow: 'Category' | 'Tag';
  /** Breadcrumb label (the category/tag name). */
  name: string;
  title: string;
  lead: string;
  posts: PostListItem[] | null;
  empty: string;
};

/** A category's or tag's posts: /categories/[slug] and /tags/[slug]. */
const TopicPostsPage = ({
  eyebrow,
  name,
  title,
  lead,
  posts,
  empty,
}: Props) => {
  const count = posts?.length ?? 0;
  return (
    <PageLayout
      variant='index'
      header={{ eyebrow, title, meta: plural(count, 'post'), lead }}
    >
      <BreadcrumbTitle title={name} />
      {count ? <BlogList blogs={posts} /> : <Text>{empty}</Text>}
    </PageLayout>
  );
};

export default TopicPostsPage;
