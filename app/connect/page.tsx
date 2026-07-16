import type { Metadata } from "next";
import { MessageSquareHeart, BookOpen, Target, Clock, CalendarHeart, Smile } from "lucide-react";
import { ProductPage } from "@/components/marketing/product-page";

export const metadata: Metadata = {
  title: "VelNit Connect",
  description:
    "Conversation starters, a relationship journal, shared goals, memory timeline, anniversary reminders and emotional check-ins - designed for couples.",
  alternates: { canonical: "/connect" },
};

export default function ConnectPage() {
  return (
    <ProductPage
      eyebrow="VelNit Connect"
      title="Designed for couples navigating what comes next."
      description="After the busyness of raising a family or building a career fades, VelNit Connect helps couples rediscover each other - intentionally, gently, every day."
      featuresTitle="Small rituals that rebuild everyday connection"
      features={[
        { icon: MessageSquareHeart, title: "Conversation Starters", description: "Thoughtful prompts that open doors routine can quietly close." },
        { icon: BookOpen, title: "Relationship Journal", description: "A shared space to reflect - together or apart." },
        { icon: Target, title: "Shared Goals", description: "From travel plans to daily habits, aligned and visible to both." },
        { icon: Clock, title: "Memory Timeline", description: "A living archive of the moments that made your story." },
        { icon: CalendarHeart, title: "Anniversary Reminders", description: "Never let a meaningful date pass unnoticed again." },
        { icon: Smile, title: "Emotional Check-ins", description: "A gentle daily pulse on how you're each really doing." },
      ]}
      ctaTitle="Rediscover each other, on purpose"
      ctaDescription="Join the beta and bring VelNit Connect into your everyday rhythm."
    />
  );
}
