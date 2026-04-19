'use server';

import dbConnect from '@/lib/dbConnect';
import { IResponse } from '@/lib/types';
import { ServerResponse } from '@/lib/utils';
import Comment, { IComment } from '@/models/comment';
import CustomUser from '@/models/user';
import { currentUser } from '@clerk/nextjs/server';

const response_obj = new ServerResponse();

export const createCommentForBlog = async (
  userId: string,
  content: string,
  blogSlug: string
): Promise<IResponse<Partial<IComment> | null>> => {
  try {
    await dbConnect();
    const dbUser = await CustomUser.findOne({ userId });

    if (!dbUser) return response_obj.errorResponse('Unauthorized');

    const comment = new Comment({
      author: dbUser._id,
      content,
      blogSlug,
    });

    await comment.save();

    return response_obj.response(comment, 'Comment created successfully');
  } catch (error: unknown) {
    console.log(error);
    return response_obj.serverErrorResponse();
  }
};

export const fetchCommentsByBlogSlug = async (
  blogSlug: string
): Promise<IResponse<Partial<IComment>[] | null>> => {
  try {
    await dbConnect();

    const comments = await Comment.find({ blogSlug })
      .populate('author')
      .sort({ createdAt: -1 })
      .lean();

    return response_obj.response(comments, 'Comments fetched successfully');
  } catch (error: unknown) {
    console.log(error);
    return response_obj.serverErrorResponse();
  }
};

export const deleteComment = async (
  commentId: string,
  userId: string
): Promise<IResponse<null>> => {
  try {
    await dbConnect();
    const user = await currentUser();

    if (!user || user.id !== userId)
      return response_obj.errorResponse('Unauthorized');

    await Comment.findOneAndDelete({ _id: commentId });
    return response_obj.response(null, 'Comment deleted successfully');
  } catch (error: unknown) {
    console.log(error);
    return response_obj.serverErrorResponse();
  }
};
