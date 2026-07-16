import type { Metadata } from "next";
import { Mail, MapPin, LifeBuoy } from "lucide-react";
import { Container } from "@/components/layout/container";
import { PageHero } from "@/components/marketing/page-hero";
import { Faq } from "@/components/marketing/faq";
import { ContactForm } from "@/features/contact/contact-form";
import { Reveal } from "@/components/marketing/reveal";
import { siteConfig } from "@/lib/constants/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with the VelNit Life team - support, partnerships, or general questions about our Relationship Intelligence Platform.",
  alternates: { canonical: "/contact" },
};

const faqItems = [
  {
    question: "Is VelNit Life a medical or care-management product?",
    answer:
      "No. VelNit Life is a Relationship Intelligence Platform. VelNit Care includes practical coordination tools, but the platform as a whole is built around emotional connection, not clinical care.",
  },
  {
    question: "Who is VelNit Life for?",
    answer:
      "Couples navigating retirement or an empty nest, families supporting aging parents, caregivers, and the communities and providers who serve them.",
  },
  {
    question: "How do I join the beta?",
    answer:
      "Visit the Join Beta page and complete the short registration form. We're onboarding a small group of families, couples and caregivers first.",
  },
  {
    question: "How is my data handled?",
    answer:
      "VelNit Life is built on Supabase with row-level security, meaning your data is scoped to you by default. We'll publish a full privacy policy ahead of general availability.",
  },
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="We'd love to hear from you"
        description="Questions about VelNit Life, partnerships, or the beta program - reach out and our team will respond within one to two business days."
      />

      <section className="pb-20 sm:pb-28">
        <Container className="grid gap-12 lg:grid-cols-[1.1fr_1.4fr]">
          <Reveal className="space-y-8">
            <div>
              <h2 className="font-heading text-xl font-semibold">Get in touch</h2>
              <div className="mt-4 space-y-4 text-muted-foreground">
                <p className="flex items-start gap-3">
                  <Mail className="mt-0.5 h-5 w-5 text-primary" aria-hidden />
                  <a href={`mailto:${siteConfig.contactEmail}`} className="hover:text-foreground">
                    {siteConfig.contactEmail}
                  </a>
                </p>
                <p className="flex items-start gap-3">
                  <LifeBuoy className="mt-0.5 h-5 w-5 text-primary" aria-hidden />
                  <span>Support responses within 1-2 business days</span>
                </p>
                <p className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-5 w-5 text-primary" aria-hidden />
                  <span>Remote-first team, serving families everywhere</span>
                </p>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.1} className="rounded-2xl border border-border bg-card p-8 shadow-soft">
            <ContactForm />
          </Reveal>
        </Container>
      </section>

      <Faq items={faqItems} />
    </>
  );
}
