import Chip from '@/components/layout/Chip';
import PageLayout from '@/components/layout/PageLayout';
import { Cluster } from '@/components/layout/Stack';
import Text from '@/components/layout/Text';
import { topicLabel } from '@/lib/topics';
import { TagListItem, TAGS_QUERY, sanityFetch } from '@/sanity/lib/queries';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tags',
  description:
    'Browse posts by tag - the tools, techniques, and topics I write about.',
};

const TagsPage = async () => {
  const tags = (await sanityFetch<TagListItem[]>(TAGS_QUERY)) ?? [];

  return (
    <PageLayout
      variant='index'
      length='short'
      header={{
        eyebrow: 'The Blog',
        title: 'Browse by tag',
        meta: tags.length
          ? `${tags.length} ${tags.length === 1 ? 'tag' : 'tags'}`
          : undefined,
        lead: 'The tools, techniques, and topics I write about. Pick a tag to see every post that touches it.',
      }}
    >
      {tags.length ? (
        <Cluster as='ul'>
          {tags.map((tag) => (
            <li key={tag._id}>
              <Chip
                variant='nav'
                href={`/tags/${tag.slug}`}
                count={tag.postCount}
              >
                {topicLabel({ name: tag.name, kind: 'tag' })}
              </Chip>
            </li>
          ))}
        </Cluster>
      ) : (
        <Text>No tags yet - check back soon.</Text>
      )}
    </PageLayout>
  );
};

export default TagsPage;
