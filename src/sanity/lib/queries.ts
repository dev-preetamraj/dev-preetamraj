import { defineQuery } from 'next-sanity'

// ─── Category Queries ─────────────────────────────────────────────

export const categoriesQuery = defineQuery(
  `*[_type == "category"] | order(_createdAt desc) { _id, name, slug }`
)

export const categoryBySlugQuery = defineQuery(
  `*[_type == "category" && slug.current == $slug][0] { _id, name, slug }`
)

export const trendingCategoriesQuery = defineQuery(
  `*[_type == "category"] | order(_createdAt desc)[0...10] { _id, name, slug }`
)

// ─── Tag Queries ──────────────────────────────────────────────────

export const tagsQuery = defineQuery(
  `*[_type == "tag"] | order(_createdAt desc) { _id, name, slug }`
)

export const tagBySlugQuery = defineQuery(
  `*[_type == "tag" && slug.current == $slug][0] { _id, name, slug }`
)

// ─── Blog Queries ─────────────────────────────────────────────────

const blogListProjection = `{
  _id,
  title,
  slug,
  description,
  featuredImage,
  _createdAt,
  category->{ _id, name, slug }
}`

export const blogsQuery = defineQuery(
  `*[_type == "blog"] | order(_createdAt desc) ${blogListProjection}`
)

export const trendingBlogsQuery = defineQuery(
  `*[_type == "blog"] | order(_createdAt desc)[0...5] ${blogListProjection}`
)

export const blogBySlugQuery = defineQuery(
  `*[_type == "blog" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    description,
    content,
    featuredImage,
    _createdAt,
    _updatedAt,
    category->{ _id, name, slug },
    tags[]->{ _id, name, slug }
  }`
)

export const blogByIdQuery = defineQuery(
  `*[_type == "blog" && _id == $id][0] {
    _id,
    title,
    slug,
    description,
    content,
    featuredImage,
    _createdAt,
    _updatedAt,
    category->{ _id, name, slug },
    tags[]->{ _id, name, slug }
  }`
)

export const blogSearchQuery = defineQuery(
  `*[_type == "blog" && title match $keyword + "*"] | order(_createdAt desc) {
    _id, title, slug
  }`
)

// ─── Portfolio Queries ────────────────────────────────────────────

const portfolioListProjection = `{
  _id,
  title,
  slug,
  description,
  featuredImage,
  _createdAt,
  category->{ _id, name, slug }
}`

export const portfoliosQuery = defineQuery(
  `*[_type == "portfolio"] | order(_createdAt desc) ${portfolioListProjection}`
)

export const featuredPortfoliosQuery = defineQuery(
  `*[_type == "portfolio"] | order(_createdAt desc)[0...5] ${portfolioListProjection}`
)

export const portfolioBySlugQuery = defineQuery(
  `*[_type == "portfolio" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    description,
    content,
    featuredImage,
    _createdAt,
    _updatedAt,
    githubUrl,
    frontendGithubUrl,
    liveUrl,
    category->{ _id, name, slug },
    tags[]->{ _id, name, slug }
  }`
)

export const portfolioSearchQuery = defineQuery(
  `*[_type == "portfolio" && title match $keyword + "*"] | order(_createdAt desc) {
    _id, title, slug
  }`
)

// ─── Combined Search Query ────────────────────────────────────────

export const combinedSearchQuery = defineQuery(
  `{
    "blogs": *[_type == "blog" && title match $keyword + "*"] | order(_createdAt desc) {
      _id, title, slug
    },
    "projects": *[_type == "portfolio" && title match $keyword + "*"] | order(_createdAt desc) {
      _id, title, slug
    },
    "categories": *[_type == "category" && name match $keyword + "*"] | order(_createdAt desc) {
      _id, name, slug
    },
    "tags": *[_type == "tag" && name match $keyword + "*"] | order(_createdAt desc) {
      _id, name, slug
    }
  }`
)
