'use server';

import dbConnect from '@/lib/dbConnect';
import { IResponse } from '@/lib/types';
import { ServerResponse } from '@/lib/utils';
import Blog, { IBlog } from '@/models/blog';
import Category from '@/models/category';
import { currentUser } from '@clerk/nextjs/server';

const response_obj = new ServerResponse();

export const getBlogById = async (
  blogId: string
): Promise<IResponse<Partial<IBlog> | null>> => {
  try {
    await dbConnect();

    const blog = await Blog.findById(blogId).populate('category').lean();

    return response_obj.response(blog, 'Blog fetched successfully');
  } catch (error: any) {
    console.log(error);
    return response_obj.serverErrorResponse();
  }
};

export const deleteBlogById = async (
  blogId: string
): Promise<IResponse<null>> => {
  try {
    await dbConnect();

    await Blog.deleteOne({ _id: blogId });

    return response_obj.response(null, 'Blog deleted successfully');
  } catch (error: any) {
    console.log(error);
    return response_obj.serverErrorResponse();
  }
};

export const getBlogBySlug = async (
  slug: string
): Promise<IResponse<Partial<IBlog> | null>> => {
  try {
    await dbConnect();

    const blog = await Blog.findOne({ slug })
      .populate('category')
      .populate({
        path: 'comments',
        populate: {
          path: 'author',
          model: 'CustomUser',
        },
      })
      .lean();

    return response_obj.response(blog, 'Blog fetched successfully');
  } catch (error: any) {
    console.log(error);
    return response_obj.serverErrorResponse();
  }
};

export const createBlog = async (
  title: string,
  description: string,
  featuredImage?: string
): Promise<IResponse<Partial<IBlog> | null>> => {
  try {
    await dbConnect();
    const user = await currentUser();
    if (!user) return response_obj.errorResponse('Unauthorized');

    const role = user.privateMetadata.role;
    if (role !== 'admin') return response_obj.errorResponse('Unauthorized');

    const existingTitle = await Blog.findOne({ title });
    if (existingTitle)
      return response_obj.errorResponse('Duplicate titles are not allowed');

    const category = await Category.findOne({ name: 'uncategorized' });

    const response = await Blog.create({
      title,
      description,
      content: 'Write here...',
      category: category._id,
    });
    if (featuredImage) {
      response.featuredImage = featuredImage;
      await response.save();
    }

    return response_obj.response(
      response,
      'Blog created successfully. Redirecting...'
    );
  } catch (error: any) {
    console.log(error);
    return response_obj.serverErrorResponse();
  }
};

export const updateMetadata = async (blogId: string, metadata: any) => {
  try {
    await dbConnect();
    const user = await currentUser();
    if (!user) return response_obj.errorResponse('Unauthorized');

    const role = user.privateMetadata.role;
    if (role !== 'admin') return response_obj.errorResponse('Unauthorized');

    const category = await Category.findOne({ name: metadata.category });
    if (!category)
      return response_obj.errorResponse('Invalid category selection');

    await Blog.findOneAndUpdate(
      { _id: blogId },
      {
        title: metadata.title,
        description: metadata.description,
        featuredImage: metadata.featuredImage,
        category: category._id,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    return response_obj.response(null, 'Metadata updated successfully');
  } catch (error: any) {
    console.log(error);
    return response_obj.serverErrorResponse();
  }
};

export const updateContent = async (blogId: string, content: string) => {
  try {
    await dbConnect();
    const user = await currentUser();
    if (!user) return response_obj.errorResponse('Unauthorized');

    const role = user.privateMetadata.role;
    if (role !== 'admin') return response_obj.errorResponse('Unauthorized');

    await Blog.findOneAndUpdate(
      { _id: blogId },
      {
        content,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    return response_obj.response(null, 'Content updated successfully');
  } catch (error: any) {
    console.log(error);
    return response_obj.serverErrorResponse();
  }
};

export const fetchBlogs = async (): Promise<
  IResponse<Partial<IBlog>[] | null>
> => {
  try {
    await dbConnect();

    const blogs = await Blog.find({ isPublished: true })
      .populate('category')
      .sort({ createdAt: -1 })
      .lean();
    return response_obj.response(blogs, 'Blogs fetched successfully');
  } catch (error: any) {
    console.log(error);
    return response_obj.serverErrorResponse();
  }
};

export const fetchTrendingBlogs = async (): Promise<
  IResponse<Partial<IBlog>[] | null>
> => {
  try {
    await dbConnect();

    const blogs = await Blog.find({ isPublished: true })
      .limit(5)
      .sort({ createdAt: -1 })
      .populate('category')
      .lean();
    return response_obj.response(blogs, 'Blogs fetched successfully');
  } catch (error: any) {
    console.log(error);
    return response_obj.serverErrorResponse();
  }
};

export const fetchAllBlogsForDashboard = async (
  keyword?: string
): Promise<IResponse<Partial<IBlog>[] | null>> => {
  try {
    await dbConnect();

    const searchQuery = keyword
      ? { title: { $regex: keyword, $options: 'i' } }
      : {};

    const blogs = await Blog.find(searchQuery)
      .populate('category')
      .sort({ createdAt: -1 })
      .lean();
    return response_obj.response(blogs, 'Blogs fetched successfully');
  } catch (error: any) {
    console.log(error);
    return response_obj.serverErrorResponse();
  }
};

export const fetchAllBlogsForSearch = async (
  keyword: string
): Promise<IResponse<Partial<IBlog>[] | null>> => {
  try {
    await dbConnect();

    const blogs = await Blog.find({
      title: { $regex: keyword, $options: 'i' },
      isPublished: true,
    }).lean();

    return response_obj.response(blogs, 'Blogs fetched successfully');
  } catch (error: any) {
    console.log(error);
    return response_obj.serverErrorResponse();
  }
};

export const publishBlog = async (
  blogId: string,
  status: boolean
): Promise<IResponse<null>> => {
  try {
    await dbConnect();

    const blog = await Blog.findById(blogId);
    blog.isPublished = status;
    await blog.save();

    return response_obj.response(
      null,
      `Blogs ${status ? 'published' : 'unpublished'} successfully`
    );
  } catch (error: any) {
    console.log(error);
    return response_obj.serverErrorResponse();
  }
};
