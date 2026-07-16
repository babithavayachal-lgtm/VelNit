import { createPublicClient } from "@/lib/supabase/public";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import type { BlogPostWithRelations } from "@/types/database";

/**
 * Blog data access. Every function degrades to an empty result (never
 * throws) when Supabase isn't configured yet, so the site builds and
 * renders cleanly before real credentials/content exist.
 */

async function withRelations(
  rows: Array<
    Record<string, unknown> & {
      authors: unknown;
      categories: unknown;
      blog_posts_tags: Array<{ tags: unknown }>;
    }
  >
): Promise<BlogPostWithRelations[]> {
  return rows.map((row) => {
    const { authors, categories, blog_posts_tags, ...post } = row;
    return {
      ...(post as BlogPostWithRelations),
      author: (authors as BlogPostWithRelations["author"]) ?? null,
      category: (categories as BlogPostWithRelations["category"]) ?? null,
      tags: (blog_posts_tags ?? []).map((t) => t.tags) as BlogPostWithRelations["tags"],
    };
  });
}

const SELECT = `
  *,
  authors ( id, name, avatar_url, bio ),
  categories ( id, name, slug ),
  blog_posts_tags ( tags ( id, name, slug ) )
`;

export async function getPublishedPosts(): Promise<BlogPostWithRelations[]> {
  if (!isSupabaseConfigured) return [];

  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select(SELECT)
    .eq("status", "published")
    .lte("published_at", new Date().toISOString())
    .order("published_at", { ascending: false });

  if (error) {
    console.error("getPublishedPosts failed:", error.message);
    return [];
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return withRelations((data ?? []) as any);
}

export async function getPostBySlug(slug: string): Promise<BlogPostWithRelations | null> {
  if (!isSupabaseConfigured) return null;

  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select(SELECT)
    .eq("slug", slug)
    .eq("status", "published")
    .lte("published_at", new Date().toISOString())
    .maybeSingle();

  if (error || !data) {
    if (error) console.error("getPostBySlug failed:", error.message);
    return null;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [withRels] = await withRelations([data as any]);
  return withRels;
}

export async function getRelatedPosts(
  post: BlogPostWithRelations,
  limit = 3
): Promise<BlogPostWithRelations[]> {
  if (!isSupabaseConfigured || !post.category_id) return [];

  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select(SELECT)
    .eq("status", "published")
    .eq("category_id", post.category_id)
    .neq("id", post.id)
    .lte("published_at", new Date().toISOString())
    .order("published_at", { ascending: false })
    .limit(limit);

  if (error) return [];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return withRelations((data ?? []) as any);
}

export async function getAllCategories() {
  if (!isSupabaseConfigured) return [];
  const supabase = createPublicClient();
  const { data } = await supabase.from("categories").select("*").order("name");
  return data ?? [];
}

export async function getAllTags() {
  if (!isSupabaseConfigured) return [];
  const supabase = createPublicClient();
  const { data } = await supabase.from("tags").select("*").order("name");
  return data ?? [];
}
