import mongoose, { Document, Schema } from 'mongoose';

export interface ITag extends Document {
  _id: string;
  __v: number;
  name: string;
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
  },
  { timestamps: true }
);

const Tag = mongoose.models.Tag || mongoose.model<ITag>('Tag', tagSchema);

export default Tag;
