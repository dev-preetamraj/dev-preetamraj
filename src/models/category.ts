import mongoose, { Document, Schema } from 'mongoose';
import slugify from 'slugify';

export interface ICategory extends Document {
  _id: string;
  __v: number;
  name: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
}

const categorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    slug: {
      type: String,
      unique: true,
    },
  },
  { timestamps: true }
);

categorySchema.pre('save', function (next) {
  if (this.isModified('name') || this.isNew) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

categorySchema.pre('findOneAndUpdate', function (next) {
  const update = this.getUpdate();
  if (update && typeof update === 'object' && 'name' in update) {
    update.slug = slugify(update.name, { lower: true, strict: true });
  }
  next();
});

const Category =
  mongoose.models.Category ||
  mongoose.model<ICategory>('Category', categorySchema);

export default Category;
