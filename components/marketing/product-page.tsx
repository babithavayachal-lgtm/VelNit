import type { LucideIcon } from "lucide-react";
import { Container } from "@/components/layout/container";
import { PageHero } from "@/components/marketing/page-hero";
import { SectionHeading } from "@/components/marketing/section-heading";
import { FeatureCard } from "@/components/marketing/feature-card";
import { CtaBanner } from "@/components/marketing/cta-banner";

export type ProductFeature = {
  icon: LucideIcon;
  title: string;
  description: string;
};

export function ProductPage({
  eyebrow,
  title,
  description,
  featuresEyebrow = "Features",
  featuresTitle,
  features,
  ctaTitle,
  ctaDescription,
}: {
  eyebrow: string;
  title: string;
  description: string;
  featuresEyebrow?: string;
  featuresTitle: string;
  features: ProductFeature[];
  ctaTitle?: string;
  ctaDescription?: string;
}) {
  return (
    <>
      <PageHero eyebrow={eyebrow} title={title} description={description} />

      <section className="py-20 sm:py-28">
        <Container>
          <SectionHeading eyebrow={featuresEyebrow} title={featuresTitle} />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <FeatureCard key={feature.title} {...feature} delay={index * 0.08} />
            ))}
          </div>
        </Container>
      </section>

      <CtaBanner title={ctaTitle} description={ctaDescription} />
    </>
  );
}
