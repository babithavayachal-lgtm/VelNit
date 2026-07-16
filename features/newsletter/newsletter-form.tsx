"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { newsletterSchema, type NewsletterInput } from "@/lib/validation/schemas";
import { subscribeToNewsletter } from "./actions";
import { cn } from "@/lib/utils";

export function NewsletterForm({ className }: { className?: string }) {
  const [state, setState] = React.useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NewsletterInput>({ resolver: zodResolver(newsletterSchema) });

  async function onSubmit(data: NewsletterInput) {
    setState("loading");
    const result = await subscribeToNewsletter(data);
    if (result.success) {
      setState("success");
      reset();
    } else {
      setState("error");
    }
  }

  if (state === "success") {
    return (
      <p
        role="status"
        className={cn(
          "flex items-center gap-2 text-sm font-medium text-primary",
          className
        )}
      >
        <CheckCircle2 className="h-5 w-5" aria-hidden />
        You&apos;re subscribed. Welcome to the VelNit Life community.
      </p>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className={cn("flex flex-col gap-3 sm:flex-row sm:items-start", className)}
    >
      <div className="w-full">
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>
        <Input
          id="newsletter-email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "newsletter-email-error" : undefined}
          {...register("email")}
        />
        <input type="text" className="hidden" tabIndex={-1} autoComplete="off" {...register("company")} />
        {errors.email && (
          <p id="newsletter-email-error" className="mt-1 text-xs text-destructive">
            {errors.email.message}
          </p>
        )}
      </div>
      <Button type="submit" variant="cta" disabled={state === "loading"} className="shrink-0">
        {state === "loading" && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
        Subscribe
      </Button>
      {state === "error" && (
        <p role="alert" className="text-xs text-destructive sm:basis-full">
          Something went wrong. Please try again.
        </p>
      )}
    </form>
  );
}
