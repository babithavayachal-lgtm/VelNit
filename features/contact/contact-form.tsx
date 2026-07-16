"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { contactSchema, type ContactInput } from "@/lib/validation/schemas";
import { submitContactMessage } from "./actions";

export function ContactForm() {
  const [state, setState] = React.useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactInput>({ resolver: zodResolver(contactSchema) });

  async function onSubmit(data: ContactInput) {
    setState("loading");
    const result = await submitContactMessage(data);
    if (result.success) {
      setState("success");
      reset();
    } else {
      setState("error");
    }
  }

  if (state === "success") {
    return (
      <div
        role="status"
        className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-card p-8 text-center"
      >
        <CheckCircle2 className="h-10 w-10 text-primary" aria-hidden />
        <h3 className="font-heading text-xl font-semibold">Message sent</h3>
        <p className="max-w-sm text-sm text-muted-foreground">
          Thank you for reaching out. Our team will respond within one to two
          business days.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            autoComplete="name"
            className="mt-2"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "name-error" : undefined}
            {...register("name")}
          />
          {errors.name && (
            <p id="name-error" className="mt-1 text-xs text-destructive">
              {errors.name.message}
            </p>
          )}
        </div>
        <div>
          <Label htmlFor="contact-email">Email</Label>
          <Input
            id="contact-email"
            type="email"
            autoComplete="email"
            className="mt-2"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "contact-email-error" : undefined}
            {...register("email")}
          />
          {errors.email && (
            <p id="contact-email-error" className="mt-1 text-xs text-destructive">
              {errors.email.message}
            </p>
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="subject">Subject (optional)</Label>
        <Input id="subject" className="mt-2" {...register("subject")} />
      </div>

      <div>
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          className="mt-2"
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "message-error" : undefined}
          {...register("message")}
        />
        {errors.message && (
          <p id="message-error" className="mt-1 text-xs text-destructive">
            {errors.message.message}
          </p>
        )}
      </div>

      <input
        type="text"
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
        {...register("company")}
      />

      <Button type="submit" variant="cta" size="lg" disabled={state === "loading"} className="w-full sm:w-auto">
        {state === "loading" && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
        Send Message
      </Button>

      {state === "error" && (
        <p role="alert" className="text-sm text-destructive">
          Something went wrong. Please try again in a moment.
        </p>
      )}
    </form>
  );
}
