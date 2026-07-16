import type { Metadata } from "next";
import Link from "next/link";
import {
  Heart,
  Users,
  ShieldCheck,
  CalendarCheck,
  MessageCircle,
  Sparkles,
  Compass,
  Sun,
  Mic,
  Brain,
  Quote,
  HandHeart,
} from "lucide-react";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SectionHeading } from "@/components/marketing/section-heading";
import { FeatureCard } from "@/components/marketing/feature-card";
import { CtaBanner } from "@/components/marketing/cta-banner";
import { Reveal } from "@/components/marketing/reveal";
import { Hero } from "@/components/marketing/home/hero";
import { BetaForm } from "@/features/beta/beta-form";
import { NewsletterForm } from "@/features/newsletter/newsletter-form";
import { siteConfig } from "@/lib/constants/site";

export const metadata: Metadata = {
  title: `${siteConfig.name} | ${siteConfig.tagline}`,
  description: siteConfig.description,
  alternates: { canonical: "/" },
};

const howItWorks = [
  {
    step: "01",
    title: "Notice",
    description:
      "VelNit Life gently surfaces what matters - check-ins, milestones, and moments worth pausing for.",
  },
  {
    step: "02",
    title: "Nurture",
    description:
      "The TALK Model turns noticing into practice: small, consistent acts of connection.",
  },
  {
    step: "03",
    title: "Grow",
    description:
      "Relationship Intelligence compounds - couples, families and caregivers grow closer, together.",
  },
];

const whoItHelps = [
  {
    icon: Heart,
    title: "Couples",
    description: "Rekindle everyday connection through shared rituals and reflection.",
  },
  {
    icon: Users,
    title: "Families",
    description: "Stay close across distance with a shared, living picture of wellbeing.",
  },
  {
    icon: HandHeart,
    title: "Caregivers",
    description: "Coordinate care without losing the relationship underneath it.",
  },
  {
    icon: Compass,
    title: "Communities & Providers",
    description: "Support the people you serve with tools built for connection, not just tasks.",
  },
];

const testimonials = [
  {
    quote:
      "This isn't another care app. For the first time, my parents and I have a shared language for how we're really doing.",
    name: "Early Beta Family",
    role: "Adult child & caregiver",
  },
  {
    quote:
      "The TALK Model gave my husband and I a simple way to reconnect after retirement changed everything about our days.",
    name: "Early Beta Couple",
    role: "Married 34 years",
  },
  {
    quote:
      "VelNit Companion feels less like software and more like a gentle daily nudge toward the people I love.",
    name: "Early Beta User",
    role: "Community member",
  },
];

