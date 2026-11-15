'use client';
import { usePathname } from 'next/navigation';
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import Navbar from './chrome/Navbar';
import Sidebar from './chrome/Sidebar';

export type PageTitle = { path: string; title: string };

const SetPageTitle = createContext<(title: PageTitle) => void>(() => {});

/**
 * Rendered by a detail page so the navbar breadcrumb shows its real title
 * ("LLM Kit Pro") instead of one guessed from the slug.
 */
export const BreadcrumbTitle = ({ title }: { title: string }) => {
  const setTitle = useContext(SetPageTitle);
  const path = usePathname();
  useEffect(() => setTitle({ path, title }), [setTitle, path, title]);
  return null;
};

/**
 * Site chrome shared by every public route: skip link, left sidebar, sticky
 * navbar and the centred page row (capped at `max-w-shell`, gutter padding).
 * The page row's content - main column, rail or article aside - comes from
 * PageLayout, so the shell never decides what a page shows. The page
 * scrolls the window; below md an open menu pushes the page off to the
 * right (clipped, never scrolled sideways).
 */
const SiteShell = ({ children }: { children: ReactNode }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [pageTitle, setPageTitle] = useState<PageTitle | null>(null);
  const pathname = usePathname();
  // Close the mobile menu on route change (adjust state during render).
  const [menuPath, setMenuPath] = useState(pathname);
  if (menuPath !== pathname) {
    setMenuPath(pathname);
    setMenuOpen(false);
  }
  return (
    <div className='flex overflow-x-clip'>
      <a href='#main-content' className='skip-link'>
        Skip to content
      </a>
      <Sidebar open={menuOpen} />
      <div className='flex w-screen min-w-0 shrink-0 flex-col md:w-full md:shrink'>
        <Navbar
          menuOpen={menuOpen}
          onMenuToggle={() => setMenuOpen((open) => !open)}
          pageTitle={pageTitle}
        />
        <div className='mx-auto w-full max-w-shell px-gutter pb-section-sm pt-8'>
          <SetPageTitle.Provider value={setPageTitle}>
            {children}
          </SetPageTitle.Provider>
        </div>
      </div>
    </div>
  );
};

export default SiteShell;
