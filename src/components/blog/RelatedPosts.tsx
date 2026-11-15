import Card from '@/components/layout/Card';
import Chip from '@/components/layout/Chip';
import { PublishedDate, ViewCount } from '@/components/layout/Meta';
import Section from '@/components/layout/Section';
import { Grid } from '@/components/layout/Stack';
import { PostListItem } from '@/sanity/lib/queries';
import { FC } from 'react';

type Props = {
  posts: PostListItem[];
};

const RelatedPosts: FC<Props> = ({ posts }) => {
  if (!posts.length) return null;

  return (
    <Section title='Keep reading'>
      <Grid cols='two'>
        {posts.map((post) => (
          <Card
            key={post._id}
            href={`/blog/${post.slug}`}
            title={post.title}
            eyebrow={post.category && <Chip>{post.category.name}</Chip>}
            meta={
              <>
                <PublishedDate item={post} />
                <ViewCount views={post.views} />
              </>
            }
          />
        ))}
      </Grid>
    </Section>
  );
};

export default RelatedPosts;
