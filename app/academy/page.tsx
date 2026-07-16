import type { Metadata } from "next";
import { GraduationCap, Presentation, Award, BookMarked, Library } from "lucide-react";
import { Container } from "@/components/layout/container";
import { PageHero } from "@/components/marketing/page-hero";
import { SectionHeading } from "@/components/marketing/section-heading";
import { FeatureCard } from "@/components/marketing/feature-card";
import { CtaBanner } from "@/components/marketing/cta-banner";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/marketing/reveal";

export const metadata: Metadata = {
  title: "VelNit Academy",
  description:
    "Workshops, courses, masterclasses and resources built around the TALK Model - practical Relationship Intelligence education for families and caregivers.",
  alternates: { canonical: "/academy" },
};

const offerings = [
  { icon: Presentation, title: "Workshops", description: "Live, practical sessions on connection, caregiving and communication." },
  { icon: GraduationCap, title: "Courses", description: "Self-paced learning paths for couples, families and caregivers." },
  { icon: Award, title: "Masterclasses", description: "Deep-dive sessions with practitioners in relationship and gerontology." },
  { icon: BookMarked, title: "The TALK Model", description: "The core curriculum behind everything VelNit Life builds." },
  { icon: Library, title: "Resources", description: "Guides, worksheets and tools you can use today, free." },
];

export default function AcademyPage() {
  return (
    <>
      <PageHero
        eyebrow="VelNit Academy"
        title="Practical education for life's second chapter"
        description="Workshops, courses and masterclasses grounded in the TALK Model - built for couples, families, caregivers and the professionals who support them."
      />

      <section className="py-20 sm:py-28">
        <Container>
          <SectionHeading eyebrow="What's Inside" title="Learn the practice behind the platform" />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {offerings.map((item, index) => (
              <FeatureCard key={item.title} {...item} delay={index * 0.1} />
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-card/50 py-20 sm:py-28">
        <Container className="mx-auto max-w-2xl text-center">
          <Reveal>
            <Badge className="mx-auto">Coming with the Academy launch</Badge>
            <h2 className="mt-4 font-heading text-3xl font-semibold">
              Full course catalog opens to beta members first
            </h2>
            <p className="mt-4 text-muted-foreground">
              Join the VelNit Life beta to get early access to Academy
              workshops and masterclasses as they launch.
            </p>
          </Reveal>
        </Container>
      </section>

      <CtaBanner
        title="Learn the TALK Model first"
        description="Join the beta and get early access to VelNit Academy."
      />
    </>
  );
}
