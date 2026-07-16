import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { PageHero } from "@/components/marketing/page-hero";
import { siteConfig } from "@/lib/constants/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How VelNit Life collects, uses and protects your information.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Privacy Policy" />
      <section className="pb-24">
        <Container className="prose prose-neutral mx-auto max-w-3xl prose-headings:font-heading prose-headings:text-foreground prose-p:text-muted-foreground">
          <p>
            This is a placeholder Privacy Policy for the VelNit Life Phase 1
            marketing site. A complete policy - covering Supabase data
            storage, authentication, and third-party processors like Resend
            - will be published ahead of general availability.
          </p>
          <h2>What we collect today</h2>
          <p>
            On this site, we collect the information you voluntarily submit
            through the beta registration, newsletter and contact forms:
            name, email address, and any message content you provide. This
            data is stored in Supabase (PostgreSQL) with row-level security
            enabled.
          </p>
          <h2>Contact</h2>
          <p>
            Questions about this policy can be sent to{" "}
            <a href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</a>.
          </p>
        </Container>
      </section>
    </>
  );
}
