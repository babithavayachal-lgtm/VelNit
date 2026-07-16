import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { PageHero } from "@/components/marketing/page-hero";
import { siteConfig } from "@/lib/constants/site";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms governing use of the VelNit Life website and beta program.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Terms of Service" />
      <section className="pb-24">
        <Container className="prose prose-neutral mx-auto max-w-3xl prose-headings:font-heading prose-headings:text-foreground prose-p:text-muted-foreground">
          <p>
            This is a placeholder Terms of Service for the VelNit Life Phase
            1 marketing site and beta program. Complete terms covering the
            VelNit Life SaaS product, AI companion, and subscription billing
            will be published ahead of general availability.
          </p>
          <h2>Beta program</h2>
          <p>
            Participation in the VelNit Life beta is voluntary and provided
            &ldquo;as is&rdquo; without warranty while the product is under
            active development.
          </p>
          <h2>Contact</h2>
          <p>
            Questions about these terms can be sent to{" "}
            <a href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</a>.
          </p>
        </Container>
      </section>
    </>
  );
}
