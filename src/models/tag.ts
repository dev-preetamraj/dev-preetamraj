import mongoose, { Document, Schema } from 'mongoose';
import slugify from 'slugify';

export interface ITag extends Document {
  _id: string;
  __v: number;
  name: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
}

const tagSchema = new Schema<ITag>(
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

tagSchema.pre('save', function (next) {
  if (this.isModified('name') || this.isNew) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

tagSchema.pre('findOneAndUpdate', function (next) {
  const update = this.getUpdate();
  if (update && typeof update === 'object' && 'name' in update) {
    update.slug = slugify(update.name, { lower: true, strict: true });
  }
  next();
});

const Tag = mongoose.models.Tag || mongoose.model<ITag>('Tag', tagSchema);

export default Tag;
