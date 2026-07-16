import { z } from "zod";

export const betaSignupSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Please enter your full name.")
    .max(100),
  email: z.string().trim().email("Please enter a valid email address."),
  role: z.enum(["Adult child", "Couple", "Caregiver", "Community or provider", "Other"], {
    errorMap: () => ({ message: "Please tell us which best describes you." }),
  }),
  reason: z.string().trim().max(500).optional().or(z.literal("")),
  // Honeypot field - must stay empty. Bots tend to fill every field.
  company: z.string().max(0).optional().or(z.literal("")),
});

export type BetaSignupInput = z.infer<typeof betaSignupSchema>;

export const newsletterSchema = z.object({
  email: z.string().trim().email("Please enter a valid email address."),
  company: z.string().max(0).optional().or(z.literal("")),
});

export type NewsletterInput = z.infer<typeof newsletterSchema>;

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(100),
  email: z.string().trim().email("Please enter a valid email address."),
  subject: z.string().trim().max(150).optional().or(z.literal("")),
  message: z
    .string()
    .trim()
    .min(10, "Tell us a little more so we can help (min. 10 characters).")
    .max(2000),
  company: z.string().max(0).optional().or(z.literal("")),
});

export type ContactInput = z.infer<typeof contactSchema>;

// ------------------------------------------------------------
// Studio (Phase B - Content Operating System) schemas
// ------------------------------------------------------------

export const loginSchema = z.object({
  email: z.string().trim().email("Please enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const contentIdeaSchema = z.object({
  topic: z.string().trim().min(3, "Give the idea a topic.").max(200),
  audience: z.string().trim().min(3, "Describe who this is for.").max(300),
  notes: z.string().trim().max(2000).optional().or(z.literal("")),
});

export type ContentIdeaInput = z.infer<typeof contentIdeaSchema>;

export const contentBriefSchema = z.object({
  ideaId: z.string().uuid(),
  topic: z.string().trim().min(3).max(200),
  audience: z.string().trim().min(3).max(300),
  primaryEmotion: z.string().trim().min(2, "Name the primary emotion.").max(200),
  desiredOutcome: z.string().trim().min(3, "Describe the desired outcome.").max(500),
  talkStage: z.string().trim().min(2, "Name the TALK stage.").max(200),
  vrifPillars: z
    .array(z.string().trim().min(1))
    .min(1, "Select at least one VRIF pillar."),
  practicalAction: z.string().trim().min(3, "Describe the practical action.").max(300),
  callToAction: z.string().trim().min(3, "Describe the call to action.").max(300),
  knowledgeReferenceIds: z.array(z.string().uuid()).default([]),
  prohibitedClaims: z.string().trim().max(1000).optional().or(z.literal("")),
});

export type ContentBriefInput = z.infer<typeof contentBriefSchema>;

export const contentReviewSchema = z.object({
  contentItemId: z.string().uuid(),
  decision: z.enum(["approved", "needs_revision"]),
  score: z.coerce.number().min(1).max(10).optional(),
  notes: z.string().trim().max(2000).optional().or(z.literal("")),
});

export type ContentReviewInput = z.infer<typeof contentReviewSchema>;

export const contentItemEditSchema = z.object({
  contentItemId: z.string().uuid(),
  title: z.string().trim().min(3, "Title is required.").max(300),
  body: z.string().trim().min(10, "Body is required."),
});

export type ContentItemEditInput = z.infer<typeof contentItemEditSchema>;
