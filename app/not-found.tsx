import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <section className="py-28 text-center sm:py-36">
      <Container className="mx-auto max-w-xl">
        <p className="font-heading text-6xl font-semibold text-primary">404</p>
        <h1 className="mt-4 font-heading text-2xl font-semibold">Page not found</h1>
        <p className="mt-3 text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist or has moved.
        </p>
        <Button asChild variant="cta" className="mt-8">
          <Link href="/">Back Home</Link>
        </Button>
      </Container>
    </section>
  );
}
