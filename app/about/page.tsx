import type { Metadata } from "next";
import { HeartHandshake, Ear, MessageCircleHeart, Sparkle, Compass, Target } from "lucide-react";
import { Container } from "@/components/layout/container";
import { PageHero } from "@/components/marketing/page-hero";
import { SectionHeading } from "@/components/marketing/section-heading";
import { FeatureCard } from "@/components/marketing/feature-card";
import { Reveal } from "@/components/marketing/reveal";
import { CtaBanner } from "@/components/marketing/cta-banner";

export const metadata: Metadata = {
  title: "About VelNit Life",
  description:
    "Our story, the TALK Model, and why VelNit Life was built as a Relationship Intelligence Platform - not another elder care app.",
  alternates: { canonical: "/about" },
};

const talkModel = [
  { letter: "T", title: "Together time", description: "Protected, undistracted time together - even ten minutes changes everything.", icon: HeartHandshake },
  { letter: "A", title: "Acknowledgment", description: "Being seen and named matters more than being fixed.", icon: Sparkle },
  { letter: "L", title: "Listening", description: "Listening to understand, not simply to reply.", icon: Ear },
  { letter: "K", title: "Kindness in small moments", description: "Small gestures compound into a felt sense of safety and belonging.", icon: MessageCircleHeart },
];

const values = [
  { icon: Compass, title: "Hope over illness", description: "We design for what's possible, not what's declining." },
  { icon: Target, title: "Technology serving humanity", description: "AI with empathy - always in service of connection, never a replacement for it." },
  { icon: HeartHandshake, title: "Dignity by default", description: "Every interaction is built to preserve agency, privacy and respect." },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="Our Story"
        title="From Silence to Connection"
        description="VelNit Life began with a simple observation: the tools built for life's second chapter manage decline. None of them nurture connection. We set out to build the one that does."
      />

      <section className="py-20 sm:py-28">
        <Container className="mx-auto max-w-3xl">
          <Reveal className="prose prose-neutral max-w-none prose-headings:font-heading prose-headings:text-foreground prose-p:text-muted-foreground">
            <h2>The Founder Story</h2>
            <p>
              VelNit Life was born from a family experience that will feel
              familiar to many: watching parents grow older while the
              conversations grew shorter, and watching a marriage of decades
              quietly drift into routine after the children left home. The
              tools available focused entirely on logistics - medication
              schedules, appointments, emergency contacts - and said nothing
              about the relationship underneath it all.
            </p>
            <p>
              We asked a different question: what if technology&apos;s job
              wasn&apos;t just to manage care, but to actively nurture
              connection? What if an AI companion could notice when
              someone&apos;s been quiet, gently encourage a phone call, or
              help a couple find their way back to each other after
              retirement changed everything about their days?
            </p>
            <p>
              That question became VelNit Life - a Relationship Intelligence
              Platform for couples, families, caregivers and communities
              navigating life&apos;s second chapter.
            </p>
          </Reveal>
        </Container>
      </section>

      <section className="bg-card/50 py-20 sm:py-28">
        <Container>
          <SectionHeading
            eyebrow="Our Framework"
            title="The TALK Model"
            description="A simple, repeatable framework for staying emotionally close, on purpose."
          />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {talkModel.map((item, index) => (
              <FeatureCard
                key={item.letter}
                icon={item.icon}
                title={`${item.letter} — ${item.title}`}
                description={item.description}
                delay={index * 0.1}
              />
            ))}
          </div>
        </Container>
      </section>

      <section className="py-20 sm:py-28">
        <Container className="grid gap-12 lg:grid-cols-2">
          <Reveal>
            <p className="text-sm font-semibold uppercase tracking-wide text-secondary">Vision</p>
            <h2 className="mt-3 font-heading text-3xl font-semibold">
              A world where the second chapter of life is defined by connection, not distance.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-sm font-semibold uppercase tracking-wide text-cta">Mission</p>
            <h2 className="mt-3 font-heading text-3xl font-semibold">
              Helping people age with connection, dignity and purpose.
            </h2>
          </Reveal>
        </Container>
      </section>

      <section className="bg-card/50 py-20 sm:py-28">
        <Container>
          <SectionHeading eyebrow="Our Values" title="What guides how we build" />
          <div className="mt-14 grid gap-6 sm:grid-cols-3">
            {values.map((item, index) => (
              <FeatureCard key={item.title} {...item} delay={index * 0.1} />
            ))}
          </div>
        </Container>
      </section>

      <CtaBanner />
    </>
  );
}
