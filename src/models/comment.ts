import mongoose, { Document, Schema } from 'mongoose';
import CustomUser, { IUser } from './user';

export interface IComment extends Document {
  _id: string;
  __v: number;
  author: IUser;
  content: string;
  blogSlug: string;
  isApproved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const commentSchema = new Schema<IComment>(
  {
    author: {
      type: Schema.Types.ObjectId,
      ref: CustomUser.modelName,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    blogSlug: {
      type: String,
      required: true,
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Comment =
  mongoose.models.Comment || mongoose.model<IComment>('Comment', commentSchema);
export default Comment;
