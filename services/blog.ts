import "server-only";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import type { BlogPostWithRelations, Category, Tag } from "@/types/database";

const BLOG_DIRECTORY = path.join(process.cwd(), "content", "blog");

type BlogFrontmatter = {
  title: string;
  excerpt?: string;
  featuredImage?: string;
  author?: string;
  category?: string;
  tags?: string[];
  seoTitle?: string;
  seoDescription?: string;
  publishedAt: string;
  updatedAt?: string;
  draft?: boolean;
};

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function categoryFrom(name?: string): Category | null {
  if (!name) return null;
  const slug = slugify(name);
  return { id: slug, name, slug };
}

function tagsFrom(names: string[] = []): Tag[] {
  return names.map((name) => {
    const slug = slugify(name);
    return { id: slug, name, slug };
  });
}

async function readPost(filename: string): Promise<BlogPostWithRelations> {
  const slug = filename.replace(/\.mdx?$/, "");
  const source = await readFile(path.join(BLOG_DIRECTORY, filename), "utf8");
  const { data, content } = matter(source);
  const meta = data as BlogFrontmatter;

  if (!meta.title || !meta.publishedAt) {
    throw new Error(`Blog post ${filename} is missing title or publishedAt frontmatter.`);
  }

  const publishedAt = new Date(meta.publishedAt).toISOString();
  const updatedAt = new Date(meta.updatedAt ?? meta.publishedAt).toISOString();

  return {
    id: slug,
    created_at: publishedAt,
    updated_at: updatedAt,
    title: meta.title,
    slug,
    excerpt: meta.excerpt ?? null,
    content: content.trim(),
    featured_image: meta.featuredImage ?? null,
    author_id: null,
    category_id: meta.category ? slugify(meta.category) : null,
    seo_title: meta.seoTitle ?? null,
    seo_description: meta.seoDescription ?? null,
    status: meta.draft ? "draft" : "published",
    published_at: publishedAt,
    scheduled_at: null,
    author: meta.author
      ? { id: slugify(meta.author), name: meta.author, avatar_url: null, bio: null }
      : null,
    category: categoryFrom(meta.category),
    tags: tagsFrom(meta.tags),
  };
}

export async function getPublishedPosts(): Promise<BlogPostWithRelations[]> {
  let filenames: string[];
  try {
    filenames = (await readdir(BLOG_DIRECTORY)).filter((name) => /\.mdx?$/.test(name));
  } catch (error) {
    console.error("Could not read Git-backed blog content:", error);
    return [];
  }

  const now = Date.now();
  const posts = await Promise.all(filenames.map(readPost));
  return posts
    .filter((post) => post.status === "published" && new Date(post.published_at!).getTime() <= now)
    .sort((a, b) => new Date(b.published_at!).getTime() - new Date(a.published_at!).getTime());
}

export async function getPostBySlug(slug: string): Promise<BlogPostWithRelations | null> {
  return (await getPublishedPosts()).find((post) => post.slug === slug) ?? null;
}

export async function getRelatedPosts(post: BlogPostWithRelations, limit = 3) {
  return (await getPublishedPosts())
    .filter((candidate) => candidate.id !== post.id && candidate.category_id === post.category_id)
    .slice(0, limit);
}

export async function getAllCategories(): Promise<Category[]> {
  const posts = await getPublishedPosts();
  return Array.from(
    new Map(posts.flatMap((post) => post.category ? [[post.category.slug, post.category] as const] : [])).values()
  ).sort((a, b) => a.name.localeCompare(b.name));
}

export async function getAllTags(): Promise<Tag[]> {
  const posts = await getPublishedPosts();
  return Array.from(
    new Map(posts.flatMap((post) => post.tags.map((tag) => [tag.slug, tag] as const))).values()
  ).sort((a, b) => a.name.localeCompare(b.name));
}
