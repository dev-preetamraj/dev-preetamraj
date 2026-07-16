import { describe, expect, it } from 'bun:test';

import { computeReplyThreading } from '../comment-thread';
import { MAX_COMMENT_DEPTH } from '../constants';

describe('computeReplyThreading', () => {
  it('roots a reply to a top-level comment on that comment', () => {
    const result = computeReplyThreading({
      id: 'top',
      depth: 1,
      rootId: null,
      parentRef: null,
    });
    expect(result).toEqual({ parentRef: 'top', rootId: 'top', depth: 2 });
  });

  it('treats a missing depth as top-level', () => {
    const result = computeReplyThreading({
      id: 'legacy',
      depth: null,
      rootId: null,
      parentRef: null,
    });
    expect(result).toEqual({ parentRef: 'legacy', rootId: 'legacy', depth: 2 });
  });

  it('nests a reply one level below a mid-thread comment', () => {
    const result = computeReplyThreading({
      id: 'mid',
      depth: 2,
      rootId: 'root',
      parentRef: 'top',
    });
    expect(result).toEqual({ parentRef: 'mid', rootId: 'root', depth: 3 });
  });

  it('caps depth: a reply to a max-depth comment becomes its sibling', () => {
    const result = computeReplyThreading({
      id: 'deep',
      depth: MAX_COMMENT_DEPTH,
      rootId: 'root',
      parentRef: 'grandparent',
    });
    expect(result).toEqual({
      parentRef: 'grandparent',
      rootId: 'root',
      depth: MAX_COMMENT_DEPTH,
    });
  });

  it('never exceeds the cap even for a corrupt over-deep target', () => {
    const result = computeReplyThreading({
      id: 'corrupt',
      depth: MAX_COMMENT_DEPTH + 3,
      rootId: 'root',
      parentRef: 'parent',
    });
    expect(result.depth).toBe(MAX_COMMENT_DEPTH);
    expect(result.parentRef).toBe('parent');
  });

  it('falls back to the root when a capped target has no parent ref', () => {
    const result = computeReplyThreading({
      id: 'capped',
      depth: MAX_COMMENT_DEPTH,
      rootId: 'root',
      parentRef: null,
    });
    expect(result.parentRef).toBe('root');
  });
});
