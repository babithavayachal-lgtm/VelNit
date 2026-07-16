import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Reveal } from "./reveal";

export function CtaBanner({
  title = "Ready to bring Relationship Intelligence home?",
  description = "Join the VelNit Life beta and be among the first families to experience it.",
  primaryLabel = "Join Beta",
  primaryHref = "/beta",
  secondaryLabel = "Talk to us",
  secondaryHref = "/contact",
}: {
  title?: string;
  description?: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
}) {
  return (
    <section className="py-20 sm:py-28">
      <Container>
        <Reveal className="relative overflow-hidden rounded-2xl bg-primary px-8 py-16 text-center sm:px-16">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_80%_at_80%_0%,hsl(var(--secondary)/0.25),transparent)]"
          />
          <h2 className="relative text-balance text-3xl font-semibold text-primary-foreground sm:text-4xl">
            {title}
          </h2>
          <p className="relative mx-auto mt-4 max-w-xl text-balance text-primary-foreground/80">
            {description}
          </p>
          <div className="relative mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild variant="cta" size="lg">
              <Link href={primaryHref}>{primaryLabel}</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
            >
              <Link href={secondaryHref}>{secondaryLabel}</Link>
            </Button>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
