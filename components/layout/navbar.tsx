"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Logo } from "./logo";
import { Container } from "./container";
import { Button } from "@/components/ui/button";
import { primaryNav, productNav } from "@/lib/constants/site";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);
  const [productsOpen, setProductsOpen] = React.useState(false);

  React.useEffect(() => {
    setOpen(false);
  }, [pathname]);

  React.useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <Container className="flex h-20 items-center justify-between">
        <Logo />

        <nav aria-label="Primary" className="hidden items-center gap-8 lg:flex">
          {primaryNav.map((item) =>
            item.title === "Products" ? (
              <div
                key={item.title}
                className="relative"
                onMouseEnter={() => setProductsOpen(true)}
                onMouseLeave={() => setProductsOpen(false)}
              >
                <button
                  className="flex items-center text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
                  aria-expanded={productsOpen}
                  aria-haspopup="true"
                  onClick={() => setProductsOpen((v) => !v)}
                >
                  Products
                </button>
                <AnimatePresence>
                  {productsOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.15 }}
                      className="absolute left-1/2 top-full w-72 -translate-x-1/2 pt-3"
                    >
                      <div className="rounded-2xl border border-border bg-background p-3 shadow-soft">
                        {productNav.map((p) => (
                          <Link
                            key={p.href}
                            href={p.href}
                            className="block rounded-xl p-3 transition-colors hover:bg-muted"
                          >
                            <p className="font-heading text-sm font-semibold text-foreground">
                              {p.title}
                            </p>
                            <p className="mt-0.5 text-xs text-muted-foreground">
                              {p.description}
                            </p>
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-sm font-medium text-foreground/80 transition-colors hover:text-foreground",
                  pathname === item.href && "text-foreground"
                )}
              >
                {item.title}
              </Link>
            )
          )}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Button asChild variant="ghost" size="sm">
            <Link href="/contact">Book a Demo</Link>
          </Button>
          <Button asChild variant="cta" size="sm">
            <Link href="/beta">Join Beta</Link>
          </Button>
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-full p-2 text-foreground lg:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </Container>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden border-b border-border/60 bg-background lg:hidden"
          >
            <Container className="flex flex-col gap-1 py-4">
              {[...primaryNav.filter((i) => i.title !== "Products"), ...productNav].map(
                (item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="rounded-xl px-3 py-3 text-base font-medium text-foreground/90 transition-colors hover:bg-muted"
                  >
                    {item.title}
                  </Link>
                )
              )}
              <div className="mt-2 flex flex-col gap-3 px-3">
                <Button asChild variant="outline">
                  <Link href="/contact">Book a Demo</Link>
                </Button>
                <Button asChild variant="cta">
                  <Link href="/beta">Join Beta</Link>
                </Button>
              </div>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
