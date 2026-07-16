import type { Metadata } from "next";
import { Pill, CalendarClock, FileHeart, PhoneCall, ClipboardCheck, LayoutDashboard, FileBarChart } from "lucide-react";
import { ProductPage } from "@/components/marketing/product-page";

export const metadata: Metadata = {
  title: "VelNit Care",
  description:
    "Medication, appointments, health records, emergency contacts, daily check-ins and caregiver dashboards - coordinated with dignity.",
  alternates: { canonical: "/care" },
};

export default function CarePage() {
  return (
    <ProductPage
      eyebrow="VelNit Care"
      title="Care coordination that never loses sight of the person."
      description="VelNit Care brings medication, appointments and health information into one calm, shared view - so families and caregivers can focus on the relationship, not just the logistics."
      featuresTitle="Everything a caregiving family needs, without the chaos"
      features={[
        { icon: Pill, title: "Medication", description: "Clear schedules and gentle reminders that respect independence." },
        { icon: CalendarClock, title: "Appointments", description: "A shared calendar so no one is left guessing about what's next." },
        { icon: FileHeart, title: "Health Records", description: "Secure, organized records accessible to the people who need them." },
        { icon: PhoneCall, title: "Emergency Contacts", description: "The right people reachable in seconds, not searched for in a panic." },
        { icon: ClipboardCheck, title: "Daily Check-ins", description: "A light daily pulse on wellbeing - physical and emotional." },
        { icon: LayoutDashboard, title: "Caregiver Dashboard", description: "One view for the whole care circle, so no one carries it alone." },
        { icon: FileBarChart, title: "Reports", description: "Simple summaries that turn daily data into shared understanding." },
      ]}
      ctaTitle="Bring calm to caregiving"
      ctaDescription="Join the beta to experience VelNit Care alongside VelNit Connect and Companion."
    />
  );
}
