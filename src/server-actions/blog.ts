'use server';

import db from '@/db';
import { blogCommentSchema, blogSchema, categorySchema } from '@/db/schema';
import { IResponse } from '@/lib/types';
import { CustomResponse } from '@/lib/utils';
import { currentUser } from '@clerk/nextjs/server';
import { eq } from 'drizzle-orm';
import slugify from 'slugify';

const response = new CustomResponse();

export const getBlogById = async (
  blogId: string
): Promise<IResponse<typeof blogSchema.$inferSelect | null>> => {
  try {
    const blog = await db
      .select()
      .from(blogSchema)
      .where(eq(blogSchema.id, blogId));

    return response.success(blog[0], 'Blog fetched successfully');
  } catch (error: any) {
    console.log(error);
    return response.internalServerError();
  }
};

export const deleteBlogById = async (
  blogId: string
): Promise<IResponse<null>> => {
  try {
    await db.delete(blogSchema).where(eq(blogSchema.id, blogId));

    return response.success(null, 'Blog deleted successfully');
  } catch (error: any) {
    console.log(error);
    return response.internalServerError();
  }
};

export const getBlogBySlug = async (
  slug: string
): Promise<IResponse<typeof blogSchema.$inferSelect | null>> => {
  try {
    const blog = await db
      .select()
      .from(blogSchema)
      .where(eq(blogSchema.slug, slug))
      .leftJoin(categorySchema, eq(blogSchema.categoryId, categorySchema.id))
      .leftJoin(blogCommentSchema, eq(blogSchema.id, blogCommentSchema.blogId));

    return response.success(blog, 'Blog fetched successfully');
  } catch (error: any) {
    console.log(error);
    return response.internalServerError();
  }
};

export const createBlog = async (
  title: string,
  description: string,
  featuredImage?: string
): Promise<IResponse<typeof blogSchema.$inferInsert | null>> => {
  try {
    const user = await currentUser();
    if (!user) return response.error('Unauthorized');

    const role = user.privateMetadata.role;
    if (role !== 'admin') return response.error('Unauthorized');

    const existingTitle = await db
      .select()
      .from(blogSchema)
      .where(eq(blogSchema.title, title));
    if (existingTitle.length)
      return response.error('Duplicate titles are not allowed');

    const category = await db
      .select()
      .from(categorySchema)
      .where(eq(categorySchema.name, 'uncategorized'));

    const res = await db
      .insert(blogSchema)
      .values({
        title,
        slug: slugify(title, { lower: true, strict: true }),
        description,
        featuredImage: featuredImage
          ? featuredImage
          : 'https://images.unsplash.com/photo-1549558549-415fe4c37b60',
        categoryId: category[0].id,
        content: 'Write here...',
      })
      .returning();

    return response.success(
      res[0],
      'Blog created successfully. Redirecting...'
    );
  } catch (error: any) {
    console.log(error);
    return response.internalServerError();
  }
};

// export const updateMetadata = async (blogId: string, metadata: any) => {
//   try {
//     await dbConnect();
//     const user = await currentUser();
//     if (!user) return response.errorResponse('Unauthorized');

//     const role = user.privateMetadata.role;
//     if (role !== 'admin') return response.errorResponse('Unauthorized');

//     const category = await Category.findOne({ name: metadata.category });
//     if (!category) return response.errorResponse('Invalid category selection');

//     await Blog.findOneAndUpdate(
//       { _id: blogId },
//       {
//         title: metadata.title,
//         description: metadata.description,
//         featuredImage: metadata.featuredImage,
//         category: category._id,
//       },
//       {
//         new: true,
//         runValidators: true,
//       }
//     );

//     return response.response(null, 'Metadata updated successfully');
//   } catch (error: any) {
//     console.log(error);
//     return response.serverErrorResponse();
//   }
// };

// export const updateContent = async (blogId: string, content: string) => {
//   try {
//     await dbConnect();
//     const user = await currentUser();
//     if (!user) return response.errorResponse('Unauthorized');

//     const role = user.privateMetadata.role;
//     if (role !== 'admin') return response.errorResponse('Unauthorized');

//     await Blog.findOneAndUpdate(
//       { _id: blogId },
//       {
//         content,
//       },
//       {
//         new: true,
//         runValidators: true,
//       }
//     );

//     return response.response(null, 'Content updated successfully');
//   } catch (error: any) {
//     console.log(error);
//     return response.serverErrorResponse();
//   }
// };

// export const fetchBlogs = async (): Promise<
//   IResponse<Partial<IBlog>[] | null>
// > => {
//   try {
//     await dbConnect();

//     const blogs = await Blog.find({ isPublished: true })
//       .populate('category')
//       .sort({ createdAt: -1 })
//       .lean();
//     return response.response(blogs, 'Blogs fetched successfully');
//   } catch (error: any) {
//     console.log(error);
//     return response.serverErrorResponse();
//   }
// };

// export const fetchTrendingBlogs = async (): Promise<
//   IResponse<Partial<IBlog>[] | null>
// > => {
//   try {
//     await dbConnect();

//     const blogs = await Blog.find({ isPublished: true })
//       .limit(5)
//       .sort({ createdAt: -1 })
//       .populate('category')
//       .lean();
//     return response.response(blogs, 'Blogs fetched successfully');
//   } catch (error: any) {
//     console.log(error);
//     return response.serverErrorResponse();
//   }
// };

// export const fetchAllBlogsForDashboard = async (
//   keyword?: string
// ): Promise<IResponse<Partial<IBlog>[] | null>> => {
//   try {
//     await dbConnect();

//     const searchQuery = keyword
//       ? { title: { $regex: keyword, $options: 'i' } }
//       : {};

//     const blogs = await Blog.find(searchQuery)
//       .populate('category')
//       .sort({ createdAt: -1 })
//       .lean();
//     return response.response(blogs, 'Blogs fetched successfully');
//   } catch (error: any) {
//     console.log(error);
//     return response.serverErrorResponse();
//   }
// };

// export const fetchAllBlogsForSearch = async (
//   keyword: string
// ): Promise<IResponse<Partial<IBlog>[] | null>> => {
//   try {
//     await dbConnect();

//     const blogs = await Blog.find({
//       title: { $regex: keyword, $options: 'i' },
//       isPublished: true,
//     }).lean();

//     return response.response(blogs, 'Blogs fetched successfully');
//   } catch (error: any) {
//     console.log(error);
//     return response.serverErrorResponse();
//   }
// };

// export const publishBlog = async (
//   blogId: string,
//   status: boolean
// ): Promise<IResponse<null>> => {
//   try {
//     await dbConnect();

//     const blog = await Blog.findById(blogId);
//     blog.isPublished = status;
//     await blog.save();

//     return response.response(
//       null,
//       `Blogs ${status ? 'published' : 'unpublished'} successfully`
//     );
//   } catch (error: any) {
//     console.log(error);
//     return response.serverErrorResponse();
//   }
// };
