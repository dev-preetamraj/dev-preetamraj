import type { TocItem } from '@/lib/toc';
import type { TopicRef } from '@/lib/topics';
import { ReactNode } from 'react';
import { MetaRow } from '../Meta';
import Section from '../Section';
import Topics, { hasTopics } from '../Topics';
import CopyLinkButton from './CopyLinkButton';
import Toc from './Toc';

export type ArticleAsideProps = {
  /** Meta items (date, read time, views). */
  meta?: ReactNode;
  /** Category + tags, rendered (and de-duplicated) by Topics. */
  topics?: {
    category?: TopicRef | null;
    tags?: readonly TopicRef[] | null;
    linked?: boolean;
  };
  /** Canonical URL for the copy-link button. */
  url: string;
};

const TopicsBlock = ({ topics }: Pick<ArticleAsideProps, 'topics'>) =>
  topics && hasTopics(topics.category, topics.tags) ? (
    <Section variant='rail' title='Topics'>
      <Topics {...topics} />
    </Section>
  ) : null;

/** Sticky column beside the article prose (lg and up). */
const ArticleAside = ({
  toc,
  meta,
  topics,
  url,
}: ArticleAsideProps & { toc: TocItem[] }) => (
  <div className='flex flex-col gap-10'>
    {toc.length > 0 && <Toc items={toc} variant='aside' />}
    {meta && (
      <Section variant='rail' title='Details'>
        <MetaRow>{meta}</MetaRow>
      </Section>
    )}
    <TopicsBlock topics={topics} />
    <CopyLinkButton url={url} />
  </div>
);

/**
 * The same topics + share capability inline after the article body, for
 * widths where the aside is hidden (below lg). Meta and the TOC already
 * show above the body there.
 */
export const ArticleDetails = ({
  topics,
  url,
}: Pick<ArticleAsideProps, 'topics' | 'url'>) => (
  <div className='flex flex-col gap-stack border-t border-border pt-stack'>
    <TopicsBlock topics={topics} />
    <CopyLinkButton url={url} />
  </div>
);

export default ArticleAside;
