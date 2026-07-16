import type { Metadata } from "next";
import { Home, Users, Compass, HeartCrack, Smile, Bot } from "lucide-react";
import { Container } from "@/components/layout/container";
import { PageHero } from "@/components/marketing/page-hero";
import { SectionHeading } from "@/components/marketing/section-heading";
import { FeatureCard } from "@/components/marketing/feature-card";
import { Reveal } from "@/components/marketing/reveal";
import { CtaBanner } from "@/components/marketing/cta-banner";

export const metadata: Metadata = {
  title: "Relationship Intelligence",
  description:
    "What Relationship Intelligence means, why it matters for life's second chapter, and how VelNit Life brings empathetic AI to human connection.",
  alternates: { canonical: "/relationship-intelligence" },
};

const themes = [
  {
    icon: Home,
    title: "Empty Nest",
    description: "Rediscovering identity and connection with a partner once the household quiets.",
  },
  {
    icon: Users,
    title: "Family Connection",
    description: "Keeping generations close across distance, schedules and life stages.",
  },
  {
    icon: Compass,
    title: "Purpose",
    description: "Finding renewed meaning and direction in life's second chapter.",
  },
  {
    icon: HeartCrack,
    title: "Loneliness",
    description: "Addressing one of the most under-discussed risks of aging - quietly, with dignity.",
  },
  {
    icon: Smile,
    title: "Emotional Wellbeing",
    description: "Supporting mental and emotional health alongside physical health.",
  },
  {
    icon: Bot,
    title: "AI Support",
    description: "Empathetic AI that notices, reflects, and gently encourages connection.",
  },
];

export default function RelationshipIntelligencePage() {
  return (
    <>
      <PageHero
        eyebrow="Relationship Intelligence"
        title="What is Relationship Intelligence?"
        description="The practice of noticing, nurturing and actively strengthening the emotional bonds that keep us well as we age - between partners, across generations, and within communities."
      />

      <section className="py-20 sm:py-28">
        <Container className="mx-auto max-w-3xl">
          <Reveal className="prose prose-neutral max-w-none prose-headings:font-heading prose-headings:text-foreground prose-p:text-muted-foreground">
            <h2>Why it matters</h2>
            <p>
              Most platforms built for this stage of life focus on physical
              logistics: medication, appointments, mobility. Necessary, but
              incomplete. Research and lived experience both point to the
              same truth - emotional connection is one of the strongest
              predictors of wellbeing as people age, and it is the thing most
              often left unmanaged.
            </p>
            <p>
              Relationship Intelligence treats connection as something that
              can be understood, measured gently, and nurtured
              intentionally - not left to chance. It is the missing layer
              between &ldquo;care management&rdquo; and a life that still
              feels full of warmth, purpose and belonging.
            </p>
          </Reveal>
        </Container>
      </section>

      <section className="bg-card/50 py-20 sm:py-28">
        <Container>
          <SectionHeading
            eyebrow="Where it shows up"
            title="The moments Relationship Intelligence is built for"
          />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {themes.map((item, index) => (
              <FeatureCard key={item.title} {...item} delay={index * 0.1} />
            ))}
          </div>
        </Container>
      </section>

      <CtaBanner
        title="See Relationship Intelligence in practice"
        description="Explore VelNit Care, VelNit Connect and VelNit Companion - the three pillars built on this framework."
        primaryLabel="Explore VelNit Care"
        primaryHref="/care"
        secondaryLabel="Join Beta"
        secondaryHref="/beta"
      />
    </>
  );
}
