import mongoose, { Document, Schema } from 'mongoose';
import Blog from './blog';
import CustomUser, { IUser } from './user';

export interface IComment extends Document {
  _id: string;
  __v: number;
  author: IUser;
  content: string;
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
    isApproved: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

commentSchema.pre('findOneAndDelete', async function (next) {
  try {
    const commentId = this.getQuery()._id;
    console.log(`findOneAndDelete hook triggered for commentId: ${commentId}`);
    await Blog.updateMany(
      { comments: commentId },
      { $pull: { comments: commentId } }
    );
    next();
  } catch (error: any) {
    next(error);
  }
});

commentSchema.pre(
  'deleteOne',
  { document: true, query: false },
  async function (next) {
    try {
      const commentId = this._id;
      console.log(`deleteOne hook triggered for commentId: ${commentId}`);
      await Blog.updateMany(
        { comments: commentId },
        { $pull: { comments: commentId } }
      );
      next();
    } catch (error: any) {
      next(error);
    }
  }
);

const Comment =
  mongoose.models.Comment || mongoose.model<IComment>('Comment', commentSchema);
export default Comment;
