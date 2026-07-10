'use client';

import { useEffect, useRef } from 'react';

import { recordView } from '@/actions/post-view';

type Props = {
  postId: string;
};

/**
 * Fires a single view record after the post mounts. Runs client-side (not during
 * server render) so bot prefetches and metadata generation don't count. The ref
 * guard prevents a double-count from React StrictMode's dev double-invoke.
 */
const ViewTracker = ({ postId }: Props) => {
  const recorded = useRef(false);

  useEffect(() => {
    if (recorded.current || !postId) return;
    recorded.current = true;
    void recordView(postId);
  }, [postId]);

  return null;
};

export default ViewTracker;
