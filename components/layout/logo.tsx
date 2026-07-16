import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn(
        "font-heading text-xl font-semibold tracking-tight text-primary",
        className
      )}
    >
      VelNit <span className="font-normal text-secondary">Life</span>
    </Link>
  );
}
