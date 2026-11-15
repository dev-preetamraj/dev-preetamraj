import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Card from './Card';

/**
 * The work-together CTA. Where it shows is decided by PageLayout (rail
 * option / article footer), never by the current pathname.
 */
const WorkTogetherCta = () => (
  <Card
    title='Let’s work together'
    description='Got something in mind? I’m always up for a good problem.'
    lines='none'
    footer={
      <Link
        href='/contact'
        className={cn(buttonVariants({ size: 'sm' }), 'gap-1.5')}
      >
        Get in touch
        <ArrowRight aria-hidden className='h-4 w-4' />
      </Link>
    }
  />
);

export default WorkTogetherCta;
