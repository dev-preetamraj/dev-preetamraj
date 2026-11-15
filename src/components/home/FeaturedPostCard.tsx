import Card from '@/components/layout/Card';
import Chip from '@/components/layout/Chip';
import { PublishedDate, ViewCount } from '@/components/layout/Meta';
import { urlFor } from '@/sanity/lib/image';
import { PostListItem } from '@/sanity/lib/queries';
import { Star } from 'lucide-react';
import { FC } from 'react';

type Props = {
  blog: PostListItem;
};

/** The home page's top-ranked post on the shared Card (featured size). */
const FeaturedPostCard: FC<Props> = ({ blog }) => {
  const imageUrl = blog.featuredImage?.asset
    ? urlFor(blog.featuredImage).width(960).url()
    : null;

  return (
    <Card
      href={`/blog/${blog.slug}`}
      title={blog.title}
      titleAs='h2'
      size='featured'
      media={
        imageUrl
          ? { src: imageUrl, sizes: '(max-width: 640px) 100vw, 480px' }
          : undefined
      }
      eyebrow={
        <>
          <Chip tone='strong' icon={Star}>
            Featured
          </Chip>
          {blog.category && <Chip>{blog.category.name}</Chip>}
        </>
      }
      description={blog.description}
      lines='none'
      meta={
        <>
          <PublishedDate item={blog} />
          <ViewCount views={blog.views} />
        </>
      }
    />
  );
};

export default FeaturedPostCard;
