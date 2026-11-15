import { dedupeTopics, topicLabel, TopicRef } from '@/lib/topics';
import Chip from './Chip';

type Props = {
  category?: TopicRef | null;
  tags?: readonly TopicRef[] | null;
  /**
   * Link topics to their category/tag pages (blog posts). When false
   * (projects, whose tags have no listing) topics render as passive meta
   * chips, so a link never looks like a label or vice versa.
   */
  linked?: boolean;
};

/**
 * Category + tags, de-duplicated case-insensitively, tags shown as "#name".
 * Linked topics are `nav` chips; passive topics are `meta` chips.
 */
const Topics = ({ category, tags, linked = false }: Props) => {
  const topics = dedupeTopics(category, tags);
  if (!topics.length) return null;

  return (
    <ul className='flex flex-wrap gap-2'>
      {topics.map((topic) => (
        <li key={`${topic.kind}:${topic.slug}`}>
          <Chip
            variant={linked ? 'nav' : 'meta'}
            tone={topic.kind === 'category' ? 'strong' : 'default'}
            href={
              linked
                ? `/${topic.kind === 'category' ? 'categories' : 'tags'}/${
                    topic.slug
                  }`
                : undefined
            }
          >
            {topicLabel(topic)}
          </Chip>
        </li>
      ))}
    </ul>
  );
};

export const hasTopics = (
  category?: TopicRef | null,
  tags?: readonly TopicRef[] | null
) => dedupeTopics(category, tags).length > 0;

export default Topics;
