import Card from '@/components/layout/Card';
import ListRow, { RowList } from '@/components/layout/ListRow';
import PageLayout from '@/components/layout/PageLayout';
import { SectionLink } from '@/components/layout/Section';
import { Grid } from '@/components/layout/Stack';
import Text from '@/components/layout/Text';
import { plural } from '@/lib/utils';
import {
  CategoryListItem,
  CATEGORIES_QUERY,
  sanityFetch,
} from '@/sanity/lib/queries';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Categories',
  description:
    'Browse posts by category - backend systems, APIs, cloud, and everything in between.',
};

const CategoriesPage = async () => {
  const categories =
    (await sanityFetch<CategoryListItem[]>(CATEGORIES_QUERY)) ?? [];

  return (
    <PageLayout
      variant='index'
      header={{
        eyebrow: 'The Blog',
        title: 'Browse by category',
        meta: categories.length
          ? plural(categories.length, 'category', 'categories')
          : undefined,
        lead: 'Every topic I write about, grouped in one place. Pick a category to see the posts inside it.',
      }}
    >
      {categories.length ? (
        <Grid cols='two-lg'>
          {categories.map((category) => {
            const href = `/categories/${category.slug}`;
            return (
              <Card
                key={category._id}
                href={href}
                stretch={false}
                titleAs='h2'
                title={category.name}
                aside={
                  <Text variant='meta'>
                    {plural(category.postCount, 'post')}
                  </Text>
                }
                description={category.description}
                lines='none'
                footer={
                  <SectionLink href={href}>
                    All {plural(category.postCount, 'post')}
                  </SectionLink>
                }
              >
                {category.latestPosts?.length > 0 && (
                  <RowList variant='compact'>
                    {category.latestPosts.map((post) => (
                      <ListRow
                        key={post._id}
                        variant='compact'
                        href={`/blog/${post.slug}`}
                        title={post.title}
                      />
                    ))}
                  </RowList>
                )}
              </Card>
            );
          })}
        </Grid>
      ) : (
        <Text>No categories yet - check back soon.</Text>
      )}
    </PageLayout>
  );
};

export default CategoriesPage;
