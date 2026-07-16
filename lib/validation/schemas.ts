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
