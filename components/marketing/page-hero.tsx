import { cn } from "@/lib/utils";
import { Container } from "@/components/layout/container";
import { Reveal } from "./reveal";

export function PageHero({
  eyebrow,
  title,
  description,
  className,
  children,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <section className={cn("relative overflow-hidden py-24 sm:py-32", className)}>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_0%,hsl(var(--sage)/0.18),transparent)]"
      />
      <Container className="relative text-center">
        <Reveal>
          {eyebrow && (
            <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-secondary">
              {eyebrow}
            </p>
          )}
          <h1 className="mx-auto max-w-3xl text-balance text-4xl font-semibold leading-tight text-foreground sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          {description && (
            <p className="mx-auto mt-6 max-w-2xl text-balance text-lg text-muted-foreground">
              {description}
            </p>
          )}
          {children}
        </Reveal>
      </Container>
    </section>
  );
}
