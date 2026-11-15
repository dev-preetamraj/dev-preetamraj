import type { TocItem } from '@/lib/toc';
import Image from 'next/image';
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import ArticleAside, {
  ArticleAsideProps,
  ArticleDetails,
} from './article/ArticleAside';
import Toc from './article/Toc';
import PageHeader, { PageHeaderProps } from './PageHeader';
import Rail, { MostRead, RailOptions } from './Rail';
import WorkTogetherCta from './WorkTogetherCta';

type IndexProps = {
  /**
   * Full main column + right rail: home, about, contact, blog, portfolio,
   * categories, tags, category/tag detail, 404.
   */
  variant: 'index';
  header?: PageHeaderProps;
  /** Which rail blocks show (all on by default). */
  rail?: RailOptions;
  /**
   * Content length policy. `long` (default): the rail is a sticky side
   * column from xl. `short` (a page that ends near the top: tag index,
   * 404): no side column - the discovery blocks follow the content in a
   * balanced full-width grid, so the main column is never stranded beside
   * a long rail.
   */
  length?: 'long' | 'short';
  children?: ReactNode;
};

type ArticleProps = {
  /**
   * Blog post / project detail: no rail; prose column at `max-w-measure`
   * plus a sticky aside (TOC, meta, topics, copy link). lg: a 13rem aside
   * and the prose takes the rest; xl+: prose up to 44rem and the aside
   * from 13rem to 22rem, starting at the shared frame's left edge. At the
   * frame cap (max-w-shell) the two fill the frame exactly.
   * Below lg the TOC is a collapsible block above the body and topics +
   * copy link sit inline after it (ArticleDetails).
   */
  variant: 'article';
  header: PageHeaderProps;
  /** h2/h3 outline from `buildToc` (same blocks as the prose). */
  toc: TocItem[];
  aside: ArticleAsideProps;
  /** Optional cover image under the header (decorative, alt=""). */
  cover?: string;
  /** Related posts, comments... rendered after the article body. */
  footer?: ReactNode;
  /** The article body (prose). */
  children: ReactNode;
};

type Props = IndexProps | ArticleProps;

const MAIN = 'flex min-w-0 flex-col gap-section-sm focus:outline-none';

/**
 * The page-level layout primitive. Every route renders exactly one
 * PageLayout; widths, the rail and vertical rhythm between blocks come from
 * here and nowhere else.
 */
const PageLayout = (props: Props) => {
  if (props.variant === 'article') {
    const { header, toc, aside, cover, footer, children } = props;
    return (
      <div className='flex flex-col gap-12 lg:grid lg:grid-cols-[minmax(0,1fr)_13rem] lg:gap-8 xl:grid-cols-[minmax(0,44rem)_minmax(13rem,1fr)] xl:gap-12'>
        <main
          id='main-content'
          tabIndex={-1}
          className={`${MAIN} w-full max-w-measure xl:max-w-measure-wide`}
        >
          {/* One rhythm owner: every block below is spaced by `MAIN`'s
              section gap - no extra divider or padding. */}
          <PageHeader {...header} metaInAside />
          {cover && (
            <div className='relative aspect-video w-full overflow-hidden rounded-xl border border-border bg-muted'>
              <Image
                src={cover}
                alt=''
                fill
                sizes='(min-width: 768px) 640px, 100vw'
                className='object-cover object-center'
                priority
              />
            </div>
          )}
          {toc.length > 0 && (
            <div className='lg:hidden'>
              <Toc items={toc} variant='disclosure' />
            </div>
          )}
          {/* #article-body: reading-progress measures to its end. */}
          <div id='article-body'>{children}</div>
          <div className='lg:hidden'>
            <ArticleDetails topics={aside.topics} url={aside.url} />
          </div>
          {footer}
          <MostRead />
          <WorkTogetherCta />
        </main>
        <aside aria-label='Article details' className='hidden min-w-0 lg:block'>
          <div className='sticky top-24'>
            <ArticleAside toc={toc} {...aside} />
          </div>
        </aside>
      </div>
    );
  }

  const { header, rail, length = 'long', children } = props;
  const short = length === 'short';
  return (
    <div
      className={cn(
        'flex flex-col gap-section',
        !short && 'xl:flex-row xl:gap-12'
      )}
    >
      <main id='main-content' tabIndex={-1} className={`${MAIN} flex-1`}>
        {header && <PageHeader {...header} />}
        {children}
      </main>
      <Rail {...rail} placement={short ? 'inline' : 'side'} />
    </div>
  );
};

export default PageLayout;
