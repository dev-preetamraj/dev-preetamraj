import SegmentedLinks from '@/components/layout/SegmentedLinks';
import { Clock, TrendingUp } from 'lucide-react';

export type SortKey = 'latest' | 'top';

type Props = {
  active: SortKey;
};

const OPTIONS = [
  { key: 'latest', label: 'Latest', href: '/blog', icon: Clock },
  {
    key: 'top',
    label: 'Top ranking',
    href: '/blog?sort=top',
    icon: TrendingUp,
  },
] as const;

/** Latest / Top ranking switch on /blog. */
const SortToggle = ({ active }: Props) => (
  <SegmentedLinks options={OPTIONS} active={active} label='Sort posts' />
);

export default SortToggle;
