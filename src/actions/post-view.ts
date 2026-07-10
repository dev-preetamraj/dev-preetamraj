'use server';

import { createHash } from 'node:crypto';

import { headers } from 'next/headers';

import { writeClient } from '@/sanity/lib/write-client';

// Salt keeps the stored hash from being a plain sha256(ip) that could be
// checked against a guessed IP. Not security-critical (only used for dedup), so
// a build-time constant is fine; an env override is used when present.
const VIEW_HASH_SALT = process.env.VIEW_HASH_SALT ?? 'preetamraj.dev/view';
const DAY_MS = 24 * 60 * 60 * 1000;

/** Resolve the client IP from proxy headers (Vercel/any reverse proxy). */
async function getClientIp(): Promise<string> {
  const headerList = await headers();
  const forwardedFor = headerList.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  return headerList.get('x-real-ip')?.trim() || 'unknown';
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
  if (!postId) return;

  try {
    const [ip, headerList] = await Promise.all([getClientIp(), headers()]);
    const userAgent = headerList.get('user-agent') ?? 'unknown';

    const viewerHash = sha256(`${ip}|${userAgent}|${VIEW_HASH_SALT}`);
    const dayBucket = Math.floor(Date.now() / DAY_MS);
    const dedupId = `postView-${sha256(`${postId}|${viewerHash}|${dayBucket}`).slice(0, 40)}`;

    // Already counted this viewer for this post today — nothing to do.
    const seen = await writeClient.fetch<number>(
      `count(*[_id == $id])`,
      { id: dedupId },
    );
    if (seen > 0) return;

    // Create the dedup record and bump the denormalized counter together. The
    // tiny race window (two concurrent first-views double-incrementing) is
    // acceptable for a personal blog.
    await writeClient
      .transaction()
      .createIfNotExists({
        _id: dedupId,
        _type: 'postView',
        post: { _type: 'reference', _ref: postId },
        viewerHash,
        viewedAt: new Date().toISOString(),
      })
      .patch(postId, (p) => p.setIfMissing({ views: 0 }).inc({ views: 1 }))
      .commit({ visibility: 'async' });
  } catch (error) {
    console.error('Failed to record post view:', error);
  }
}
