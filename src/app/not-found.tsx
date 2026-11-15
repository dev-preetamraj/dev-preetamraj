import NotFoundView from '@/components/blog/NotFoundView';
import SiteShell from '@/components/layout/SiteShell';

// Unmatched URLs render outside the route groups, so wrap the shared 404 in
// the same site shell the groups use.
const NotFound = () => (
  <SiteShell>
    <NotFoundView />
  </SiteShell>
);

export default NotFound;
