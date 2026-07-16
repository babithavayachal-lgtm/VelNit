import Link from "next/link";
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import { Container } from "./container";
import { Logo } from "./logo";
import { footerNav, siteConfig } from "@/lib/constants/site";
import { NewsletterForm } from "@/features/newsletter/newsletter-form";

const socialLinks = [
  { label: "Twitter", href: siteConfig.links.twitter, Icon: Twitter },
  { label: "Facebook", href: siteConfig.links.facebook, Icon: Facebook },
  { label: "LinkedIn", href: siteConfig.links.linkedin, Icon: Linkedin },
  { label: "Instagram", href: siteConfig.links.instagram, Icon: Instagram },
];

function FooterColumn({ title, items }: { title: string; items: { title: string; href: string }[] }) {
  return (
    <div>
      <h3 className="font-heading text-sm font-semibold text-foreground">{title}</h3>
      <ul className="mt-4 space-y-3">
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-card/60">
      <Container className="grid gap-12 py-16 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1.2fr]">
        <div className="lg:pr-8">
          <Logo />
          <p className="mt-4 max-w-xs text-sm text-muted-foreground">
            {siteConfig.mission}
          </p>
          <div className="mt-6 flex gap-3">
            {socialLinks.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={label}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-foreground/70 transition-colors hover:border-primary hover:text-primary"
              >
                <Icon className="h-4 w-4" aria-hidden />
              </a>
            ))}
          </div>
        </div>

        <FooterColumn title="Product" items={footerNav.product} />
        <FooterColumn title="Company" items={footerNav.company} />
        <FooterColumn title="Get Involved" items={footerNav.getInvolved} />

        <div id="newsletter">
          <h3 className="font-heading text-sm font-semibold text-foreground">
            Stay connected
          </h3>
          <p className="mt-4 text-sm text-muted-foreground">
            One thoughtful email a month. Stories, research and the TALK
            Model in practice.
          </p>
          <NewsletterForm className="mt-4" />
        </div>
      </Container>

      <div className="border-t border-border/60 py-6">
        <Container className="flex flex-col items-center justify-between gap-4 text-xs text-muted-foreground sm:flex-row">
          <p>
            &copy; {new Date().getFullYear()} {siteConfig.name}. All rights
            reserved.
          </p>
          <div className="flex gap-6">
            {footerNav.legal.map((item) => (
              <Link key={item.href} href={item.href} className="hover:text-foreground">
                {item.title}
              </Link>
            ))}
          </div>
        </Container>
      </div>
    </footer>
  );
}
