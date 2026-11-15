import { cn } from '@/lib/utils';
import { ElementType, ReactNode } from 'react';

/*
 * Spacing primitives. Routes never write margins/padding/space-y: vertical
 * rhythm comes from Stack (and PageLayout/Section), horizontal groups from
 * Cluster, card grids from Grid. Gaps are component spacing on the 4px grid
 * plus the fluid layout tokens (stack, section-sm).
 */

const GAP = {
  xs: 'gap-1',
  sm: 'gap-2',
  md: 'gap-4',
  stack: 'gap-stack',
  section: 'gap-section-sm',
} as const;

type StackProps = {
  gap?: keyof typeof GAP;
  children: ReactNode;
};

/** Vertical flow with one gap between children. */
export const Stack = ({ gap = 'md', children }: StackProps) => (
  <div className={cn('flex min-w-0 flex-col', GAP[gap])}>{children}</div>
);

/** Wrapping horizontal group (chips, buttons, icon links). */
export const Cluster = ({
  as: Tag = 'div',
  gap = 'sm',
  children,
}: StackProps & { as?: ElementType }) => (
  <Tag className={cn('flex flex-wrap items-center', GAP[gap])}>{children}</Tag>
);

/*
 * Column counts follow the width of the column the grid sits in (CSS
 * container queries, rules in globals.css), not the viewport, so cards
 * never get squeezed when the sidebar or rail takes space.
 */
const COLUMNS = {
  /** 2 columns once the container fits two ~280px cards (36rem). */
  two: 'cq-grid-two',
  /** 2 columns from 44rem (long card content). */
  'two-lg': 'cq-grid-two-lg',
  /** 2 columns from 36rem, 3 from 52rem. */
  three: 'cq-grid-three',
} as const;

type GridProps = {
  cols?: keyof typeof COLUMNS;
  children: ReactNode;
};

/** Card grid: one column when narrow, the same gap everywhere. */
export const Grid = ({ cols = 'two', children }: GridProps) => (
  <div className='cq-container min-w-0'>
    <div className={cn('grid gap-4', COLUMNS[cols])}>{children}</div>
  </div>
);
