import mongoose, { Document, Schema } from 'mongoose';
import slugify from 'slugify';
import { ICategory } from './category';
import { ITag } from './tag';

export interface IPortfolio extends Document {
  _id: string;
  __v: number;
  title: string;
  slug: string;
  description: string;
  content: string;
  category: ICategory;
  tags: ITag[];
  featuredImage: string;
  githubUrl?: string;
  frontendGithubUrl?: string;
  liveUrl?: string;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const portfolioSchema = new Schema<IPortfolio>(
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
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    tags: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tag',
      },
    ],
    featuredImage: {
      type: String,
      default: 'https://images.unsplash.com/photo-1549558549-415fe4c37b60',
    },
    githubUrl: {
      type: String,
    },
    frontendGithubUrl: {
      type: String,
    },
    liveUrl: {
      type: String,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

portfolioSchema.pre('save', function (next) {
  if (this.isModified('title') || this.isNew) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

portfolioSchema.pre('findOneAndUpdate', function (next) {
  const update = this.getUpdate();
  if (update && typeof update === 'object' && 'title' in update) {
    update.slug = slugify(update.title, { lower: true, strict: true });
  }
  next();
});

const Portfolio =
  mongoose.models.Portfolio ||
  mongoose.model<IPortfolio>('Portfolio', portfolioSchema);

export default Portfolio;
