import SiteShell from '@/components/layout/SiteShell';
import '@/styles/globals.css';

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SiteShell>{children}</SiteShell>;
}
