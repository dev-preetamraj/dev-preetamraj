'use server';

import { headers } from 'next/headers';
import { z } from 'zod';

import { IResponse } from '@/lib/types';
import { client } from '@/sanity/lib/client';
import { COMMENTS_PAGE_QUERY, PostComment } from '@/sanity/lib/queries';
import { writeClient } from '@/sanity/lib/write-client';

const commentSchema = z.object({
  postId: z.string().min(1),
  authorName: z.string().trim().min(1, 'Name is required').max(80),
  authorEmail: z.string().trim().email('A valid email is required'),
  content: z
    .string()
    .trim()
    .min(1, 'Comment is required')
    .max(500, 'Maximum 500 characters are allowed'),
  // Honeypot — real users never fill this. Optional so it can be absent/empty.
  website: z.string().optional(),
});

export type CreateCommentInput = z.infer<typeof commentSchema>;

const SUCCESS_MESSAGE = 'Comment submitted for approval';
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const RATE_LIMIT_MAX = 5; // max comments per IP per window

/** Resolve the client IP from proxy headers (Vercel/any reverse proxy). */
async function getClientIp(): Promise<string> {
  const headerList = await headers();
  const forwardedFor = headerList.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  return headerList.get('x-real-ip')?.trim() || 'unknown';
}

/**
 * Fetch a page of approved comments for infinite scroll. Reads via the public
 * client — only approved comments are returned. `start`/`end` are a GROQ range
 * (end exclusive).
 */
export async function getApprovedComments(
  postId: string,
  start: number,
  end: number,
): Promise<PostComment[]> {
  if (!postId || end <= start) return [];
  try {
    return await client.fetch<PostComment[]>(COMMENTS_PAGE_QUERY, {
      postId,
      start,
      end,
    });
  } catch (error) {
    console.error('Failed to fetch comments page:', error);
    return [];
  }
}

export async function createComment(
  input: CreateCommentInput,
): Promise<IResponse<null>> {
  const parsed = commentSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      data: null,
      message: parsed.error.errors[0]?.message ?? 'Invalid comment',
    };
  }

  const { postId, authorName, authorEmail, content, website } = parsed.data;

  // Honeypot: silently pretend success without creating anything, so bots
  // get no signal that they were caught.
  if (website && website.trim().length > 0) {
    return { success: true, data: null, message: SUCCESS_MESSAGE };
  }

  try {
    const ip = await getClientIp();

    // Rate limit per IP over a sliding window (skip when IP is unknown — the
    // approval gate is the backstop in that case).
    if (ip !== 'unknown') {
      const since = new Date(Date.now() - RATE_LIMIT_WINDOW_MS).toISOString();
      const recentCount = await writeClient.fetch<number>(
        `count(*[_type == "comment" && authorIp == $ip && _createdAt > $since])`,
        { ip, since },
      );
      if (recentCount >= RATE_LIMIT_MAX) {
        return {
          success: false,
          data: null,
          message:
            'You are commenting too fast. Please try again in a few minutes.',
        };
      }
    }

    await writeClient.create({
      _type: 'comment',
      post: { _type: 'reference', _ref: postId },
      authorName,
      authorEmail,
      content,
      authorIp: ip,
      isApproved: false,
    });

    return { success: true, data: null, message: SUCCESS_MESSAGE };
  } catch (error) {
    console.error('Failed to create comment:', error);
    return {
      success: false,
      data: null,
      message: 'Something went wrong. Please try again later.',
    };
  }
}
