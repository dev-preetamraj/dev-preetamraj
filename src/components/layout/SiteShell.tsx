import { ScrollArea } from '@/components/ui/scroll-area';
import { ReactNode } from 'react';
import Navbar from './chrome/Navbar';
import Sidebar from './chrome/Sidebar';

/**
 * Site chrome shared by every public route: skip link, left sidebar, sticky
 * navbar and the centred page row (capped at `max-w-shell`, gutter padding).
 * The page row's content - main column, rail or article aside - comes from
 * PageLayout, so the shell never decides what a page shows.
 */
const SiteShell = ({ children }: { children: ReactNode }) => (
  <div className='flex'>
    <a href='#main-content' className='skip-link'>
      Skip to content
    </a>
    <Sidebar />
    <ScrollArea className='flex h-screen w-full flex-col overflow-y-auto'>
      <Navbar />
      <div className='mx-auto w-screen max-w-shell px-gutter pb-section-sm pt-8 md:w-full'>
        {children}
      </div>
    </ScrollArea>
  </div>
);

export default SiteShell;
