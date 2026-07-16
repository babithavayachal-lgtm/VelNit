import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "You're Subscribed",
  description: "Thank you for subscribing to the VelNit Life newsletter.",
  alternates: { canonical: "/newsletter/thank-you" },
  robots: { index: false, follow: true },
};

export default function NewsletterThankYouPage() {
  return (
    <section className="py-28 text-center sm:py-36">
      <Container className="mx-auto max-w-xl">
        <CheckCircle2 className="mx-auto h-14 w-14 text-primary" aria-hidden />
        <h1 className="mt-6 font-heading text-3xl font-semibold sm:text-4xl">
          You&apos;re subscribed
        </h1>
        <p className="mt-4 text-muted-foreground">
          Thank you for joining the VelNit Life community. Keep an eye on
          your inbox for the 7-Day Connection Guide and monthly stories on
          Relationship Intelligence.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Button asChild variant="cta">
            <Link href="/blog">Read the Blog</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/">Back Home</Link>
          </Button>
        </div>
      </Container>
    </section>
  );
}
