/** Number of comments loaded per batch (initial render + each infinite-scroll fetch). */
export const COMMENTS_BATCH_SIZE = 5;

/** Fraction of the page height scrolled past which the next comment batch loads. */
export const COMMENTS_SCROLL_TRIGGER_RATIO = 0.9;

/** Number of posts rendered on the blog list's first paint. */
export const POSTS_INITIAL_BATCH_SIZE = 10;

/** Number of posts appended on each infinite-scroll fetch of the blog list. */
export const POSTS_BATCH_SIZE = 5;
