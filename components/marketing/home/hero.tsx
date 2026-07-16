"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative overflow-hidden pb-24 pt-20 sm:pb-32 sm:pt-28">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-sage/25 blur-3xl" />
        <div className="absolute -right-24 top-24 h-[28rem] w-[28rem] rounded-full bg-secondary/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
      </div>

      <Container className="relative text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <span className="inline-flex items-center rounded-full border border-border bg-background/80 px-4 py-1.5 text-sm font-medium text-muted-foreground shadow-sm">
            Introducing Relationship Intelligence
          </span>
          <h1 className="mx-auto mt-8 max-w-4xl text-balance font-heading text-4xl font-semibold leading-[1.1] text-foreground sm:text-6xl">
            Relationship Intelligence for Life&apos;s Second Chapter
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-balance text-lg text-muted-foreground sm:text-xl">
            Helping people age with connection, dignity and purpose.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button asChild variant="cta" size="lg">
              <Link href="/beta">
                Join Beta <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/relationship-intelligence">Learn More</Link>
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="relative mx-auto mt-16 aspect-[16/9] w-full max-w-4xl overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-primary/90 via-primary to-[hsl(182,45%,12%)] shadow-soft"
        >
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-10 text-center">
            <p className="font-heading text-2xl font-medium text-primary-foreground/95 sm:text-3xl">
              &ldquo;Together time. Acknowledgment. Listening. Kindness.&rdquo;
            </p>
            <p className="text-sm uppercase tracking-widest text-primary-foreground/60">
              The TALK Model
            </p>
          </div>
          <div
            aria-hidden
            className="absolute -bottom-16 -right-16 h-64 w-64 rounded-full bg-secondary/30 blur-2xl"
          />
        </motion.div>
      </Container>
    </section>
  );
}
