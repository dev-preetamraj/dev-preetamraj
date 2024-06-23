import mongoose, { Document, Schema } from 'mongoose';
import slugify from 'slugify';
import Category, { ICategory } from './category';
import Comment, { IComment } from './comment';
import Tag, { ITag } from './tag';

export interface IBlog extends Document {
  _id: string;
  __v: number;
  title: string;
  slug: string;
  description: string;
  content: string;
  category: ICategory;
  tags: ITag[];
  featuredImage: string;
  comments: IComment[];
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const blogSchema = new Schema<IBlog>(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    slug: {
      type: String,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: Category.modelName,
      required: true,
    },
    tags: [
      {
        type: Schema.Types.ObjectId,
        ref: Tag.modelName,
      },
    ],
    featuredImage: {
      type: String,
      default: 'https://images.unsplash.com/photo-1549558549-415fe4c37b60',
    },
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: Comment.modelName,
      },
    ],
    isPublished: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

blogSchema.pre('save', function (next) {
  if (this.isModified('title') || this.isNew) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

blogSchema.pre('findOneAndUpdate', function (next) {
  const update = this.getUpdate();
  if (update && typeof update === 'object' && 'title' in update) {
    update.slug = slugify(update.title, { lower: true, strict: true });
  }
  next();
});

const Blog = mongoose.models.Blog || mongoose.model<IBlog>('Blog', blogSchema);

export default Blog;
