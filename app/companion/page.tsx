import type { Metadata } from "next";
import { Mic, UserCircle, BellRing, Sun, HeartHandshake, MessagesSquare, BrainCircuit } from "lucide-react";
import { ProductPage } from "@/components/marketing/product-page";

export const metadata: Metadata = {
  title: "VelNit Companion",
  description:
    "An AI companion for voice conversation, daily reflection, gratitude journaling, conversation coaching and memory coaching - built with empathy.",
  alternates: { canonical: "/companion" },
};

export default function CompanionPage() {
  return (
    <ProductPage
      eyebrow="VelNit Companion"
      title="An AI companion built with empathy, not automation."
      description="VelNit Companion is technology in service of humanity - noticing quiet moments, encouraging reflection, and gently coaching richer conversation. Never a replacement for human connection, always in service of it."
      featuresTitle="A daily presence, never a replacement for people"
      features={[
        { icon: Mic, title: "Voice Conversation", description: "Natural, unhurried conversation that meets people where they are." },
        { icon: UserCircle, title: "Avatar", description: "A warm, approachable presence - future-ready for HeyGen avatar integration." },
        { icon: BellRing, title: "Reminders", description: "Gentle nudges for the moments and people that matter." },
        { icon: Sun, title: "Daily Reflection", description: "A short daily practice to notice what went well and what needs care." },
        { icon: HeartHandshake, title: "Gratitude Journal", description: "A simple habit linked to measurable gains in wellbeing." },
        { icon: MessagesSquare, title: "Conversation Coach", description: "Gentle guidance for richer conversations with the people you love." },
        { icon: BrainCircuit, title: "Memory Coach", description: "Playful, supportive prompts that keep memory and connection active." },
      ]}
      ctaTitle="Meet your Companion"
      ctaDescription="Join the beta to be among the first to experience VelNit Companion."
    />
  );
}
