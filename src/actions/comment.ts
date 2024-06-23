'use server';

import { IResponse } from '@/lib/types';
import { ServerResponse } from '@/lib/utils';
import Blog from '@/models/blog';
import Comment, { IComment } from '@/models/comment';
import CustomUser from '@/models/user';
import { User } from '@clerk/nextjs/server';

export type CommentType = {
  comment: Partial<IComment>;
  user: User;
};

const response_obj = new ServerResponse();

export const createCommentForBlog = async (
  userId: string,
  content: string,
  blogId: string
): Promise<IResponse<Partial<IComment> | null>> => {
  try {
    const dbUser = await CustomUser.findOne({ userId });

    if (!dbUser) return response_obj.errorResponse('Unauthorized');

    const comment = new Comment({
      author: dbUser._id,
      content,
    });

    await comment.save();

    const blog = await Blog.findById(blogId);
    if (!blog) return response_obj.errorResponse('Blog not found');

    blog.comments.push(comment);
    await blog.save();

    return response_obj.response(comment, 'Comment created successfully');
  } catch (error: any) {
    console.log(error);
    return response_obj.serverErrorResponse();
  }
};

export const createReply = async (
  author: string,
  parentComment: string,
  content: string,
  blogId: string | null = null,
  portfolioId: string | null = null
): Promise<IResponse<Partial<IComment> | null>> => {
  try {
    const comment: IComment = new Comment({
      author,
      parentComment,
      content,
      blog: blogId,
      portfolio: portfolioId,
    });

    await comment.save();
    return response_obj.response(comment, 'Reply created successfully');
  } catch (error: any) {
    console.log(error);
    return response_obj.serverErrorResponse();
  }
};

export const fetchCommentsForBlog = async (
  blogId: string
): Promise<IResponse<IComment[] | null>> => {
  try {
    const comments = await Comment.find({ blog: blogId })
      .populate('author')
      .populate('replies')
      .lean();

    return response_obj.response(comments, 'Comments fetched successfully');
  } catch (error: any) {
    console.log(error);
    return response_obj.serverErrorResponse();
  }
};
