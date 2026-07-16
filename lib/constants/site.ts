export const siteConfig = {
  name: "VelNit Life",
  tagline: "Relationship Intelligence for Life's Second Chapter",
  mission: "Helping people age with connection, dignity and purpose.",
  description:
    "VelNit Life is an AI-powered Relationship Intelligence Platform helping couples, families, caregivers and communities stay emotionally connected through life's second chapter.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://velnit.life",
  ogImage: "/images/og-default.jpg",
  links: {
    twitter: "https://twitter.com/velnitlife",
    facebook: "https://facebook.com/velnitlife",
    linkedin: "https://www.linkedin.com/company/velnitlife",
    instagram: "https://instagram.com/velnitlife",
  },
  contactEmail: "hello@velnit.life",
} as const;

export type NavItem = {
  title: string;
  href: string;
  description?: string;
};

export const primaryNav: NavItem[] = [
  { title: "About", href: "/about" },
  { title: "Relationship Intelligence", href: "/relationship-intelligence" },
  {
    title: "Products",
    href: "/care",
    description: "VelNit Care, Connect & Companion",
  },
  { title: "Academy", href: "/academy" },
  { title: "Blog", href: "/blog" },
  { title: "Contact", href: "/contact" },
];

export const productNav: NavItem[] = [
  {
    title: "VelNit Care",
    href: "/care",
    description: "Medication, appointments and caregiver coordination.",
  },
  {
    title: "VelNit Connect",
    href: "/connect",
    description: "Relationship tools designed for couples.",
  },
  {
    title: "VelNit Companion",
    href: "/companion",
    description: "An AI companion for daily reflection and connection.",
  },
];

export const footerNav = {
  product: [
    { title: "VelNit Care", href: "/care" },
    { title: "VelNit Connect", href: "/connect" },
    { title: "VelNit Companion", href: "/companion" },
    { title: "Relationship Intelligence", href: "/relationship-intelligence" },
  ],
  company: [
    { title: "About", href: "/about" },
    { title: "Academy", href: "/academy" },
    { title: "Blog", href: "/blog" },
    { title: "Contact", href: "/contact" },
  ],
  getInvolved: [
    { title: "Join the Beta", href: "/beta" },
    { title: "Newsletter", href: "/#newsletter" },
  ],
  legal: [
    { title: "Privacy Policy", href: "/privacy" },
    { title: "Terms of Service", href: "/terms" },
  ],
};