export default function HomePage() {
  return (
    <>
      <Hero />

      {/* Mission */}
      <section className="py-20 sm:py-28">
        <Container>
          <SectionHeading
            eyebrow="Our Mission"
            title="Helping people age with connection, dignity and purpose."
            description="VelNit Life is an AI-powered Relationship Intelligence Platform - not an elder care management system. We believe the second half of life deserves the same investment in connection as the first."
          />
        </Container>
      </section>

      {/* Problem / Solution */}
      <section className="bg-card/50 py-20 sm:py-28">
        <Container className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <p className="text-sm font-semibold uppercase tracking-wide text-secondary">
              The Problem
            </p>
            <h2 className="mt-3 text-balance font-heading text-3xl font-semibold sm:text-4xl">
              Life&apos;s second chapter often arrives in silence.
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Retirement, an empty nest, health changes, distance between
              generations - the risk isn&apos;t illness. It&apos;s
              disconnection. Most tools built for this stage of life focus on
              managing decline, not nurturing what&apos;s still possible.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-sm font-semibold uppercase tracking-wide text-cta">
              Our Solution
            </p>
            <h2 className="mt-3 text-balance font-heading text-3xl font-semibold sm:text-4xl">
              Relationship Intelligence, powered by empathetic AI.
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              VelNit Life pairs the TALK Model with AI that notices, reflects
              and gently encourages - so couples, families and caregivers stay
              close on purpose, not by accident.
            </p>
          </Reveal>
        </Container>
      </section>

      {/* Features */}
      <section className="py-20 sm:py-28">
        <Container>
          <SectionHeading
            eyebrow="Features"
            title="One platform, three ways to stay connected"
            description="VelNit Care, VelNit Connect and VelNit Companion work together as a single Relationship Intelligence layer around your family."
          />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={ShieldCheck}
              title="VelNit Care"
              description="Medication, appointments, health records and caregiver dashboards - coordinated with dignity."
            />
            <FeatureCard
              icon={Heart}
              title="VelNit Connect"
              description="Conversation starters, a relationship journal, shared goals and anniversary reminders for couples."
              delay={0.1}
            />
            <FeatureCard
              icon={Sparkles}
              title="VelNit Companion"
              description="An AI companion for daily reflection, gratitude journaling and gentle conversation coaching."
              delay={0.2}
            />
            <FeatureCard
              icon={CalendarCheck}
              title="Daily Check-ins"
              description="Lightweight emotional and wellbeing check-ins that respect people's time and privacy."
              delay={0.3}
            />
            <FeatureCard
              icon={MessageCircle}
              title="Memory Timeline"
              description="A shared, living archive of the moments that matter across a family or relationship."
              delay={0.4}
            />
            <FeatureCard
              icon={Brain}
              title="Relationship Insights"
              description="Gentle, private insights that help people notice patterns and nurture what's working."
              delay={0.5}
            />
          </div>
        </Container>
      </section>

      {/* How it Works */}
      <section className="bg-card/50 py-20 sm:py-28">
        <Container>
          <SectionHeading eyebrow="How It Works" title="Notice. Nurture. Grow." />
          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {howItWorks.map((item, index) => (
              <Reveal key={item.step} delay={index * 0.1}>
                <div className="relative rounded-2xl border border-border bg-background p-8">
                  <span className="font-heading text-4xl font-semibold text-secondary/70">
                    {item.step}
                  </span>
                  <h3 className="mt-4 font-heading text-xl font-semibold">{item.title}</h3>
                  <p className="mt-2 text-muted-foreground">{item.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Who It Helps */}
      <section className="py-20 sm:py-28">
        <Container>
          <SectionHeading eyebrow="Who It Helps" title="Built for every relationship in the family system" />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {whoItHelps.map((item, index) => (
              <FeatureCard key={item.title} {...item} delay={index * 0.1} />
            ))}
          </div>
        </Container>
      </section>

      {/* AI Companion */}
      <section className="bg-primary py-20 text-primary-foreground sm:py-28">
        <Container className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <p className="text-sm font-semibold uppercase tracking-wide text-secondary">
              VelNit Companion
            </p>
            <h2 className="mt-3 text-balance font-heading text-3xl font-semibold sm:text-4xl">
              An AI companion built with empathy, not automation.
            </h2>
            <p className="mt-4 text-lg text-primary-foreground/80">
              Voice conversation, gentle reminders, daily reflection and a
              gratitude journal - VelNit Companion is technology in service of
              humanity, never the other way around.
            </p>
            <Button asChild variant="cta" size="lg" className="mt-8">
              <Link href="/companion">Meet VelNit Companion</Link>
            </Button>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { icon: Mic, label: "Voice Conversation" },
                { icon: Sun, label: "Daily Reflection" },
                { icon: Heart, label: "Gratitude Journal" },
                { icon: Sparkles, label: "Memory Coach" },
              ].map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="rounded-2xl border border-primary-foreground/15 bg-primary-foreground/5 p-6"
                >
                  <Icon className="h-6 w-6 text-secondary" aria-hidden />
                  <p className="mt-3 font-heading font-medium">{label}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </Container>
      </section>

      {/* Testimonials */}
      <section className="py-20 sm:py-28">
        <Container>
          <SectionHeading eyebrow="Early Voices" title="What our beta community is saying" />
          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            {testimonials.map((t, index) => (
              <Reveal key={t.name} delay={index * 0.1}>
                <Card className="h-full">
                  <CardContent className="pt-6">
                    <Quote className="h-6 w-6 text-secondary" aria-hidden />
                    <p className="mt-4 text-foreground">{t.quote}</p>
                    <p className="mt-6 text-sm font-semibold text-foreground">{t.name}</p>
                    <p className="text-sm text-muted-foreground">{t.role}</p>
                  </CardContent>
                </Card>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Beta Registration */}
      <section id="beta" className="bg-card/50 py-20 sm:py-28">
        <Container className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <p className="text-sm font-semibold uppercase tracking-wide text-cta">
              Join the Beta
            </p>
            <h2 className="mt-3 text-balance font-heading text-3xl font-semibold sm:text-4xl">
              Be among the first families to experience Relationship
              Intelligence.
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Space is limited as we roll out VelNit Life with a small group
              of families, couples and caregivers.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="rounded-2xl border border-border bg-background p-8 shadow-soft">
              <BetaForm compact />
            </div>
          </Reveal>
        </Container>
      </section>

      {/* Newsletter / Lead Magnet */}
      <section id="newsletter-lead-magnet" className="py-20 sm:py-28">
        <Container className="mx-auto max-w-2xl text-center">
          <Reveal>
            <p className="text-sm font-semibold uppercase tracking-wide text-secondary">
              Free Guide
            </p>
            <h2 className="mt-3 text-balance font-heading text-3xl font-semibold sm:text-4xl">
              The 7-Day Connection Guide
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              A short daily practice - grounded in the TALK Model - to help
              you reconnect with someone you love this week. Delivered free
              to your inbox.
            </p>
            <NewsletterForm className="mx-auto mt-8 max-w-md" />
          </Reveal>
        </Container>
      </section>

      <CtaBanner />
    </>
  );
}
