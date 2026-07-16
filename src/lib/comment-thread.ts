import { MAX_COMMENT_DEPTH } from './constants';

/** The existing comment a reply is aimed at, with its denormalized thread fields. */
export type ReplyTarget = {
  id: string;
  depth: number | null;
  rootId: string | null;
  parentRef: string | null;
};

/** Threading fields to persist on a new reply. */
export type ReplyThreading = {
  parentRef: string;
  rootId: string;
  depth: number;
};

/**
 * Compute a reply's threading fields from the comment it targets, enforcing the
 * depth cap: replying to a comment already at MAX_COMMENT_DEPTH makes the new
 * comment its sibling (same parent) rather than a deeper child, so the tree
 * never grows past the limit. A top-level target roots the thread on itself.
 */
export function computeReplyThreading(target: ReplyTarget): ReplyThreading {
  const targetDepth = target.depth ?? 1;
  const rootId = target.rootId ?? target.id;
  const atCap = targetDepth >= MAX_COMMENT_DEPTH;
  // At the cap the target is itself a reply, so parentRef is defined; fall back
  // to the root only to stay total against malformed data.
  const parentRef = atCap ? (target.parentRef ?? rootId) : target.id;
  const depth = Math.min(targetDepth + 1, MAX_COMMENT_DEPTH);
  return { parentRef, rootId, depth };
}
