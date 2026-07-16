import type { Metadata } from "next";
import { CheckCircle2 } from "lucide-react";
import { Container } from "@/components/layout/container";
import { PageHero } from "@/components/marketing/page-hero";
import { BetaForm } from "@/features/beta/beta-form";
import { Reveal } from "@/components/marketing/reveal";

export const metadata: Metadata = {
  title: "Join the Beta",
  description:
    "Join the VelNit Life beta and be among the first couples, families and caregivers to experience Relationship Intelligence.",
  alternates: { canonical: "/beta" },
};

const included = [
  "Early access to VelNit Care, Connect and Companion",
  "Direct input into what we build next",
  "Founding-member pricing when we launch publicly",
  "A seat in the VelNit Academy launch cohort",
];

export default function BetaPage() {
  return (
    <>
      <PageHero
        eyebrow="Beta Program"
        title="Join the VelNit Life beta"
        description="We're onboarding a small group of couples, families and caregivers first. Tell us a little about yourself and we'll be in touch."
      />

      <section className="pb-20 sm:pb-28">
        <Container className="grid gap-12 lg:grid-cols-[1fr_1.3fr] lg:items-start">
          <Reveal>
            <h2 className="font-heading text-xl font-semibold">What&apos;s included</h2>
            <ul className="mt-5 space-y-4">
              {included.map((item) => (
                <li key={item} className="flex items-start gap-3 text-muted-foreground">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-cta" aria-hidden />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.1} className="rounded-2xl border border-border bg-card p-8 shadow-soft">
            <BetaForm />
          </Reveal>
        </Container>
      </section>
    </>
  );
}
