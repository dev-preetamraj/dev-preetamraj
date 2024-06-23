'use server';

import dbConnect from '@/lib/dbConnect';
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
    await dbConnect();
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
