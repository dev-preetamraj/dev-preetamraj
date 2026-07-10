import { EyeOpenIcon } from '@sanity/icons/EyeOpen';
import { defineField, defineType } from 'sanity';

/**
 * Internal dedup record for the blog view counter. One document per
 * (post, hashed viewer, day). Never shown publicly — the displayed count lives
 * on `post.views`. Created server-side by the `recordView` action.
 */
export const postViewType = defineType({
  name: 'postView',
  title: 'Post view',
  type: 'document',
  icon: EyeOpenIcon,
  fields: [
    defineField({
      name: 'post',
      title: 'Post',
      type: 'reference',
      to: [{ type: 'post' }],
      readOnly: true,
    }),
    defineField({
      name: 'viewerHash',
      title: 'Viewer hash',
      type: 'string',
      readOnly: true,
      description:
        'SHA-256 of IP + user-agent. Used only to deduplicate views; the raw IP is never stored.',
    }),
    defineField({
      name: 'viewedAt',
      title: 'Viewed at',
      type: 'datetime',
      readOnly: true,
    }),
  ],
  preview: {
    select: { postTitle: 'post.title', viewedAt: 'viewedAt' },
    prepare({ postTitle, viewedAt }) {
      return {
        title: postTitle ? `View on “${postTitle}”` : 'Post view',
        subtitle: viewedAt,
      };
    },
  },
});
