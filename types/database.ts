/**
 * Hand-authored types mirroring the Supabase schema defined in
 * supabase/migrations/0001_init.sql and 0002_content_os.sql. Regenerate
 * with the Supabase CLI (`supabase gen types typescript`) once the project
 * is linked, and this file can be replaced automatically without touching
 * call sites, since consumers import the `Database` type, not individual
 * table shapes.
 */
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

/** Mirrors the `content_status` Postgres enum from 0002_content_os.sql. */
export type ContentStatus =
  | "idea"
  | "brief_ready"
  | "generating"
  | "draft"
  | "needs_revision"
  | "approved"
  | "scheduled"
  | "published"
  | "archived";

export type ContentType = "article" | "facebook" | "newsletter" | "reel";

export type ReviewDecision = "approved" | "needs_revision";

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

      // ------------------------------------------------------------
      // Phase B - Content Operating System (0002_content_os.sql)
      // ------------------------------------------------------------

      founders: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["founders"]["Insert"]>;
        Relationships: [];
      };

      knowledge_references: {
        Row: {
          id: string;
          created_at: string;
          source_document: string;
          section: string | null;
          concept: string;
          summary: string;
          url: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          source_document: string;
          section?: string | null;
          concept: string;
          summary: string;
          url?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["knowledge_references"]["Insert"]>;
        Relationships: [];
      };

      content_ideas: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          created_by: string | null;
          topic: string;
          audience: string;
          notes: string | null;
          status: ContentStatus;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          created_by?: string | null;
          topic: string;
          audience: string;
          notes?: string | null;
          status?: ContentStatus;
        };
        Update: Partial<Database["public"]["Tables"]["content_ideas"]["Insert"]>;
        Relationships: [];
      };

      content_briefs: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          idea_id: string;
          created_by: string | null;
          topic: string;
          audience: string;
          primary_emotion: string;
          desired_outcome: string;
          talk_stage: string;
          vrif_pillars: string[];
          practical_action: string;
          call_to_action: string;
          knowledge_reference_ids: string[];
          prohibited_claims: string | null;
          status: ContentStatus;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          idea_id: string;
          created_by?: string | null;
          topic: string;
          audience: string;
          primary_emotion: string;
          desired_outcome: string;
          talk_stage: string;
          vrif_pillars?: string[];
          practical_action: string;
          call_to_action: string;
          knowledge_reference_ids?: string[];
          prohibited_claims?: string | null;
          status?: ContentStatus;
        };
        Update: Partial<Database["public"]["Tables"]["content_briefs"]["Insert"]>;
        Relationships: [];
      };

      content_items: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          brief_id: string;
          created_by: string | null;
          content_type: ContentType;
          title: string;
          body: string;
          version: number;
          status: ContentStatus;
          talk_stage: string | null;
          vrif_pillars: string[];
          knowledge_reference_ids: string[];
          prompt_version: string | null;
          review_score: number | null;
          review_notes: string | null;
          generation_error: string | null;
          approved_at: string | null;
          published_at: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          brief_id: string;
          created_by?: string | null;
          content_type: ContentType;
          title: string;
          body: string;
          version?: number;
          status?: ContentStatus;
          talk_stage?: string | null;
          vrif_pillars?: string[];
          knowledge_reference_ids?: string[];
          prompt_version?: string | null;
          review_score?: number | null;
          review_notes?: string | null;
          generation_error?: string | null;
          approved_at?: string | null;
          published_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["content_items"]["Insert"]>;
        Relationships: [];
      };

      content_reviews: {
        Row: {
          id: string;
          created_at: string;
          content_item_id: string;
          reviewer_id: string | null;
          decision: ReviewDecision;
          score: number | null;
          notes: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          content_item_id: string;
          reviewer_id?: string | null;
          decision: ReviewDecision;
          score?: number | null;
          notes?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["content_reviews"]["Insert"]>;
        Relationships: [];
      };

      publication_jobs: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          content_item_id: string;
          channel: string;
          status: ContentStatus;
          scheduled_at: string | null;
          published_at: string | null;
          notes: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          content_item_id: string;
          channel: string;
          status?: ContentStatus;
          scheduled_at?: string | null;
          published_at?: string | null;
          notes?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["publication_jobs"]["Insert"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      content_status: ContentStatus;
    };
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

export type Founder = Database["public"]["Tables"]["founders"]["Row"];
export type KnowledgeReference = Database["public"]["Tables"]["knowledge_references"]["Row"];
export type ContentIdea = Database["public"]["Tables"]["content_ideas"]["Row"];
export type ContentBrief = Database["public"]["Tables"]["content_briefs"]["Row"];
export type ContentItem = Database["public"]["Tables"]["content_items"]["Row"];
export type ContentReview = Database["public"]["Tables"]["content_reviews"]["Row"];
export type PublicationJob = Database["public"]["Tables"]["publication_jobs"]["Row"];
