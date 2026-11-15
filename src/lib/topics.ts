/**
 * Category + tags as one de-duplicated topic list (pure, testable).
 *
 * Tags whose name equals the category (or an earlier tag) case-insensitively
 * are dropped, so "Design Patterns" / "#Design Patterns" or "Python" /
 * "python" never show twice. The category always comes first.
 */

export type TopicRef = { name: string; slug: string };

export type Topic = TopicRef & { kind: 'category' | 'tag' };

const key = (name: string) => name.trim().toLowerCase();

export const dedupeTopics = (
  category: TopicRef | null | undefined,
  tags: readonly TopicRef[] | null | undefined
): Topic[] => {
  const seen = new Set<string>();
  const topics: Topic[] = [];

  if (category?.name?.trim()) {
    seen.add(key(category.name));
    topics.push({ ...category, kind: 'category' });
  }
  for (const tag of tags ?? []) {
    if (!tag?.name?.trim()) continue;
    const k = key(tag.name);
    if (seen.has(k)) continue;
    seen.add(k);
    topics.push({ ...tag, kind: 'tag' });
  }
  return topics;
};

/** The one hash convention: tags are shown as "#name", categories plain. */
export const topicLabel = (topic: Pick<Topic, 'name' | 'kind'>) =>
  topic.kind === 'tag' ? `#${topic.name.trim()}` : topic.name.trim();
