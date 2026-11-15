'use server';

import { createHash } from 'node:crypto';

import { headers } from 'next/headers';

import { trustedClientIp } from '@/lib/rate-limit';
import { writeClient } from '@/sanity/lib/write-client';

// Salt keeps the stored hash from being a plain sha256(ip) that could be
// checked against a guessed IP. Not security-critical (only used for dedup), so
// a build-time constant is fine; an env override is used when present.
const VIEW_HASH_SALT = process.env.VIEW_HASH_SALT ?? 'preetamraj.dev/view';
const DAY_MS = 24 * 60 * 60 * 1000;

/** Trust only Vercel's overwritten header; otherwise use a shared fallback. */
async function getClientIp(): Promise<string> {
  const headerList = await headers();
  return trustedClientIp(process.env.VERCEL === '1', headerList.get('x-vercel-forwarded-for'));
}

function sha256(input: string): string {
  return createHash('sha256').update(input).digest('hex');
}

/**
 * Record a view for a post, deduplicated per hashed viewer per day. Called
 * fire-and-forget from the client after the post renders, so any failure is
 * swallowed — a miscounted view must never surface to the reader.
 *
 * Dedup uses a deterministic document id built from (post, viewer hash, day),
 * so a refresh within the same UTC day maps to the same id and is not counted
 * again. The raw IP is never stored, only its hash.
 */
export async function recordView(postId: string): Promise<void> {
  if (typeof postId !== 'string' || !/^[a-zA-Z0-9_-][a-zA-Z0-9_.-]{0,127}$/.test(postId) || postId.startsWith('drafts.') || postId.startsWith('versions.')) return;

  try {
    const post = await writeClient.fetch<{ _rev: string } | null>(
      '*[_id == $postId && _type == "post" && defined(publishedAt) && dateTime(publishedAt) <= dateTime(now())][0]{_rev}',
      { postId }, { cache: 'no-store' },
    );
    if (!post) return;
    const ip = await getClientIp();
    // User-Agent is controlled by callers and must not influence identity.
    const viewerHash = sha256(`${ip}|${VIEW_HASH_SALT}`);
    const dayBucket = Math.floor(Date.now() / DAY_MS);
    const dedupId = `postView-${sha256(`${postId}|${viewerHash}|${dayBucket}`).slice(0, 40)}`;

    // Already counted this viewer for this post today — nothing to do.
    const seen = await writeClient.fetch<number>(
      `count(*[_id == $id])`,
      { id: dedupId },
    );
    if (seen > 0) return;

    // Create-only makes duplicate requests abort the entire transaction.
    // Revision guard also prevents mutating a post changed since validation.
    await writeClient
      .transaction()
      .create({
        _id: dedupId,
        _type: 'postView',
        post: { _type: 'reference', _ref: postId },
        viewerHash,
        viewedAt: new Date().toISOString(),
      })
      .patch(postId, (p) => p.ifRevisionId(post._rev).setIfMissing({ views: 0 }).inc({ views: 1 }))
      .commit({ visibility: 'async' });
  } catch (error) {
    if ((error as { statusCode?: number }).statusCode === 409) return;
    console.error('Failed to record post view:', error);
  }
}
