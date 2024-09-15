import {
  boolean,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

export const userSchema = pgTable('users', {
  id: varchar('id', { length: 255 }).primaryKey(),
  email: varchar('email', { length: 255 }).unique(),
  firstName: varchar('first_name', { length: 255 }),
  lastName: varchar('last_name', { length: 255 }),
  profilePicture: text('profile_picture'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export const categorySchema = pgTable('categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 100 }).unique().notNull(),
  slug: varchar('slug', { length: 255 }).unique().notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export const tagSchema = pgTable('tags', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 100 }).unique().notNull(),
  slug: varchar('slug', { length: 255 }).unique().notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export const commentSchema = pgTable('comments', {
  id: uuid('id').primaryKey().defaultRandom(),
  authorId: varchar('author_id', { length: 255 })
    .notNull()
    .references(() => userSchema.id, { onDelete: 'cascade' }),
  content: varchar('content', { length: 500 }).notNull(),
  isApproved: boolean('is_approved').default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export const blogSchema = pgTable('blogs', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: varchar('title', { length: 255 }).unique().notNull(),
  slug: varchar('slug', { length: 255 }).unique().notNull(),
  description: varchar('description', { length: 500 }).notNull(),
  content: text('content').notNull(),
  categoryId: uuid('category_id')
    .notNull()
    .references(() => categorySchema.id, { onDelete: 'set null' }),
  featuredImage: text('featured_image').notNull(),
  isPublished: boolean('is_published').default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export const portfolioSchema = pgTable('portfolios', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: varchar('title', { length: 255 }).unique().notNull(),
  slug: varchar('slug', { length: 255 }).unique().notNull(),
  description: varchar('description', { length: 500 }).notNull(),
  content: text('content').notNull(),
  categoryId: uuid('category_id')
    .notNull()
    .references(() => categorySchema.id, { onDelete: 'set null' }),
  featuredImage: text('featured_image').notNull(),
  githubUrl: text('github_url'),
  frontendGithubUrl: text('frontend_github_url'),
  liveUrl: text('live_url'),
  isPublished: boolean('is_published').default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export const blogTagSchema = pgTable(
  'blog_tags',
  {
    blogId: uuid('blog_id')
      .notNull()
      .references(() => blogSchema.id, { onDelete: 'cascade' }),
    tagId: uuid('tag_id')
      .notNull()
      .references(() => tagSchema.id, { onDelete: 'cascade' }),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.blogId, table.tagId] }),
  })
);

export const portfolioTagSchema = pgTable(
  'portfolio_tags',
  {
    portfolioId: uuid('portfolio_id')
      .notNull()
      .references(() => portfolioSchema.id, { onDelete: 'cascade' }),
    tagId: uuid('tag_id')
      .notNull()
      .references(() => tagSchema.id, { onDelete: 'cascade' }),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.portfolioId, table.tagId] }),
  })
);

export const blogCommentSchema = pgTable(
  'blog_comments',
  {
    blogId: uuid('blog_id')
      .notNull()
      .references(() => blogSchema.id, { onDelete: 'cascade' }),
    commentId: uuid('comment_id')
      .notNull()
      .references(() => commentSchema.id, { onDelete: 'cascade' }),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.blogId, table.commentId] }),
  })
);

export const portfolioCommentSchema = pgTable(
  'portfolio_comments',
  {
    portfolioId: uuid('portfolio_id')
      .notNull()
      .references(() => portfolioSchema.id, { onDelete: 'cascade' }),
    commentId: uuid('comment_id')
      .notNull()
      .references(() => commentSchema.id, { onDelete: 'cascade' }),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.portfolioId, table.commentId] }),
  })
);
