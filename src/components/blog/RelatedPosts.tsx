import Card from '@/components/layout/Card';
import Chip from '@/components/layout/Chip';
import { MetaItem, ViewCount } from '@/components/layout/Meta';
import Section from '@/components/layout/Section';
import { Grid } from '@/components/layout/Stack';
import { formatDate, toISODate } from '@/lib/format-date';
import { PostListItem } from '@/sanity/lib/queries';
import { CalendarIcon } from 'lucide-react';
import { FC } from 'react';

type Props = {
  posts: PostListItem[];
};

const RelatedPosts: FC<Props> = ({ posts }) => {
  if (!posts.length) return null;

  return (
    <Section title='Keep reading'>
      <Grid cols='two'>
        {posts.map((post) => {
          const published = post.publishedAt ?? post._createdAt;
          return (
            <Card
              key={post._id}
              href={`/blog/${post.slug}`}
              title={post.title}
              eyebrow={post.category && <Chip>{post.category.name}</Chip>}
              meta={
                <>
                  <MetaItem icon={CalendarIcon}>
                    <time dateTime={toISODate(published)}>
                      {formatDate(published)}
                    </time>
                  </MetaItem>
                  <ViewCount views={post.views} />
                </>
              }
            />
          );
        })}
      </Grid>
    </Section>
  );
};

export default RelatedPosts;
