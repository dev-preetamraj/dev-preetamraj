/** Number of comments loaded per batch (initial render + each infinite-scroll fetch). */
export const COMMENTS_BATCH_SIZE = 5;

/** Fraction of the page height scrolled past which the next comment batch loads. */
export const COMMENTS_SCROLL_TRIGGER_RATIO = 0.9;

/** Deepest a reply can nest. Replies to a comment at this depth become siblings. */
export const MAX_COMMENT_DEPTH = 4;

/** Number of posts rendered on the blog list's first paint. */
export const POSTS_INITIAL_BATCH_SIZE = 10;

/** Number of posts appended on each infinite-scroll fetch of the blog list. */
export const POSTS_BATCH_SIZE = 5;

/** Number of most-recent posts carried in the RSS feed. */
export const FEED_POSTS_COUNT = 20;

/** Number of related posts shown at the foot of a post - two full rows. */
export const RELATED_POSTS_COUNT = 4;
