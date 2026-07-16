"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { betaSignupSchema, type BetaSignupInput } from "@/lib/validation/schemas";
import { submitBetaSignup } from "./actions";

const roles = [
  "Adult child",
  "Couple",
  "Caregiver",
  "Community or provider",
  "Other",
] as const;

export function BetaForm({ compact = false }: { compact?: boolean }) {
  const [state, setState] = React.useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BetaSignupInput>({ resolver: zodResolver(betaSignupSchema) });

  async function onSubmit(data: BetaSignupInput) {
    setState("loading");
    const result = await submitBetaSignup(data);
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
        <h3 className="font-heading text-xl font-semibold">You&apos;re on the list</h3>
        <p className="max-w-sm text-sm text-muted-foreground">
          Thank you for joining the VelNit Life beta. Keep an eye on your inbox -
          we&apos;ll be in touch with next steps.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <div className={compact ? "grid gap-5 sm:grid-cols-2" : "grid gap-5"}>
        <div>
          <Label htmlFor="fullName">Full name</Label>
          <Input
            id="fullName"
            autoComplete="name"
            className="mt-2"
            aria-invalid={Boolean(errors.fullName)}
            aria-describedby={errors.fullName ? "fullName-error" : undefined}
            {...register("fullName")}
          />
          {errors.fullName && (
            <p id="fullName-error" className="mt-1 text-xs text-destructive">
              {errors.fullName.message}
            </p>
          )}
        </div>
        <div>
          <Label htmlFor="email">Email address</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            className="mt-2"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "email-error" : undefined}
            {...register("email")}
          />
          {errors.email && (
            <p id="email-error" className="mt-1 text-xs text-destructive">
              {errors.email.message}
            </p>
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="role">Which best describes you?</Label>
        <select
          id="role"
          className="mt-2 flex h-12 w-full rounded-xl border border-input bg-background px-4 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-invalid={Boolean(errors.role)}
          defaultValue=""
          {...register("role")}
        >
          <option value="" disabled>
            Select one
          </option>
          {roles.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>
        {errors.role && (
          <p className="mt-1 text-xs text-destructive">{errors.role.message}</p>
        )}
      </div>

      {!compact && (
        <div>
          <Label htmlFor="reason">What brings you to VelNit Life? (optional)</Label>
          <Textarea id="reason" className="mt-2" {...register("reason")} />
        </div>
      )}

      <input
        type="text"
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
        {...register("company")}
      />

      <Button type="submit" variant="cta" size="lg" disabled={state === "loading"} className="w-full sm:w-auto">
        {state === "loading" && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
        Join the Beta
      </Button>

      {state === "error" && (
        <p role="alert" className="text-sm text-destructive">
          Something went wrong. Please try again in a moment.
        </p>
      )}
    </form>
  );
}
