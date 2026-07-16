import { CommentIcon } from '@sanity/icons/Comment';
import { defineField, defineType } from 'sanity';

export const commentType = defineType({
  name: 'comment',
  title: 'Comment',
  type: 'document',
  icon: CommentIcon,
  fields: [
    defineField({
      name: 'post',
      title: 'Post',
      type: 'reference',
      to: [{ type: 'post' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'parent',
      title: 'Parent comment',
      type: 'reference',
      to: [{ type: 'comment' }],
      readOnly: true,
      description: 'Immediate parent when this is a reply. Empty for top-level comments.',
    }),
    defineField({
      name: 'root',
      title: 'Thread root',
      type: 'reference',
      to: [{ type: 'comment' }],
      readOnly: true,
      description:
        'Top-level ancestor of the thread. Empty for top-level comments.',
    }),
    defineField({
      name: 'depth',
      title: 'Depth',
      type: 'number',
      readOnly: true,
      description: 'Nesting level 1-4, set server-side.',
    }),
    defineField({
      name: 'authorName',
      title: 'Author name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'authorEmail',
      title: 'Author email',
      type: 'string',
      validation: (Rule) => Rule.email(),
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'isApproved',
      title: 'Approved',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'authorIp',
      title: 'Author IP',
      type: 'string',
      readOnly: true,
      description:
        'Captured server-side for rate limiting and moderation. Not shown publicly.',
    }),
  ],
  preview: {
    select: {
      authorName: 'authorName',
      content: 'content',
      isApproved: 'isApproved',
      postTitle: 'post.title',
      parentId: 'parent._ref',
    },
    prepare({ authorName, content, isApproved, postTitle, parentId }) {
      const reply = parentId ? '↳ ' : '';
      return {
        title: `${isApproved ? '✓' : '•'} ${reply}${authorName}`,
        subtitle: postTitle ? `on “${postTitle}” — ${content}` : content,
      };
    },
  },
});
