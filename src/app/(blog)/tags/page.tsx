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
        <p className='text-sm font-medium uppercase tracking-wide text-primary'>
          The Blog
        </p>
        <h1 className='text-2xl font-bold leading-tight text-foreground md:text-3xl'>
          Browse by tag
        </h1>
        <p className='max-w-2xl text-muted-foreground'>
          The tools, techniques, and topics I write about. Pick a tag to see
          every post that touches it.
        </p>
      </section>

      {tags?.length ? (
        <>
          <span className='text-sm text-muted-foreground'>
            {tags.length} {tags.length === 1 ? 'tag' : 'tags'}
          </span>
          <ul className='flex flex-wrap gap-2.5'>
            {tags.map((tag) => (
              <li key={tag._id}>
                <Link
                  href={`/tags/${tag.slug}`}
                  className='group flex items-center gap-2 rounded-full border border-border/70 bg-gradient-to-b from-card to-muted/20 py-1.5 pl-3.5 pr-2 text-sm shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md hover:shadow-primary/[0.06]'
                >
                  <span className='font-medium text-foreground transition-colors group-hover:text-primary'>
                    <span className='text-primary'>#</span>
                    {tag.name}
                  </span>
                  <span className='rounded-full bg-muted/60 px-2 py-0.5 font-mono text-[11px] text-muted-foreground ring-1 ring-border/60 transition-colors group-hover:bg-primary/10 group-hover:text-primary'>
                    {tag.postCount}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p className='text-muted-foreground'>No tags yet - check back soon.</p>
      )}
    </div>
  );
};

export default TagsPage;
