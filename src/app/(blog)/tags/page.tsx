import { TagListItem, TAGS_QUERY, sanityFetch } from '@/sanity/lib/queries';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Tags',
  description:
    'Browse posts by tag - the tools, techniques, and topics I write about.',
};

const TagsPage = async () => {
  const tags = await sanityFetch<TagListItem[]>(TAGS_QUERY);

  return (
    <div className='flex w-full flex-col space-y-8'>
      <section className='flex flex-col space-y-5'>
        <p className='text-eyebrow text-muted-foreground'>The Blog</p>
        <h1 className='text-h1 text-foreground'>Browse by tag</h1>
        <p className='max-w-2xl text-lead text-muted-foreground'>
          The tools, techniques, and topics I write about. Pick a tag to see
          every post that touches it.
        </p>
      </section>

      {tags?.length ? (
        <>
          <span className='text-small text-muted-foreground'>
            {tags.length} {tags.length === 1 ? 'tag' : 'tags'}
          </span>
          <ul className='flex flex-wrap gap-2.5'>
            {tags.map((tag) => (
              <li key={tag._id}>
                <Link
                  href={`/tags/${tag.slug}`}
                  className='group flex items-center gap-2 rounded-full border border-border bg-card py-1.5 pl-3.5 pr-2 text-small transition-all duration-base hover:-translate-y-0.5 hover:border-input hover:shadow-md'
                >
                  <span className='font-medium text-foreground transition-colors group-hover:text-primary'>
                    <span className='text-muted-foreground'>#</span>
                    {tag.name}
                  </span>
                  <span className='rounded-full border border-border bg-muted px-2 py-0.5 font-mono text-micro text-muted-foreground'>
                    {tag.postCount}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p className='text-body text-muted-foreground'>No tags yet - check back soon.</p>
      )}
    </div>
  );
};

export default TagsPage;
