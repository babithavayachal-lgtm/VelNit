import type { Metadata } from "next";
import Link from "next/link";
import { requireFounder } from "@/lib/auth/founder";
import { signOutFounder } from "@/features/studio/auth-actions";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: {
    default: "VelNit Studio",
    template: "%s - VelNit Studio",
  },
  robots: { index: false, follow: false },
};

const studioNav = [
  { title: "Ideas", href: "/studio" },
  { title: "Briefs", href: "/studio/briefs" },
  { title: "Review", href: "/studio/review" },
];

export default async function StudioLayout({ children }: { children: React.ReactNode }) {
  const founder = await requireFounder();

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="border-b border-border bg-background">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-8">
            <Link href="/studio" className="font-heading text-lg font-semibold">
              VelNit Studio
            </Link>
            <nav className="hidden gap-6 text-sm font-medium text-muted-foreground sm:flex">
              {studioNav.map((item) => (
                <Link key={item.href} href={item.href} className="hover:text-foreground">
                  {item.title}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden text-sm text-muted-foreground sm:inline">
              {founder.email}
            </span>
            <form action={signOutFounder}>
              <Button type="submit" variant="outline" size="sm">
                Sign out
              </Button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">{children}</main>
    </div>
  );
}
