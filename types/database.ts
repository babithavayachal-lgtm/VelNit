/**
 * Hand-authored types mirroring the Supabase schema defined in
 * supabase/migrations/0001_init.sql. Regenerate with the Supabase CLI
 * (`supabase gen types typescript`) once the project is linked, and this
 * file can be replaced automatically without touching call sites, since
 * consumers import the `Database` type, not individual table shapes.
 */
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      beta_signups: {
        Row: {
          id: string;
          created_at: string;
          full_name: string;
          email: string;
          role: string | null;
          reason: string | null;
          source: string | null;
          status: "pending" | "invited" | "active";
        };
        Insert: {
          id?: string;
          created_at?: string;
          full_name: string;
          email: string;
          role?: string | null;
          reason?: string | null;
          source?: string | null;
          status?: "pending" | "invited" | "active";
        };
        Update: Partial<Database["public"]["Tables"]["beta_signups"]["Insert"]>;
        Relationships: [];
      };
      newsletter_subscribers: {
        Row: {
          id: string;
          created_at: string;
          email: string;
          status: "subscribed" | "unsubscribed";
          source: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          email: string;
          status?: "subscribed" | "unsubscribed";
          source?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["newsletter_subscribers"]["Insert"]>;
        Relationships: [];
      };
      contact_messages: {
        Row: {
          id: string;
          created_at: string;
          name: string;
          email: string;
          subject: string | null;
          message: string;
          status: "new" | "read" | "archived";
        };
        Insert: {
          id?: string;
          created_at?: string;
          name: string;
          email: string;
          subject?: string | null;
          message: string;
          status?: "new" | "read" | "archived";
        };
        Update: Partial<Database["public"]["Tables"]["contact_messages"]["Insert"]>;
        Relationships: [];
      };
      authors: {
        Row: { id: string; name: string; avatar_url: string | null; bio: string | null };
        Insert: { id?: string; name: string; avatar_url?: string | null; bio?: string | null };
        Update: Partial<Database["public"]["Tables"]["authors"]["Insert"]>;
        Relationships: [];
      };
      categories: {
        Row: { id: string; name: string; slug: string };
        Insert: { id?: string; name: string; slug: string };
        Update: Partial<Database["public"]["Tables"]["categories"]["Insert"]>;
        Relationships: [];
      };
      tags: {
        Row: { id: string; name: string; slug: string };
        Insert: { id?: string; name: string; slug: string };
        Update: Partial<Database["public"]["Tables"]["tags"]["Insert"]>;
        Relationships: [];
      };
      blog_posts: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          title: string;
          slug: string;
          excerpt: string | null;
          content: string;
          featured_image: string | null;
          author_id: string | null;
          category_id: string | null;
          seo_title: string | null;
          seo_description: string | null;
          status: "draft" | "published" | "scheduled";
          published_at: string | null;
          scheduled_at: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          title: string;
          slug: string;
          excerpt?: string | null;
          content: string;
          featured_image?: string | null;
          author_id?: string | null;
          category_id?: string | null;
          seo_title?: string | null;
          seo_description?: string | null;
          status?: "draft" | "published" | "scheduled";
          published_at?: string | null;
          scheduled_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["blog_posts"]["Insert"]>;
        Relationships: [];
      };
      blog_posts_tags: {
        Row: { post_id: string; tag_id: string };
        Insert: { post_id: string; tag_id: string };
        Update: Partial<Database["public"]["Tables"]["blog_posts_tags"]["Insert"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}

export type BetaSignup = Database["public"]["Tables"]["beta_signups"]["Row"];
export type NewsletterSubscriber =
  Database["public"]["Tables"]["newsletter_subscribers"]["Row"];
export type ContactMessage = Database["public"]["Tables"]["contact_messages"]["Row"];
export type Author = Database["public"]["Tables"]["authors"]["Row"];
export type Category = Database["public"]["Tables"]["categories"]["Row"];
export type Tag = Database["public"]["Tables"]["tags"]["Row"];
export type BlogPost = Database["public"]["Tables"]["blog_posts"]["Row"];

export type BlogPostWithRelations = BlogPost & {
  author: Author | null;
  category: Category | null;
  tags: Tag[];
};
