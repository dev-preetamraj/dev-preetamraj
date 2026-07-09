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
  ],
  preview: {
    select: {
      authorName: 'authorName',
      content: 'content',
      isApproved: 'isApproved',
      postTitle: 'post.title',
    },
    prepare({ authorName, content, isApproved, postTitle }) {
      return {
        title: `${isApproved ? '✓' : '•'} ${authorName}`,
        subtitle: postTitle ? `on “${postTitle}” — ${content}` : content,
      };
    },
  },
});
