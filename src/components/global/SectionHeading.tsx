import { ReactNode } from 'react';

type Props = {
  /** @deprecated Numbered prefixes were dropped from the design; ignored. */
  index?: string;
  title: string;
  /** Optional trailing link/action, right-aligned on the same line. */
  action?: ReactNode;
};

const SectionHeading = ({ title, action }: Props) => (
  <div className='flex items-baseline justify-between gap-4'>
    <h2 className='text-h3 text-foreground'>{title}</h2>
    {action}
  </div>
);

export default SectionHeading;
